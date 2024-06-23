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

function CreateSensorType() {
  const [sensorTypeName, setSensorTypeName] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('');
  const [parameters, setParameters] = useState([]); // [{ name: '', dataType: '' }
  const [sensorTypes, setSensorTypes] = useState([]);
  const [baseSensorType, setBaseSensorType] = useState('');
  const [errors, setErrors] = useState({
    sensorTypeName: false,
    selectedVertical: false,
    parameters: [] // Array of booleans, one for each parameter
  });

  const { verticals } = useContext(DataContext);

  const validate = () => {
    let isValid = true;
    let newErrors = {
      sensorTypeName: !sensorTypeName,
      selectedVertical: !selectedVertical,
      parameters: parameters.map((param) => !param.name || !param.dataType)
    };

    if (
      newErrors.sensorTypeName ||
      newErrors.selectedVertical ||
      newErrors.parameters.includes(true)
    ) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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

  const handleBaseSensorTypeChange = (event) => {
    const selectedBaseType = sensorTypes.find((type) => type.res_name === event.target.value);
    setBaseSensorType(event.target.value);

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

    if (!validate()) {
      // Handle the case where validation fails
      return;
    }

    // check if at least one parameter is added
    if (parameters.length === 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'At least one parameter is required.'
      });
      return;
    }

    axiosAuthInstance
      .post('sensor-types/create', {
        res_name: sensorTypeName,
        parameters: parameters.map((param) => param.name),
        data_types: parameters.map((param) => param.dataType),
        vertical_id: verticals.find((v) => v.name === selectedVertical).id
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
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
          text: 'Something went wrong!'
        });
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Create New Sensor Type</Typography>

      <FormControl fullWidth margin="normal" disabled={!selectedVertical}>
        <InputLabel id="select-base-node-type-label">Base Sensor Type (Optional)</InputLabel>
        <Select
          labelId="select-base-sensor-type-label"
          value={baseSensorType}
          label="Base Sensor Type (Optional)"
          onChange={handleBaseSensorTypeChange}>
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
        <FormControl error={errors.selectedVertical} fullWidth margin="normal">
          <InputLabel id="select-vertical-label">Select Domain</InputLabel>
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
        {errors.selectedVertical && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            Selecting a domain is required.
          </Typography>
        )}

        <TextField
          error={errors.sensorTypeName}
          helperText={errors.sensorTypeName && 'Sensor Type Name is required'}
          label="Sensor Type Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={sensorTypeName}
          onChange={(e) => setSensorTypeName(e.target.value)}
        />

        {parameters &&
          parameters.map((param, index) => (
            <Box key={param} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                label="Parameter Name"
                error={errors.parameters[index]}
                helperText={errors.parameters[index] && 'This field is required'}
                variant="outlined"
                value={param.name}
                onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                sx={{ mr: 1, flex: 1 }}
              />
              <FormControl
                error={errors.parameters[index]}
                variant="outlined"
                sx={{ mr: 1, flex: 1, marginBottom: errors.parameters[index] ? '1.5rem' : 0 }}>
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

        <Button 
        color="inherit"
        startIcon={<AddCircleOutlineIcon />} onClick={handleAddParameter} sx={{ mt: 2,
          marginRight: '0.5rem'
         }}>
          Add Parameter
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}>
          Create Sensor Type
        </Button>
      </form>
    </Box>
  );
}

export default CreateSensorType;
