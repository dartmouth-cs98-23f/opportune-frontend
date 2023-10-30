import styles from '~/styles/home.css';
import { useState } from 'react';
import { Slider } from '@mui/material';

// import { motion } from "framer-motion";
import { Link } from '@remix-run/react'

interface Question {
	question: string;
} 

const marks = [
	{ value: 1, label: '1' },
	{ value: 2, label: '2' },
	{ value: 3, label: '3' },
	{ value: 4, label: '4' },
	{ value: 5, label: '5' }
];

export default function Scale(props:Question) {
  const [active, setActive] = useState<number>(0)
  function handleBubbleClick(new_score: number) {
	setActive(new_score);
  }
  
  return (
	<div>
		<p>{props.question}</p>
		<div className="slider">
			<Slider size="medium" defaultValue={1} min={1} max={5}
			step={1} marks={marks} aria-label="Small" valueLabelDisplay="off" 
			sx={{ width: '60%' }} />
		</div>
	</div>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}