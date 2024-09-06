import { authActions } from "@/actions/auth/authActions";
import { useMutation } from "react-query";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authActions.sLogin,
  });
export const useLogoutMutation = () =>
  useMutation({ mutationFn: authActions.sLogout });

export const useLogoutBackendMutation = () =>
  useMutation({ mutationFn: authActions.logout });
