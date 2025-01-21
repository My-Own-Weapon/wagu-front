import { localStorageAdapter } from '@/feature/_shared/adapter/out';
import { LocalStoragePort } from '@/feature/_shared/applications/port/out/LocalStoragePort';
import { userApiAdapter } from '@/feature/user/adapter/out/userApiAdapter';
import { LoginUseCase } from '@/feature/user/application/port/in/LoginUseCase';
import {
  AuthPort,
  AuthPortFailure,
  AuthPortOutput,
} from '@/feature/user/application/port/out/AuthPort';

const loginService = (): LoginUseCase => {
  const authPort: AuthPort = userApiAdapter;
  const userStorage: LocalStoragePort = localStorageAdapter;

  return {
    login: async (params) => {
      const result = await authPort.authenticate(params);
      if (isLoginFailure(result)) {
        throw new Error(result.reason);
      }

      const { userName, profileImageUrl } = result.data;
      userStorage.setUserName(userName);
      userStorage.setProfileImageUrl(profileImageUrl);

      return result;
    },
  };
};

const isLoginFailure = (result: AuthPortOutput): result is AuthPortFailure => {
  return result.ok === false;
};

export default loginService;
