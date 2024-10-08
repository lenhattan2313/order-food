'use client';
import { Spinner } from '@/components/_client/Spinner';
import { PropsWithChildren } from 'react';
import { Suspense as SuspenseReact } from 'react';
export const Suspense = ({ children }: PropsWithChildren) => {
  return <SuspenseReact fallback={<Spinner />}>{children}</SuspenseReact>;
};
