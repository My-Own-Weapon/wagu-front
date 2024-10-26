import { useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { authApiService } from '@/feature/auth/services/api/authApiService';

const clientParams = z.object({
  userName: z.string(),
  password: z.string(),
  passwordConfirm: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
});
type ClientParams = z.infer<typeof clientParams>;

const useSignup = ({
  userName,
  password,
  passwordConfirm,
  name,
  phoneNumber,
}: ClientParams) => {
  const parsed = clientParams.parse({
    userName,
    password,
    passwordConfirm,
    name,
    phoneNumber,
  });

  const serverParams = {
    username: parsed.userName,
    password: parsed.password,
    passwordConfirm: parsed.passwordConfirm,
    name: parsed.name,
    phoneNumber: parsed.phoneNumber,
  };

  const { data: signupResponse } = useSuspenseQuery({
    queryKey: ['signup'],
    queryFn: () => authApiService.signup(serverParams),
  });

  return signupResponse;
};

export default useSignup;
