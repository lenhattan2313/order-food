import { mediaActions } from "@/actions/media/mediaActions";
import { useMutation } from "@tanstack/react-query";

export const useUploadAvatar = () =>
  useMutation({ mutationFn: mediaActions.uploadAvatar });
