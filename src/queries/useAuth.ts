import { authActions } from "@/actions/auth/authActions";
import { useMutation } from "react-query";

const useLoginMutation = () =>
  useMutation({
    mutationFn: authActions.sLogin,
  });
const useLogoutMutation = () => useMutation({ mutationFn: authActions.logout });

export { useLoginMutation, useLogoutMutation };
