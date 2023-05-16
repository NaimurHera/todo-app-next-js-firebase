import { AuthUserContext } from "@/firebase/auth";
import { useContext } from "react";

export const useAuth = () => useContext(AuthUserContext);
