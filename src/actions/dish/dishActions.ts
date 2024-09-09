import { PREFIX_URL } from "@/constants/url";
import http from "@/lib/httpUtils";
import {
  CreateDishBodyType,
  DishListResType,
  DishParamsType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
type IUpdateDishType = DishParamsType & UpdateDishBodyType;
export const dishActions = {
  getList: () => http.get<DishListResType>(`${PREFIX_URL.DISH}`),
  createDish: (body: CreateDishBodyType) =>
    http.post<DishResType, CreateDishBodyType>(`${PREFIX_URL.DISH}`, body),

  getDishDetail: ({ id }: DishParamsType) =>
    http.get<DishResType>(`${PREFIX_URL.DISH}/${id}`),
  updateDish: ({ id, ...body }: IUpdateDishType) =>
    http.put<DishResType, UpdateDishBodyType>(`${PREFIX_URL.DISH}/${id}`, body),
  deleteDish: ({ id }: DishParamsType) =>
    http.delete<DishResType>(`${PREFIX_URL.DISH}/${id}`),
};
