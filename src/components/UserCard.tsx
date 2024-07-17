'use client';

import { useState } from 'react';
import classNames from 'classnames';

import ImageFill from '@/components/ui/ImageFill';

import s from './UserCard.module.scss';
import { useMutation } from '@tanstack/react-query';

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
  return (
    <div className={s.cardsContainer}>
      {users.length > 0 &&
        users.map((user) => <UserCard key={user.memberId} {...user} />)}
    </div>
  );
}

function UserCard({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  memberId,
  memberUsername,
  memberImage,
  to,
  from,
  isEach,
}: User) {
  const { url } = memberImage;

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
          <p className={s.userName}>{memberUsername}</p>
        </div>
        <FollowButton to={to} from={from} isEach={isEach} memberId={memberId} />
      </div>
    </li>
  );
}

type FollowButtonText = 'Follow' | 'Unfollow' | 'EachFollow';

function FollowButton({
  to,
  isEach,
  memberId,
}: Pick<User, 'to' | 'from' | 'isEach' | 'memberId'>) {
  const [isHover, setIsHover] = useState(false);
  const follow = useMutation(
    {mutationFn: () =>{},
    onMutate: async () => {},
    onError: () => {},
  }
  )

  const unfollow = useMutation((memberId: string) => {
    return fetch(`/api/unfollow/${memberId}`, {
      method: 'POST',
    });
  })


  
  
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

  const handleFollow = 

  return (
    <button
      data-member-id={memberId}
      type="button"
      className={btnClassName}
      onMouseEnter={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
      onClick={}
    >
      {text}
    </button>
  );
}
