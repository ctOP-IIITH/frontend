import React, { createContext, useState, useMemo } from 'react';
import { axiosAuthInstance } from '../services/axiosConfig';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [verticals, setVerticals] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [fetchedVerticals, setFetchedVerticals] = useState(false);

  const fetchAllVerticals = () => {
    axiosAuthInstance.get('/verticals/all').then((response) => {
      const verts = [];
      response.data.forEach((element) => {
        verts.push({
          id: element.id,
          name: element.res_name,
          description: element.description,
          orid: element.orid
        });
      });
      setVerticals(verts);
      setFetchedVerticals(true);
    });
  };

  const value = useMemo(
    () => ({ verticals, setVerticals, nodes, setNodes, fetchAllVerticals, fetchedVerticals }),
    [verticals, nodes]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
