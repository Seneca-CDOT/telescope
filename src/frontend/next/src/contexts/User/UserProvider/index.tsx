import { useReducer, FC } from 'react';
import { UserStateContext, UserDispatchContext } from '../UserContext';
import { userReducer, initialState } from '../UserReducer';

interface UserProviderProps {
  children: React.Component;
}

const UserProvider: FC<UserProviderProps> = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export default UserProvider;
