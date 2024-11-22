import CandidateStoresViewModel, {
  CandidateStoreViewModelProps,
} from '@/feature/vote/viewModels/CandidateStoresViewModel';
import { useFetchCandidateStores } from '@/feature/vote/services/hooks';

type RTCSessionId = string;

const useGetCandidateStores = (sessionId: RTCSessionId) => {
  const { data: candidateStores } = useFetchCandidateStores<
    CandidateStoreViewModelProps[]
  >({
    sessionId,
    selector: (serverData) => {
      return serverData.map((store) => ({
        mainMenuName: store.menuName,
        mainMenuImageUrl: store.menuImage.url,
        storeName: store.storeName,
        storeId: store.storeId,
      }));
    },
  });

  const candidateStoresViewModels = candidateStores.map((store) => {
    return new CandidateStoresViewModel(store);
  });

  return {
    candidateStoresViewModels,
  };
};

export default useGetCandidateStores;
