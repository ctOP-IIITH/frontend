import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { axiosAuthInstance } from '../services/axiosConfig';
import { AuthContext } from '../contexts/AuthContext';

const USER_TYPES = {
  ADMIN: 1,
  VENDOR: 2,
  USER: 3
};

const UserProfile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    axiosAuthInstance
      .get('/user/profile')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data', error);
      });
  }, []);

  const handlePasswordChange = () => {
    // Handle password change
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ m: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h4">User Profile</Typography>
          <Typography variant="h6">Name: {user.username}</Typography>
          <Typography variant="h6">Email: {user.email}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5">Change Password</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Box display="flex" justifyContent="space-between" mt={2}>
        {user.user_type === USER_TYPES.ADMIN && (
          <Button variant="contained" color="secondary">
            Create User
          </Button>
        )}
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfile;
