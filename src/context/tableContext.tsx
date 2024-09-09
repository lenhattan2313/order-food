import { TableListResType } from "@/schemaValidations/table.schema";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export type TableItem = TableListResType["data"][0];

const TableContext = createContext<{
  setTableIdEdit: (value?: number) => void;
  tableIdEdit?: number;
  tableDelete: TableItem | null;
  setTableDelete: (value: TableItem | null) => void;
}>({
  setTableIdEdit: (value?: number) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {},
});
export const TableProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
  return (
    <TableContext.Provider
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => useContext(TableContext);
