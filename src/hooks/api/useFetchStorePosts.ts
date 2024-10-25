import { apiService } from '@/services/apiService';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * @QUERY_KEY ["fetchStorePosts", var(storeId)]
 */
const useFetchStorePosts = (storeId: number) => {
  const { data } = useSuspenseQuery({
    queryKey: ['fetchStorePosts', storeId],
    queryFn: () => (storeId ? apiService.fetchStorePosts(storeId) : null),
    staleTime: 1000 * 60 * 3,
  });

  return {
    storePosts: data ?? [],
  };
};

export default useFetchStorePosts;
