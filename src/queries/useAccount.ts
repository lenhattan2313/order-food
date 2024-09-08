import { accountActions } from "@/actions/account/accountActions";
import { AccountResType } from "@/schemaValidations/account.schema";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetAccountMe = (options?: UseQueryOptions<AccountResType>) =>
  useQuery<AccountResType>({
    queryKey: ["account_profile"],
    queryFn: accountActions.getMe,
    ...options,
  });

export const useAccountMeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountActions.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account_profile"],
        exact: true,
      });
    },
  });
};
export const useChangePassword = () =>
  useMutation({ mutationFn: accountActions.changePassword });
