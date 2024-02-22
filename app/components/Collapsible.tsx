import { useState } from 'react';

export const Collapsible = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible-container">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <div
        style={{ marginLeft: '1rem' }}
        className={`collapsible ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};
