import { OnLiveFollowings } from '@/components/feature';
import { Flex, Heading, Spacing, Stack } from '@/components/ui';

import { Friend } from '@/types';

interface LiveFriendsSectionProps {
  liveFollowings: Friend[];
}

export default function LiveFollowingsSection({
  liveFollowings,
}: LiveFriendsSectionProps) {
  return (
    <Stack padding="0 24px">
      <Spacing size={16} />
      <Heading as="h3" color="white" fontSize="20px" fontWeight="semiBold">
        {liveFollowings.length > 0
          ? '방송중인 친구가 있어요 !'
          : '방송중인 친구가 없어요...'}
      </Heading>
      <Spacing size={20} />
      <Flex justifyContent="flex-start">
        <OnLiveFollowings onLiveFollowings={liveFollowings} />
      </Flex>
      <Spacing size={40} />
    </Stack>
  );
}
