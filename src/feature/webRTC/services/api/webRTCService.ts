import { z } from 'zod';

import { RTCSessionId } from '@/feature/_types';
import ApiService from '@/services/apiService';

class WebRTCService extends ApiService {
  async fetchConnectionToken(
    sessionId: RTCSessionId,
  ): Promise<FetchConnectionTokenSchma> {
    const res = await this.fetcher(
      `/api/sessions/${sessionId}/connections/voice`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    const data = await res.json();

    return fetchConnectionTokenSchema.parse(data);
  }
}

/**
 * 백엔드의 api 문서화가 되어있지않아 하드코딩
 *
 * data : {
 *  token: wss://openvidu.local:4443?sessionId=1234&token=1234,
 *  memberId: number,
 * }
 */
const fetchConnectionTokenSchema = z.object({
  token: z.string(),
  memberId: z.number(),
});
export type FetchConnectionTokenSchma = z.infer<
  typeof fetchConnectionTokenSchema
>;

export const webRTCService = new WebRTCService();
