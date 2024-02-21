import { useState } from 'react';

export const Collapsible = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`collapsible ${isOpen && 'open'}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && <div style={{ marginLeft: '1rem' }}>{children}</div>}
    </div>
  );
};
