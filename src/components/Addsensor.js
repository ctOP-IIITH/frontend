/* eslint-disable */
import React, { useState, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../contexts/DataContext';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { axiosAuthInstance } from '../services/axiosConfig';

const MySwal = withReactContent(Swal);

function CreateNodeType() {
  const [nodeTypeName, setNodeTypeName] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('');
  const [parameters, setParameters] = useState([]); // [{ name: '', dataType: '' }
  const [sensorTypes, setSensorTypes] = useState([]);
  const [baseNodeType, setBaseNodeType] = useState('');
  const { verticals, nodesData, updateNodesData } = useContext(DataContext);

  const handleAddParameter = () => {
    setParameters([...parameters, { name: '', dataType: '' }]);
  };

  const handleParameterChange = (index, field, value) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    setParameters(newParameters);
  };

  const handleRemoveParameter = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleBaseNodeTypeChange = (event) => {
    const selectedBaseType = sensorTypes.find((type) => type.res_name === event.target.value);
    setBaseNodeType(event.target.value);

    if (selectedBaseType) {
      // parameters in selectedBaseType.parameters
      // data types in selectedBaseType.data_types
      const baseParams = selectedBaseType.parameters;
      const baseDataTypes = selectedBaseType.data_types;

      const formattedParams = baseParams.map((param, index) => ({
        name: param,
        dataType: baseDataTypes[index]
      }));
      console.log(formattedParams);
      setParameters(formattedParams);
    } else {
      setParameters([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedVertical || !nodeTypeName) {
      // Handle the case where no vertical or node type name is selected
      // You might want to show an error message here
      return;
    }

    axiosAuthInstance
      .post('sensor-types/create', {
        res_name: nodeTypeName,
        parameters: parameters.map((param) => param.name),
        data_types: parameters.map((param) => param.dataType),
        vertical_id: verticals.find((v) => v.name === selectedVertical).id
      })
      .then((response) => {
        if (response.data.detail === 'Sensor type created') {
          // Show SweetAlert on success
          MySwal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Sensor type added successfully.',
            showConfirmButton: false,
            timer: 1500 // Auto close after 1.5 seconds
          });
        }
      })
      .catch((error) => {
        console.log(error);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
        });
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Create New Node Type</Typography>

      <FormControl fullWidth margin="normal" disabled={!selectedVertical}>
        <InputLabel id="select-base-node-type-label">Base Node Type (Optional)</InputLabel>
        <Select
          labelId="select-base-node-type-label"
          value={baseNodeType}
          label="Base Node Type (Optional)"
          onChange={handleBaseNodeTypeChange}>
          <MenuItem value="None">None</MenuItem>
          {selectedVertical &&
            sensorTypes.length > 0 &&
            sensorTypes.map((type) => (
              <MenuItem key={type.res_name} value={type.res_name}>
                {type.res_name}
              </MenuItem>
            ))}
        </Select>
        {!selectedVertical && (
          <Typography variant="caption" sx={{ mt: 1 }}>
            Please select a vertical first to enable this option.
          </Typography>
        )}
      </FormControl>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-vertical-label">Select Vertical</InputLabel>
          <Select
            labelId="select-vertical-label"
            value={selectedVertical}
            label="Select Vertical"
            onChange={(e) => {
              setSelectedVertical(e.target.value);
              const vert_id = verticals.find((v) => v.name === e.target.value).id;
              axiosAuthInstance.get(`/sensor-types/get/${vert_id}`).then((response) => {
                setSensorTypes(response.data);
              });
            }}>
            {verticals.map((vertical) => (
              <MenuItem key={vertical} value={vertical.name}>
                {vertical.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Node Type Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nodeTypeName}
          onChange={(e) => setNodeTypeName(e.target.value)}
        />

        {parameters &&
          parameters.map((param, index) => (
            <Box key={param} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                label="Parameter Name"
                variant="outlined"
                value={param.name}
                onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                sx={{ mr: 1, flex: 1 }}
              />
              <FormControl variant="outlined" sx={{ mr: 1, flex: 1 }}>
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={param.dataType}
                  onChange={(e) => handleParameterChange(index, 'dataType', e.target.value)}
                  label="Data Type">
                  <MenuItem value="int">Number</MenuItem>
                  <MenuItem value="string">String</MenuItem>
                  <MenuItem value="float">Decimal</MenuItem>
                  {/* Add more data types as needed */}
                </Select>
              </FormControl>
              <IconButton onClick={() => handleRemoveParameter(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

        <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddParameter} sx={{ mt: 2 }}>
          Add Parameter
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}>
          Create Node Type
        </Button>
      </form>
    </Box>
  );
}

export default CreateNodeType;
