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
      "nodeType": "kristnam",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    },
    {
      "nodeName": "AE-AQ2",
      "nodeType": "shenitech",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    }
  ]
},
  // { id: 'airQuality', name: 'Air Quality', description: 'Information about air quality', nodes:'' },
  { id: 'waterQuality', name: 'Water Quality', description: 'Information about water quality' , "nodes": [
    {
      "nodeName": "AE-WM1",
      "nodeType": "kristnam",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    },
    {
      "nodeName": "AE-WM2",
      "nodeType": "shenitech",
      "data": {
        "pm25": 10,
        "pm10": 12
      }
    }
  ]},
  { id: 'weatherMonitoring', name: 'Weather Monitoring', description: 'Information about weather monitoring' },
];

// ... (previous imports)

export default function MultipleSelect() {
  const [selectedData, setSelectedData] = React.useState(null);
  const [parameters, setParameters] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedItem = data.find((item) => item.id === value);
    setSelectedData(selectedItem);
  };

  const handleParameterChange = (index, key, value) => {
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

  return (
    <Box sx={{ p: 3 }}>
      <div>
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
          >
            {data.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

          <TextField
            id="text-field"
            label="Node type"
            variant="outlined"
            fullWidth
            sx={{ m: 1 }}
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
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, m: 1 }}>
        Create Node Type
      </Button>
    </Box>
  );
}