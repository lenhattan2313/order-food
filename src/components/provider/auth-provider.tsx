"use client";

import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import {
  clearTokenFromLocalStorage,
  localStorageUtil,
} from "@/lib/storageUtils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
export type IAuthContext = {
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
};
const initialAuth: IAuthContext = {
  isAuth: false,
  setIsAuth: (_value: boolean) => {},
};
const AuthContext = createContext<IAuthContext>(initialAuth);
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const accessToken = localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    accessToken && setIsAuth(true);
  }, []);
  const setAuth = useCallback((auth: boolean) => {
    if (auth) {
      setIsAuth(true);
    } else {
      clearTokenFromLocalStorage();
      setIsAuth(false);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth: setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
