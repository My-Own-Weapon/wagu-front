import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';

import s from './LiveFriendsList.module.scss';
import Image from 'next/image';

export interface Friend {
  memberId: string;
  username: string;
  memberImageUrl: string | null;
  each: boolean;
  onLive: boolean;
}

export default function LiveFriends({
  liveFriends,
}: {
  liveFriends: Friend[];
}) {
  const UserIconWithText = WithText<UserIconProps>(UserIcon);

  return (
    <div className={s.container}>
      {liveFriends.length > 0 ? (
        <div className={s.titleArea}>
          <Image
            src="/images/emoji/tv.svg"
            width={20}
            height={20}
            alt="tv-icon"
          />
          <p className={s.title}>방송중인 친구가 있어요 !</p>
        </div>
      ) : (
        <div className={s.titleArea}>
          <Image
            src="/images/emoji/sad-face.svg"
            width={20}
            height={20}
            alt="tv-icon"
          />
          <p className={s.title}>방송중인 친구가 없어요...</p>
        </div>
      )}
      <ul className={s.friends}>
        {liveFriends.length > 0 &&
          liveFriends.map(({ memberId, username, memberImageUrl }) => (
            <li key={memberId}>
              <UserIconWithText
                width={40}
                height={40}
                shape="circle"
                size="small"
                imgSrc={
                  !!memberImageUrl
                    ? memberImageUrl
                    : '/profile/profile-default-icon-female.svg'
                }
                alt="profile-icon"
              >
                {username}
              </UserIconWithText>
            </li>
          ))}
      </ul>
    </div>
  );
}
