import { RTCSessionId } from '@/feature/_types';
import {
  FetchConnectionTokenSchma,
  webRTCService,
} from '@/feature/webRTC/services/api/webRTCService';
import { UseMutationOptions } from '@tanstack/react-query';

const webRTCOptions = {
  mutation: {
    fetchConnectionToken: {
      mutationKey: ['fetchConnectionToken'],
      mutationFn: (sessionId: RTCSessionId) => {
        return webRTCService.fetchConnectionToken(sessionId);
      },
      throwOnError: true,
    } satisfies UseMutationOptions<
      FetchConnectionTokenSchma,
      Error,
      RTCSessionId
    >,
  },
} as const;

export default webRTCOptions;
