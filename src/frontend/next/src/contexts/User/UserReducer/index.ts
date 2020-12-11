interface State {
  name?: string;
  email?: string;
  id?: string;
  isAdmin: boolean;
}

interface Action {
  type?: string;
  payload?: any;
}

export const initialState: State = {
  name: '',
  email: '',
  id: '',
  isAdmin: false,
};

export const userReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case 'LOGIN_USER': {
      return { ...action.payload };
    }
    default:
      return state;
  }
};
