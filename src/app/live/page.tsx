'use client';

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-depth */

import React, { FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AddressSearchDetails } from '@/types';
import { apiService } from '@services/apiService';
import AddressInput from '@/components/AddressInput';

import s from './page.module.scss';

export default function PrepareStreamingPage() {
  const [storeInfo, setStoreInfo] = useState<AddressSearchDetails | null>(null);
  const router = useRouter();

  const joinSession: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!storeInfo) {
      alert('가게 정보를 입력해주세요');
      return;
    }

    const { sessionId } = await apiService.createSessionId(storeInfo);

    alert(sessionId);

    router.push(`/live/${sessionId}`);
  };

  return (
    <div
      className={s.entryPageContainer}
      style={{
        marginTop: '100px',
      }}
    >
      <div className={s.entryPageHeaderWrapper} id="join-dialog">
        <h1 className={s.title}> 스트리밍 방 참가 페이지 </h1>
        <AddressInput
          title="가게 이름"
          value={
            storeInfo ? `[${storeInfo?.storeName}] ${storeInfo?.address}` : ''
          }
          onSelect={setStoreInfo}
        />
        <form className={s.joinInfoWrapper} onSubmit={joinSession}>
          <input name="commit" type="submit" value="세션 참여 !!" />
        </form>
      </div>
    </div>
  );
}
