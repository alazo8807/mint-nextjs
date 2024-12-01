'use client'

type SyncBtnProps = {
  isSynching: boolean;
  onSync: () => void;
};

const SyncBtn = ({ isSynching, onSync }: SyncBtnProps) => {
  return (
    <button 
      className={`btn mb-6 ${isSynching ? '' : 'btn-neutral'}`} 
      onClick={onSync}
      disabled={isSynching}
    >
      {isSynching ? (
        <>
          <span className="loading loading-spinner"></span> Synchronizing
        </>
      ) : (
        'Check for update'
      )}
    </button>
  );
};

export default SyncBtn;