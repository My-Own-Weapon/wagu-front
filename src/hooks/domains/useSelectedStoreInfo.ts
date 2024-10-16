import { useState } from 'react';

import {
  useFetchOnLiveFollowingsAtStore,
  useFetchStorePosts,
} from '@/hooks/api';
import { StoreResponse } from '@/types';

const useSelectedStoreInfo = () => {
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(
    null,
  );

  const { storePosts } = useFetchStorePosts(selectedStore?.storeId);
  const { onLiveFollowingsAtStore } = useFetchOnLiveFollowingsAtStore(
    selectedStore?.storeId,
  );

  return {
    selectedStore,
    setSelectedStore,
    storePosts,
    onLiveFollowingsAtStore,
  };
};

export default useSelectedStoreInfo;
