// React imports
import { useContext, useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Material UI imports
import {
  Box,
  Button,
  Paper,
  Stack,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// Other third-party imports
import SweetAlert from 'sweetalert2';

// Local imports
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

function CheckboxFilter({ title, options, selectedOptions, onChange }) {
  return (
    <div>
      <Typography variant="subtitle1">
        <strong>{title}</strong>
      </Typography>
      <Box style={{ maxHeight: '200px', overflow: 'auto' }}>
        {options.length === 0 && <Typography variant="body2">No options available</Typography>}
        {options.length > 0 &&
          options.map((option) => (
            <FormControlLabel
              key={option.value}
              style={{ display: 'block' }}
              control={
                <Checkbox
                  checked={selectedOptions.includes(option.value)}
                  onChange={(e) => onChange(option.value, e.target.checked)}
                  name={option.value}
                />
              }
              label={option.label}
            />
          ))}
      </Box>
    </div>
  );
}

export default function Details() {
  const { verticals, fetchAllVerticals, fetchedVerticals } = useContext(DataContext);

  // Uncommented usage
  const [selectedData, setSelectedData] = useState({
    id: '',
    name: '',
    nodes: []
  });

  const [filters, setFilters] = useState({ area: [], sensorType: [], nodeAssignment: [] });
  const location = useLocation();
  const navigate = useNavigate();

  const fetchNodes = (curFilter) => {
    axiosAuthInstance.get(`/nodes/${curFilter}`).then((response) => {
      const selectedItem = {
        id: curFilter,
        name: curFilter,
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
  };
  useEffect(() => {
    if (!fetchedVerticals) fetchAllVerticals();
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    // Find the selectedData based on verticalId
    fetchNodes(filter);
    console.log(filter);
  }, [location]);

  const handleCheckboxChange = (filterName, value, checked) => {
    setFilters((prevFilters) => {
      const updatedOptions = checked
        ? [...prevFilters[filterName], value]
        : prevFilters[filterName].filter((item) => item !== value);
      return { ...prevFilters, [filterName]: updatedOptions };
    });
  };

  const filterOptions = {
    area: [
      ...selectedData.nodes
        .reduce(
          (unique, node) =>
            unique.findIndex((uniqueNode) => uniqueNode.nodeArea === node.nodeArea) < 0
              ? [...unique, node]
              : unique,
          []
        )
        .map((node) => ({
          value: node.nodeArea,
          label: node.nodeArea
        }))
      // { value: 'unassigned', label: 'Unassigned' },
      // { value: 'assigned', label: 'Assigned' },
      // { value: 'all', label: 'All' },
      // { value: 'test1', label: 'Test1' },
      // { value: 'test2', label: 'Test2' },
      // { value: 'test3', label: 'Test3' }
    ],
    sensorType: selectedData.nodes
      .reduce(
        (unique, node) =>
          unique.findIndex((uniqueNode) => uniqueNode.nodeSensorType === node.nodeSensorType) < 0
            ? [...unique, node]
            : unique,
        []
      )
      .map((node) => ({
        value: node.nodeSensorType,
        label: node.nodeSensorType
      })),
    nodeAssignment: [
      selectedData.nodes.filter((node) => node.nodeTokenNumber).length > 0 && {
        // If there are assigned nodes
        value: 'assigned',
        label: 'Assigned'
      },
      selectedData.nodes.filter((node) => !node.nodeTokenNumber).length > 0 && {
        // If there are unassigned nodes
        value: 'unassigned',
        label: 'Unassigned'
      }
    ].filter(Boolean) // Remove the falsy values
  };

  const filteredNodes = useMemo(
    () =>
      selectedData.nodes.filter(
        (node) =>
          (filters.area.length === 0 || filters.area.includes(node.nodeArea)) &&
          (filters.sensorType.length === 0 || filters.sensorType.includes(node.nodeSensorType)) &&
          (filters.nodeAssignment.length === 0 ||
            (filters.nodeAssignment.includes('assigned') && node.nodeTokenNumber) ||
            (filters.nodeAssignment.includes('unassigned') && !node.nodeTokenNumber))
      ),
    [selectedData.nodes, filters]
  );

  const handleVerticalClick = (nodeID) => {
    navigate(`/nodedata?filter=${encodeURIComponent(nodeID)}`);
  };

  const handleDeleteItem = (itemId) => {
    axiosAuthInstance
      .delete(`/nodes/delete-node/${itemId}`)
      .then((response) => {
        console.log(response);
        if (response.status === 204) {
          SweetAlert.fire({
            icon: 'success',
            title: 'Vertical Deleted Successfully',
            showConfirmButton: false,
            timer: 1500
          });
          fetchNodes(selectedData.name);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
      <Grid container spacing={2}>
        {/* Filter section */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ padding: 2, height: 'fit-content', marginTop: 2 }}>
            <Typography
              variant="h5"
              style={{
                paddingBottom: '5px',
                marginBottom: '5px',
                borderBottom: '1px solid #e0e0e0'
              }}>
              <strong>Filters</strong>
            </Typography>
            {Object.entries(filterOptions).map(([filterName, options]) => (
              <CheckboxFilter
                key={filterName}
                title={filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                options={options}
                selectedOptions={filters[filterName]}
                onChange={(value, checked) => handleCheckboxChange(filterName, value, checked)}
              />
            ))}
          </Paper>
        </Grid>
        {/* Node display section */}
        <Grid item xs={12} md={9}>
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            {filteredNodes && filteredNodes.length > 0 ? (
              <Stack spacing={3} sx={{ marginTop: 2 }}>
                {filteredNodes.map((node) => (
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
                      <DeleteIcon onClick={() => handleDeleteClick(node.nodeName)} />
                    </div>
                  </StyledPaper>
                ))}
              </Stack>
            ) : (
              <StyledPaper>No nodes available</StyledPaper>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate(`/add`)}>
        <Typography variant="button">ADD</Typography>
      </Fab>
    </Box>
  );
}
