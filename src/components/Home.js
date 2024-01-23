import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {  Container,Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { APP_NAME } from '../constants';

import Addnode from './Addnode';
import Addvertical from './Addvertical';
import Addsensor from './Addsensor';



const steps = ['Domains', 'Sensor Type', 'Node'];

function Home() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();
  const [isAddClicked, setIsAddClicked] = React.useState(false);

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

  const handleStep = (step: number) => () => {
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


  const handleAddClick = () => {
    
     setIsAddClicked((prevIsAddClicked) => !prevIsAddClicked);

  };



  return (
    <Box sx={{ width: '100%' }}>
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
        Welcome to { APP_NAME } 
      </Typography>
    </Container>

        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddClick}
        >
          <AddIcon />
        </Fab>

        {isAddClicked && (
        <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
        )}

        {isAddClicked && ( 
      <div>
        {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
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
                sx={{ mr: 1, bgcolor:"#50C878" }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext} sx={{ mr: 1 , bgcolor:"#50C878"}}>
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" sx={{ display: 'inline-block', bgcolor:"#50C878" }}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button onClick={handleComplete} sx={{bgcolor:"#50C878"}}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </Box>
          </>
        )}
      </div>
        )}
      </Box>
   

  );
}

export default Home;
