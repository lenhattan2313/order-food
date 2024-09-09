import { accountActions } from "@/actions/account/accountActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
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
export const useGetAccountList = () =>
  useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: accountActions.getList,
  });

export const useGetEmployeeDetail = ({ id }: { id?: number }) =>
  useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS, id],
    queryFn: () => accountActions.getEmployeeDetail({ id: id! }),
    enabled: Boolean(id),
  });
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountActions.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNTS],
      });
    },
  });
};
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountActions.updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNTS],
        exact: true,
      });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountActions.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACCOUNTS],
        exact: true,
      });
    },
  });
};
