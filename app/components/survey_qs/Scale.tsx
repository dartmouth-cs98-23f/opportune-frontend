import styles from '~/styles/home.css';
import { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from '@remix-run/react'

interface Question {
	question: string;
} 

let scores = [1, 2, 3, 4, 5]

export default function Scale(props:Question) {
  const [active, setActive] = useState<number>(0)
  function handleBubbleClick(new_score: number) {
	setActive(new_score);
  }
  
  return (
	<motion.div initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.4 }}>
		<p>{props.question}</p>
		<div>
			<ul className='option-list'>
				{scores.map((score) => {
					return <li className="option-bubble" key={score}>
					<button
						onClick={() => handleBubbleClick(score)}
						className={active === score ? "active" : ""}> {score}
					</button>
					</li>
				})}
			</ul>
		</div>
	</motion.div>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}