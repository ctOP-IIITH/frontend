/* eslint-disable */
import React, { useState } from 'react';
import Output from './allnodes.json';
import './Allnodes.css';

export default function AllNodes() {
  const [selectedVertical, setSelectedVertical] = useState('');

  const handleSelectChange = (event) => {
    setSelectedVertical(event.target.value);
  };

  const filteredOutput = selectedVertical
    ? Output.filter((outputGroup) => outputGroup.Vertical === selectedVertical)
    : Output;

  return (
    <div className="App">
      <header>
        <h1>All Nodes</h1>
      </header>
      <div className="select-container">
        <label htmlFor="verticalSelect">Select Vertical : </label>
        <select id="verticalSelect" onChange={handleSelectChange} value={selectedVertical}>
          <option value="">All</option>
          {Output &&
            Output.map((outputGroup) => (
              <option key={outputGroup.Vertical} value={outputGroup.Vertical}>
                {outputGroup.Vertical}
              </option>
            ))}
        </select>
      </div>
      {filteredOutput.length === 0 ? (
        <p>No data found.</p>
      ) : (
        filteredOutput.map((outputGroup) => (
          <div className="output-box" key={outputGroup.Vertical}>
            <div className="label-heading">{outputGroup.Vertical}</div>
            <div className="label-heading">{outputGroup.description}</div>
            <div className="node-box">
              {outputGroup.Nodes &&
                outputGroup.Nodes.map((node) => (
                  <div className="node" key={node.nodeName}>
                    <div className="nodeName">{node.nodeName}</div>
                    <div className="node-data">
                      {node.data &&
                        Object.entries(node.data).map(([key, value]) => (
                          <div key={key}>
                            {key}: {value}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
