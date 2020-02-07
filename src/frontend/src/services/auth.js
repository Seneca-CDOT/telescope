export const isBrowser = () => typeof window !== 'undefined';
export const getUser = () =>
  isBrowser() && window.localStorage.getItem('telescopeUser')
    ? JSON.parse(window.localStorage.getItem('telescopeUser'))
    : {};
export const isLoggedIn = () => {
  const user = getUser();
  return !!user.email;
};

export const setUser = user => window.localStorage.setItem('telescopeUser', JSON.stringify(user));
export const loginUser = () => {
  fetch('../user/info', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`HTTP ${response.status}, ${response.statusText}`);
    })
    .then(response => {
      return setUser(response);
    })
    .catch(error => {
      // Handles an error thrown above, as well as network general errors
      console.log(error);
    });
};

export const logout = callback => {
  setUser({});
  callback();
};
