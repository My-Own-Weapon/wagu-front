import { User } from '@/feature/user/domain/User';

export interface LoginUseCase {
  login: (params: LoginUseCaseInput) => Promise<LoginUseCaseOutput>;
}

export interface LoginUseCaseInput {
  userName: string;
  password: string;
}

export type LoginUseCaseOutput = LoginUseCaseSuccess | LoginUseCaseFailure;
export type LoginUseCaseSuccess = {
  ok: true;
  data: {
    userName: User['userName'];
    profileImageUrl: User['profileImageUrl'];
  };
};
export type LoginUseCaseFailure = {
  ok: false;
  reason: string;
  error?: Error;
};
