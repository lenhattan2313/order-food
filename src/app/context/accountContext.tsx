"use client";
import { AccountListResType } from "@/schemaValidations/account.schema";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export type AccountItem = AccountListResType["data"][0];

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (_value?: number) => void;
  employeeIdEdit?: number;
  employeeDelete: AccountItem | null;
  setEmployeeDelete: (value: AccountItem | null) => void;
}>({
  setEmployeeIdEdit: (value?: number) => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (value: AccountItem | null) => {},
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(
    null
  );
  return (
    <AccountTableContext.Provider
      value={{
        employeeIdEdit,
        setEmployeeIdEdit,
        employeeDelete,
        setEmployeeDelete,
      }}
    >
      {children}
    </AccountTableContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountTableContext);
