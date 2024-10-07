'use client';

import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { RoleType, TokenPayload } from '@/interface/IAuth';
import { socket } from '@/lib/socket';
import {
  clearTokenFromLocalStorage,
  localStorageUtil,
} from '@/lib/storageUtils';
import { decodeJWT } from '@/lib/utils';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
export type IAuthContext = {
  role?: RoleType;
  isAuth: boolean;
  setRole: (value?: RoleType) => void;
};
const initialAuth: IAuthContext = {
  role: undefined,
  isAuth: false,
  setRole: (value?: RoleType) => {},
};
const AuthContext = createContext<IAuthContext>(initialAuth);
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [role, setRole] = useState<RoleType>();
  const socketRef = useRef(false);
  useEffect(() => {
    const accessToken =
      localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? '';
    const decodeRole = decodeJWT<TokenPayload>(accessToken);

    if (decodeRole) {
      if (!socketRef.current) {
        socket.connect();
        socketRef.current = true;
      }
      setRole(decodeRole.role);
    }
    return () => {
      !socketRef.current && socket.disconnect();
    };
  }, []);
  const setRoleType = useCallback((value?: RoleType) => {
    if (value) {
      setRole(value);
    } else {
      clearTokenFromLocalStorage();
      setRole(undefined);
    }
  }, []);
  const isAuth = useMemo(() => Boolean(role), [role]);
  return (
    <AuthContext.Provider value={{ isAuth, setRole: setRoleType, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
