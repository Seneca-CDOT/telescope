export const initialState = {
  name: '',
  email: '',
  id: '',
  isAdmin: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER': {
      return { ...action.payload };
    }
    default:
      return state;
  }
};
