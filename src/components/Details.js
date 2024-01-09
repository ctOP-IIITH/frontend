import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useLocation ,useNavigate} from 'react-router-dom';
// import { useParams } from 'react-router-dom'; // Import useParams
// import {  } from 'react-router-dom';


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




const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'black' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: 'black',
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
    console.log(filter)
    const selectedItem = data.find((item) => item.name === filter);
    setSelectedData(selectedItem);
  }, []);

  const handleVerticalClick = (nodeID) => {
    navigate(`/nodedata?filter=${encodeURIComponent(nodeID)}`);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedItem = data.find((item) => item.name === value);
    setSelectedData(selectedItem);
  };

  return (
        <Box sx={{ p: 3 }}>
      <div>
        {/* <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}> */}
             <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}>
          <InputLabel
            id="demo-multiple-name-label"
            sx={{ marginRight: 1, marginBottom: 1 }}
          >
            Select Vertical
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple={false}
            value={selectedData ? selectedData.name : ''}
            onChange={handleChange}
            MenuProps={MenuProps}
            sx={{ flex: 1 }}
            label="Select Vertical"
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
              <StyledPaper key={node.nodeName} onClick={() => handleVerticalClick(node.nodeName)}>
                {node.nodeName}
              </StyledPaper>
            ))}
          </Stack>
        ) : (
          <StyledPaper>No nodes available</StyledPaper>
        )}
      </div>
    </Box>
  );
}

