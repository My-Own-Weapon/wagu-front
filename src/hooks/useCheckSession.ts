import { apiService } from '@/services/apiService';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useCheckSession = () => {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        await apiService.checkSession();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          router.push('/entry');
        }
      }
    }

    checkSession();
  }, [router]);
};
