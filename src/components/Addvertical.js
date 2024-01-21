import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



export default function MultipleSelect() {
  const [VerticalName, setVerticalName] = React.useState('');
const [Description, setDescription] = React.useState('');
const [VerticalNameError, setVerticalNameError] = React.useState(false);
const [DescriptionError, setDescriptionError] = React.useState(false);


  const handleCreateVerticalName = () => {
  if (!VerticalName) {
    setVerticalNameError(true);
  }
  else{
    setVerticalNameError(false);
  }
  


  if (!Description) {
    setDescriptionError(true);
  }
  else{
    setDescriptionError(false);
  }
  if(!VerticalName || Description){
    return;
  }
  

  console.log('Vertical Name:', document.getElementById('text-field').value);
    console.log('Description:', document.getElementById('text-field1').value);
};


  return (
    <Box sx={{ p: 3 }}>
      <div>

  <Typography noWrap sx={{ fontSize: '1.5rem' }}>
      <div>
        <strong>Create New Vertical</strong> <br />
      </div>
  </Typography>

  
         <TextField
  id="text-field"
  label="Vertical Name"
  variant="outlined"
  fullWidth
  sx={{ m: 1 }}
  value={VerticalName}
  onChange={(e) => {
    setVerticalName(e.target.value);
    setVerticalNameError(false); // Reset error on change
  }}
  error={VerticalNameError}
  helperText={VerticalNameError ? 'Vertical Name is required' : ''}
/>

<TextField
  id="text-field1"
  label="Description"
  variant="outlined"
  fullWidth
  multiline
  sx={{ m: 1 }}
  rows={4}
  value={Description}
  onChange={(e) => {
    setDescription(e.target.value);
    setDescriptionError(false); // Reset error on change
  }}
  error={DescriptionError}
  helperText={DescriptionError ? 'Description is required' : ''}
/>


      </div>



      {/* Submit button */}
      <Button type="submit" variant="contained" color="primary" onClick={handleCreateVerticalName}  sx={{ mt: 2, m: 1 }}>
        Create Vertical
      </Button>
    </Box>
  );
}