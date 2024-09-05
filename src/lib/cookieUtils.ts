import "server-only";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export function setCookies(name: string, value: string) {
  const expires = (jwt.decode(value) as JwtPayload).exp ?? 0;
  const cookieStore = cookies();
  cookieStore.set(name, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax", //navigation from another site to our site, or get method
    expires: expires * 1000,
  });
}
