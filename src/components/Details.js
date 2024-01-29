import { useContext, useState, useEffect } from 'react';
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
import { DataContext } from '../contexts/DataContext';
import { axiosAuthInstance } from '../services/axiosConfig';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'black' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: 'black'
  //   fontSize: '30px',
}));

export default function Details() {
  // eslint-disable-next-line no-unused-vars
  const { verticals, nodes, setNodes } = useContext(DataContext);

  // Uncommented usage
  const [selectedData, setSelectedData] = useState(null);
  const [areaFilter, setAreaFilter] = useState('');
  const [sensorTypeFilter, setSensorTypeFilter] = useState('');
  const [nodeAssignmentStatus, setNodeAssignmentStatus] = useState('all'); // 'assigned', 'unassigned', 'all'
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    // Find the selectedData based on verticalId
    console.log(filter);
    axiosAuthInstance.get(`/nodes/${filter}`).then((response) => {
      const selectedItem = {
        id: filter,
        name: filter,
        nodes: response.data.map((node) => ({
          nodeName: node.node_name,
          nodeSensorType: node.res_name,
          nodeOrid: node.orid,
          nodeDataOrid: node.data_orid,
          nodeArea: node.area,
          nodeTokenNumber: node.token_num,
          nodeSensorNumber: node.sensor_node_number
        }))
      };

      setSelectedData(selectedItem);
    });
  }, [areaFilter, sensorTypeFilter, nodeAssignmentStatus, location]);

  // Handlers for filters
  const handleAreaChange = (event) => setAreaFilter(event.target.value);
  const handleSensorTypeChange = (event) => setSensorTypeFilter(event.target.value);
  const handleAssignmentStatusChange = (event) => setNodeAssignmentStatus(event.target.value);

  const handleClickOpen = () => {
    navigate(`/add`);
  };
  const handleVerticalClick = (nodeID) => {
    navigate(`/nodedata?filter=${encodeURIComponent(nodeID)}`);
  };

  const handleDeleteItem = (itemId) => {
    console.log(itemId);
    // data.filter((item) => item.id !== itemId);
    // TO DO to refresh AE in frontned write API fro get node of that AE
  };

  const handleDeleteClick = (itemId) => {
    // data.filter((item) => item.id !== itemId);
    console.log(itemId);
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
    // reload the page with the new verticalId
    navigate(`/details?filter=${encodeURIComponent(value)}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} sx={{ marginTop: 2 }}>
        {/* Area Filter */}
        <FormControl fullWidth>
          <InputLabel>Area</InputLabel>
          <Select value={areaFilter} onChange={handleAreaChange} MenuProps={MenuProps}>
            {/* Map areas to MenuItems */}
          </Select>
        </FormControl>

        {/* Sensor Type Filter */}
        <FormControl fullWidth>
          <InputLabel>Sensor Type</InputLabel>
          <Select value={sensorTypeFilter} onChange={handleSensorTypeChange} MenuProps={MenuProps}>
            {/* Map sensor types to MenuItems */}
          </Select>
        </FormControl>

        {/* Node Assignment Status Filter */}
        <FormControl fullWidth>
          <InputLabel>Node Assignment</InputLabel>
          <Select
            value={nodeAssignmentStatus}
            onChange={handleAssignmentStatusChange}
            MenuProps={MenuProps}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="unassigned">Unassigned</MenuItem>
          </Select>
        </FormControl>

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
            label="Select Domain">
            {verticals.map((item) => (
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
                  {/* {node.nodeName}{' '} */}
                  {node.nodeSensorType} {node.nodeSensorNumber}{' '}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleVerticalClick(node.nodeName)}>
                    View Node Details
                  </Button>
                </Typography>
                <Typography variant="body1">
                  <strong>Node Name:</strong> {node.nodeName}
                  <br />
                  SensorType: {node.nodeSensorType}
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '-20px',
                    paddingRight: '8px'
                  }}>
                  <DeleteIcon onClick={handleDeleteClick} />
                </div>
              </StyledPaper>
            ))}
          </Stack>
        ) : (
          <StyledPaper>No nodes available</StyledPaper>
        )}
      </Stack>

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
