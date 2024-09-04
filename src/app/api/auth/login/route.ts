"use server";
import { authActions } from "@/actions/auth/authActions";
import { setCookies } from "@/lib/cookieUtils";
import { LoginBodyType } from "@/schemaValidations/auth.schema";

export async function POST(request: Request) {
  const dataForm: LoginBodyType = await request.json();
  try {
    const response = await authActions.login(dataForm);
    const {
      data: { accessToken, refreshToken },
    } = response;
    setCookies("accessToken", accessToken);
    setCookies("refreshToken", refreshToken);
    return Response.json(response);
  } catch (error) {
    return Response.json(error);
  }
}
