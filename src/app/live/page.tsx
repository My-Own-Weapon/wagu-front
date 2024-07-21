'use client';

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-depth */

import React, { FormEventHandler } from 'react';
import { apiService } from '@services/apiService';
import { useRouter } from 'next/navigation';

import s from './page.module.scss';

export default function PrepareStreamingPage() {
  const router = useRouter();

  const joinSession: FormEventHandler = async (e) => {
    e.preventDefault();

    const { sessionId } = await apiService.createSessionId();

    alert(sessionId);

    router.push(`/live/${sessionId}`);
  };

  return (
    <div>
      <div
        className={s.entryPageContainer}
        style={{
          marginTop: '100px',
        }}
      >
        <div className={s.entryPageHeaderWrapper} id="join-dialog">
          <h1 className={s.title}> 스트리밍 방 참가 페이지 </h1>
          <form className={s.joinInfoWrapper} onSubmit={joinSession}>
            <input name="commit" type="submit" value="세션 참여 !!" />
          </form>
        </div>
      </div>
    </div>
  );
}
