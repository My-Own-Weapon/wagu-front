import { RTCSessionId } from '@/feature/_types';
import { voteMutationOptions } from '@/feature/vote/services/options/mutations';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

const useVoteStore = (sessionId: RTCSessionId) => {
  const { mutate } = useMutation(voteMutationOptions.useVoteStore(sessionId));
  const voteStore = useCallback(
    ({ storeId }: { storeId: number }) => {
      mutate(
        { storeId },
        {
          onSuccess: () => {
            return alert('투표가 완료되었습니다.');
          },
          onError: () => {
            return alert('투표에 실패했습니다.');
          },
        },
      );
    },
    [mutate],
  );

  return { voteStore };
};

export default useVoteStore;
