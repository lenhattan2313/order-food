"use server";
import envConfig from "@/config";
import http from "@/lib/httpUtils";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const dataForm: LoginBodyType = await request.json();
  try {
    const response = await http.post<LoginResType, LoginBodyType>(
      "/auth/login",
      dataForm,
      {
        baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const cookieStore = cookies();
    cookieStore.set("accessToken", response.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });
    cookieStore.set("refreshToken", response.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });
    return Response.json(response);
  } catch (error) {
    return Response.json(error);
  }
}

export async function GET(request: Request) {
  return new Response("Hello, Next.js!", {
    status: 200,
  });
}
