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
         <TextField
            id="text-field"
            label="Node type"
            variant="outlined"
            fullWidth
            sx={{ m: 1 }}
          />

          <TextField
            id="text-field"
            label="Sensor Name"
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
          <TextField
            label="Unit name"
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