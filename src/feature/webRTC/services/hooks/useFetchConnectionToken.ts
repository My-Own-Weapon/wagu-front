import { useMutation } from '@tanstack/react-query';
import { RTCSessionId } from '@/feature/_types';
import { webRTCService } from '@/feature/webRTC/services/api/webRTCService';

const useFetchConnectionToken = () => {
  const mutation = useMutation({
    mutationKey: ['fetchConnectionToken'],
    mutationFn: (sessionId: RTCSessionId) =>
      webRTCService.fetchConnectionToken(sessionId),
    throwOnError: true,
  });

  return mutation;
};

export default useFetchConnectionToken;
