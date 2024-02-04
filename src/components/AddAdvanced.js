import React, { useState } from 'react';
import Ajv from 'ajv';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Stepper,
  Step,
  StepButton,
  Typography,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

const steps = ['Import Verticals', 'Import Nodes'];

function AddAdvanced() {
  const ajv = new Ajv();

  const [activeStep, setActiveStep] = useState(0);
  const [verticalsJson, setVerticalsJson] = useState(
    JSON.stringify(
      {
        name: 'Weather Monitoring',
        sensor_types: [
          {
            name: 'Kristnam',
            parameters: {
              'Flow Volume': 'int',
              'Flow Rate': 'float',
              pH: 'int'
            }
          },
          {
            name: 'Ganga',
            parameters: {
              pH: 'float'
            }
          },
          {
            name: 'Phillips',
            parameters: {
              value: 'float',
              label: 'string'
            }
          }
        ]
      },
      null,
      2
    )
  );
  const [nodesJson, setNodesJson] = useState(
    JSON.stringify(
      {
        sensors: [
          {
            coordinates: {
              latitude: 17.446919,
              longitude: 78.348122
            },
            sensor_type: 'Kristnam',
            area: 'Gachibowli'
          },
          {
            coordinates: {
              latitude: 5.4455,
              longitude: 8.3499
            },
            sensor_type: 'Phillips',
            area: 'Gachibowli'
          },

          {
            coordinates: {
              latitude: 4.455,
              longitude: 8.3499
            },
            sensor_type: 'Kristnam',
            area: 'Madhapur'
          }
        ]
      },
      null,
      2
    )
  );

  const navigate = useNavigate();

  const verticalsSchema = {
    title: 'Verticals',
    type: 'object',
    required: ['name', 'sensor_types'],
    properties: {
      name: {
        type: 'string',
        title: 'Name'
      },
      sensor_types: {
        type: 'array',
        title: 'Sensor Types',
        items: {
          type: 'object',
          required: ['name', 'parameters'],
          properties: {
            name: {
              type: 'string',
              title: 'Sensor Name'
            },
            parameters: {
              type: 'object',
              title: 'Parameters',
              additionalProperties: {
                type: 'string',
                enum: ['int', 'float', 'string']
              }
            }
          }
        }
      }
    }
  };

  const nodesSchema = {
    title: 'Nodes',
    type: 'object',
    required: ['sensors'],
    properties: {
      sensors: {
        type: 'array',
        title: 'Sensors',
        items: {
          type: 'object',
          required: ['coordinates', 'sensor_type', 'area'],
          properties: {
            coordinates: {
              type: 'object',
              title: 'Coordinates',
              required: ['latitude', 'longitude'],
              properties: {
                latitude: {
                  type: 'number',
                  title: 'Latitude'
                },
                longitude: {
                  type: 'number',
                  title: 'Longitude'
                }
              }
            },
            sensor_type: {
              type: 'string',
              title: 'Sensor Type'
            },
            area: {
              type: 'string',
              title: 'Area'
            }
          }
        }
      }
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleVerticalsChange = (data) => {
    setVerticalsJson(data);
  };

  const handleNodesChange = (data) => {
    setNodesJson(data);
  };

  const handleImport = () => {
    // Implement your import logic here
    console.log('Importing...');
    let data;
    let schema;
    if (activeStep === 0) {
      data = JSON.parse(verticalsJson);
      schema = verticalsSchema;
    } else {
      data = JSON.parse(nodesJson);
      schema = nodesSchema;
    }

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      console.error('Invalid data:', validate.errors);
    } else {
      console.log('Valid data');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={handleStep(index)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {activeStep === 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Import Verticals</Typography>
            <AceEditor
              mode="json"
              theme="monokai"
              value={verticalsJson}
              onChange={handleVerticalsChange}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography>Import Nodes</Typography>
            <AceEditor
              mode="json"
              theme="monokai"
              value={nodesJson}
              onChange={handleNodesChange}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={handleImport}>Import</Button>
        </Grid>
        <Grid item>
          {activeStep !== steps.length - 1 && <Button onClick={handleNext}>Next</Button>}
          {activeStep === steps.length - 1 && <Button onClick={() => navigate('/')}>Finish</Button>}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddAdvanced;
