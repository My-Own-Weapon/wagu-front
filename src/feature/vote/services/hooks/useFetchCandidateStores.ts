import { useSuspenseQuery } from '@tanstack/react-query';
import { voteApiService } from '@/feature/vote/services/api/voteApiService';
import {
  OriginalServerData,
  RTCSessionId,
  WithSelector,
} from '@/feature/_types';

type ServerData = OriginalServerData<
  typeof voteApiService.fetchCandidateStores
>;

interface Props<T> extends WithSelector<ServerData, T> {
  sessionId: RTCSessionId;
}

const useFetchCandidateStores = <T = ServerData>({
  sessionId,
  selector,
}: Props<T>) => {
  const query = useSuspenseQuery({
    queryKey: ['fetchCandidateStores', sessionId],
    queryFn: () => voteApiService.fetchCandidateStores(sessionId),
    select: selector,
  });

  return query;
};

export default useFetchCandidateStores;
