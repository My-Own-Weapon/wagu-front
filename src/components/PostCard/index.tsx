import React from 'react';

import { NextImageWithCover, Spacing, Stack, Text } from '@/components/ui';
import { PostOfStoreResponse } from '@/types';
import Link from 'next/link';
import { formatDate } from '@/utils';

import s from './index.module.scss';

const ellipsisStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  letterSpacing: '-0.03em',
  lineHeight: '150%',
};

type Props = Pick<
  PostOfStoreResponse,
  'postId' | 'storeName' | 'menuImage' | 'postMainMenu' | 'createdDate'
> & {
  priority?: boolean;
  alt?: string;
};

export default function PostCard({
  postId,
  storeName,
  menuImage,
  postMainMenu,
  createdDate,
  priority = false,
  alt = 'post-image',
}: Props) {
  if (!menuImage) return null;

  const formattedDate = formatDate(createdDate);

  return (
    <Stack as="li" className={s.cardContainer} data-id={postId}>
      <Link className={s.cardWrapper} href={`/posts/${postId}`}>
        <NextImageWithCover
          id={menuImage.id}
          src={menuImage.url}
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
          style={ellipsisStyle}
        >
          {storeName}
        </Text>
        <Spacing size={8} />
        <Text
          as="p"
          fontSize="medium"
          fontWeight="medium"
          color="#767676"
          style={ellipsisStyle}
        >
          {postMainMenu}
        </Text>
        <Spacing size={8} />
        <Text
          as="p"
          fontSize="small"
          fontWeight="regular"
          color="#767676"
          style={ellipsisStyle}
        >
          {formattedDate}
        </Text>
      </Link>
    </Stack>
  );
}
