import Link from 'next/link';

import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';

import s from './LiveFriendsList.module.scss';

export interface Friend {
  profileImage: string;
  sessionId: string;
  userName: string;
  address: string;
  storeName: string;
}

export default function LiveFriends({
  liveFriends,
}: {
  liveFriends: Friend[];
}) {
  const UserIconWithText = WithText<UserIconProps>(UserIcon);

  return (
    <div className={s.container}>
      <div className={s.titleArea}>
        <p className={s.title}>
          {liveFriends.length > 0
            ? '방송중인 친구가 있어요 !'
            : '방송중인 친구가 없어요...'}
        </p>
      </div>
      {liveFriends.length > 0 ? (
        <ul className={s.friends}>
          {liveFriends.map(({ profileImage, sessionId, userName }) => (
            <Link href={`/live/${sessionId}`} key={sessionId}>
              <li>
                <UserIconWithText
                  width={48}
                  height={48}
                  shape="circle"
                  size="small"
                  imgSrc={
                    !!profileImage
                      ? profileImage
                      : '/profile/profile-default-icon-female.svg'
                  }
                  alt="profile-icon"
                >
                  {userName}
                </UserIconWithText>
              </li>
            </Link>
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
