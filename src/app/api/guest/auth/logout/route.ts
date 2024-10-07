import { guestActions } from '@/apiRequest/guest/guestActions';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { removeCookies } from '@/lib/cookieUtils';
import { getTokenCookies } from '@/lib/serverUtils';
import { StatusCodes } from 'http-status-codes';

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = getTokenCookies();
    removeCookies(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    removeCookies(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    if (!accessToken || !refreshToken) {
      return Response.json(
        { message: "Don't have any accessToken or refreshToken" },
        { status: StatusCodes.OK },
      );
    }
    const response = await guestActions.logout({ accessToken, refreshToken });
    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: 'Somethings happened',
      },
      { status: StatusCodes.OK },
    );
  }
}
