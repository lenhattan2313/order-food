"use client";

import { useAuth } from "@/components/provider/auth-provider";
import { Role } from "@/constants/type";
import { RoleType } from "@/interface/IAuth";
import { cn, handleApiError } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useGuestLogout } from "@/queries/useGuest";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const menuItems: {
  title: string;
  href: string;
  roles?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Món ăn",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    roles: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/order",
    roles: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAuth();
  const router = useRouter();
  const { mutateAsync: logout, isPending: isLogoutPending } =
    useLogoutMutation();
  const { mutateAsync: guestLogout, isPending: isGuestLogoutPending } =
    useGuestLogout();

  const handleLogout = useCallback(async () => {
    try {
      role === Role.Guest ? await guestLogout() : await logout();
      setRole(undefined);
      router.push("/");
    } catch (error) {
      handleApiError(error);
    }
  }, [guestLogout, logout, router, role, setRole]);
  const menu = menuItems.map((item) => {
    const canShow =
      (!item.roles && !item.hideWhenLogin) || (!role && item.hideWhenLogin);
    if ((role && item.roles?.includes(role)) || canShow) {
      return (
        <Link href={item.href} key={item.href} className={className}>
          {item.title}
        </Link>
      );
    }

    return null;
  });
  if (role) {
    menu.push(
      <div
        onClick={handleLogout}
        key="logout"
        className={cn(className, "cursor-pointer", {
          "opacity-50 pointer-events-none":
            isGuestLogoutPending || isLogoutPending,
        })}
      >
        Đăng xuất
      </div>
    );
    return menu;
  }
  return menu;
}
