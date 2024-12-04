import { Dispatch, Fragment, SetStateAction, Suspense, useEffect } from 'react';

import { WinnerStoreCard } from '@/components/feature/vote';
import { useGetWinnerStores } from '@/feature/vote/applications/hooks';
import { Spacing } from '@/components/ui';
import { isLastIndex } from '@/utils';
import { RTCSessionId } from '@/feature/_types';

export default function WinnerStoreCards({
  sessionId,
  setVoteWinStore,
}: {
  sessionId: RTCSessionId;
  setVoteWinStore: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <WinnerStoreCardList
        sessionId={sessionId}
        setVoteWinStore={setVoteWinStore}
      />
    </Suspense>
  );
}

function WinnerStoreCardList({
  sessionId,
  setVoteWinStore,
}: {
  sessionId: RTCSessionId;
  setVoteWinStore: Dispatch<SetStateAction<string>>;
}) {
  const { winnerStoresViewModels } = useGetWinnerStores(sessionId);

  useEffect(() => {
    if (winnerStoresViewModels) {
      setVoteWinStore(winnerStoresViewModels[0]?.getStoreName() ?? '');
    }
  }, [winnerStoresViewModels, setVoteWinStore]);

  return winnerStoresViewModels.map((viewModel, idx) => (
    <Fragment key={viewModel.getStoreId()}>
      <WinnerStoreCard viewModel={viewModel} />
      {!isLastIndex(winnerStoresViewModels, idx) && <Spacing size={16} />}
    </Fragment>
  ));
}
