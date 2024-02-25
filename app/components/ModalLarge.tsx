import { useEffect } from 'react';

function ModalLarge({ open, children, onClose, title }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.keyCode === 27) {
        onClose();
      }
    }

    if (open) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-large">
        {/* Close icon */}
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h1>
        <button className="right" onClick={onClose}>
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}

export default ModalLarge;
