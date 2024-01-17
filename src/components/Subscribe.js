import React, { useState } from 'react';
import { Button, TextField, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { blue } from '@mui/material/colors';

const CenteredContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh', // Set minimum height to 100% of the viewport height
});

const NodeContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  '&.subscribed': {
    backgroundColor: '#e6ffe6', // Light green for subscribed nodes
  },
});

const SubscribeButton = styled(Button)({
  backgroundColor: '#2196f3', // Blue color for the button
  color: '#fff', // White text color
});

const Node = ({ nodeName, onNodeClick, isSubscribed }) => {
  const handleSubscribe = () => {
    onNodeClick(nodeName);
  };

  return (
    <NodeContainer className={isSubscribed ? 'subscribed' : ''}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onNodeClick(nodeName)}
        onKeyDown={(e) => e.key === 'Enter' && onNodeClick(nodeName)}
      >
        {nodeName}
      </div>
      <SubscribeButton variant="outlined" onClick={handleSubscribe}>
        Subscribe
      </SubscribeButton>
    </NodeContainer>
  );
};

const NodeList = () => {
  const [showNodes, setShowNodes] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribedNode, setSubscribedNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const nodes = ['Node 1', 'Node 2', 'Node 3', 'Node 4'];

  const handleToggleNodes = () => {
    if (emailInput.trim() !== '') {
      setShowNodes(!showNodes);
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter a valid URL');
    }
  };

  const handleNodeClick = (nodeName) => {
    if (!subscribedNode) {
      setSubscribedNode(nodeName);
      console.log(`Subscribed to node: ${nodeName}`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  return (
    <CenteredContainer>
      <Paper style={{ padding: '16px', maxWidth: '400px'}}>
        <TextField
          fullWidth
          type="text"
          placeholder="Enter URL"
          value={emailInput}
          onChange={handleEmailInputChange}
          style={{ marginBottom: '16px' }}
        />
        <Button variant="contained" onClick={handleToggleNodes}>
          {showNodes ? 'Hide Nodes' : 'Show Nodes'}
        </Button>
        {errorMessage && <Typography style={{ color: 'red' }}>{errorMessage}</Typography>}
        {showNodes && (
          <div>
            <Typography variant="h6" style={{ marginTop: '16px' }}>
              Nodes Present
            </Typography>
            {nodes.map((nodeName) => (
              <Node
                key={nodeName}
                nodeName={nodeName}
                onNodeClick={handleNodeClick}
                isSubscribed={nodeName === subscribedNode}
              />
            ))}
          </div>
        )}
        {subscribedNode && (
          <Typography style={{ marginTop: '16px' }}>Subscribed to: {subscribedNode}</Typography>
        )}
      </Paper>
    </CenteredContainer>
  );
};

export default NodeList;
