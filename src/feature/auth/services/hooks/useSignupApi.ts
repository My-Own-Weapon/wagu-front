import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { authApiService } from '@/feature/auth/services/api/authApiService';

export const signupClientParams = z.object({
  userName: z.string(),
  password: z.string(),
  passwordConfirm: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
});
type SignupClientParams = z.infer<typeof signupClientParams>;

const useSignupApi = () => {
  const mutation = useMutation({
    mutationFn: async ({
      userName,
      password,
      passwordConfirm,
      fullName,
      phoneNumber,
    }: SignupClientParams) => {
      signupClientParams.parse({
        userName,
        password,
        passwordConfirm,
        fullName,
        phoneNumber,
      });

      const serverParams = {
        username: userName,
        password,
        passwordConfirm,
        name: fullName,
        phoneNumber,
      };

      return authApiService.signup(serverParams);
    },
  });

  return mutation;
};

export default useSignupApi;
