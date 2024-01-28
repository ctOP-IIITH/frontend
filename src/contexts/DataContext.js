import React, { createContext, useState, useMemo } from 'react';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [verticals, setVerticals] = useState([]);
  const [nodes, setNodes] = useState([]);

  const value = useMemo(() => ({ verticals, setVerticals, nodes, setNodes }), [verticals, nodes]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
