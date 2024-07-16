import Image from 'next/image';
import s from './UserCard.module.scss';
import ImageFill from '@/components/ui/ImageFill';

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
        <div className={s.profileImgArea}>
          {/* <Image
            src={url ?? '/profile/profile-default-icon-female.svg'}
            alt="profile-img"
            width={80}
            height={80}
          /> */}
          <ImageFill
            src={url ?? '/profile/profile-default-icon-female.svg'}
            alt="profile-img"
            fill
            height="80px"
          />
        </div>
        <p>{memberUsername}</p>
        <FollowButton to={to} from={from} isEach={isEach} />
      </div>
    </li>
  );
}

function FollowButton({
  to,
  from,
  isEach,
}: Pick<User, 'to' | 'from' | 'isEach'>) {
  const text = to ? 'unfollow' : 'follow';

  return <button>follow</button>;
}
