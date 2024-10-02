import { PREFIX_URL } from "@/constants/url";
import http from "@/lib/httpUtils";

import {
  CreateTableBodyType,
  TableListResType,
  TableParamsType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
type IUpdateTableType = TableParamsType & UpdateTableBodyType;
export const tableActions = {
  getList: () => http.get<TableListResType>(`${PREFIX_URL.TABLE}`),
  createTable: (body: CreateTableBodyType) =>
    http.post<TableResType, CreateTableBodyType>(`${PREFIX_URL.TABLE}`, body),

  getTableDetail: ({ number }: TableParamsType) =>
    http.get<TableResType>(`${PREFIX_URL.TABLE}/${number}`),
  updateTable: ({ number, ...body }: IUpdateTableType) =>
    http.put<TableResType, UpdateTableBodyType>(
      `${PREFIX_URL.TABLE}/${number}`,
      body
    ),
  deleteTable: ({ number }: TableParamsType) =>
    http.delete<TableResType>(`${PREFIX_URL.TABLE}/${number}`),
};
