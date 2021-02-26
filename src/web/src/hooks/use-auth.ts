import { useContext } from 'react';
import { AuthContext, AuthContextInterface } from '../components/AuthProvider';

const useAuth = (): AuthContextInterface => useContext(AuthContext);

export default useAuth;
