import { guestActions } from "@/apiRequest/guest/guestActions";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { setCookies } from "@/lib/cookieUtils";
import { HttpError } from "@/lib/error";
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
  const data: GuestLoginBodyType = await request.json();
  try {
    const response = await guestActions.login(data);
    const {
      data: { accessToken, refreshToken },
    } = response;
    setCookies(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
    setCookies(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
    return Response.json(response);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error, {
        status: error.status,
      });
    }
    return Response.json(
      {
        message: "Somethings happened",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
