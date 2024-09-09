"use server";
import { authActions } from "@/actions/auth/authActions";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
//logout: remove cookies at Next server, and localStorage Next client
export async function POST(_request: Request) {
  try {
    //check accessToken & refreshToken
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    if (!accessToken || !refreshToken) {
      return Response.json(
        {
          message: "Không có accessToken hoặc refreshToken",
        },
        { status: StatusCodes.OK } //auto successful
      );
    }
    //call api backend Server
    const response = await authActions.logout({ accessToken, refreshToken });
    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        message: "Có lỗi xảy ra khi gọi API Logout",
      },
      { status: StatusCodes.OK }
    );
  }
}
