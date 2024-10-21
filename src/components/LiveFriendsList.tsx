'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { COLORS } from '@/components/ui/_contants';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { Flex } from '@/components/ui';
import { Friend } from '@/types';

interface Props {
  liveFriends: Friend[];
}

export default function OnLiveFollowings({
  liveFriends: onLiveFollowings,
}: Props) {
  const UserIconWithText = WithText<UserIconProps>(UserIcon);
  const path = usePathname();

  return (
    onLiveFollowings.length > 0 && (
      <ul aria-label="라이브 중인 팔로잉 목록">
        <Flex gap="12px" justifyContent="flex-start">
          {onLiveFollowings.map(({ profileImage, sessionId, userName }) => (
            <li key={sessionId}>
              <Link
                href={`/live/${sessionId}`}
                aria-label={`${userName}의 라이브 방송 보기`}
              >
                <UserIconWithText
                  shape="circle"
                  size="large"
                  fontSize="large"
                  color={path === '/' ? 'white' : 'black'}
                  border={`1.5px solid ${COLORS.PRIMARY_ORANGE}`}
                  imgSrc={
                    profileImage || '/profile/profile-default-icon-female.svg'
                  }
                  alt={`${userName}의 프로필 사진`}
                >
                  {userName}
                </UserIconWithText>
              </Link>
            </li>
          ))}
        </Flex>
      </ul>
    )
  );
}
