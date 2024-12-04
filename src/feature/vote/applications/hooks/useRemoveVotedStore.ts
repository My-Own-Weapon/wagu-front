import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import { RTCSessionId } from '@/feature/_types';
import { voteMutationOptions } from '@/feature/vote/services/options/mutations';

const useRemoveVotedStore = (sessionId: RTCSessionId) => {
  const { mutate } = useMutation(
    voteMutationOptions.useRemoveVotedStore(sessionId),
  );
  const removeVotedStore = useCallback(
    ({ storeId }: { storeId: number }) => {
      mutate(
        { storeId },
        {
          onSuccess: () => {
            return alert('투표 취소가 완료되었습니다.');
          },
          onError: () => {
            return alert('투표 취소에 실패했습니다.');
          },
        },
      );
    },
    [mutate],
  );

  return { removeVotedStore };
};

export default useRemoveVotedStore;
