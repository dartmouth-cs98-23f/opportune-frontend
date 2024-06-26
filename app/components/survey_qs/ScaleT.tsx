import styles from '~/styles/home.css';
import { Slider } from '@mui/material';
import { useEffect, useState } from 'react';

interface Question {
	question: string;
	skill: string;
	existing: {name:string, score:number}[];
	labels: string[];
} 

export default function ScaleT(props:Question) {
  // define scores
  const marks = props.labels.map((label, i) => ({
	"value": i + 1,
	"label": label
  }));

  // get skill score if user submitted before
  const skillIdx = props.existing.findIndex(s => s.name === props.skill);
  const savedScore = (skillIdx !== -1 ? props.existing[skillIdx].score: 1);

  // score state
  const [score, setScore] = useState(savedScore);
  function handleChange(new_score: any) {
	setScore(new_score);
  }

  // update saved score when tech stack changes
  useEffect(() => {
	setScore(savedScore);
  }, [props.skill])
  
  return (
	<div className="scale-container">
		<p>{props.question}</p>
		<div className="slider">
			<Slider className="mui-slider" size="medium" value={score} min={1} max={marks.length}
			step={1} marks={marks} aria-label="Small" valueLabelDisplay="off" 
			sx={{ width: '60%' }} onChange={(e, val) => handleChange(val)}/>
			<input type="hidden" name={props.skill} value={score}></input>
		</div>
	</div>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}