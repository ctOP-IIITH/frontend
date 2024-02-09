import React, { createContext, useState, useMemo } from 'react';
import { axiosAuthInstance } from '../services/axiosConfig';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [verticals, setVerticals] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [fetchedVerticals, setFetchedVerticals] = useState(false);
  const [isUserfetched, setIsUserfetched] = useState(false);
  const [user, setUser] = useState(null);

  const USER_TYPES = {
    ADMIN: 1,
    VENDOR: 2,
    USER: 3
  };

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

  const fetchUser = () => {
    axiosAuthInstance
      .get('/user/profile')
      .then((response) => {
        setUser(response.data);
        setIsUserfetched(true);
      })
      .catch((error) => {
        console.error('Error fetching user data', error);
        setIsUserfetched(false);
        setUser(null);
      });
  };

  const value = useMemo(
    () => ({
      verticals,
      setVerticals,
      nodes,
      setNodes,
      fetchAllVerticals,
      fetchedVerticals,
      fetchUser,
      isUserfetched,
      user,
      setUser,
      USER_TYPES
    }),
    [verticals, nodes, user]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
