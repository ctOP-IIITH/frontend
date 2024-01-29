import React, { useContext, useEffect, useState } from 'react';
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
import { DataContext } from '../contexts/DataContext';

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

function Vertical() {
  const { verticals, fetchAllVerticals, fetchedVerticals } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetchedVerticals) fetchAllVerticals();
  });

  // const updatedData = data;
  const handleClickOpen = () => {
    navigate(`/add`);
  };

  const handleVerticalClick = (verticalId) => {
    navigate(`/details?filter=${encodeURIComponent(verticalId)}`);
  };

  const handleDeleteItem = (itemId) => {
    verticals.filter((item) => item.id !== itemId);
    // TO DO to refresh AE in frontned write API fro get AE
  };

  const handleDeleteClick = (itemId) => {
    verticals.filter((item) => item.id !== itemId);
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
        {verticals
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
        {verticals.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .length === 0 && (
          <Grid item xs={12}>
            <Item>
              <p>Vertical not found.</p>
            </Item>
          </Grid>
        )}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleClickOpen}>
        <Typography variant="button">ADD</Typography>
      </Fab>
    </Box>
  );
}

export default Vertical;
