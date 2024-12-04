import { UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { voteQueryOptions } from '@/feature/vote/services/options/queries';
import { RTCSessionId } from '@/feature/_types';
import {
  CancelVoteStoreSchema,
  RemoveCandidateStoreSchema,
  voteApiService,
  VoteStoreSchema,
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

  useVoteStore: (sessionId: RTCSessionId) => {
    return {
      mutationFn: ({ storeId }: { storeId: number }) => {
        return voteApiService.voteStore(sessionId, String(storeId));
      },
    } satisfies UseMutationOptions<VoteStoreSchema, Error, { storeId: number }>;
  },

  useRemoveVotedStore: (sessionId: RTCSessionId) => {
    return {
      mutationFn: ({ storeId }: { storeId: number }) => {
        return voteApiService.removeVotedStore(sessionId, String(storeId));
      },
    } satisfies UseMutationOptions<
      CancelVoteStoreSchema,
      Error,
      { storeId: number }
    >;
  },
};
