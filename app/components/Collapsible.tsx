import { useState } from 'react';

export const Collapsible = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          style={{ marginLeft: '1rem' }}
          className={`collapsible ${isOpen ? 'open' : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};
