import useFetchBoundaryStores from '@/hooks/api/useFetchBoundaryStores';
import { MapVertexes } from '@/types';
import { useState } from 'react';

const INITIAL_BOUNDARY = {
  left: 127.03211537373265,
  down: 37.49514710722404,
  right: 127.05067255624952,
  up: 37.5124399097617,
};

const useBoundaryStores = () => {
  const [boundary, setBoundary] = useState<MapVertexes>(INITIAL_BOUNDARY);
  const { stores } = useFetchBoundaryStores(boundary);

  return {
    stores,
    setBoundary,
  };
};

export default useBoundaryStores;
