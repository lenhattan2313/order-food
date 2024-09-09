import { DishListResType } from "@/schemaValidations/dish.schema";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export type DishItem = DishListResType["data"][0];

const DishTableContext = createContext<{
  setDishIdEdit: (value?: number) => void;
  dishIdEdit?: number;
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
}>({
  setDishIdEdit: (value?: number) => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: (value: DishItem | null) => {},
});
export const DishProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null);
  return (
    <DishTableContext.Provider
      value={{
        setDishDelete,
        dishDelete,
        setDishIdEdit,
        dishIdEdit,
      }}
    >
      {children}
    </DishTableContext.Provider>
  );
};

export const useDishContext = () => useContext(DishTableContext);
