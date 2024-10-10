'use client';

import { ConfirmDialog } from '@/components/_client/ConfirmDialog';
import { useAuth } from '@/components/provider/auth-provider';

import { Role } from '@/constants/type';
import { RoleType } from '@/interface/IAuth';
import { MenuTranslationKeys } from '@/interface/common';
import { socket } from '@/lib/socket';
import { handleApiError } from '@/lib/utils';
import { Link, useRouter } from '@/navigation';
import { useLogoutMutation } from '@/queries/useAuth';
import { useGuestLogout } from '@/queries/useGuest';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('menu');
  const tl = useTranslations('login');
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
          {t(item.name)}
        </Link>
      );
    }

    return null;
  });
  if (role) {
    menu.push(
      <ConfirmDialog
        key="logout"
        title={t('logout')}
        description={
          role === Role.Guest ? tl('guest-logout') : tl('account-logout')
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
  name: MenuTranslationKeys;
  href: string;
  roles?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    name: 'menu',
    href: '/',
  },
  {
    name: 'menu',
    href: '/guest/menu',
    roles: [Role.Guest],
  },
  {
    name: 'order',
    href: '/guest/order',
    roles: [Role.Guest],
  },
  {
    name: 'login',
    href: '/login',
    hideWhenLogin: true,
  },
  {
    name: 'dashboard',
    href: '/manage/dashboard',
    roles: [Role.Owner, Role.Employee],
  },
];
