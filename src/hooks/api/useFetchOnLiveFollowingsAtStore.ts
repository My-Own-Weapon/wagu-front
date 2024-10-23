import { apiService } from '@/services/apiService';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * @QUERY_KEY ["fetchOnLiveFollowingsAtStore", var(storeId)]
 *
 * @staleTime 만약, 인플루언서가 방송을 시작했다고 했을때 staleTime이 지나지 않았다면,
 *            방송중인 인플루언서 목록을 다시 불러오지 않아 사용자관점에서 좋지 않을 수 있음
 *
 * @gcTime    이 또한 위의 이유와 마찬가지로 방송시작이라는것은 빠르게 반영되어야 하므로
 *            캐시되어 있는(이전의 데이터)를 fetch중 보여줄 필요가 없다.
 */
const useFetchOnLiveFollowingsAtStore = (storeId: number | undefined) => {
  const { data } = useSuspenseQuery({
    queryKey: ['fetchOnLiveFollowingsAtStore', storeId],
    queryFn: () => {
      return storeId ? apiService.fetchOnLiveFollowingsAtStore(storeId) : null;
    },
    staleTime: 0,
    gcTime: 0,
  });

  return {
    onLiveFollowings: data ?? [],
  };
};

export default useFetchOnLiveFollowingsAtStore;
