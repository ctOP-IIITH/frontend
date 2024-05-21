import React, { useEffect, useRef, useState } from 'react';
import Ajv from 'ajv';
import { Button, Container, Typography, Card, CardContent, Grid, Modal, Box } from '@mui/material';
import AceEditor from 'react-ace';
import { axiosAuthInstance } from '../services/axiosConfig';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

function AddAdvanced() {
  const ajv = new Ajv();

  const [nodesJson, setNodesJson] = useState('');
  const [importStatus, setImportStatus] = useState({ inProgress: false, message: '' });
  const [modalOpen, setModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const csvFileInputRef = useRef(null);

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

  const handleCsvFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        setImportStatus({ inProgress: true, message: 'Import in progress...' });
        setModalOpen(true);

        axiosAuthInstance
          .post('/import/import_csv', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            console.log('Import response:', response.data);
            const {
              created_nodes: createdNodes = [],
              failed_nodes: failedNodes = [],
              invalid_sensor_nodes: invalidSensorNodes = []
            } = response.data;
            let message = `Status:\n`;
            message += `Created nodes: ${createdNodes.length}\n`;
            message += `Failed nodes: ${failedNodes.length}\n`;
            message += `Invalid sensor nodes: ${invalidSensorNodes.length}\n\n`;

            if (failedNodes.length > 0) {
              message += `Failed nodes:\n`;
              failedNodes.forEach((node, index) => {
                message += `${index + 1}. ${node.node.name}, Error: ${node.error}\n`;
              });
              message += '\n';
            }

            if (invalidSensorNodes.length > 0) {
              message += `Invalid sensor nodes:\n`;
              invalidSensorNodes.forEach((node, index) => {
                message += `${index + 1}. ${node.node.name}, Error: ${node.error}\n`;
              });
            }

            if (createdNodes.length > 0) {
              message += `Created nodes:\n`;
              createdNodes.forEach((node, index) => {
                message += `${index + 1}. ${node.node.name}\n`;
              });
            }
            setImportStatus({ inProgress: false, message });
          })
          .catch((error) => {
            console.error('Import failed:', error);
            setImportStatus({
              inProgress: false,
              message: 'Failed to import nodes. Please try again.'
            });
          });
      } catch (error) {
        console.error('Error processing CSV file:', error);
        setImportStatus({
          inProgress: false,
          message: 'Error processing CSV file. Please try again.'
        });
      }
    }
  };

  const handleBulkImport = () => {
    try {
      const data = JSON.parse(nodesJson);

      // Validate the parsed data against the schema
      const validate = ajv.compile(nodesSchema);
      const valid = validate(data);

      if (valid) {
        setImportStatus({ inProgress: true, message: 'Import in progress...' });
        setModalOpen(true);

        axiosAuthInstance
          .post('/import/import', data)
          .then((response) => {
            console.log('Import response:', response.data);
            const {
              created_nodes: createdNodes = [],
              failed_nodes: failedNodes = [],
              invalid_sensor_nodes: invalidSensorNodes = []
            } = response.data;
            let message = `Import completed.\n`;
            message += `Created nodes: ${createdNodes.length}\n`;
            message += `Failed nodes: ${failedNodes.length}\n`;
            message += `Invalid sensor nodes: ${invalidSensorNodes.length}\n\n`;

            if (failedNodes.length > 0) {
              message += `Failed nodes:\n`;
              failedNodes.forEach((node, index) => {
                message += `${index + 1}. ${node.node.name}, Error: ${node.error}\n`;
              });
              message += '\n';
            }

            if (invalidSensorNodes.length > 0) {
              message += `Invalid sensor nodes:\n`;
              invalidSensorNodes.forEach((node, index) => {
                message += `${index + 1}. ${node.node.name}, Error: ${node.error}\n`;
              });
              message += '\n';
            }
            if (createdNodes.length > 0) {
              console.log(createdNodes);
              message += `Created  nodes:\n`;
              createdNodes.forEach((node, index) => {
                console.log(index, node);

                message += `${index + 1}. ${node.name}\n`;
              });
            }
            setImportStatus({ inProgress: false, message });
          })
          .catch((error) => {
            console.error('Import failed:', error);
            setImportStatus({
              inProgress: false,
              message: 'Failed to import nodes. Please try again.'
            });
          });
      } else {
        // Data is invalid according to the schema
        console.error('Invalid JSON data:', validate.errors);
        alert('The JSON data is not in the correct format. Please check and try again.');
      }
    } catch (error) {
      // Handle parsing errors
      console.error('Error parsing JSON data:', error);
      alert('Invalid JSON format. Please check and try again.');
    }
  };
  const buttonStyle = {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': {
      bgcolor: 'primary.dark'
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mb: 2 }}>
        <CardContent>
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
            Import JSON
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Grid>
        <Grid item>
          <Button onClick={() => csvFileInputRef.current.click()} sx={buttonStyle}>
            Import CSV
          </Button>
          <input
            type="file"
            ref={csvFileInputRef}
            style={{ display: 'none' }}
            onChange={handleCsvFileSelect}
            accept=".csv"
          />
        </Grid>
        <Grid item>
          <Button onClick={handleBulkImport} disabled={importStatus.inProgress} sx={buttonStyle}>
            {importStatus.inProgress ? 'Importing...' : 'Bulk Import'}
          </Button>
        </Grid>
      </Grid>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          {importStatus.message && (
            <Typography whiteSpace="pre-line">{importStatus.message}</Typography>
          )}
          <Button onClick={() => setModalOpen(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
export default AddAdvanced;
