"use client";
import { accountActions } from "@/actions/account/accountActions";
import { useEffect } from "react";

export default function MePage() {
  async function getProfile() {
    const response = await accountActions.getMe();
    console.log("reponse client", response);
  }
  useEffect(() => {
    getProfile();
  }, []);
  return <div>Profile client</div>;
}
