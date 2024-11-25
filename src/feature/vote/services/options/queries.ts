import type {
  OriginalServerData,
  RTCSessionId,
  WithSelector,
} from '@/feature/_types';
import type { UseSuspenseQueryOptions } from '@tanstack/react-query';
import { voteApiService } from '../api/voteApiService';

export const voteQueryOptions = {
  suspense: {
    fetchWinnerStores: <TReturnData = OriginalVoteWinnerStoresData>({
      sessionId,
      selector,
    }: FetchWinnerStoresProps<TReturnData>) => {
      return {
        queryKey: ['fetchVoteWinnerStores', sessionId],
        queryFn: () => voteApiService.fetchVoteWinnerStores(sessionId),
        select: selector,
      } satisfies UseSuspenseQueryOptions<
        OriginalVoteWinnerStoresData,
        Error,
        TReturnData
      >;
    },
    fetchCandidateStores: {
      queryKey: (sessionId: RTCSessionId) => [
        'fetchCandidateStores',
        sessionId,
      ],
      query: <TReturnData = OriginalCandidateStoresData>({
        sessionId,
        selector,
      }: FetchCandidateStoresProps<TReturnData>) => {
        return {
          queryKey:
            voteQueryOptions.suspense.fetchCandidateStores.queryKey(sessionId),
          queryFn: () => voteApiService.fetchCandidateStores(sessionId),
          select: selector,
          staleTime: 0,
        } satisfies UseSuspenseQueryOptions<
          OriginalCandidateStoresData,
          Error,
          TReturnData
        >;
      },
    },
  },
} as const;

type OriginalVoteWinnerStoresData = OriginalServerData<
  typeof voteApiService.fetchVoteWinnerStores
>;

interface FetchWinnerStoresProps<TReturnData>
  extends WithSelector<OriginalVoteWinnerStoresData, TReturnData> {
  sessionId: RTCSessionId;
}

type OriginalCandidateStoresData = OriginalServerData<
  typeof voteApiService.fetchCandidateStores
>;
interface FetchCandidateStoresProps<TReturnData>
  extends WithSelector<OriginalCandidateStoresData, TReturnData> {
  sessionId: RTCSessionId;
}
