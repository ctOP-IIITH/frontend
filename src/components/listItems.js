import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import LockIcon from '@mui/icons-material/Lock';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';

import { useNavigate } from 'react-router-dom'; // Import useNavigate

function MainListItems() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleItemClick = (path) => {
    navigate(path); // Use navigate to navigate to the specified path
  };

  return (
    <>
      <ListItemButton onClick={() => handleItemClick('/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/private')}>
        <ListItemIcon>
          <LockIcon />
        </ListItemIcon>
        <ListItemText primary="Private" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/vertical')}>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary="Vertical" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/addnode')}>
        <ListItemIcon>
          <AddToPhotosIcon />
        </ListItemIcon>
        <ListItemText primary="Addnode" />
      </ListItemButton>
       <ListItemButton onClick={() => handleItemClick('/addsensor')}>
        <ListItemIcon>
          <AddToQueueIcon/>
        </ListItemIcon>
        <ListItemText primary="Addsensor" />
      </ListItemButton>
       {/* <ListItemButton onClick={() => handleItemClick('/details')}>
        <ListItemIcon>
          <AddToQueueIcon/>
        </ListItemIcon>
        <ListItemText primary="Nodedata" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/nodedata')}>
        <ListItemIcon>
          <AddToQueueIcon/>
        </ListItemIcon>
        <ListItemText primary="Nodedata" />
      </ListItemButton> */}
    </>
  );
}

export default MainListItems;
