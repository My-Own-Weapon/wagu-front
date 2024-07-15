import Image from 'next/image';

import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';

import s from './LiveFriendsList.module.scss';

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
      {liveFriends.length > 0 ? (
        <ul className={s.friends}>
          {liveFriends.map(({ memberId, username, memberImageUrl }) => (
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
      ) : (
        <Cat />
      )}
    </div>
  );
}

function Cat() {
  return (
    <pre
      className={s.catAnimation}
      style={{
        margin: 0,
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        lineHeight: '1',
      }}
    >
      {' '}
      /\_/\
      <br />( 8.8 )<br /> &gt; ^ &lt;
    </pre>
  );
}
