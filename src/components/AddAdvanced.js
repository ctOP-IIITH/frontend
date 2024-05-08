import React, { useEffect, useRef, useState } from 'react';
import Ajv from 'ajv';
import { Button, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import AceEditor from 'react-ace';
import { axiosAuthInstance } from '../services/axiosConfig';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

function AddAdvanced() {
  const ajv = new Ajv();

  const [nodesJson, setNodesJson] = useState('');

  const fileInputRef = useRef(null);

  const nodesSchema = {
    title: 'Nodes',
    type: 'object',
    required: ['nodes'],
    properties: {
      nodes: {
        type: 'array',
        title: 'Nodes',
        items: {
          type: 'object',
          required: ['latitude', 'longitude', 'area', 'sensor_name', 'domain', 'name'],
          properties: {
            latitude: {
              type: 'number',
              title: 'Latitude'
            },
            longitude: {
              type: 'number',
              title: 'Longitude'
            },
            area: {
              type: 'string',
              title: 'Area'
            },
            sensor_name: {
              type: 'string',
              title: 'Sensor Name'
            },
            domain: {
              type: 'string',
              title: 'Domain'
            },
            name: {
              type: 'string',
              title: 'Name'
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    // fetching the template file
    async function fetchTemplate() {
      try {
        const res = await fetch('/import-template.json');
        if (!res.ok) {
          throw new Error('Failed to fetch the template');
        }
        const data = await res.json();
        setNodesJson(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('error fetching json: ', error);
      }
    }

    fetchTemplate();
  }, []);

  const handleNodesChange = (data) => {
    setNodesJson(data);
  };

  const handleDownloadTemplate = () => {
    const element = document.createElement('a');
    const file = new Blob([nodesJson], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'import-template.json';
    document.body.appendChild(element);
    element.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileContent = await file.text();

        const data = JSON.parse(fileContent);

        // validating with schema
        const validate = ajv.compile(nodesSchema);
        const valid = validate(data);

        if (valid) {
          // data is valid
          setNodesJson(JSON.stringify(data, null, 2));
        } else {
          // data is invalid
          console.error('Invalid JSON data:', validate.errors);
          alert('The JSON data is not in the correct format. Please check and try again.');
        }
      } catch (error) {
        // Handle parsing and validation errors
        console.error('Error parsing or validating JSON data:', error);
        alert('Error parsing or validating JSON data. Please check and try again.');
      }
    }
  };

  const handleBulkImport = () => {
    const data = JSON.parse(nodesJson);
    axiosAuthInstance
      .post('/import/import', data)
      .then((response) => {
        console.log('Import successful:', response.data);
        alert('Nodes imported successfully!');
      })
      .catch((error) => {
        console.error('Import failed:', error);
        alert('Failed to import nodes. Please try again.');
      });
  };

  const buttonStyle = {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': {
      bgcolor: 'primary.dark'
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>Import Nodes</Typography>
          <AceEditor
            mode="json"
            theme="monokai"
            value={nodesJson}
            onChange={handleNodesChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false
            }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={handleDownloadTemplate} sx={buttonStyle}>
            Download Template
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={() => fileInputRef.current.click()} sx={buttonStyle}>
            Import
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleBulkImport} sx={buttonStyle}>
            Bulk Import
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddAdvanced;
