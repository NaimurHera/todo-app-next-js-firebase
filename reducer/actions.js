const { LOGGED_IN, LOGGED_OUT } = require("./authReducer");

export const login = (user) => {
  return {
    type: LOGGED_IN,
    payload: user,
  };
};

export const logout = () => {
  return {
    type: LOGGED_OUT,
  };
};
