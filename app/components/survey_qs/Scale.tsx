import styles from '~/styles/home.css';
import { useEffect, useState } from 'react';
import { Slider } from '@mui/material';
// import { motion } from "framer-motion";
import { Link } from '@remix-run/react'

interface Question {
	question: string;
	existingSkills: {name: string; score: number}[];
} 

const marks = [
	{ value: 1, label: '1' },
	{ value: 2, label: '2' },
	{ value: 3, label: '3' },
	{ value: 4, label: '4' },
	{ value: 5, label: '5' }
];

export default function Scale(props:Question) {
  // get skill score if user submitted before
  const skill = props.question.trim().split(" ").pop().replace("?", "");
  const skillIdx = props.existingSkills.findIndex(s => s.name === skill);
  const savedScore = (skillIdx !== -1 ? props.existingSkills[skillIdx].score: 1);

  // score state
  const [score, setScore] = useState(savedScore);
  function handleChange(new_score: any) {
	setScore(new_score);
  }

  // update saved score when tech stack changes
  useEffect(() => {
	setScore(savedScore);
  }, [skill])
  
  // component
  return (
	<div className="scale-container">
		<p>{props.question}</p>
		<div className="slider">
			<Slider size="medium" value={score} min={1} max={5}
			step={1} marks={marks} aria-label="Small" valueLabelDisplay="off" 
			sx={{ width: '60%' }} onChange={(e, val) => handleChange(val)}/>
			<input type="hidden" name={skill} value={score}></input>
		</div>
	</div>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}