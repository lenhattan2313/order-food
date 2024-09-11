"use server";
import { authActions } from "@/actions/auth/authActions";
import { setCookies } from "@/lib/cookieUtils";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";

export async function POST(_request: Request) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return Response.json(
        {
          message: "Don't have refreshToken",
        },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }
    const response = await authActions.refreshToken({ refreshToken });
    const {
      data: { accessToken, refreshToken: refreshTokenNew },
    } = response;

    setCookies("accessToken", accessToken);
    setCookies("refreshToken", refreshTokenNew);
    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: (error as Error).message ?? "Somethings happened",
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }
}
