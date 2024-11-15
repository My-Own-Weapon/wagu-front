import { OriginalServerData } from '@/feature/_types';
import { VoteWinnerStoreViewModel } from '@/feature/vote/applications/viewModels';
import { VoteWinnerStoreViewModelProps } from '@/feature/vote/applications/viewModels/VoteWinnerStoreViewModel';
import useFetchVoteWinnerStores from '@/feature/vote/services/hooks/useFetchVoteWinnerStores';

const useGetVoteWinnerStores = (sessionId: string) => {
  const { data: winnerStores } =
    useFetchVoteWinnerStores<VoteWinnerStoreViewModelProps>({
      sessionId,
      selector: (serverData) => {
        return serverData.map((store) => ({
          storeName: store.storeName,
          storeId: store.storeId,
          storePostCount: store.postCount,
          mainMenuImageUrl: store.menuImage.url,
          mainMenuName: store.menuName,
        }));
      },
    });

  const winnerStoresViewModels = winnerStores.map((store) => {
    return new VoteWinnerStoreViewModel(store);
  });

  return {
    winnerStoresViewModels,
  };
};

export default useGetVoteWinnerStores;
