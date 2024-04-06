import styles from '~/styles/home.css';
import { Link } from '@remix-run/react';
import Button from '~/components/Button';
// import { motion } from 'framer-motion';

interface Question {
	question: string;
} 

export default function Textbox(props:Question) {
  return (
	<div>
		<p>{props.question}</p>
		<div>
			<ul className='option-list'>
				<textarea className="text-q" rows={10}></textarea>
			</ul>
		</div>
	</div>
  )
}

// <button type="submit">Submit</button>
// <form onSubmit={handleSubmit}>


function links() {
	return [{ rel: 'stylesheet', href: styles }];
}