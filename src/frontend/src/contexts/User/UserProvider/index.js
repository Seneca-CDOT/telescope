import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { UserStateContext, UserDispatchContext } from '../UserContext';
import { userReducer, initialState } from '../UserReducer';

const UserProvider = (props) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{props.children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.object,
};

export default UserProvider;
