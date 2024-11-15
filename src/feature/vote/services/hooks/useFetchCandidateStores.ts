import { useSuspenseQuery } from '@tanstack/react-query';
import { voteApiService } from '@/feature/vote/services/api/voteApiService';
import { OriginalServerData, RTCSessionId, Selector } from '@/feature/_types';

type ServerData = OriginalServerData<
  typeof voteApiService.fetchCandidateStores
>;

const useFetchCandidateStores = <T = DefaultItem>(
  sessionId: RTCSessionId,
  selector?: Selector<ServerData, T>,
) => {
  const query = useSuspenseQuery<ServerData, Error, T[]>({
    queryKey: ['fetchCandidateStores', sessionId],
    queryFn: () => voteApiService.fetchCandidateStores(sessionId),
    select: selector ?? (defaultSelector as Selector<ServerData, T>),
  });

  return query;
};

type DefaultItem = {
  mainMenuName: string;
  mainMenuImageUrl: string;
  mainMenuImageId: number;
  storeName: string;
  storeId: number;
  storePostCount: number;
};
const defaultSelector = (data: ServerData): DefaultItem[] => {
  return data.map((store) => {
    return {
      mainMenuName: store.menuName,
      mainMenuImageUrl: store.menuImage.url,
      mainMenuImageId: store.menuImage.id,
      storeName: store.storeName,
      storeId: store.storeId,
      storePostCount: store.postCount,
    };
  });
};

export default useFetchCandidateStores;
