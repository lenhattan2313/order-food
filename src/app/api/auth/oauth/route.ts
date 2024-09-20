"use server";
import { AccessToken } from "@/interface/IAuth";
import { setCookies } from "@/lib/cookieUtils";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
  try {
    const token: AccessToken = await request.json();
    const { accessToken, refreshToken } = token;
    setCookies("accessToken", accessToken);
    setCookies("refreshToken", refreshToken);
    return Response.json({ data: token });
  } catch (error) {
    return Response.json(
      {
        message: "Somethings happened",
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
