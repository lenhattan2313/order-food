import { authActions } from "@/apiRequest/auth/authActions";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authActions.sLogin,
  });
export const useLogoutMutation = () =>
  useMutation({ mutationFn: authActions.sLogout });

export const useLogoutBackendMutation = () =>
  useMutation({ mutationFn: authActions.logout });

export const useLoginOauth = () =>
  useMutation({ mutationFn: authActions.setTokenFromOAuth });
