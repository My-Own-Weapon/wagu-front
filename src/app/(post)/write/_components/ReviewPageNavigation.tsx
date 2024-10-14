export interface Props {
  currentPageIdx: number;
  totalPageCount: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleDeleteAdditionalMenu: () => void;
}

export default function ReviewPageNavigation({
  currentPageIdx,
  totalPageCount,
  handlePrevPage,
  handleNextPage,
  handleDeleteAdditionalMenu,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {currentPageIdx > 0 && totalPageCount > 0 && (
        <button
          onClick={handlePrevPage}
          type="button"
          style={{
            position: 'absolute',
            left: '24px',
            width: '24px',
            height: '24px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          &lt;
        </button>
      )}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: '#fff',
          padding: '8px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 500,
        }}
      >
        <p>
          {currentPageIdx + 1} / {totalPageCount}
        </p>
      </div>
      {currentPageIdx < totalPageCount - 1 && (
        <button
          onClick={handleNextPage}
          type="button"
          style={{
            position: 'absolute',
            right: '24px',
            width: '24px',
            height: '24px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          &gt;
        </button>
      )}
      {totalPageCount > 1 && (
        <button
          onClick={handleDeleteAdditionalMenu}
          type="button"
          style={{
            position: 'absolute',
            bottom: '-48px',
            backgroundColor: 'transparent',
            color: '#ff0000',
            border: 'none',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          현재 메뉴 삭제
        </button>
      )}
    </div>
  );
}
