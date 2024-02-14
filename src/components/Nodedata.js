import { useContext, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Link,
  TextField,
  Button
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { axiosAuthInstance } from '../services/axiosConfig';
import { BACKEND_API_URL } from '../constants';
import CodeComponent from './CodeComponent';
import { DataContext } from '../contexts/DataContext';

export default function Details() {
  const [selectedData, setSelectedData] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [vendorAssigned, setVendorAssigned] = useState(false);
  const [showCodeComponent, setShowCodeComponent] = useState(false);

  const { user, fetchUser, isUserfetched, USER_TYPES } = useContext(DataContext);

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedData = selectedData
    ? [...selectedData.cins].sort((a, b) => {
        const dateA = new Date(
          a[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6Z')
        );
        const dateB = new Date(
          b[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6Z')
        );
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      })
    : [];

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter = params.get('filter');

    if (!isUserfetched) fetchUser();

    axiosAuthInstance
      .get(`/nodes/get-node/${filter}`)
      .then((response) => {
        const selectedItem = response.data.detail;
        if (!selectedItem) {
          Swal.fire({
            icon: 'error',
            title: 'No node with the specified name exists!',
            text: 'Redirecting to homepage',
            timer: 2000
          }).then(() => {
            setTimeout(() => {
              navigate('/');
            }, 2000);
          });
        }
        setSelectedData(selectedItem);
        console.log(selectedItem);
        axiosAuthInstance
          .get(`/nodes/get-vendor/${selectedItem.node_name}`)
          .then((res) => {
            setVendorAssigned(res.data);
            console.log(res.data);
          })
          .catch((error) => {
            console.error('Error fetching vendor', error);
            setVendorAssigned(false);
          });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error?.response?.data?.detail,
          text: 'Redirecting to homepage',
          timer: 2000
        }).then(() => {
          setTimeout(() => {
            navigate('/');
          }, 2000);
        });
      });
  }, [location.search]);

  useEffect(() => {
    if (isUserfetched && vendorAssigned) {
      setLoading(false);
      if (user.user_type === USER_TYPES.ADMIN) {
        setShowCodeComponent(true);
      }
      if (user.user_type === USER_TYPES.VENDOR) {
        if (vendorAssigned) {
          setShowCodeComponent(user.email === vendorAssigned.email);
        }
      }
      if (user.user_type === USER_TYPES.USER) {
        setShowCodeComponent(false);
      }
    }
  }, [isUserfetched, vendorAssigned]);

  const adminVendorAssignment = (
    <Grid item xs={12}>
      <Typography variant="h5" gutterBottom>
        {vendorAssigned ? 'Assigned Vendor' : 'Assign Vendor'}
      </Typography>
      {vendorAssigned ? (
        <Box>
          <Typography variant="body2" color="text.secondary">
            <strong>Username: </strong> {vendorAssigned.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Email: </strong> {vendorAssigned.email}
          </Typography>
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            const vendorEmail = document.getElementById('vendorEmail').value;
            axiosAuthInstance
              .post(`/nodes/assign-vendor`, {
                vendor_email: vendorEmail,
                node_id: selectedData.node_name
              })
              .then((res) => {
                console.log(res);
                Swal.fire({
                  icon: 'success',
                  title: 'Vendor assigned successfully!',
                  timer: 2000
                }).then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                });
              })
              .catch((error) => {
                console.error('Error assigning vendor', error);
                Swal.fire({
                  icon: 'error',
                  title: error.response.data.detail || 'Error assigning vendor',
                  timer: 2000
                });
              });
          }}
          noValidate
          sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="vendorEmail"
            label="Vendor Email"
            name="vendorEmail"
            autoComplete="email"
            autoFocus
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Assign Vendor
          </Button>
        </Box>
      )}
    </Grid>
  );

  const vendorVendorAssignment = (
    <Grid item xs={12}>
      <Typography variant="h5" gutterBottom>
        Assigned Vendor
      </Typography>
      {vendorAssigned ? (
        <Typography variant="body2" color="text.secondary">
          <strong>Username: </strong> {vendorAssigned.username} <br />
          <strong>Email: </strong> {vendorAssigned.email}
        </Typography>
      ) : (
        <Typography gutterBottom>Not Assigned</Typography>
      )}
    </Grid>
  );
  return loading ? (
    <Box sx={{ p: 3, m: 3 }}>
      <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
        Loading...
      </Typography>
    </Box>
  ) : (
    <Box sx={{ p: 3, m: 3 }}>
      {selectedData ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="h5" gutterBottom>
                      Device Information
                    </Typography>
                    <Typography variant="body1">
                      <strong>Node ID:</strong> {selectedData.node_name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Node Type:</strong> {selectedData.res_name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Parameters:</strong>
                      {selectedData.parameters.map((param) => (
                        <Chip key={param} label={param} sx={{ m: 1 }} />
                      ))}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    {user.user_type === USER_TYPES.ADMIN && adminVendorAssignment}
                    {user.user_type === USER_TYPES.VENDOR && vendorVendorAssignment}
                    {user.user_type === USER_TYPES.USER && (
                      <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                          Vendor Assignment
                        </Typography>
                        <Typography variant="body1">
                          <strong>Vendor: </strong>
                          {vendorAssigned ? vendorAssigned.username : 'Not Assigned'}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                  Subscriptions:
                </Typography>
                <Typography variant="body1">To DO subscription url</Typography>
              </CardContent>
            </Card>
          </Grid>

          {showCodeComponent && (
            <CodeComponent
              token={selectedData.token_num}
              nodeParams={selectedData.parameters}
              dataTypes={selectedData.data_types}
            />
          )}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="custom pagination table">
                <TableBody>
                  <TableRow>
                    {selectedData.parameters.map((param) => (
                      <TableCell key={param}>{param}</TableCell>
                    ))}
                    <TableCell onClick={handleSort} style={{ cursor: 'pointer' }}>
                      Timestamp
                      <IconButton size="small">
                        {sortOrder === 'asc' ? (
                          <ArrowUpwardIcon fontSize="inherit" />
                        ) : (
                          <ArrowDownwardIcon fontSize="inherit" />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {sortedData.map((cin) => (
                    <TableRow key={cin[1]}>
                      {cin[0].map((value) => (
                        <TableCell key={value}>{value}</TableCell>
                      ))}
                      <TableCell>
                        {new Date(
                          cin[1].replace(
                            /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
                            '$1-$2-$3T$4:$5:$6Z'
                          )
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Fetch Latest Data
                </Typography>
                <Typography variant="body1">
                  <strong>URL: </strong>
                  <Link
                    href={`${BACKEND_API_URL}/nodes/get-node/${selectedData.node_name}/latest`}
                    target="_blank"
                    rel="noopener"
                    sx={{ color: 'blue' }}>
                    {`${BACKEND_API_URL}/nodes/get-node/${selectedData.node_name}/latest`}
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
          Loading...
        </Typography>
      )}
    </Box>
  );
}
