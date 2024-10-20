'use client';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { CheckLoginSessionError } from '@/services/apiService';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function LoginSessionRQProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
      queryCache: new QueryCache({
        onError: (error) => {
          if (error instanceof CheckLoginSessionError) {
            router.push('/login');
          }
        },
      }),
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={process.env.NEXT_PUBLIC_MODE === 'local'}
      />
    </QueryClientProvider>
  );
}
