import type { RTCSessionId } from '@/feature/_types';
import { voteMutationOptions } from '@/feature/vote/services/options/mutations';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UseAddCandidateStoreProps {
  sessionId: RTCSessionId;
}

interface AddCandidateStoreProps {
  storeId: number;
  onSuccess?: () => void;
  onError?: () => void;
}

const useAddCandidateStore = ({ sessionId }: UseAddCandidateStoreProps) => {
  const { mutate } = useMutation(
    voteMutationOptions.useAddCandidateStore(sessionId),
  );
  const addCandidateStore = useCallback(
    ({ storeId, onSuccess, onError }: AddCandidateStoreProps) => {
      mutate(
        { storeId },
        {
          onSuccess: () => {
            // ✅ TODO: 추가 토스트 뿌리기
            onSuccess?.();
            return alert('후보자 목록에 해당 스토어를 추가했어요');
          },
          onError: () => {
            // ✅ TODO: 추가 에러 토스트 뿌리기
            onError?.();
            return alert('후보자 목록에 해당 스토어를 추가하는데 실패했어요');
          },
        },
      );
    },
    [mutate],
  );

  return {
    addCandidateStore,
  };
};

export default useAddCandidateStore;
