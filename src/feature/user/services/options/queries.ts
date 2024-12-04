import { WithSelector } from '@/feature/_types';
import {
  ProfileDetailsSchema,
  userApiService,
} from '@/feature/user/services/api/userApiService';
import { UseQueryOptions } from '@tanstack/react-query';

export const userQueryOptions = {
  query: {
    fetchUserProfile: {
      queryKey: (userName: string) => ['fetchProfileWithoutFollow', userName],
      query: <TReturnData = ProfileDetailsSchema>({
        userName,
        selector,
      }: FetchUserProfileProps<TReturnData>) => {
        return {
          queryKey: userQueryOptions.query.fetchUserProfile.queryKey(userName),
          queryFn: () => userApiService.fetchProfileWithoutFollow(userName),
          staleTime: Infinity,
          select: selector,
        } satisfies UseQueryOptions<ProfileDetailsSchema, Error, TReturnData>;
      },
    },
  },
} as const;

interface FetchUserProfileProps<TReturnData>
  extends WithSelector<ProfileDetailsSchema, TReturnData> {
  userName: string;
}
