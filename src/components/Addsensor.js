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
import { Typography } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const data = [
  {
  "id": "airQuality",
  "name": "Air Quality",
  "description": "Information about air quality",
  "nodes": [
    {
      "nodeName": "AE-AQ1",
      "sensorType": "kristnam",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    },
    {
      "nodeName": "AE-AQ2",
      "sensorType": "shenitech",
      "data": {
        "pm25": 10,
        "pm10": 12,
        "co2": 36
      }
    }
  ]
},
  // { id: 'airQuality', name: 'Air Quality', description: 'Information about air quality', nodes:'' },
  { id: 'waterQuality', name: 'Water Quality', description: 'Information about water quality' , "nodes": [
    {
      "nodeName": "AE-WM1",
      "sensorType": "kristnam",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    },
    {
      "nodeName": "AE-WM2",
      "sensorType": "shenitech",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    }
  ]},
  { id: 'weatherMonitoring', name: 'Weather Monitoring', description: 'Information about weather monitoring' },
];

export default function MultipleSelect() {
  const [parameters, setParameters] = React.useState([]);
  const [sensorType, setsensorType] = React.useState('');
// const [sensorName, setSensorName] = React.useState('');
const [sensorTypeError, setsensorTypeError] = React.useState(false);
// const [sensorNameError, setSensorNameError] = React.useState(false);
 const [selectedData, setSelectedData] = React.useState(null);
 const [selectedDataError, setSelectedDataError] = React.useState(false);
 const [selectedsensorType, setSelectedsensorType] = React.useState(''); 
  const [availableParameters, setAvailableParameters] = React.useState([]);

 React.useEffect(() => {
  if (selectedsensorType && selectedData) {
    const selectedNode = selectedData.nodes.find((node) => node.sensorType === selectedsensorType);
    if (selectedNode && selectedNode.data) {
      // Extract parameter names from the data object
      const params = Object.keys(selectedNode.data);
      setAvailableParameters(params.map((param) => ({ name: param }))); // Update this line
    }
  } else {
    setAvailableParameters([]);
  }
}, [selectedsensorType, selectedData]);



const handleChange = (event) => {
  const {
    target: { value },
  } = event;
  const selectedItem = data.find((item) => item.id === value);
  setSelectedData(selectedItem);
  setSelectedDataError(false);

  const selectedNodeId = event.target.value;
  const selectedNode = data.find((item) => item.id === selectedNodeId);

  if (selectedNode && selectedNode.nodes && selectedNode.nodes.length > 0) {
    setParameters([]); // Clear parameters when the vertical changes
    setSelectedsensorType('None'); // Set selected node type to 'None'
  } else {
    setParameters([]); // Clear parameters when 'None' is selected or another node type is selected
  }
};



const handleParameterChange = (index, key, value) => {
  const newParameters = [...parameters];
  newParameters[index] = {
    ...newParameters[index],
    [key]: value,
  };
  

  if (selectedsensorType === 'None') {
    // Reset parameters to empty object when "None" is selected
    setParameters([{}]);
  } else {
    setParameters(newParameters);
  }
};


  const handleRemoveParameter = (index) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

const handleAddParameter = () => {
  if (selectedsensorType === 'None') {
    // If "None" is selected, reset parameters to empty array and availableParameters to empty object
    setParameters([]);
    setAvailableParameters([]);
  } else {
    const newParameter = { name: '', unitname: '', dataType: '' };
    setParameters([...parameters, newParameter]);
    setAvailableParameters([...availableParameters, newParameter]);
  }
};



  //  const handleCreatesensorType = () => {
  //   // Log selected vertical, node type, and added parameters to the console
  //   // console.log('Selected Vertical:', selectedData);
    // console.log('Node Type:', document.getElementById('text-field').value);
    // console.log('Sensor Name:', document.getElementById('text-field1').value);
    // console.log('Added Parameters:', parameters);
  // };


  const handleCreatesensorType = () => {
  if (!sensorType) {
    setsensorTypeError(true);
  }
  else{
    setsensorTypeError(false);
  }
  
   if (!selectedData) {
    setSelectedDataError(true);
  }else{
    setSelectedDataError(false);
    }
  


  if(!sensorType || selectedData){
    return;
  }
  


  // if (!sensorName) {
  //   setSensorNameError(true);
  // }
  // else{
  //   setSensorNameError(false);
  // }
  // if(!sensorType || sensorName ){
  //   return;
  // }
  

  // Log selected vertical, node type, and added parameters to the console
  // console.log('Selected Vertical:', selectedData);
  console.log('Node Type:', document.getElementById('text-field').value);
    console.log('Sensor Name:', document.getElementById('text-field1').value);
    console.log('Added Parameters:', parameters);
};


  return (
    <Box sx={{ p: 3 }}>
      <div>

         <Typography noWrap sx={{ fontSize: '1.5rem' }}>
      <div>
        <strong>Create New Sensor Type</strong> <br />
      </div>
  </Typography>

        <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}>
  <InputLabel
    id="demo-multiple-name-label"
    sx={{ marginRight: 1, marginBottom: 1 }} // Added marginBottom to create space
  >
    Select Vertical
  </InputLabel>
  <Select
    labelId="demo-multiple-name-label"
    id="demo-multiple-name"
    multiple={false}
    value={selectedData ? selectedData.id : ''}
    onChange={handleChange}
    MenuProps={MenuProps}
    sx={{ flex: 1 }}
    label="Select Vertical" // Added label prop to ensure space for label
    error={selectedDataError} // Add error prop based on selectedDataError
  >
    {data.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ))}
  </Select>

  {selectedDataError && (
    <Typography variant="caption" color="error">
      Vertical type is required
    </Typography>
  )}
</FormControl>

<FormControl sx={{ m: 1, display: 'flex', width: '100%' }}>
  <InputLabel
    id="demo-multiple-name-label"
    sx={{ marginRight: 1, marginBottom: 1 }} // Added marginBottom to create space
  >
    Select Sensor Type
  </InputLabel>
 <Select
  labelId="demo-multiple-name-label"
  id="demo-multiple-name"
  multiple={false}
  value={selectedsensorType}
  onChange={(e) => setSelectedsensorType(e.target.value)}
  MenuProps={MenuProps}
  sx={{ flex: 1 }}
  label="Select Sensor Type"
  // error={selectedDataError}
>
  <MenuItem value="None">None</MenuItem>
  {selectedData && selectedData.nodes && selectedData.nodes.length > 0 && (
    selectedData.nodes.map((node) => (
      <MenuItem key={node.sensorType} value={node.sensorType}>
        {node.sensorType}
      </MenuItem>
    ))
  )}
</Select>
 <Typography variant="caption" color="true">
      Select Vertical to enable menu options
    </Typography>


  {/* {selectedDataError && (
    <Typography variant="caption" color="error">
      Sensor type is required
    </Typography>
  )} */}
</FormControl>
         <TextField
  id="text-field"
  label="Sensor Type Name"
  variant="outlined"
  fullWidth
  sx={{ m: 1 }}
  value={sensorType}
  onChange={(e) => {
    setsensorType(e.target.value);
    setsensorTypeError(false); // Reset error on change
  }}
  error={sensorTypeError}
  helperText={sensorTypeError ? 'Sensor type is required' : ''}
/>

{/* <TextField
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
/> */}

      </div>

      {/* Parameter input fields */}
      {availableParameters.map((param, index) => (
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
      <Button type="submit" variant="contained" color="primary" onClick={handleCreatesensorType}  sx={{ mt: 2, m: 1 }}>
        Create Sensor Type
      </Button>
    </Box>
  );
}