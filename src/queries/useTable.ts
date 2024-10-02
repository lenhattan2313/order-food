import { tableActions } from "@/apiRequest/table/tableActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () =>
  useQuery({
    queryKey: [QUERY_KEYS.TABLES],
    queryFn: tableActions.getList,
  });

export const useGetTableDetail = ({ number }: { number?: number }) =>
  useQuery({
    queryKey: [QUERY_KEYS.TABLES, number],
    queryFn: () => tableActions.getTableDetail({ number: number! }),
    enabled: Boolean(number),
  });
export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableActions.createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TABLES],
      });
    },
  });
};
export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableActions.updateTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TABLES],
        exact: true,
      });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableActions.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TABLES],
        exact: true,
      });
    },
  });
};
