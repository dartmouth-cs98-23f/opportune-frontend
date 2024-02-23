import { useState } from 'react';
import { Link } from '@remix-run/react';

export default function ReadMore({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {text.siz}
      <p>
        {expanded ? text : `${text.substring(0, 100)}...`}
        {text.length > 100 && 
          <button className='read-more-btn' onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Read Less' : 'Read More'}  
          </button>
        }
      </p>
    </div>
  );
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}