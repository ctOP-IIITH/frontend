import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import { lighten, darken } from '@mui/system';

import './barchart.css';

function AreaTable({ selectedSegment }) {
  console.log('selectedSegment:', selectedSegment);

  const verticals = [
    'Air Quality',
    'Water Quality',
    'Water Quantity',
    'Waste Management',
    'Energy Monitoring'
  ];

  const labels = [
    'Gachibowli',
    'Madhapur',
    'Miyapur',
    'KPHB',
    'JNTU',
    'Jubilee Hills',
    'Abids',
    'Koti',
    'Nagaram',
    'Gandipet'
  ];
  const backgroundColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF'
  ];
  const numNodes = [15, 59, 80, 81, 56, 55, 40];
  const color = backgroundColors[selectedSegment];

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: lighten(color, 0.3) // lighter shade of the selected color
    },
    '&:nth-of-type(even)': {
      backgroundColor: darken(color, 0.3) // darker shade of the selected color,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    },
    backgroundColor: theme.palette.grey[500]
  }));

  const segmentData = labels.map((label, index) => ({
    label,
    data: numNodes[index]
  }));

  // const data = segmentData[selectedSegment];
  console.log(segmentData);
  console.log('selectedSegment:', selectedSegment);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
      <h5>Number of {verticals[selectedSegment]} Nodes by Area</h5>
      <TableContainer component={Paper} sx={{ backgroundColor: 'inherit', overflow: 'auto' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ position: 'sticky', top: 0, zIndex: 10, background: '#d4d6df' }}>
              <TableCell style={{ border: '1px solid #ddd' }}>
                <strong>Label</strong>
              </TableCell>
              <TableCell style={{ border: '1px solid #ddd' }} align="right">
                <strong>Number of Nodes</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {segmentData.map((row) => (
              <StyledTableRow key={row.label}>
                <TableCell style={{ border: '1px solid #ddd' }} component="th" scope="row">
                  {row.label}
                </TableCell>
                <TableCell style={{ border: '1px solid #ddd' }} align="right">
                  {row.data || 0}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default AreaTable;
