import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useLocation } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

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
      "name": "AE-AQ1",
      "nodeType": "kristnam",
      "data": [{
        "pm25": 12,
        "pm10": 13
      }]
    },
    
    {
      "name": "AE-AQ2",
      "nodeType": "shenitech",
      "data": [{
        "pm25": 56,
        "pm10": 12,
        "co2":80
      },{
        "pm25": 12,
        "pm10": 13,
        "co2":70
      },
      {
        "pm25": 56,
        "pm10": 12,
        "co2":80
      },{
        "pm25": 12,
        "pm10": 13,
        "co2":70
      },
      {
        "pm25": 56,
        "pm10": 12,
        "co2":80
      },{
        "pm25": 12,
        "pm10": 13,
        "co2":70
      }
    ]
    },
    
    {
      "name": "AE-WM1",
      "nodeType": "kristnam",
      "data": [{
        "ph": 10,
        "turbidity": 12
      },
    {
        "ph": 13,
        "turbidity": 12
      },
    {
        "ph": 14,
        "turbidity": 12
      },
    {
        "ph": 1,
        "turbidity": 12
      }]
    },
    {
      "name": "AE-WM2",
      "nodeType": "shenitech",
      "data": [{
      }]
    }
];

// const message = `Truncation should be conditionally applicable on this long line of text
//  as this is a much longer line than what the container can support. `;

function generateKey(node) {
  return Object.entries(node).map(([param, value]) => `${param}-${value}`).join('-');
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'black' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: 'black',
//   fontSize: '30px',
}));

// ... (previous imports)

// ... (previous imports)

export default function Details() {
  const [selectedData, setSelectedData] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');
    const selectedItem = data.find((item) => item.name === filter);
    setSelectedData(selectedItem);
  }, [location.search]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedItem = data.find((item) => item.name === value);
    setSelectedData(selectedItem);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3, m:3 }}>
      <div>
          <Grid item xs>
  <Typography noWrap sx={{ fontSize: '1.5rem' }}>
    {selectedData ? (
      <div>
        <strong>Device Information</strong> <br />
        <strong>Node ID:</strong> {selectedData.name} <br />
        <strong>Node Type:</strong> {selectedData.nodeType} <br />
        <strong>Parameters:</strong>
        {Object.keys(selectedData.data[0]).map((param) => (
          <span key={param}>
            {param} &nbsp;
          </span>
        ))}
      </div>
    ) : (
      'No nodes available'
    )}
  </Typography>
</Grid>

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
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedData ? (
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableBody>
                  <TableRow>
                    {Object.keys(selectedData.data[0]).map((param) => (
                      <TableCell key={param} align="right">
                        {param}
                      </TableCell>
                    ))}
                  </TableRow>
                  {(rowsPerPage > 0
                    ? selectedData.data.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : selectedData.data
                  ).map((node) => (
                    <TableRow key={generateKey(node)}>
                      {Object.values(node).map((value) => (
                        <TableCell key={`${value}`} align="right">
                          {value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={selectedData.data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        ) : (
          <StyledPaper>No nodes available</StyledPaper>
        )}
      </div>
    </Box>
  );
}
