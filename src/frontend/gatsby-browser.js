import React from 'react';
import UserProvider from './src/contexts/User/UserProvider';
import InViewProvider from './src/contexts/InView/InViewProvider';

// Named export required for useContext
/* eslint-disable import/prefer-default-export */
export const wrapRootElement = ({ element }) => {
  return (
    <InViewProvider>
      <UserProvider>{element}</UserProvider>;
    </InViewProvider>
  );
};
