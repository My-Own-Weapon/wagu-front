'use client';

import Link from 'next/link';

import { COLORS } from '@/components/ui/_contants';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { usePathname } from 'next/navigation';
import { Flex } from '@/components/ui';

export interface Friend {
  profileImage: string;
  sessionId: string;
  userName: string;
  address: string;
  storeName: string;
}

interface Props {
  onLiveFollowings: Friend[];
}

export default function OnLiveFollowings({ onLiveFollowings }: Props) {
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
