import React, { useEffect, useState } from 'react';
import Ajv from 'ajv';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

function AddAdvanced() {
  const ajv = new Ajv();

  const [nodesJson, setNodesJson] = useState('');

  const navigate = useNavigate();

  const nodesSchema = {
    title: 'Nodes',
    type: 'object',
    required: ['sensors'],
    properties: {
      sensors: {
        type: 'array',
        title: 'Sensors',
        items: {
          type: 'object',
          required: ['coordinates', 'sensor_type', 'area'],
          properties: {
            coordinates: {
              type: 'object',
              title: 'Coordinates',
              required: ['latitude', 'longitude'],
              properties: {
                latitude: {
                  type: 'number',
                  title: 'Latitude'
                },
                longitude: {
                  type: 'number',
                  title: 'Longitude'
                }
              }
            },
            sensor_type: {
              type: 'string',
              title: 'Sensor Type'
            },
            area: {
              type: 'string',
              title: 'Area'
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

  const handleImport = () => {
    // Implement your import logic here
    console.log('Importing...');
    const data = JSON.parse(nodesJson);
    const schema = nodesSchema;

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      console.error('Invalid data:', validate.errors);
    } else {
      console.log('Valid data');
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
              tabSize: 2
            }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={handleImport}>Import</Button>
        </Grid>
        <Grid item>
          <Button onClick={() => navigate('/')}>Finish</Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddAdvanced;
