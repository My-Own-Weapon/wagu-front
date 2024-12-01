'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { COLORS } from '@/components/ui/_contants';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { Flex, Heading, Spacing } from '@/components/ui';
import { useFetchOnLiveFollowingsAtStore } from '@/hooks/api';

interface Props {
  storeId: number;
  storeName: string;
}

const UserIconWithText = WithText<UserIconProps>(UserIcon);

export default function OnLiveFollowingsAtStore({ storeId, storeName }: Props) {
  const path = usePathname();
  const { onLiveFollowings } = useFetchOnLiveFollowingsAtStore(storeId);

  return (
    onLiveFollowings.length > 0 && (
      <>
        <Heading as="h3" fontSize="16px" fontWeight="bold" color="black">
          {storeName}에서 방송중이에요 !
        </Heading>
        <Spacing size={16} />
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
      </>
    )
  );
}
