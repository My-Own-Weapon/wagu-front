import React, { Suspense } from 'react';

import { Spacing } from '@/components/ui';
import {
  useGetCandidateStores,
  useRemoveCandidateStore,
} from '@/feature/vote/applications/hooks';
import { CandidateStore } from '@/components/feature/vote';
import { RTCSessionId } from '@/feature/_types';
import { isLastIndex } from '@/utils';

export default function CandidateStores({
  sessionId,
}: {
  sessionId: RTCSessionId;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div data-testid="nominate-stores">
        <CandidateStoreList sessionId={sessionId} />
      </div>
    </Suspense>
  );
}

function CandidateStoreList({ sessionId }: { sessionId: RTCSessionId }) {
  const { candidateStoresViewModels } = useGetCandidateStores(sessionId);
  const { removeCandidateStore } = useRemoveCandidateStore({ sessionId });

  return candidateStoresViewModels.map((viewModel, idx) => (
    <React.Fragment key={viewModel.getStoreId()}>
      <CandidateStore
        viewModel={viewModel}
        onRemoveCandidateStore={() => {
          removeCandidateStore({ storeId: viewModel.getStoreId() });
        }}
      />
      {!isLastIndex(candidateStoresViewModels, idx) && <Spacing size={16} />}
    </React.Fragment>
  ));
}
