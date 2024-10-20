import { apiService } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

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
