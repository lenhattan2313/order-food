import { guestActions } from "@/actions/guest/guestActions";
import { useMutation } from "@tanstack/react-query";

export const useGuestLogin = () =>
  useMutation({ mutationFn: guestActions.sLogin });
export const useGuestLogout = () =>
  useMutation({ mutationFn: guestActions.sLogout });
