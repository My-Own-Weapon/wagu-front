import { MouseEventHandler } from 'react';
import { CandidateStoresViewModel } from '@/feature/vote/viewModels';
import { UserIcon } from '@/components/UserIcon';

import s from './CandidateStore.module.scss';

export default function CandidateStore({
  viewModel,
  onRemoveCandidateStore,
}: {
  viewModel: CandidateStoresViewModel;
  onRemoveCandidateStore: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <li className={s.votedStoreCardWrapper}>
      <p className={s.storeName}>{viewModel.getStoreName()}</p>
      <UserIcon
        size="small"
        shape="circle"
        imgSrc="/profile/profile-default-icon-male.svg"
        alt="profile-img"
      />
      <button
        className={s.removeBtn}
        type="button"
        data-store-id={viewModel.getStoreId()}
        onClick={onRemoveCandidateStore}
      >
        x
      </button>
    </li>
  );
}
