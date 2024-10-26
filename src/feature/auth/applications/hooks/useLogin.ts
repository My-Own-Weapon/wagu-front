/* eslint-disable no-shadow */

import useLoginApi, {
  LoginClientParams,
} from '@/feature/auth/services/hooks/useLoginApi';
import { useRouter } from 'next/navigation';
import { loginFail, loginSuccess } from '@/feature/auth/domains';

interface Props {
  setErrorMsg: (msg: string | null) => void;
}

const useLogin = ({ setErrorMsg }: Props) => {
  const router = useRouter();
  const { mutate, isPending, isError } = useLoginApi();

  return {
    isPending,
    isError,
    login: ({ userName, password }: LoginClientParams) => {
      return mutate(
        { userName, password },
        {
          onSuccess: ({ userName }) => {
            loginSuccess(userName, router);
          },
          onError: (error) => {
            loginFail(error.message, setErrorMsg);
          },
        },
      );
    },
  };
};

export default useLogin;
