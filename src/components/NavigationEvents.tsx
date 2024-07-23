'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // const url = `${pathname}?${searchParams}`;
    // ✅ TODO: 미들웨어가 적용이 안된다면 로그인 유지 확인 가능
  }, [pathname, searchParams]);

  return null;
}
