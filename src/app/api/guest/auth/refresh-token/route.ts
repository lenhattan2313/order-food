import { guestActions } from '@/apiRequest/guest/guestActions';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { setCookies } from '@/lib/cookieUtils';
import { HttpError } from '@/lib/error';
import { getTokenCookies } from '@/lib/serverUtils';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: Request) {
  try {
    const { refreshToken: token } = getTokenCookies();
    if (!token) {
      return Response.json(
        { message: "Don't have any  refreshToken" },
        { status: StatusCodes.UNAUTHORIZED },
      );
    }
    const response = await guestActions.refreshToken({ refreshToken: token });
    const {
      data: { refreshToken, accessToken },
    } = response;
    setCookies(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
    setCookies(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
    return Response.json(response);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.errors, { status: error.status });
    }
    return Response.json(
      {
        message: 'Somethings happened',
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
