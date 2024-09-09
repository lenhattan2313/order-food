import { accountActions } from "@/actions/account/accountActions";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";
  const res = await accountActions.sGetMe(accessToken);

  return <div>Dashboard: {res.data.name}</div>;
}
