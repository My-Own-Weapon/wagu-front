import { apiService } from '@/services/apiService';
import { MapVertexes } from '@/types';
import { useQuery } from '@tanstack/react-query';

/**
 * ✅ TODO: 127.30 -> 127.3으로 변환되어 캐싱에 문제가 생길 수 있음
 */
const limitPrecision = (num: number, precision: number = 2) => {
  return Number(num.toFixed(precision));
};

const limitBoundaryPrecision = (boundary: MapVertexes): MapVertexes => {
  return {
    left: limitPrecision(boundary.left, 2),
    down: limitPrecision(boundary.down, 2),
    right: limitPrecision(boundary.right, 2),
    up: limitPrecision(boundary.up, 2),
  };
};

/**
 * @QUERY_KEY ["fetchMapBoundaryStores", var(boundary)]
 *
 * @staleTime useFetchOnLiveFollowings와 같은 이유로 인플루언서가 라이브를 시작했을때
 *            라이브중인 마커를 다시 불러오지 않아 사용자 관점에서 좋지 않을 수 있음
 */
const useFetchMapBoundaryStores = (boundary: MapVertexes) => {
  const { data } = useQuery({
    queryKey: ['fetchMapBoundaryStores', limitBoundaryPrecision(boundary)],
    queryFn: () => apiService.fetchMapBoundaryStores(boundary),
    staleTime: 0,
    gcTime: 1000 * 60 * 3,
  });

  return {
    stores: data ?? [],
  };
};

export default useFetchMapBoundaryStores;
