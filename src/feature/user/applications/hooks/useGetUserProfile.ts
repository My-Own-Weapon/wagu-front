import { useQuery } from '@tanstack/react-query';

import { userQueryOptions } from '@/feature/user/services/options/queries';

const useGetUserProfile = (userName: string) => {
  const { data } = useQuery(
    userQueryOptions.query.fetchUserProfile.query({
      userName,
      selector: (data) => {
        return {
          fullName: data.name,
          userName: data.username,
          profileImage: data.imageUrl ?? 'images/profile-default-icon-male.svg',
          userId: data.memberId,
        };
      },
    }),
  );

  return {
    userProfile: data ?? {
      fullName: '',
      userName: '',
      profileImage: '',
      userId: -1,
    },
  };
};

export default useGetUserProfile;
