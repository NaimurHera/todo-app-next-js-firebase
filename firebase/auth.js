import { login, logout } from "@/reducer/actions";
import { authReducer, initialState } from "@/reducer/authReducer";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useReducer } from "react";
import { auth } from "./firebase";

export const AuthUserContext = createContext({});

export const AuthUserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const authStateChanged = async (user) => {
      if (!user) {
        dispatch(logout());
      } else {
        dispatch(login(user));
      }
    };
    // whenever user login,register or logout then authStateChanged function will be called
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);

  return <AuthUserContext.Provider value={{ state, dispatch }}>{children}</AuthUserContext.Provider>;
};
