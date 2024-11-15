import { RTCSessionId } from '@/feature/_types';
import { useFetchConnectionToken } from '@/feature/webRTC/services/hooks';

const useGetRTCConnectionToken = () => {
  const { mutateAsync } = useFetchConnectionToken();

  return {
    getConnectionToken: (sessionId: RTCSessionId) => {
      return mutateAsync(sessionId, {
        onError: (error) => {
          throw error;
        },
      });
    },
  };
};

export default useGetRTCConnectionToken;
