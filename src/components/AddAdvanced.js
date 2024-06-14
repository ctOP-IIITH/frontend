import React, { useEffect, useRef, useState } from 'react';
import Ajv from 'ajv';
import AceEditor from 'react-ace';
import {
  Box,
  Container,
  Grid,
  Button,
  Modal,
  Typography,
  LinearProgress,
  Paper,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { axiosAuthInstance } from '../services/axiosConfig';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';

function AddAdvanced() {
  const ajv = new Ajv();

  const [nodesJson, setNodesJson] = useState('');
  const [importStatus, setImportStatus] = useState({ inProgress: false, message: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

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
          required: ['latitude', 'longitude', 'area', 'sensor_type', 'domain', 'name'],
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
            sensor_type: {
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

  // const handleDownloadJSONTemplate = () => {
  //   const element = document.createElement('a');
  //   const file = new Blob([nodesJson], { type: 'text/plain' });
  //   element.href = URL.createObjectURL(file);
  //   element.download = 'import-template.json';
  //   document.body.appendChild(element);
  //   element.click();
  // };

  const handleDownloadJSONTemplate = async () => {
    try {
      const response = await fetch('/import-template.json');
      if (!response.ok) {
        throw new Error('Failed to fetch the JSON template');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.download = 'template.json';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading JSON template:', error);
    }
  };

  const handleDownloadCSVTemplate = async () => {
    try {
      const response = await fetch('/import-template.csv');
      if (!response.ok) {
        throw new Error('Failed to fetch the CSV template');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.download = 'import-template.csv';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV template:', error);
    }
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

  const simulateLoadingProgress = (callback) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 95) {
        progress = 95;
        clearInterval(interval);
        callback();
      }
      setLoadingProgress(progress);
    }, 200);
  };

  const handleCsvFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        setImportStatus({ inProgress: true, message: 'Import in progress...' });
        setLoadingProgress(0);
        setModalOpen(true);

        simulateLoadingProgress(() => {
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
      if (data?.nodes?.length && data.nodes.length > 5000) {
        alert('Import less than 5000 nodes!');
        return;
      }
      if (valid) {
        setImportStatus({ inProgress: true, message: 'Import in progress...' });
        setLoadingProgress(0);
        setModalOpen(true);

        simulateLoadingProgress(() => {
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
    textTransform: 'none',
    minWidth: '180px',
    bgcolor: 'info.main',
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
    p: 4,
    borderRadius: 2
  };

  return (
    <Box sx={{ width: '100%', marginTop: '30px' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            JSON Editor
          </Typography>
          <AceEditor
            mode="json"
            theme="github"
            value={nodesJson}
            onChange={handleNodesChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false
            }}
            style={{ width: '100%', height: '400px', borderRadius: '4px' }}
          />
        </Paper>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Download JSON Template">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadJSONTemplate}
                sx={buttonStyle}>
                JSON Template
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Download CSV Template">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadCSVTemplate}
                sx={buttonStyle}>
                CSV Template
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Import JSON File">
              <Button
                fullWidth
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current.click()}
                sx={buttonStyle}>
                Import JSON
              </Button>
            </Tooltip>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Bulk Import CSV">
              <Button
                fullWidth
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => csvFileInputRef.current.click()}
                sx={buttonStyle}>
                Import CSV
              </Button>
            </Tooltip>
            <input
              type="file"
              ref={csvFileInputRef}
              style={{ display: 'none' }}
              onChange={handleCsvFileSelect}
              accept=".csv"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Tooltip title="Start Bulk Import">
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<PlayArrowIcon />}
                onClick={handleBulkImport}
                disabled={importStatus.inProgress}
                sx={buttonStyle}>
                {importStatus.inProgress ? 'Importing...' : 'Start Bulk Import'}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Paper sx={modalStyle}>
            {importStatus.inProgress ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Import Progress
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {loadingProgress}% Complete
                </Typography>
                <LinearProgress variant="determinate" value={loadingProgress} sx={{ mb: 2 }} />
              </Box>
            ) : (
              importStatus.message && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Import Status
                  </Typography>
                  <Typography variant="body1" whiteSpace="pre-line">
                    {importStatus.message}
                  </Typography>
                </>
              )
            )}
            <Button variant="contained" onClick={() => setModalOpen(false)} sx={{ mt: 2 }}>
              Close
            </Button>
          </Paper>
        </Modal>
      </Container>
    </Box>
  );
}
export default AddAdvanced;
