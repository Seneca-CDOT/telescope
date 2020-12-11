import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { UserStateContext, UserDispatchContext } from '../UserContext';
import { userReducer, initialState } from '../UserReducer';

const UserProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.elementType.isRequired,
};

export default UserProvider;
