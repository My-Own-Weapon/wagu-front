import { apiService } from '@/services/apiService';
import { MapVertexes } from '@/types';
import { useQuery } from '@tanstack/react-query';

const limitPrecision = (num: number, precision: number = 2): number => {
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

const useFetchBoundaryStores = (boundary: MapVertexes) => {
  const { data } = useQuery({
    queryKey: ['fetchBoundaryStores', limitBoundaryPrecision(boundary)],
    queryFn: () => apiService.fetchBoundaryStores(boundary),
    gcTime: 1000 * 60 * 1,
  });

  return {
    stores: data,
  };
};

export default useFetchBoundaryStores;
