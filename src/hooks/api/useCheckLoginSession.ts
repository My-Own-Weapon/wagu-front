'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

/**
 * @QUERY_KEY ['checkLoginSession']
 */
const useCheckLoginSession = () => {
  const query = useQuery({
    queryKey: ['checkLoginSession'],
    queryFn: apiService.checkLoginSession.bind(apiService),
  });

  return query;
};

export default useCheckLoginSession;
