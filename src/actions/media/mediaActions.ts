import http from "@/lib/httpUtils";
import { UploadImageResType } from "@/schemaValidations/media.schema";

export const mediaActions = {
  uploadAvatar: (form: FormData) =>
    http.post<UploadImageResType, FormData>("/media/upload", form),
};
