'use client';

import { ReactNode, useState } from 'react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/navigation';
import CheckLoginSessionError from '@/services/errors/CheckLoginSessionError';

interface Props {
  children: ReactNode;
}

export default function RQProvider({ children }: Props) {
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
            alert(
              `로그인 이후 이용한지 오래되지않아 로그아웃되었어요.\n다시 로그인해주세요.`,
            );
            router.push('/login');
          }
        },
      }),
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.REACT_APP_SHOW_DEV_TOOLS ? <ReactQueryDevtools /> : null}
    </QueryClientProvider>
  );
}
