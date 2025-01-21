import 'reflect-metadata';

import { container } from 'tsyringe';

import {
  AUTH_PORT_TOKEN,
  USER_STORAGE_PORT_TOKEN,
} from '@/feature/user/application/service/LoginService';
import LocalStorageAdapter from '@/feature/_shared/adapter/out/LocalStorageAdapterDI';
import { UserStoragePort } from '@/feature/_shared/applications/port/out/UserStoragePort';
import PostApiAdapter from '@/feature/post/adapter/out/PostApiAdapterDI';
import { FetchMyPostPort } from '@/feature/post/application/port/out/FetchMyPostPort';
import { FETCH_MY_POST_PORT_TOKEN } from '@/feature/post/application/service/GetMyPostsService';
import UserApiAdapter from '@/feature/user/adapter/out/UserApiAdapterDI';
import { AuthPort } from '@/feature/user/application/port/out/AuthPort';

/* -------------------------- Post -------------------------- */
container.register<FetchMyPostPort>(FETCH_MY_POST_PORT_TOKEN, {
  useClass: PostApiAdapter,
});

/* -------------------------- User -------------- ------------ */
container.register<AuthPort>(AUTH_PORT_TOKEN, {
  useClass: UserApiAdapter,
});
container.register<UserStoragePort>(USER_STORAGE_PORT_TOKEN, {
  useClass: LocalStorageAdapter,
});

export { container };
