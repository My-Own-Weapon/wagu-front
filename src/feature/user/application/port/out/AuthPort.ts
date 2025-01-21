import { User } from '@/feature/user/domain/User';

export interface AuthPort {
  authenticate: (params: AuthPortInput) => Promise<AuthPortOutput>;
}

export interface AuthPortInput {
  userName: User['userName'];
  password: string;
}

export type AuthPortOutput = AuthPortSuccess | AuthPortFailure;
export type AuthPortSuccess = {
  ok: true;
  data: {
    userName: User['userName'];
    profileImageUrl: User['profileImageUrl'];
  };
};
export type AuthPortFailure = {
  ok: false;
  reason: string;
  error?: Error;
};
