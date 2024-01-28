import React, { useState } from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'; // Import PanToolAltIcon
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import SweetAlert from 'sweetalert2';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer', // Set default cursor style
  '&:hover': {
    cursor: `url(${PanToolAltIcon}) 0 0, auto` // Use PanToolAltIcon as cursor on hover
  }
}));

const data = [
  {
    id: 'airQuality',
    name: 'Air Quality',
    description: 'Information about air quality',
    nodes: [
      {
        nodeName: 'AE-AQ1',
        nodeType: 'kristnam',
        data: {
          pm25: 10,
          pm10: 12
        }
      },
      {
        nodeName: 'AE-AQ2',
        nodeType: 'shenitech',
        data: {
          pm25: 10,
          pm10: 12
        }
      }
    ]
  },

  // { id: 'airQuality', name: 'Air Quality', description: 'Information about air quality', nodes:'' },
  {
    id: 'waterQuality',
    name: 'Water Quality',
    description: 'Information about water quality',
    nodes: [
      {
        nodeName: 'AE-WM1',
        nodeType: 'kristnam',
        data: {
          pm25: 10,
          pm10: 12
        }
      },
      {
        nodeName: 'AE-WM2',
        nodeType: 'shenitech',
        data: {
          pm25: 10,
          pm10: 12
        }
      }
    ]
  },
  {
    id: 'weatherMonitoring',
    name: 'Weather Monitoring',
    description: 'Information about weather monitoring'
  }
];

function Vertical() {
  // const [verticalName, setVerticalName] = useState('');
  // const [description, setDescription] = useState('');
  // const [verticalNameError, setVerticalNameError] = React.useState(false);
  // const [descritionError, setDescriptionError] = React.useState(false);
  // const [open, setOpen] = React.useState(false);
  // const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // const updatedData = data;
  const handleClickOpen = () => {
    navigate(`/add`);
  };

  const handleVerticalClick = (verticalId) => {
    navigate(`/details?filter=${encodeURIComponent(verticalId)}`);
  };

  const handleDeleteItem = (itemId) => {
    data.filter((item) => item.id !== itemId);
    // TO DO to refresh AE in frontned write API fro get AE
  };

  const handleDeleteClick = (itemId) => {
    data.filter((item) => item.id !== itemId);
    // navigate(`/details?filter=${encodeURIComponent(verticalId)}`);
    SweetAlert.fire({
      title: 'Are you sure?',
      text: `Do you want to delete?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete function or dispatch an action to delete the item
        handleDeleteItem(itemId);
      }
    });
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1 }}>
      {/* Add the search box here */}
      <Box sx={{ p: 3 }}>
        <TextField
          label="Search Domain"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
        {data
          .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((item) => (
            <Grid key={item.id} item xs={4}>
              <div style={{ position: 'relative' }}>
                <Item onClick={() => handleVerticalClick(item.name)}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </Item>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                  <DeleteIcon onClick={() => handleDeleteClick(item.id)} />
                </div>
              </div>
            </Grid>
          ))}
        {data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .length === 0 && (
          <Grid item xs={12}>
            <Item>
              <p>Vertical not found.</p>
            </Item>
          </Grid>
        )}
      </Grid>

      <>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={handleClickOpen}>
          <Typography variant="button">ADD</Typography>
        </Fab>

        {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedItem ? selectedItem.name : ''}</DialogTitle>
        <DialogTitle>Vertical Addition</DialogTitle>
        <DialogContent>
           <DialogContent>
          {selectedItem && (
            <p>{selectedItem.description}</p>
          )}
          </DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="verticalName"
            label="Vertical Name"
            type="text"
            fullWidth
            variant="standard"
            value={verticalName}
              onChange={(e) => {
                setVerticalName(e.target.value);
                setVerticalNameError(false); // Reset error on change
              }}
              error={verticalNameError}
              helperText={verticalNameError ? 'Vertical Type is required' : ''}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError(false); // Reset error on change
              }}
              error={descritionError}
              helperText={descritionError ? 'Description is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ color: 'blue' }} onClick={handleClose}>
            Cancel
          </Button>
          <Button style={{ color: 'blue' }} onClick={handleAddNode}>
            Add Node
          </Button>
        </DialogActions>
      </Dialog> */}
      </>
    </Box>
  );
}

export default Vertical;
