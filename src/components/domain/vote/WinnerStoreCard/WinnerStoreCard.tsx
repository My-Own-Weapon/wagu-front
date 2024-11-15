import { NextImageWithCover, Spacing, Stack, Text } from '@/components/ui';
import Link from 'next/link';

import { colors } from '@/constants/theme';

interface Props {
  storeId: number;
  storeName: string;
  menuImage: {
    url: string;
  };
  postCount: number;
  menuName: string;
}
export default function WinStoreCard({
  storeId,
  storeName,
  menuImage,
  postCount,
  menuName,
}: Props) {
  const { url } = menuImage;

  return (
    <Link style={{ width: '100%' }} href={`/store/${storeId}`}>
      <Stack>
        <NextImageWithCover
          src={url}
          id={String(storeId)}
          alt="vote-win-store-img"
          height="280px"
          borderRadius="24px"
        />
        <Spacing size={16} />
        <Stack>
          <Text fontWeight="bold" fontSize="large" color={colors.grayAsh900}>
            {storeName}
          </Text>
          <Spacing size={8} />
          <Text fontWeight="medium" fontSize="medium" color={colors.grayAsh800}>
            {menuName}
          </Text>
        </Stack>
      </Stack>
    </Link>
  );
}
