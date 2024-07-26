/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */

'use client';

import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

import { KakaoLogoSVG, XSVG } from '@public/newDesign';
import Heading from '@/components/ui/Heading';
import ImageFill from '@/components/ui/ImageFill';

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
      <div className={s.modalWrapper}>
        <button className={s.closeButton} onClick={onRequestClose}>
          <XSVG />
        </button>
        <div className={s.contentArea}>
          <div className={s.titleArea}>
            <Heading
              as="h2"
              fontSize="20px"
              fontWeight="semiBold"
              color="black"
              title="투표 링크가 생성되었어요 !"
            />
            <p className={s.subTitle}>
              아래의 Box를 클릭하면 자동으로 복사됩니다
            </p>
          </div>
          <div
            className={s.urlBox}
            onClick={() => handleShareMapUrlClick(voteUrl)}
          >
            {voteUrl}
          </div>
          <ImageFill
            src="/newDesign/share_url_hand.svg"
            width="220px"
            height="220px"
            alt="share-url-hand-img"
          />
          <button className={s.shareButton}>
            <KakaoLogoSVG />
            <p className={s.shareText}>카카오톡으로 공유해보세요 !</p>
          </button>
        </div>
      </div>
    </Modal>
  );
}
