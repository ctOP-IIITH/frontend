import { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CardHeader,
  IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
  // const [user, setUser] = useState(null);
  // const [users, setUsers] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {user, users, fetchedUser, fetchedUsers, fetchUserDetails, fetchUsers} = useContext(AuthContext)

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if(!fetchedUser) fetchUserDetails()
    if(!fetchedUsers) fetchUsers()
  })

  const handlePasswordChange = () => {
    // check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    // if one of the fields is empty
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill all the fields');
      return;
    }

    axiosAuthInstance
      .post('/user/change-password', {
        email: user.email,
        old_password: oldPassword,
        new_password: newPassword
      })
      .then((response) => {
        if (response.status === 200) {
          alert('Password changed successfully');
        }
      })
      .catch((error) => {
        console.error('Error changing password', error);
        if (error.response) alert(error.response.data.detail);
        else alert('Error changing password');
      });
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
      {user.user_type === USER_TYPES.ADMIN && (
        <Card sx={{ mb: 2 }}>
          <CardHeader
            title={
              <Typography variant="h5" component="div">
                All Users
              </Typography>
            }
          />
          <CardContent>
            <List>
              {users.map((cuser, index) => (
                <Fragment key={cuser.id}>
                  <ListItem>
                    <ListItemText
                      primary={`Name: ${cuser.username}`}
                      secondary={`Email: ${cuser.email}, Type: ${cuser.user_type}`}
                    />
                  </ListItem>
                  {index < users.length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          </CardContent>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" aria-label="info about upcoming feature">
              <InfoOutlinedIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Option coming soon to allow modifying user details
            </Typography>
          </CardContent>
        </Card>
      )}
      <Box display="flex" justifyContent="space-between" mt={2}>
        {user.user_type === USER_TYPES.ADMIN && (
          <Button variant="contained" color="secondary" onClick={() => navigate('/create-user')}>
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
