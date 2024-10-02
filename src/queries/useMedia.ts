import { mediaActions } from "@/apiRequest/media/mediaActions";
import { useMutation } from "@tanstack/react-query";

export const useUploadAvatar = () =>
  useMutation({ mutationFn: mediaActions.uploadAvatar });

export const useUploadImageToS3 = () =>
  useMutation({ mutationFn: mediaActions.uploadImageToS3 });
