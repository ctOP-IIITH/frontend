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
    <Box>
      <Typography variant="h6" gutterBottom>
        Bulk Node Form
      </Typography>
      {nodes.map((node) => (
        <Paper key={node.id} sx={{ padding: 2, marginBottom: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Domain</InputLabel>
                <Select
                  value={node.selectedData || ''}
                  onChange={(e) =>
                    handleChange(nodes.indexOf(node), 'selectedData', e.target.value)
                  }>
                  {verticals.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Sensor Type</InputLabel>
                <Select
                  value={node.sensorType || ''}
                  onChange={(e) => handleChange(nodes.indexOf(node), 'sensorType', e.target.value)}>
                  {node.sensorTypes &&
                    node.sensorTypes.map((sensorType) => (
                      <MenuItem key={sensorType.id} value={sensorType.id}>
                        {sensorType.res_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={node.name}
                onChange={(e) => handleChange(nodes.indexOf(node), 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area"
                value={node.area}
                onChange={(e) => handleChange(nodes.indexOf(node), 'area', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={node.latitude}
                onChange={(e) => handleChange(nodes.indexOf(node), 'latitude', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={node.longitude}
                onChange={(e) => handleChange(nodes.indexOf(node), 'longitude', e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" color="error" onClick={() => removeNode(node.id)}>
                Delete
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Button variant="contained" onClick={addNode}>
            Add Node
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleBulkImport} disabled={importStatus.inProgress}>
            {importStatus.inProgress ? 'Importing...' : 'Bulk Import'}
          </Button>
        </Grid>
      </Grid>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '80%',
            maxWidth: 600
          }}>
          <Typography variant="h6" gutterBottom>
            Import Status
          </Typography>
          {importStatus.inProgress && (
            <LinearProgress variant="determinate" value={loadingProgress} />
          )}
          <Typography sx={{ marginTop: 2, whiteSpace: 'pre-line' }}>
            {importStatus.message}
          </Typography>
          <Button onClick={() => setModalOpen(false)} sx={{ marginTop: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BulkForm;
