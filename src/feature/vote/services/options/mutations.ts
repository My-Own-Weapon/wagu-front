import { UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { voteQueryOptions } from '@/feature/vote/services/options/queries';
import { RTCSessionId } from '@/feature/_types';
import {
  RemoveCandidateStoreSchema,
  voteApiService,
} from '../api/voteApiService';

export const voteMutationOptions = {
  useRemoveCandidateStore: (sessionId: RTCSessionId) => {
    const queryClient = useQueryClient();

    return {
      mutationFn: ({ storeId }) => {
        return voteApiService.removeCandidateStore(sessionId, String(storeId));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            voteQueryOptions.suspense.fetchCandidateStores.queryKey(sessionId),
        });
      },
    } satisfies UseMutationOptions<
      RemoveCandidateStoreSchema,
      Error,
      { storeId: number }
    >;
  },

  useAddCandidateStore: (sessionId: RTCSessionId) => {
    const queryClient = useQueryClient();

    return {
      mutationFn: ({ storeId }) => {
        return voteApiService.addCandidateStore(sessionId, String(storeId));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            voteQueryOptions.suspense.fetchCandidateStores.queryKey(sessionId),
        });
      },
    } satisfies UseMutationOptions<
      RemoveCandidateStoreSchema,
      Error,
      { storeId: number }
    >;
  },
};
