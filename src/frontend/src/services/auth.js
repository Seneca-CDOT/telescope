export const isBrowser = () => typeof window !== 'undefined';
export const getUser = () =>
  isBrowser() && window.localStorage.getItem('gatsbyUser')
    ? JSON.parse(window.localStorage.getItem('gatsbyUser'))
    : {};
const setUser = user => window.localStorage.setItem('gatsbyUser', JSON.stringify(user));
export const handleLogin = ({ username }) => {
  if (username === `john`) {
    return setUser({
      email: `johnny@example.org`,
    });
  }
  return false;
};
export const isLoggedIn = () => {
  const user = getUser();
  return !!user.email;
};
export const logout = callback => {
  setUser({});
  callback();
};
