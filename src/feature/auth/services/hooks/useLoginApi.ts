import { useMutation } from '@tanstack/react-query';

import { authApiService } from '@/feature/auth/services/api/authApiService';
import { z } from 'zod';
import { PostParameters } from '@/feature/_types/openApiAccess';

export const loginClientParams = z.object({
  userName: z.string(),
  password: z.string(),
});
export type LoginClientParams = z.infer<typeof loginClientParams>;

const useLoginApi = () => {
  const mutation = useMutation({
    mutationFn: async ({ userName, password }: LoginClientParams) => {
      loginClientParams.parse({ userName, password });

      const serverParams = {
        username: userName,
        password,
      } satisfies PostParameters['/login'];
      const data = await authApiService.login(serverParams);

      return {
        userName: data.memberUsername,
        imageUrl: data.memberImage.url,
        imageId: data.memberImage.id,
      };
    },
  });

  return mutation;
};

export default useLoginApi;
