import { apiService } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

/**
 * @QUERY_KEY ["fetchOnLiveFollowingsAtStore", var(storeId)]
 */
const useFetchOnLiveFollowingsAtStore = (storeId: number | undefined) => {
  const { data } = useQuery({
    queryKey: ['fetchOnLiveFollowingsAtStore', storeId],
    queryFn: () => apiService.fetchOnLiveFollowingsAtStore(storeId),
    enabled: Boolean(storeId),
  });

  return {
    onLiveFollowingsAtStore: data ?? [],
  };
};

export default useFetchOnLiveFollowingsAtStore;
