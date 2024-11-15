import CandidateStoresViewModel, {
  CandidateStoreViewModelProps,
} from '@/feature/vote/applications/viewModels/CandidateStoresViewModel';
import { voteApiService } from '@/feature/vote/services/api/voteApiService';
import { useFetchCandidateStores } from '@/feature/vote/services/hooks';

type RTCSessionId = string;

const useGetCandidateStores = (sessionId: RTCSessionId) => {
  const { data: candidateStores } =
    useFetchCandidateStores<CandidateStoreViewModelProps>(sessionId, selector);

  const candidateStoresViewModels = candidateStores.map((store) => {
    return new CandidateStoresViewModel(store);
  });

  return {
    candidateStoresViewModels,
  };
};

const selector = (
  data: Awaited<ReturnType<typeof voteApiService.fetchCandidateStores>>,
) => {
  return data.map((store) => {
    return {
      mainMenuName: store.menuName,
      mainMenuImageUrl: store.menuImage.url,
      storeName: store.storeName,
      storeId: store.storeId,
    };
  });
};

export default useGetCandidateStores;
