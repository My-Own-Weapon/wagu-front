import classNames from 'classnames';
import { useState } from 'react';

import ImageFill from '@/components/ui/ImageFill';

import s from './UserCard.module.scss';

export interface User {
  memberId: string;
  memberUsername: string;
  memberImage: {
    id: string;
    url: string | null;
  };
  to: boolean;
  from: boolean;
  isEach: boolean;
}

export default function UserCards({ users }: { users: User[] }) {
  // const { memberId, memberUsername, memberImage } = users;
  // const { id: imageId, url } = memberImage;

  return (
    <div className={s.cardsContainer}>
      {users.length > 0 &&
        users.map((user) => <UserCard key={user.memberId} {...user} />)}
    </div>
  );
}

function UserCard({
  memberId,
  memberUsername,
  memberImage,
  to,
  from,
  isEach,
}: User) {
  const { id: imageId, url } = memberImage;

  console.log(memberId, memberUsername, imageId, url);
  console.log(url);

  return (
    <li className={s.container}>
      <div className={s.wrapper}>
        <div className={s.profileInfoArea}>
          <ImageFill
            src={url ?? '/profile/profile-default-icon-female.svg'}
            alt="profile-img"
            fill
            height="80px"
            borderRadius="8px"
            backgroundColor="#aeaeae"
          />
          <p className={s.storeName}>{memberUsername}</p>
        </div>
        <FollowButton to={to} from={from} isEach={isEach} />
      </div>
    </li>
  );
}

type FollowButtonText = 'Follow' | 'Unfollow' | 'EachFollow';

function FollowButton({
  to,
  from,
  isEach,
}: Pick<User, 'to' | 'from' | 'isEach'>) {
  const [isHover, setIsHover] = useState(false);
  const btnClassName = classNames(s.followBtn, {
    [s.follow]: !to,
    [s.unFollow]: to,
    [s.eachFollow]: isEach,
  });
  let text: FollowButtonText;

  if (isEach) {
    text = isHover ? 'Unfollow' : 'EachFollow';
  } else if (to) {
    text = 'Unfollow';
  } else {
    text = 'Follow';
  }

  return (
    <button
      type="button"
      className={btnClassName}
      onMouseEnter={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
    >
      {text}
    </button>
  );
}
