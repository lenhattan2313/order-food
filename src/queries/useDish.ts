import { dishActions } from "@/actions/dish/dishActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDishList = () =>
  useQuery({
    queryKey: [QUERY_KEYS.DISHES],
    queryFn: dishActions.getList,
  });

export const useGetDishDetail = ({ id }: { id?: number }) =>
  useQuery({
    queryKey: [QUERY_KEYS.DISHES, id],
    queryFn: () => dishActions.getDishDetail({ id: id! }),
    enabled: Boolean(id),
  });
export const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishActions.createDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DISHES],
      });
    },
  });
};
export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishActions.updateDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DISHES],
        exact: true,
      });
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishActions.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DISHES],
        exact: true,
      });
    },
  });
};
