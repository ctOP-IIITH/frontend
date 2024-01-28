import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { axiosAuthInstance } from '../services/axiosConfig';

const MySwal = withReactContent(Swal);

export default function MultipleSelect() {
  const [VerticalName, setVerticalName] = React.useState('');
  const [Description, setDescription] = React.useState('');
  const [VerticalNameError, setVerticalNameError] = React.useState(false);
  const [DescriptionError, setDescriptionError] = React.useState(false);

  // const handleAddVerticalName = () => {
  const handleAddVerticalName = () => {
    if (!VerticalName) {
      setVerticalNameError(true);
    } else {
      setVerticalNameError(false);
    }

    if (!Description) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }

    if (!VerticalName || !Description) {
      return;
    }

    // Your existing code for handling vertical name and description
    console.log('Vertical Name:', VerticalName);
    console.log('Description:', Description);

    axiosAuthInstance
      .post('/verticals/create-ae', {
        ae_name: VerticalName,
        ae_description: Description,
        path: ''
      })
      .then((response) => {
        if (response.data.detail === 'AE created') {
          // Show SweetAlert on success
          MySwal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Domain added successfully.',
            showConfirmButton: false,
            timer: 1500 // Auto close after 1.5 seconds
          });
        } else {
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href="">Why do I have this issue?</a>'
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
      <div>
        <Typography noWrap sx={{ fontSize: '1.5rem' }}>
          <div>
            <strong>Add New Domain</strong> <br />
          </div>
        </Typography>

        <TextField
          id="text-field"
          label="Domain Name"
          variant="outlined"
          fullWidth
          sx={{ m: 1 }}
          value={VerticalName}
          onChange={(e) => {
            setVerticalName(e.target.value);
            setVerticalNameError(false); // Reset error on change
          }}
          error={VerticalNameError}
          helperText={VerticalNameError ? 'Domain Name is required' : ''}
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleAddVerticalName}
        sx={{ mt: 2, m: 1 }}>
        Add Domain
      </Button>
    </Box>
  );
}
