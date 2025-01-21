import type { UserStoragePort } from '@/feature/_shared/applications/port/out/UserStoragePort';
import {
  LoginUseCase,
  LoginUseCaseInput,
} from '@/feature/user/application/port/in/LoginUseCase';
import type {
  AuthPort,
  AuthPortOutput,
} from '@/feature/user/application/port/out/AuthPort';
import { singleton, inject } from 'tsyringe';

export const AUTH_PORT_TOKEN = Symbol('AuthPort');
export const USER_STORAGE_PORT_TOKEN = Symbol('UserStoragePort');

@singleton()
export default class LoginService implements LoginUseCase {
  private readonly authPort: AuthPort;
  private readonly userStoragePort: UserStoragePort;

  constructor(
    @inject(AUTH_PORT_TOKEN) authPort: AuthPort,
    @inject(USER_STORAGE_PORT_TOKEN) userStoragePort: UserStoragePort,
  ) {
    this.authPort = authPort;
    this.userStoragePort = userStoragePort;
  }

  async login(params: LoginUseCaseInput) {
    const result = await this.authPort.authenticate(params);
    if (!isLoginSuccess(result)) {
      throw new Error(result.reason);
    }

    const { userName, profileImageUrl } = result.data;
    this.userStoragePort.setUserName(userName);
    this.userStoragePort.setProfileImageUrl(profileImageUrl);

    return result;
  }
}

const isLoginSuccess = (result: AuthPortOutput) => {
  return result.ok === true;
};
