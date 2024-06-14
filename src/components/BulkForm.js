import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Modal,
  LinearProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Ajv from 'ajv';

import { DataContext } from '../contexts/DataContext';
import { axiosAuthInstance } from '../services/axiosConfig';

const BulkForm = () => {
  const { verticals } = useContext(DataContext);
  const [nodes, setNodes] = useState([
    {
      id: 1,
      selectedData: null,
      name: '',
      area: '',
      latitude: '',
      longitude: '',
      sensorType: '',
      sensorTypes: []
    }
  ]);
  const [importStatus, setImportStatus] = useState({ inProgress: false, message: '' });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const addNode = () => {
    const lastNode = nodes[nodes.length - 1];
    const newNodeId = nodes.length + 1;
    setNodes([
      ...nodes,
      {
        id: newNodeId,
        selectedData: lastNode.selectedData,
        name: '',
        area: lastNode.area,
        latitude: '',
        longitude: '',
        sensorType: lastNode.sensorType,
        sensorTypes: lastNode.sensorTypes
      }
    ]);
  };

  const removeNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
  };

  const fetchSensorTypes = (domainId, index) => {
    axiosAuthInstance
      .get(`/sensor-types/get/${domainId}`)
      .then((response) => {
        const updatedNodes = [...nodes];
        updatedNodes[index].sensorTypes = response.data;
        setNodes(updatedNodes);
      })
      .catch((err) => {
        console.error('Error fetching sensor types:', err);
      });
  };

  const handleChange = (index, field, value) => {
    const updatedNodes = [...nodes];

    if (field === 'latitude' || field === 'longitude') {
      // Allow only numeric characters, a single decimal point, and an optional minus sign
      const regex = /^-?\d*\.?\d*$/;
      if (value === '' || regex.test(value)) {
        updatedNodes[index][field] = value;
      }
    } else {
      updatedNodes[index][field] = value;
    }

    setNodes(updatedNodes);

    if (field === 'selectedData') {
      fetchSensorTypes(value, index);
    }
  };

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

  const ajv = new Ajv();

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

  const handleBulkImport = () => {
    const nodesData = nodes.map((node) => ({
      latitude: parseFloat(node.latitude),
      longitude: parseFloat(node.longitude),
      area: node.area,
      sensor_type: node.sensorTypes.find((sensorType) => sensorType.id === node.sensorType)
        .res_name,
      domain: verticals.find((vertical) => vertical.id === node.selectedData).name,
      name: node.name
    }));

    const data = {
      nodes: nodesData
    };

    try {
      // Validate the data against the schema
      const validate = ajv.compile(nodesSchema);
      const valid = validate(data);

      if (valid) {
        setImportStatus({ inProgress: true, message: 'Import in progress...' });
        setModalOpen(true);
        setLoadingProgress(0);

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
              }
              message += '\n';

              if (invalidSensorNodes.length > 0) {
                message += `Invalid sensor nodes:\n`;
                invalidSensorNodes.forEach((node, index) => {
                  message += `${index + 1}. ${node.node.name}, Error: ${node.error}\n`;
                });
              }
              message += '\n';

              if (createdNodes.length > 0) {
                console.log(createdNodes);
                message += `Created nodes:\n`;
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
        console.log(data);
        alert('The JSON data is not in the correct format. Please check and try again.');
      }
    } catch (error) {
      // Handle parsing errors
      console.error('Error parsing JSON data:', error);
      alert('Invalid JSON format. Please check and try again.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Bulk Node Form
      </Typography>
      {nodes.map((node) => (
        <Paper key={node.id} sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id={`domain-label-${node.id}`}>Select Domain</InputLabel>
                <Select
                  labelId={`domain-label-${node.id}`}
                  value={node.selectedData || ''}
                  onChange={(e) =>
                    handleChange(nodes.indexOf(node), 'selectedData', e.target.value)
                  }
                  label="Select Domain">
                  {verticals.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id={`sensor-type-label-${node.id}`}>Select Sensor Type</InputLabel>
                <Select
                  labelId={`sensor-type-label-${node.id}`}
                  value={node.sensorType || ''}
                  onChange={(e) => handleChange(nodes.indexOf(node), 'sensorType', e.target.value)}
                  label="Select Sensor Type">
                  {node.sensorTypes &&
                    node.sensorTypes.map((sensorType) => (
                      <MenuItem key={sensorType.id} value={sensorType.id}>
                        {sensorType.res_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={node.name}
                onChange={(e) => handleChange(nodes.indexOf(node), 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Area"
                variant="outlined"
                value={node.area}
                onChange={(e) => handleChange(nodes.indexOf(node), 'area', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                variant="outlined"
                value={node.latitude}
                onChange={(e) => handleChange(nodes.indexOf(node), 'latitude', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                variant="outlined"
                value={node.longitude}
                onChange={(e) => handleChange(nodes.indexOf(node), 'longitude', e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeNode(node.id)}
              startIcon={<DeleteIcon />}>
              Delete Node
            </Button>
          </Box>
        </Paper>
      ))}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="contained" onClick={addNode} startIcon={<AddIcon />}>
            Add Node
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkImport}
            disabled={importStatus.inProgress}
            startIcon={<CloudUploadIcon />}>
            {importStatus.inProgress ? 'Importing...' : 'Bulk Import'}
          </Button>
        </Grid>
      </Grid>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            p: 4,
            borderRadius: 2
          }}>
          <Typography variant="h6" gutterBottom>
            Import Status
          </Typography>
          {importStatus.inProgress && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={loadingProgress} />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {`${Math.round(loadingProgress)}%`}
              </Typography>
            </Box>
          )}
          <Typography sx={{ mt: 2, whiteSpace: 'pre-line' }}>{importStatus.message}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default BulkForm;
