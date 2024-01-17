import React, { useState } from 'react';
import { Button, Collapse, Typography, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

const SubscriptionsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '16px',
});

const NodeButton = styled(Button)({
  marginBottom: '8px',
});

const NodeContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '8px',
});

function Getsub() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [urls, setUrls] = useState({
    Node1: ['https://url1-1.com', 'https://url1-2.com'],
    Node2: ['https://url2-1.com', 'https://url2-2.com'],
    Node3: ['https://url3-1.com', 'https://url3-2.com'],
    Node4: ['https://url4-1.com', 'https://url4-2.com'],
  });

  const handleNodeChange = (event) => {
    setSelectedNode(event.target.value);
  };

  const handleCloseNodeContent = () => {
    setSelectedNode(null);
  };

  return (
    <SubscriptionsContainer>
      <Select value={selectedNode} onChange={handleNodeChange} style={{ marginBottom: '16px' }}>
        {[1, 2, 3, 4].map((node) => (
          <MenuItem key={`Node${node}`} value={`Node${node}`}>
            Node {node}
          </MenuItem>
        ))}
      </Select>
      <Collapse in={selectedNode !== null}>
        <NodeContent>
          {selectedNode !== null ? (
            <>
              <Typography variant="h6">{selectedNode}</Typography>
              {urls[selectedNode]?.map((url, index) => (
                <Typography key={`url${index}`} style={{ marginTop: '8px' }}>
                  URL {index + 1}: {url}
                </Typography>
              ))}
              <Button variant="outlined" onClick={handleCloseNodeContent} style={{ marginTop: '16px' }}>
                Close
              </Button>
            </>
          ) : (
            <Typography variant="body1">Select a node to view URLs</Typography>
          )}
        </NodeContent>
      </Collapse>
    </SubscriptionsContainer>
  );
}

export default Getsub;
