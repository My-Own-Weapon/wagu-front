import loginService from '@/feature/user/application/service/loginService';
import {
  LoginUseCaseInput,
  LoginUseCase,
  LoginUseCaseSuccess,
} from '@/feature/user/application/port/in/LoginUseCase';
import { useMutation } from '@tanstack/react-query';

interface Props {
  onSuccess?: (result: LoginUseCaseSuccess) => void;
  onError?: (error: Error) => void;
}

const useLogin = ({ onSuccess, onError }: Props) => {
  const LoginService: LoginUseCase = loginService();
  const mutation = useMutation({
    mutationFn: async (params: LoginUseCaseInput) => {
      return LoginService.login(params);
    },
    onSuccess: (result) => {
      if (result.ok) {
        onSuccess?.(result);
      }
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    login: mutation.mutate,
  };
};

export default useLogin;
