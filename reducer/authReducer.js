// initialstate
export const initialState = {
  authUser: null,
  isLoading: true,
};

// action types
export const LOGGED_IN = "logged_in";
export const LOGGED_OUT = "logged_out";

//auth reducer function
export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {
        ...state,
        authUser: action.payload,
        isLoading: false,
      };
    case LOGGED_OUT:
      return {
        ...state,
        authUser: null,
        isLoading: false,
      };

    default:
      return state;
  }
};
