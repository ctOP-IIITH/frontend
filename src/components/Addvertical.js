import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { axiosAuthInstance } from '../services/axiosConfig';
import { DataContext } from '../contexts/DataContext';

const MySwal = withReactContent(Swal);

export default function MultipleSelect() {
  const { fetchAllVerticals } = useContext(DataContext);
  const [VerticalName, setVerticalName] = useState('');
  const [VerticalShortName, setVerticalShortName] = useState('');
  // 0 is no error, 1 is not filled, 2 is greater than 2 characters
  const [VerticalShortNameError, setVerticalShortNameError] = useState(0);
  const [Description, setDescription] = useState('');
  const [VerticalNameError, setVerticalNameError] = useState(false);
  const [DescriptionError, setDescriptionError] = useState(false);

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

    if (!VerticalShortName) {
      setVerticalShortNameError(1);
    } else if (VerticalShortName.length > 2) {
      setVerticalShortNameError(2);
    } else {
      setVerticalShortNameError(0);
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
        ae_short_name: VerticalShortName,
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
        }
        fetchAllVerticals();
      })
      .catch((error) => {
        console.log(error, error.response.data);
        if (error.response.status === 409) {
          MySwal.fire({
            icon: 'warning',
            title: 'Domain already exists!'
          });
        } else {
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          });
        }
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
          id="text-field2"
          label="Domain Short Name"
          variant="outlined"
          fullWidth
          sx={{ m: 1 }}
          value={VerticalShortName}
          onChange={(e) => {
            setVerticalShortName(e.target.value);
            setVerticalShortNameError(0); // Reset error on change
          }}
          error={VerticalShortNameError > 0}
          helperText={() => {
            if (VerticalShortNameError === 1) return 'Domain Short Name is required';
            if (VerticalShortNameError === 2) return 'Domain Short Name should be 2 characters';
            return '';
          }}
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
