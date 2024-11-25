import ProfileViewModel from '@/feature/auth/applications/viewModel/ProfileViewModel';
import { useFetchUserProfileApi } from '@/feature/auth/services/hooks';

interface Props {
  userName: string;
}

const useGetUserProfile = ({ userName }: Props) => {
  const { data, isSuccess } = useFetchUserProfileApi({
    userName,
  });

  if (!isSuccess) {
    return {
      profileViewModel: null,
    };
  }

  return {
    profileViewModel: new ProfileViewModel(data),
  };
};

export default useGetUserProfile;
