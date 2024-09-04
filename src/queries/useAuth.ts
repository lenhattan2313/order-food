import { authActions } from "@/actions/auth/authActions";
import { useMutation } from "react-query";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authActions.sLogin,
  });
