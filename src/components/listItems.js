import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // New icon for Nodes

// import LockIcon from '@mui/icons-material/Lock';
// import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
// import AddToQueueIcon from '@mui/icons-material/AddToQueue';

import { useNavigate } from 'react-router-dom'; // Import useNavigate

function MainListItems() {
  const navigate = useNavigate(); // Initialize the useNa vigate hook

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
      <ListItemButton onClick={() => handleItemClick('/add')}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Setup" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/verticals')}>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary="Domains" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/details?filter=Water Quality')}>
        <ListItemIcon>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary="Nodes" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/bulk-import')}>
        <ListItemIcon>
          <SystemUpdateAltIcon />
        </ListItemIcon>
        <ListItemText primary="Bulk Import" />
      </ListItemButton>
      {/* <ListItemButton onClick={() => handleItemClick('/addvertical')}>
        <ListItemIcon>
          <AddToQueueIcon />
        </ListItemIcon>
        <ListItemText primary="Create Vertical" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/addsensor')}>
        <ListItemIcon>
          <AddToQueueIcon />
        </ListItemIcon>
        <ListItemText primary="Create Sensor Type" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/addnode')}>
        <ListItemIcon>
          <AddToQueueIcon />
        </ListItemIcon>
        <ListItemText primary="Create Node" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/details')}>
        <ListItemIcon>
          <AddToQueueIcon />
        </ListItemIcon>
        <ListItemText primary="Nodedata" />
      </ListItemButton>
      <ListItemButton onClick={() => handleItemClick('/nodedata')}>
        <ListItemIcon>
          <AddToQueueIcon />
        </ListItemIcon>
        <ListItemText primary="Nodedata" />
      </ListItemButton> */}
    </>
  );
}

export default MainListItems;
