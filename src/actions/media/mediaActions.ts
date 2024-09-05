import envConfig from "@/config";
import http from "@/lib/httpUtils";
import { UploadImageResType } from "@/schemaValidations/media.schema";

export const mediaActions = {
  uploadAvatar: (form: FormData) =>
    http.post<UploadImageResType, FormData>("/media/upload", form, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
};
