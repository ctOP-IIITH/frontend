import { useContext, useEffect } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { DataContext } from '../contexts/DataContext';
import AddAdvanced from './AddAdvanced';
import BulkForm from './BulkForm';


function BulkImport() {
  const { fetchAllVerticals, fetchedVerticals } = useContext(DataContext);


  useEffect(() => {
    if (!fetchedVerticals) fetchAllVerticals();
  }, []);

  return (
    <Box sx={{ width: '100%', marginTop: '30px' }}>

      <div>
        <Grid container spacing={2} sx={{ mt: 2, mb: 1, py: 1 }}>
          <Grid item xs={12}>
            <AddAdvanced />
          </Grid>
          <Grid item xs={12}>
            <BulkForm />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

export default BulkImport;