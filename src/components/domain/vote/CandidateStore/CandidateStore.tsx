import { MouseEventHandler } from 'react';
import { UserIcon } from '@/components/UserIcon';
import ViewModel from '@/feature/_lib/ViewModel';
import { Flex, Text } from '@/components/ui';
import { colors } from '@/constants/theme';

import s from './CandidateStore.module.scss';

export interface CandidateStoresViewModelImpl {
  getStoreName: () => string;
  getStoreId: () => number;
}

export default function CandidateStore({
  viewModel,
  onRemoveCandidateStore,
}: {
  viewModel: ViewModel & CandidateStoresViewModelImpl;
  onRemoveCandidateStore: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <li aria-label="후보 가게 카드">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{
          width: '100%',
          height: '56px',
          position: 'relative',
        }}
      >
        <Text color={colors.grayAsh800} fontWeight="medium" fontSize="medium">
          {viewModel.getStoreName()}
        </Text>
        <UserIcon
          size="small"
          shape="circle"
          imgSrc="/profile/profile-default-icon-male.svg"
          alt="profile-img"
        />
        <button
          data-testid="remove-candidate-store-button"
          className={s.removeBtn}
          type="button"
          data-store-id={viewModel.getStoreId()}
          onClick={onRemoveCandidateStore}
        />
      </Flex>
    </li>
  );
}
