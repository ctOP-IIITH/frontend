import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom'; // Import useParams
// import {  } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import SweetAlert from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'black' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: 'black'
  //   fontSize: '30px',
}));

export default function Details() {
  // Uncommented usage
  const [selectedData, setSelectedData] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    // Find the selectedData based on verticalId
    console.log(filter);
    const selectedItem = data.find((item) => item.name === filter);
    setSelectedData(selectedItem);
  }, []);

  const handleClickOpen = () => {
    navigate(`/add`);
  };
  const handleVerticalClick = (nodeID) => {
    navigate(`/nodedata?filter=${encodeURIComponent(nodeID)}`);
  };

  const handleDeleteItem = (itemId) => {
    data.filter((item) => item.id !== itemId);
    // TO DO to refresh AE in frontned write API fro get node of that AE
  };

  const handleDeleteClick = (itemId) => {
    data.filter((item) => item.id !== itemId);

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

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    const selectedItem = data.find((item) => item.name === value);
    setSelectedData(selectedItem);
  };

  return (
    <Box sx={{ p: 3 }}>
      <div>
        {/* <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}> */}
        <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}>
          <InputLabel id="demo-multiple-name-label" sx={{ marginRight: 1, marginBottom: 1 }}>
            Select Domain
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple={false}
            value={selectedData ? selectedData.name : ''}
            onChange={handleChange}
            MenuProps={MenuProps}
            sx={{ flex: 1 }}
            label="Select Domain"
          >
            {data.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedData && Array.isArray(selectedData.nodes) && selectedData.nodes.length > 0 ? (
          <Stack spacing={3} sx={{ marginTop: 2 }}>
            {selectedData.nodes.map((node) => (
              <StyledPaper key={node.nodeName}>
                <Typography variant="h6">
                  {node.nodeName}{' '}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleVerticalClick(node.nodeName)}
                  >
                    View Node Details
                  </Button>
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '-20px',
                    paddingRight: '8px'
                  }}
                >
                  <DeleteIcon onClick={handleDeleteClick} />
                </div>
              </StyledPaper>
            ))}
          </Stack>
        ) : (
          <StyledPaper>No nodes available</StyledPaper>
        )}
      </div>

      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={handleClickOpen}
      >
        <Typography variant="button">ADD</Typography>
      </Fab>
    </Box>
  );
}
