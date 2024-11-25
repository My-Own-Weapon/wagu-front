import { NextImageWithCover, Spacing, Stack, Text } from '@/components/ui';
import Link from 'next/link';

import { colors } from '@/constants/theme';
import ViewModel from '@/feature/_lib/ViewModel';
import { WinnerStoreViewModelImpl } from './WinnerStoreCardImple';

interface WinnerStoreCardProps {
  viewModel: ViewModel & WinnerStoreViewModelImpl;
}

export default function WinnerStoreCard({ viewModel }: WinnerStoreCardProps) {
  return (
    <Link style={{ width: '100%' }} href={`/store/${viewModel.getStoreId()}`}>
      <Stack>
        <NextImageWithCover
          src={viewModel.getMainMenuImageUrl()}
          id={String(viewModel.getStoreId())}
          alt="vote-win-store-img"
          height="280px"
          borderRadius="24px"
        />
        <Spacing size={16} />
        <Stack>
          <Text fontWeight="bold" fontSize="large" color={colors.grayAsh900}>
            {viewModel.getStoreName()}
          </Text>
          <Spacing size={8} />
          <Text fontWeight="medium" fontSize="medium" color={colors.grayAsh800}>
            {viewModel.getMainMenuName()}
          </Text>
        </Stack>
      </Stack>
    </Link>
  );
}
