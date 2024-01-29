import { useEffect } from 'react';

function Modal({ open, children, onClose, title }) {
  
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
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close icon */}
        <div>{title}</div>
        <button className="right" onClick={onClose}>&times;</button>

        {children}
      </div>
    </div>
  )
}

export default Modal;