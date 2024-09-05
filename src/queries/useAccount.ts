import { accountActions } from "@/actions/account/accountActions";
import { AccountResType } from "@/schemaValidations/account.schema";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const useGetAccountMe = (options?: UseQueryOptions<AccountResType>) =>
  useQuery<AccountResType>({
    queryKey: ["account_profile"],
    queryFn: accountActions.getMe,
    ...options,
  });

const useAccountMeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountActions.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries(["account_profile"], { exact: true });
    },
  });
};

export { useGetAccountMe, useAccountMeMutation };
