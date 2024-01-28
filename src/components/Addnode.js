import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

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

// ... (previous imports)

export default function MultipleSelect() {
  const [selectedData, setSelectedData] = React.useState(null);
  const [selectedDataError, setSelectedDataError] = React.useState(false);
  const [parameters, setParameters] = React.useState([]);
  // const [nodeType, setNodeType] = React.useState('');
  const [latitude, setlatitude] = React.useState('');
  const [longitude, setlongitude] = React.useState('');
  const [latitudeError, setlatitudeError] = React.useState('');
  const [longitudeError, setlongitudeError] = React.useState('');
  // const [sensorName, setSensorName] = React.useState('');
  // const [nodeTypeError, setNodeTypeError] = React.useState(false);
  // const [sensorNameError, setSensorNameError] = React.useState(false);
  const [selectedNodeType, setSelectedNodeType] = React.useState('');

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    const selectedItem = data.find((item) => item.id === value);
    setSelectedData(selectedItem);
    setSelectedDataError(false);

    const selectedNodeId = event.target.value;
    const selectedNode = data.find((item) => item.id === selectedNodeId);

    if (selectedNode && selectedNode.nodes && selectedNode.nodes.length > 0) {
      setParameters([]); // Clear parameters when the vertical changes
      setSelectedNodeType(selectedNode.nodes[0].nodeType);
    } else {
      setSelectedNodeType('');
    }
  };

  // const handleParameterChange = (index, key, value) => {
  //   setParameters([...parameters, { name: '', dataType: '' }]);
  //   const newParameters = [...parameters];
  //   newParameters[index][key] = value;
  //   setParameters(newParameters);
  // };

  const handleAddNodeType = () => {
    //  if (!nodeType) {
    //   setNodeTypeError(true);
    // }
    // else{
    //   setNodeTypeError(false);
    // }

    if (!selectedData) {
      setSelectedDataError(true);
    } else {
      setSelectedDataError(false);
    }

    if (!latitude) {
      setlatitudeError(true);
    } else {
      setlatitudeError(false);
    }

    if (!longitude) {
      setlongitudeError(true);
    } else {
      setlongitudeError(false);
    }

    if (!selectedData || !latitude || !longitude) {
      return;
    }

    // Log selected vertical, node type, and added parameters to the console
    console.log('Selected Domain:', selectedData);
    console.log('Node Type:', document.getElementById('text-field').value);
    console.log('Added Parameters:', parameters);
    console.log('latitude:', latitude);
    console.log('longitude:', longitude);

    MySwal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Node added successfully.',
      showConfirmButton: false,
      timer: 1500 // Auto close after 1.5 seconds
    });
  };

  // const handleRemoveParameter = (index) => {
  //   const newParameters = [...parameters];
  //   newParameters.splice(index, 1);
  //   setParameters(newParameters);
  // };

  // const handleAddParameter = () => {
  //   setParameters([...parameters, { name: '', dataType: '' }]);
  // };

  return (
    <Box sx={{ p: 3 }}>
      <div>
        <Typography noWrap sx={{ fontSize: '1.5rem' }}>
          <div>
            <strong>Add New Node</strong> <br />
          </div>
        </Typography>

        <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}>
          <InputLabel
            id="demo-multiple-name-label"
            sx={{ marginRight: 1, marginBottom: 1 }} // Added marginBottom to Add space
          >
            Select Domain
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple={false}
            value={selectedData ? selectedData.id : ''}
            onChange={handleChange}
            MenuProps={MenuProps}
            sx={{ flex: 1 }}
            label="Select Domain" // Added label prop to ensure space for label
            error={selectedDataError} // Add error prop based on selectedDataError
          >
            {data.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>

          {selectedDataError && (
            <Typography variant="caption" color="error">
              Domain type is required
            </Typography>
          )}
        </FormControl>

        <FormControl sx={{ m: 1, display: 'flex', width: '100%' }}>
          <InputLabel
            id="demo-multiple-name-label"
            sx={{ marginRight: 1, marginBottom: 1 }} // Added marginBottom to Add space
          >
            Select Sensor Type
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple={false}
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
            MenuProps={MenuProps}
            sx={{ flex: 1 }}
            label="Select Sensor Type"
            error={selectedDataError}
          >
            <MenuItem value="None">None</MenuItem>
            {selectedData &&
              selectedData.nodes &&
              selectedData.nodes.length > 0 &&
              selectedData.nodes.map((node) => (
                <MenuItem key={node.nodeType} value={node.nodeType}>
                  {node.nodeType}
                </MenuItem>
              ))}
          </Select>

          {selectedDataError && (
            <Typography variant="caption" color="error">
              Sensor type is required
            </Typography>
          )}
          <Typography variant="caption" color="true">
            Select Domain to enable menu options
          </Typography>
        </FormControl>

        <TextField
          id="text-field"
          label="Latitude"
          variant="outlined"
          fullWidth
          sx={{ m: 1 }}
          value={latitude}
          onChange={(e) => {
            setlatitude(e.target.value);
            setlatitudeError(false); // Reset error on change
          }}
          error={latitudeError}
          helperText={latitudeError ? 'Latitude is required' : ''}
        />

        <TextField
          id="text-field"
          label="Longitude"
          variant="outlined"
          fullWidth
          sx={{ m: 1 }}
          value={longitude}
          onChange={(e) => {
            setlongitude(e.target.value);
            setlongitudeError(false); // Reset error on change
          }}
          error={longitudeError}
          helperText={longitudeError ? 'Longitude is required' : ''}
        />
      </div>

      {/* Parameter input fields */}
      {/* {parameters.map((param, index) => (
        <Box key={param.name} sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%', m: 1 }}>
          <TextField
            label="Parameter Name"
            variant="outlined"
            value={param.name}
            onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
            sx={{ mr: 1, flex: 1 }}
          />
          <FormControl variant="outlined" sx={{ mr: 1, flex: 1, m: 1 }}>
            <InputLabel>Data Type</InputLabel>
            <Select
              value={param.dataType}
              onChange={(e) => handleParameterChange(index, 'dataType', e.target.value)}
              label="Data Type"
              sx={{ width: '100%' }}
            >
              <MenuItem value="Number">Number</MenuItem>
              <MenuItem value="String">String</MenuItem>
              <MenuItem value="Boolean">Boolean</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => handleRemoveParameter(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))} */}

      {/* <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddParameter} sx={{ mt: 2, m: 1 }}>
        Add Parameter
      </Button> */}

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleAddNodeType}
        sx={{ mt: 2, m: 1 }}
      >
        Add Node
      </Button>
    </Box>
  );
}
