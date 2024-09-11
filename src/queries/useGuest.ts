import { guestActions } from "@/actions/guest/guestActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGuestLogin = () =>
  useMutation({ mutationFn: guestActions.sLogin });
export const useGuestLogout = () =>
  useMutation({ mutationFn: guestActions.sLogout });
export const useGuestGetOrder = () =>
  useQuery({
    queryKey: [QUERY_KEYS.GUEST_ORDERS],
    queryFn: guestActions.orderList,
  });
export const useGuestOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guestActions.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GUEST_ORDERS],
        exact: true,
      });
    },
  });
};
