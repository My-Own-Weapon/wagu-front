import Link from 'next/link';

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
  storeName?: string;
}

export default function LiveFriends({ storeName = '', liveFriends }: Props) {
  const path = usePathname();
  const UserIconWithText = WithText<UserIconProps>(UserIcon);

  return (
    <div className={s.container}>
      <div className={s.titleArea}>
        <p
          className={s.title}
          style={{
            color:
              path.includes('/map') || path.includes('/share')
                ? '#2E2E37'
                : '#fff',
          }}
        >
          {liveFriends.length > 0
            ? `${storeName && `${storeName}에서 `}방송중인 친구가 있어요 !`
            : `${storeName && `${storeName}에서 `}방송중인 친구가 없어요...`}
        </p>
      </div>
      {liveFriends.length > 0 ? (
        <ul className={s.friendsWrapper}>
          {liveFriends.map(({ profileImage, sessionId, userName }) => (
            <Link href={`/live/${sessionId}`} key={sessionId}>
              <li>
                <UserIconWithText
                  shape="circle"
                  size="large"
                  fontSize="large"
                  color="black"
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
