import { useSuspenseQuery } from '@tanstack/react-query';

import { postApiService } from '@/feature/post/services/api/postApiService';

/**
 * @QUERY_KEY ["fetchStorePosts", var(storeId)]
 */
const useFetchStorePostsApi = (storeId: number) => {
  const query = useSuspenseQuery({
    queryKey: ['fetchStorePosts', storeId],
    queryFn: () => postApiService.fetchStorePosts({ storeId }),
    staleTime: 1000 * 60 * 3,
  });

  return query;
};

export default useFetchStorePostsApi;
