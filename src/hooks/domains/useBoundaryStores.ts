import { useState } from 'react';

import { useFetchMapBoundaryStores } from '@/hooks/api';
import { MapVertexes } from '@/types';

const INITIAL_BOUNDARY = {
  left: 127.03211537373265,
  down: 37.49514710722404,
  right: 127.05067255624952,
  up: 37.5124399097617,
};

const useBoundaryStores = () => {
  const [boundary, setBoundary] = useState<MapVertexes>(INITIAL_BOUNDARY);
  const { stores } = useFetchMapBoundaryStores(boundary);

  return {
    stores,
    setBoundary,
  };
};

export default useBoundaryStores;
