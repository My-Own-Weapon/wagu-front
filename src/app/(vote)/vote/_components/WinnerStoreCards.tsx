import { WinnerStoreCard } from '@/components/feature/vote';
import { useGetWinnerStores } from '@/feature/vote/applications/hooks';
import { Spacing } from '@/components/ui';
import { isLastIndex } from '@/utils';
import { Suspense } from 'react';
import { RTCSessionId } from '@/feature/_types';

export default function WinnerStoreCards({
  sessionId,
}: {
  sessionId: RTCSessionId;
}) {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <WinnerStoreCardList sessionId={sessionId} />
    </Suspense>
  );
}

function WinnerStoreCardList({ sessionId }: { sessionId: RTCSessionId }) {
  const { winnerStoresViewModels } = useGetWinnerStores(sessionId);

  return winnerStoresViewModels.map((viewModel, idx) => (
    <>
      <WinnerStoreCard key={viewModel.getStoreId()} viewModel={viewModel} />
      {!isLastIndex(winnerStoresViewModels, idx) && <Spacing size={16} />}
    </>
  ));
}
