'use client';

import { ConfirmDialog } from '@/components/_client/ConfirmDialog';
import { useAuth } from '@/components/provider/auth-provider';

import { Role } from '@/constants/type';
import { RoleType } from '@/interface/IAuth';
import { socket } from '@/lib/socket';
import { handleApiError } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useGuestLogout } from '@/queries/useGuest';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

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
      socket.disconnect();
      router.push('/');
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
          {item.name}
        </Link>
      );
    }

    return null;
  });
  if (role) {
    menu.push(
      <ConfirmDialog
        key="logout"
        title="Đăng xuất"
        description={
          role === Role.Guest
            ? 'Bạn có thể sẽ mất đơn hàng của mình'
            : 'Bạn muốn đăng xuất?'
        }
        onClick={handleLogout}
        isPending={isGuestLogoutPending || isLogoutPending}
      />,
    );
    return menu;
  }
  return menu;
}

const menuItems: {
  name: string;
  href: string;
  roles?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    name: 'Shop',
    href: '/',
  },
  {
    name: 'Menu',
    href: '/guest/menu',
    roles: [Role.Guest],
  },
  {
    name: 'Đơn hàng',
    href: '/guest/order',
    roles: [Role.Guest],
  },
  {
    name: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true,
  },
  {
    name: 'Dashboard',
    href: '/manage/dashboard',
    roles: [Role.Owner, Role.Employee],
  },
];
