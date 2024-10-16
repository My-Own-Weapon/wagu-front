import { apiService } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

/**
 * @QUERY_KEY ["fetchStorePosts", var(storeId)]
 */
const useFetchStorePosts = (storeId: number | undefined) => {
  const { data } = useQuery({
    queryKey: ['fetchStorePosts', storeId],
    queryFn: () => apiService.fetchStorePosts(storeId),
    enabled: Boolean(storeId),
  });

  return {
    storePosts: data ?? [],
  };
};

export default useFetchStorePosts;
