import { useState } from 'react';
import classNames from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NextImageWithCover } from '@/components/ui';
import { apiService } from '@/services/apiService';

import s from './UserCard.module.scss';

export interface User {
  memberId: number;
  memberUsername: string;
  memberImage: {
    id: string;
    url: string | null;
  };
  to: boolean;
  from: boolean;
  each: boolean;
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
  memberId,
  memberUsername,
  memberImage,
  to,
  from,
  each,
}: User) {
  const { url } = memberImage;
  const [saveFrom, setSaveFrom] = useState(from);

  return (
    <li className={s.container}>
      <div className={s.wrapper}>
        <div className={s.profileInfoArea}>
          <NextImageWithCover
            src={url ?? '/profile/profile-default-icon-female.svg'}
            alt="profile-img"
            height="80px"
            borderRadius="8px"
            backgroundColor="#aeaeae"
          />
          <p className={s.userName}>{memberUsername}</p>
        </div>
        <FollowButton
          saveFrom={saveFrom}
          to={to}
          from={from}
          each={each}
          memberId={memberId}
          setSaveFrom={setSaveFrom}
        />
      </div>
    </li>
  );
}

type FollowButtonText = 'Follow' | 'Unfollow' | 'EachFollow';

type FollowButtonProps = Pick<User, 'memberId' | 'to' | 'from' | 'each'> & {
  saveFrom: boolean;
  setSaveFrom: (from: boolean) => void;
};

function FollowButton({
  to,
  from,
  each,
  saveFrom,
  memberId,
  setSaveFrom: setLocalTo,
}: FollowButtonProps) {
  const queryClient = useQueryClient();
  const [isHover, setIsHover] = useState(false);

  const followMutation = useMutation({
    mutationFn: () => apiService.followUser(memberId),

    onMutate: async () => {
      // await queryClient.cancelQueries(['user', memberId]);
      const previousUser = queryClient.getQueryData(['user', memberId]);
      setLocalTo(true);
      queryClient.setQueryData(['user', memberId], (old: { from: string }) => ({
        ...old,
        from: true,
      }));

      return { previousUser };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['user', memberId], context?.previousUser);
      setLocalTo(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', memberId] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => apiService.unFollowUser(memberId),

    onMutate: async () => {
      // await queryClient.cancelQueries(['user', memberId]);
      const previousUser = queryClient.getQueryData(['user', memberId]);
      setLocalTo(false);
      queryClient.setQueryData(['user', memberId], (old: { from: string }) => ({
        ...old,
        from: false,
      }));

      return { previousUser };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['user', memberId], context?.previousUser);

      setLocalTo(true);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', memberId] });
    },
  });

  const handleClick = () => {
    console.log(`to : ${to}, from : ${from}`);

    if (saveFrom) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const btnClassName = classNames(s.followBtn, {
    [`${s.eachFollow}`]: (saveFrom && each) || (saveFrom && to),
    [`${s.follow}`]: !saveFrom,
    [`${s.unFollow}`]: saveFrom,
  });

  let text: FollowButtonText;

  if ((saveFrom && each) || (saveFrom && to)) {
    text = isHover ? 'Unfollow' : 'EachFollow';
  } else if (saveFrom) {
    text = 'Unfollow';
  } else {
    text = 'Follow';
  }

  return (
    <button
      type="button"
      className={btnClassName}
      data-member-id={memberId}
      onMouseEnter={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
