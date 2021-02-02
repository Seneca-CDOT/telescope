import { createContext, ReactNode, useContext } from 'react';

import { User } from '../interfaces';
import useAuthorization from '../hooks/use-authorization';

const UserContext = createContext<User>({ isLoggedIn: false });

type Props = {
  children: ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const user = useAuthorization();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUser = () => useContext(UserContext);
