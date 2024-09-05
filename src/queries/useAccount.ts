import { accountActions } from "@/actions/account/accountActions";
import { useQuery } from "react-query";

export const useGetAccount = () =>
  useQuery({
    queryKey: ["account_profile"],
    queryFn: accountActions.getMe,
  });
