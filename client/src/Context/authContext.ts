import React, { createContext } from "react";
import { User } from "../utils/commonInterfaces";

interface authContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    auth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    CheckAuth: () => Promise<void>;
    handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<authContextType>({
    user: null,
    setUser: () => { },
    auth: false,
    setAuth: () => { },
    loading: false,
    CheckAuth: () => Promise.resolve(),
    handleLogout: () => Promise.resolve(),
})

export const AuthContextProvider = AuthContext.Provider