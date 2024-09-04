import "server-only";
import { cookies } from "next/headers";

export function setCookies(name: string, value: string) {
  const cookieStore = cookies();
  cookieStore.set(name, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax", //navigation from another site to our site, or get method
  });
}
