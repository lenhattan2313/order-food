import http from "@/lib/httpUtils";
import { UploadImageResType } from "@/schemaValidations/media.schema";

export const mediaActions = {
  uploadAvatar: (form: FormData) =>
    http.post<UploadImageResType, FormData>("/media/upload", form),
  uploadImageToS3: (form: FormData) =>
    http.post<UploadImageResType, FormData>("/api/aws/s3", form, {
      baseUrl: "",
    }),
};
