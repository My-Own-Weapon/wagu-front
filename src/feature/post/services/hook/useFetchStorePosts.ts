import { useSuspenseQuery } from '@tanstack/react-query';

import { postApiService } from '@/feature/post/services/api/postApiService';
import { OriginalServerData, Selector } from '@/feature/_types';

type ServerData = OriginalServerData<typeof postApiService.fetchStorePosts>;

/**
 * @QUERY_KEY ["fetchStorePosts", var(storeId)]
 */
const useFetchStorePosts = <TReturnData = ServerData>({
  storeId,
  selector = undefined,
}: {
  storeId: number;
  selector?: Selector<ServerData, TReturnData>;
}) => {
  const query = useSuspenseQuery({
    queryKey: ['fetchStorePosts', storeId],
    queryFn: () => postApiService.fetchStorePosts({ storeId }),
    staleTime: 1000 * 60 * 3,
    select: selector,
  });

  return query;
};

export default useFetchStorePosts;
