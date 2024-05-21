import { useContext, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { DataContext } from '../contexts/DataContext';
import AddAdvanced from './AddAdvanced';
import BulkForm from './BulkForm';

const steps = ['Form', 'JSON'];

function BulkImport() {
  const { fetchAllVerticals, fetchedVerticals } = useContext(DataContext);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(() => {
    if (!fetchedVerticals) fetchAllVerticals();
  }, []);

  return (
    <Box sx={{ width: '100%', marginTop: '30px' }}>

      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={completed[index]}
            sx={{
              '& .MuiStepLabel-root .Mui-active': {
                color: 'orange',
              },
              '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                color: 'white',
              },
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'green',
              },
            }}
          >
            <StepButton onClick={handleStep(index)}>{label}</StepButton>
          </Step>
        ))}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button sx={{ bgcolor: '#b4bce3' }} onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </>
        ) : (
            <Grid container spacing={2} sx={{ mt: 2, mb: 1, py: 1 }}>
              {activeStep === 0 && (
                <Grid item xs={12}>
                    <BulkForm />
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid item xs={12}>
                  <AddAdvanced />
                </Grid>
              )}
            </Grid>
        )}
      </div>
    </Box>
  );
}

export default BulkImport;