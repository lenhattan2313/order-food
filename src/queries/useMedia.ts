import { mediaActions } from "@/actions/media/mediaActions";
import { useMutation } from "react-query";

export const useUploadAvatar = () =>
  useMutation({ mutationFn: mediaActions.uploadAvatar });
