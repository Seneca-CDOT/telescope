import React from 'react';
import UserProvider from './src/contexts/User/UserProvider';

// Named export required for useContext
/* eslint-disable import/prefer-default-export */
export const wrapRootElement = ({ element }) => {
  return <UserProvider>{element}</UserProvider>;
};
