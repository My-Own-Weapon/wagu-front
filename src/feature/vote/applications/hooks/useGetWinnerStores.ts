import { voteQueryOptions } from '@/feature/vote/services/options/queries';
import { WinnerStoreViewModel } from '@/feature/vote/viewModels';
import { useSuspenseQuery } from '@tanstack/react-query';

type RTCSessionId = string;

const useGetWinnerStores = (sessionId: RTCSessionId) => {
  const { data: winnerStores } = useSuspenseQuery(
    voteQueryOptions.suspense.fetchWinnerStores({
      sessionId,
      selector: (serverData) => {
        return serverData.map((store) => ({
          mainMenuName: store.menuName,
          mainMenuImageUrl: store.menuImage.url,
          storeName: store.storeName,
          storeId: store.storeId,
        }));
      },
    }),
  );

  const winnerStoresViewModels = winnerStores.map((store) => {
    return new WinnerStoreViewModel(store);
  });

  return {
    winnerStoresViewModels,
  };
};

export default useGetWinnerStores;
