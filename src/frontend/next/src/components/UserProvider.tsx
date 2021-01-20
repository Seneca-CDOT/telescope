import { createContext, ReactNode, useContext } from 'react';

import useAuthorization from '../hooks/use-authorization';
import { User } from '../interfaces';

const unauthenticatedUser: User = { isLoggedIn: false };
const UserContext = createContext(unauthenticatedUser);

type Props = {
  children: ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const user = useAuthorization(unauthenticatedUser);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUser = () => useContext(UserContext);
