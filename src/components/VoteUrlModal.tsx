/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */

'use client';

import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

import s from './VoteUrlModal.module.scss';

interface VoteUrlModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  voteUrl: string;
}

export default function VoteUrlModal({
  isOpen,
  onRequestClose,
  voteUrl,
}: VoteUrlModalProps) {
  const router = useRouter();

  const handleShareMapUrlClick = (shareMapUrl: string) => {
    navigator.clipboard.writeText(shareMapUrl);
    console.log(shareMapUrl);
    router.push(shareMapUrl);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={s.modal}
      overlayClassName={s.overlay}
      /* ✅ TODO : `Modal.setAppElement(el)` 사용해서 리팩토링 (for 웹 접근성) */
      ariaHideApp={false}
    >
      <div className={s.modalContent}>
        <button className={s.closeButton} onClick={onRequestClose}>
          X
        </button>
        <h2>투표 Url이 생성되었어요!</h2>
        <p>아래의 Box를 클릭하면 자동으로 복사됩니다</p>
        <div
          className={s.urlBox}
          onClick={() => handleShareMapUrlClick(voteUrl)}
        >
          {voteUrl}
        </div>
        <button className={s.shareButton}>카카오톡으로 공유해보세요!</button>
      </div>
    </Modal>
  );
}
