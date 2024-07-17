/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable react/function-component-definition */
import React from 'react';
import Modal from 'react-modal';
import s from './VoteUrlModal.module.scss';

interface VoteUrlModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  voteUrl: string;
}

const VoteUrlModal: React.FC<VoteUrlModalProps> = ({
  isOpen,
  onRequestClose,
  voteUrl,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={s.modal}
      overlayClassName={s.overlay}
    >
      <div className={s.modalContent}>
        <button className={s.closeButton} onClick={onRequestClose}>
          X
        </button>
        <h2>투표 Url이 생성되었어요!</h2>
        <p>아래의 Box를 클릭하면 자동으로 복사됩니다</p>
        <div
          className={s.urlBox}
          onClick={() => navigator.clipboard.writeText(voteUrl)}
        >
          {voteUrl}
        </div>
        <button className={s.shareButton}>카카오톡으로 공유해보세요!</button>
      </div>
    </Modal>
  );
};

export default VoteUrlModal;
