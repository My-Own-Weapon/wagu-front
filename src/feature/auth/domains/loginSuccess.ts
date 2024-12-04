import { localStorageApi } from '@/services/localStorageApi';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface UserInfo {
  userName: string;
  imageUrl: string | null;
  imageId: number | null;
}
const loginSuccess = (userInfo: UserInfo, router: AppRouterInstance) => {
  localStorageApi.setUserName(userInfo.userName);
  localStorageApi.setProfileImage(
    userInfo.imageUrl ?? '/profile/profile-default-icon-male.svg',
  );
  router.push('/');
};

export default loginSuccess;
