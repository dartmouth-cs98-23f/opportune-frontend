import styles from '~/styles/home.css';
import { Slider } from '@mui/material';
import { useEffect, useState } from 'react';

interface Question {
	question: string;
	existingSkills: {name: string; score: number}[];
	labels: string[];
} 

export default function Scale(props:Question) {
  // define scores
  console.log(props.labels)
  const marks = props.labels.map((label, i) => ({
	"value": i + 1,
	"label": label
  }));

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
  
  return (
	<div className="scale-container">
		<p>{props.question}</p>
		<div className="slider">
			<Slider className="mui-slider" size="medium" value={score} min={1} max={marks.length}
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