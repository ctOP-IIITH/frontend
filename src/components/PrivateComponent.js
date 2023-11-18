import { Box, Button } from '@mui/material';
import { axiosAuthInstance } from '../services/axiosConfig';

function PrivateComponent() {
  return (
    <Box>
      <h1>PrivateComponent</h1>
      <div
        style={{
          display: 'flex',
          // flexDirection: 'column',
          gap: '10px'
        }}>
        <Button
          onClick={async () => {
            const res = await axiosAuthInstance.get('/user/am-i-admin');
            alert(res.data);
          }}
          variant="contained"
          color="primary">
          AM I ADMIN
        </Button>
        {/* get all users */}
        <Button
          onClick={async () => {
            const res = await axiosAuthInstance.get('/user/getusers');
            alert(JSON.stringify(res.data));
          }}
          variant="contained"
          color="primary">
          GET ALL USERS
        </Button>
      </div>
    </Box>
  );
}
export default PrivateComponent;
