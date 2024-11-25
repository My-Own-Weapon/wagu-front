import type { RTCSessionId } from '@/feature/_types';
import { voteMutationOptions } from '@/feature/vote/services/options/mutations';
import { useMutation } from '@tanstack/react-query';

interface UseRemoveCandidateStoreProps {
  sessionId: RTCSessionId;
}

interface RemoveCandidateStoreProps {
  storeId: number;
}

const useRemoveCandidateStore = ({
  sessionId,
}: UseRemoveCandidateStoreProps) => {
  const mutationOption = voteMutationOptions.useRemoveCandidateStore(sessionId);
  const { mutate } = useMutation(mutationOption);

  return {
    removeCandidateStore: ({ storeId }: RemoveCandidateStoreProps) => {
      mutate(
        { storeId },
        {
          onSuccess: () => {
            // ✅ TODO: 삭제 토스트 뿌리기
            alert('후보자 목록에서 해당 스토어를 제외했어요');
          },
          onError: () => {
            // ✅ TODO: 삭제 에러 토스트 뿌리기
            alert('후보자 목록에서 해당 스토어를 제외하는데 실패했어요');
          },
        },
      );
    },
  };
};

export default useRemoveCandidateStore;
