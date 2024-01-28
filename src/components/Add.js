import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import { APP_NAME } from '../constants';

import Addnode from './Addnode';
import Addvertical from './Addvertical';
import Addsensor from './Addsensor';

const steps = ['Domains', 'Sensor Type', 'Node'];

function Add() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  // const handleSkip = () => {
  //   // Reset state and hide the progress bar
  //   setActiveStep(0);
  //   setCompleted({});
  //   // setIsAddClicked(false);
  // };

  return (
    <Box sx={{ width: '100%', marginTop: '30px' }}>
      <Container maxWidth="sm">
        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
          Hyderabad
        </Typography>
      </Container>

      {/* // <Container maxWidth="sm"> */}
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      {/* <Container maxWidth="sm" sx={{ bgcolor: '#eceef8', borderRadius:'5%'}}> */}

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
          <>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
              {activeStep === 0 && <Addvertical />}
              {activeStep === 1 && <Addsensor />}
              {activeStep === 2 && <Addnode />}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, bgcolor: '#b4bce3' }}>
                Back
              </Button>

              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                onClick={handleComplete}
                sx={{ mr: 1, bgcolor: '#b4bce3' }}
                style={{ display: activeStep === steps.length - 1 ? 'none' : 'inline-block' }}>
                SKIP
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography
                    variant="caption"
                    sx={{ display: 'inline-block', bgcolor: '#b4bce3' }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete} sx={{ bgcolor: '#b4bce3' }}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'NEXT'}
                  </Button>
                ))}
            </Box>
          </>
        )}
      </div>
    </Box>
  );
}

export default Add;
