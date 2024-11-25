import { OriginalServerData, Selector } from '@/feature/_types';
import { voteApiService } from '@/feature/vote/services/api/voteApiService';
import { useSuspenseQuery } from '@tanstack/react-query';

type ServerData = OriginalServerData<
  typeof voteApiService.fetchVoteWinnerStores
>;

const useFetchVoteWinnerStores = <TReturnData = ServerData>({
  sessionId,
  selector,
}: {
  sessionId: string;
  selector?: Selector<ServerData, TReturnData>;
}) => {
  const query = useSuspenseQuery({
    queryKey: ['fetchVoteWinnerStores', sessionId],
    queryFn: () => voteApiService.fetchVoteWinnerStores(sessionId),
    select: selector,
  });

  return query;
};

export default useFetchVoteWinnerStores;
