import { accountActions } from "@/actions/account/accountActions";
import { cookies } from "next/headers";

export default async function Profile() {
  const cookieStore = cookies();
  const response = await accountActions.getProfile(
    cookieStore.get("accessToken")?.value ?? ""
  );
  return (
    <div>
      <h1>Profile</h1>
      <p>{JSON.stringify(response, null, 2)}</p>
    </div>
  );
}
