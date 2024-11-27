import { RTCSessionId } from '@/feature/_types';
import webRTCOptions from '@/feature/webRTC/services/options/mutations';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

const useGetRTCConnectionToken = () => {
  const { mutateAsync } = useMutation(
    webRTCOptions.mutation.fetchConnectionToken,
  );

  const getConnectionToken = useCallback(
    (sessionId: RTCSessionId) => {
      return mutateAsync(sessionId, {
        onError: () => {
          console.error('webRTC 연결 토큰 발급 실패');
        },
      });
    },
    [mutateAsync],
  );

  return {
    getConnectionToken,
  };
};

export default useGetRTCConnectionToken;
