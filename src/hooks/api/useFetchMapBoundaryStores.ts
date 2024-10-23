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
 */
const useFetchMapBoundaryStores = (boundary: MapVertexes) => {
  const { data } = useQuery({
    queryKey: ['fetchMapBoundaryStores', limitBoundaryPrecision(boundary)],
    queryFn: () => apiService.fetchMapBoundaryStores(boundary),
    gcTime: 1000 * 60 * 1,
  });

  return {
    stores: data ?? [],
  };
};

export default useFetchMapBoundaryStores;
