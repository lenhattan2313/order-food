"use server";
import { authActions } from "@/actions/auth/authActions";
import { setCookies } from "@/lib/cookieUtils";
import { HttpError } from "@/lib/error";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { StatusCodes } from "http-status-codes";

export async function POST(request: Request) {
  try {
    const dataForm: LoginBodyType = await request.json();
    const response = await authActions.login(dataForm);
    const {
      data: { accessToken, refreshToken },
    } = response;

    setCookies("accessToken", accessToken);
    setCookies("refreshToken", refreshToken);
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
