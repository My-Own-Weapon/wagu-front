import { NextImageWithCover, Spacing, Stack, Text } from '@/components/ui';
import Link from 'next/link';
import { formatDate } from '@/utils';
import { type Post } from '@/feature/post/domains/post';

import s from './PostCard.module.scss';

interface PostCardProps extends Post {
  priority?: boolean;
  alt?: string;
}
export default function PostCard({
  postId,
  store,
  menu,
  date,
  priority = false,
  alt = 'post-image',
}: PostCardProps) {
  if (!menu.image.url) return null;

  const formattedDate = formatDate(date.createdAt);

  return (
    <Stack as="li" className={s.cardContainer} data-id={postId}>
      <Link className={s.cardWrapper} href={`/posts/${postId}`}>
        <NextImageWithCover
          id={String(menu.image.id)}
          src={menu.image.url}
          height="240px"
          borderRadius="16px"
          priority={priority}
          alt={alt}
        />
        <Spacing size={16} />
        <Text
          as="p"
          fontSize="large"
          fontWeight="semiBold"
          color="#444444"
          style={STYLE.ellipsis}
        >
          {store.name}
        </Text>
        <Spacing size={8} />
        <Text
          as="p"
          fontSize="medium"
          fontWeight="medium"
          color="#767676"
          style={STYLE.ellipsis}
        >
          {menu.name}
        </Text>
        <Spacing size={8} />
        <Text
          as="p"
          style={STYLE.ellipsis}
          fontSize="small"
          fontWeight="regular"
          color="#767676"
        >
          {formattedDate}
        </Text>
      </Link>
    </Stack>
  );
}

export function PostCardSkeleton() {
  return (
    <Stack as="li" className={s.cardContainer}>
      <div className={s.cardWrapper}>
        <div className={s.imageSkeleton} />
        <Spacing size={16} />
        <div className={`${s.textSkeleton} ${s.large}`} />
        <Spacing size={8} />
        <div className={`${s.textSkeleton} ${s.medium}`} />
        <Spacing size={8} />
        <div className={`${s.textSkeleton} ${s.small}`} />
      </div>
    </Stack>
  );
}

const STYLE = {
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: '-0.03em',
    lineHeight: '150%',
  },
};
