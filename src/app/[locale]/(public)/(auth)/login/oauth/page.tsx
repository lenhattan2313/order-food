'use client';

import { Spinner } from '@/components/_client/Spinner';
import { useAuth } from '@/components/provider/auth-provider';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorage';
import { toast } from '@/hooks/use-toast';
import { decodeJWT } from '@/lib/utils';
import { useRouter } from '@/navigation';
import { useLoginOauth } from '@/queries/useAuth';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

function OAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync } = useLoginOauth();
  const { setRole } = useAuth();
  const isFirstRender = useRef(false);
  useEffect(() => {
    const accessToken = searchParams.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? '';
    const refreshToken =
      searchParams.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ?? '';
    if (!accessToken || !refreshToken) {
      setTimeout(() => toast({ description: 'Tài khoản không hợp lệ' }));
      router.push('/login');
      return;
    }
    //set cookie and local storage
    if (isFirstRender.current) {
      return;
    }
    mutateAsync({ accessToken, refreshToken })
      .then(({ data }) => {
        const decodeRole = decodeJWT(data.accessToken);
        decodeRole && setRole(decodeRole.role);
        router.push('/manage/dashboard');
      })
      .catch((err) => {
        toast({ description: err.message });
        router.push('/login');
      });
    isFirstRender.current = true;
  }, [searchParams]);
  return <Spinner />;
}

export default function OAuthPage() {
  return (
    <Suspense>
      <OAuth />
    </Suspense>
  );
}
