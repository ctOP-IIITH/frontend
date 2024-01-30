import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axiosAuthInstance } from '../services/axiosConfig';

const validationSchema = yup.object({
  username: yup.string('Enter your username').required('Username is required'),
  password: yup.string('Enter your password').required('Password is required'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  user_type: yup
    .number('Enter your user type')
    .oneOf([1, 2, 3], 'User type must be either 1 (Admin), 2 (Vendor), or 3 (User)')
    .required('User type is required')
});

export default function CreateUser() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      user_type: ''
    },
    validationSchema,
    onSubmit: (values) => {
      axiosAuthInstance
        .post('/user/create-user', values)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Successful', 'User created successfully', 'success');
            navigate('/profile');
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            Swal.fire('Error', 'Not authorized to create user', 'error');
            navigate('/profile');
          } else {
            Swal.fire('Error', 'Failed to create user', 'error');
          }
        });
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Typography component="h1" variant="h5">
          Create User
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            id="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <FormControl fullWidth>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="user_type"
              name="user_type"
              value={formik.values.user_type}
              onChange={formik.handleChange}
              error={formik.touched.user_type && Boolean(formik.errors.user_type)}>
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Vendor</MenuItem>
              <MenuItem value={3}>User</MenuItem>
            </Select>
            {formik.touched.user_type && formik.errors.user_type && (
              <FormHelperText error>{formik.errors.user_type}</FormHelperText>
            )}
          </FormControl>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Create User
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
