import CandidateStoresViewModel from '@/feature/vote/viewModels/CandidateStoresViewModel';
import { useSuspenseQuery } from '@tanstack/react-query';
import { voteQueryOptions } from '@/feature/vote/services/options/queries';

type RTCSessionId = string;

const useGetCandidateStores = (sessionId: RTCSessionId) => {
  const { data: candidateStores } = useSuspenseQuery(
    voteQueryOptions.suspense.fetchCandidateStores.query({
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

  const candidateStoresViewModels = candidateStores.map((store) => {
    return new CandidateStoresViewModel(store);
  });

  return {
    candidateStoresViewModels,
  };
};

export default useGetCandidateStores;
