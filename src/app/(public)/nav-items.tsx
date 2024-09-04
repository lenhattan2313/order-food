"use client";

import { localStorageUtil } from "@/lib/storageUtils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setAuth] = useState(false);
  useEffect(() => {
    setAuth(Boolean(localStorageUtil.get("accessToken")));
  }, []);
  return menuItems.map((item) => {
    if (
      (isAuth && item.authRequired === false) ||
      (!isAuth && item.authRequired === true)
    ) {
      return null;
    }
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
