'use client';

import Link from 'next/link';

import { COLORS } from '@/components/ui/_contants';
import { UserIcon, UserIconProps, WithText } from '@/components/UserIcon';
import { usePathname } from 'next/navigation';

import s from './LiveFriendsList.module.scss';

export interface Friend {
  profileImage: string;
  sessionId: string;
  userName: string;
  address: string;
  storeName: string;
}

interface Props {
  liveFriends: Friend[];
}

export default function LiveFriends({ liveFriends }: Props) {
  const UserIconWithText = WithText<UserIconProps>(UserIcon);
  const path = usePathname();

  return (
    <div className={s.container}>
      {liveFriends.length > 0 ? (
        <ul className={s.friendsWrapper}>
          {liveFriends.map(({ profileImage, sessionId, userName }) => (
            <Link href={`/live/${sessionId}`} key={sessionId}>
              <li>
                <UserIconWithText
                  shape="circle"
                  size="large"
                  fontSize="large"
                  color={path === '/' ? 'white' : 'black'}
                  border={`1.5px solid ${COLORS.PRIMARY_ORANGE}`}
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
      ) : null}
    </div>
  );
}

// function Cat() {
//   return (
//     <pre
//       className={s.catAnimation}
//       style={{
//         margin: 0,
//         fontFamily: 'monospace',
//         whiteSpace: 'pre',
//         lineHeight: '1',
//       }}
//     >
//       {' '}
//       /\_/\
//       <br />( 8.8 )<br /> &gt; ^ &lt;
//     </pre>
//   );
// }
