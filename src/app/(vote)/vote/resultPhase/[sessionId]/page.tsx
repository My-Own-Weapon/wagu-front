'use client';

import { useState } from 'react';

import { WinnerStoreCards } from '@/app/(vote)/vote/_components';
import { KingSVG } from '@public/newDesign/vote';
import { Heading } from '@/components/ui';

import s from './page.module.scss';

interface ResultPhaseProps {
  params: { sessionId: string };
}

export default function ResultPhase({ params }: ResultPhaseProps) {
  const { sessionId } = params;
  const [voteWinStore, setVoteWinStore] = useState<string>('');

  return (
    <div className={s.endVoteContainer}>
      <div className={s.top}>
        <div className={s.winningMsgArea}>
          <KingSVG />
          <Heading as="h3" color="white" fontSize="24px" fontWeight="medium">
            {`${voteWinStore}이 우승했어요 !`}
          </Heading>
        </div>
      </div>
      <div className={s.bottom}>
        <div className={s.endVoteWrapper}>
          <WinnerStoreCards
            sessionId={sessionId}
            setVoteWinStore={setVoteWinStore}
          />
        </div>
      </div>
    </div>
  );
}
