import { RTCSessionId } from '@/feature/_types';
import { useFetchConnectionToken } from '@/feature/webRTC/services/hooks';
import { useCallback } from 'react';

const useGetRTCConnectionToken = () => {
  const { mutateAsync } = useFetchConnectionToken();

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
