import { localStorageApi } from '@/services/localStorageApi';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const loginSuccess = (userName: string, router: AppRouterInstance) => {
  localStorageApi.setUserName(userName);
  router.push('/');
};

export default loginSuccess;
