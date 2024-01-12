import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';


export default function MultipleSelect() {
  const [parameters, setParameters] = React.useState([]);
  const [nodeType, setNodeType] = React.useState('');
const [sensorName, setSensorName] = React.useState('');
const [nodeTypeError, setNodeTypeError] = React.useState(false);
const [sensorNameError, setSensorNameError] = React.useState(false);


  const handleParameterChange = (index, key, value) => {
    setParameters([...parameters, { name: '', dataType: '' , unitname: ''}]);
    const newParameters = [...parameters];
    newParameters[index][key] = value;
    setParameters(newParameters);
  };

  const handleRemoveParameter = (index) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

  const handleAddParameter = () => {
    setParameters([...parameters, { name: '', dataType: '' }]);
  };

  //  const handleCreateNodeType = () => {
  //   // Log selected vertical, node type, and added parameters to the console
  //   // console.log('Selected Vertical:', selectedData);
    // console.log('Node Type:', document.getElementById('text-field').value);
    // console.log('Sensor Name:', document.getElementById('text-field1').value);
    // console.log('Added Parameters:', parameters);
  // };


  const handleCreateNodeType = () => {
  if (!nodeType) {
    setNodeTypeError(true);
  }
  else{
    setNodeTypeError(false);
  }
  


  if (!sensorName) {
    setSensorNameError(true);
  }
  else{
    setSensorNameError(false);
  }
  if(!nodeType || sensorName){
    return;
  }
  

  // Log selected vertical, node type, and added parameters to the console
  // console.log('Selected Vertical:', selectedData);
  console.log('Node Type:', document.getElementById('text-field').value);
    console.log('Sensor Name:', document.getElementById('text-field1').value);
    console.log('Added Parameters:', parameters);
};


  return (
    <Box sx={{ p: 3 }}>
      <div>
         <TextField
  id="text-field"
  label="Node type"
  variant="outlined"
  fullWidth
  sx={{ m: 1 }}
  value={nodeType}
  onChange={(e) => {
    setNodeType(e.target.value);
    setNodeTypeError(false); // Reset error on change
  }}
  error={nodeTypeError}
  helperText={nodeTypeError ? 'Node type is required' : ''}
/>

<TextField
  id="text-field1"
  label="Sensor Name"
  variant="outlined"
  fullWidth
  sx={{ m: 1 }}
  value={sensorName}
  onChange={(e) => {
    setSensorName(e.target.value);
    setSensorNameError(false); // Reset error on change
  }}
  error={sensorNameError}
  helperText={sensorNameError ? 'Sensor Name is required' : ''}
/>

      </div>

      {/* Parameter input fields */}
      {parameters.map((param, index) => (
        <Box key={param.name} sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%', m: 1 }}>
          <TextField
            label="Parameter Name"
            variant="outlined"
            value={param.name}
            onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
            sx={{ mr: 1, flex: 1 }}
          />
          <TextField
            label="Unit name"
            variant="outlined"
            value={param.unitname}
            onChange={(e) => handleParameterChange(index, 'unitname', e.target.value)}
            sx={{ mr: 1, flex: 1 }}
          />
          <FormControl variant="outlined" sx={{ mr: 1, flex: 1, m: 1 }}>
            <InputLabel>Data Type</InputLabel>
            <Select
              value={param.dataType}
              onChange={(e) => handleParameterChange(index, 'dataType', e.target.value)}
              label="Data Type"
              sx={{ width: '100%' }}
            >
              <MenuItem value="Number">Number</MenuItem>
              <MenuItem value="String">String</MenuItem>
              <MenuItem value="Boolean">Boolean</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => handleRemoveParameter(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Add Parameter button */}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddParameter} sx={{ mt: 2, m: 1 }}>
        Add Parameter
      </Button>

      {/* Submit button */}
      <Button type="submit" variant="contained" color="primary" onClick={handleCreateNodeType}  sx={{ mt: 2, m: 1 }}>
        Create Sensor Type
      </Button>
    </Box>
  );
}