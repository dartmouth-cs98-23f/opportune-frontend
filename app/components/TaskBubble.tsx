import { useState } from "react";

interface Fields {
	classLabel: string;
	start: number;
	end: number;
	task: string;
	descrip: string;
	progress: number;
}

export default function TaskBubble(props:Fields) {
	const [expand, setExpand] = useState(false);

	const handleExpand = () => {
		setExpand(!expand)
	}
	
	if (props.progress < 0) {
		if (!expand) {
			return (
				<div className={props.classLabel} style={{width: `${(props.end - props.start) * 20}%`, 
															 marginLeft: `calc(${(props.start - 1) * 20}% + 10px)`}}> 
				  <b> {props.task} </b> 
				  <span className="task-desc-toggle" onClick={() => handleExpand()}>⬇</span>
				</div>
			)
		} else {
			return (
				<div className={props.classLabel} style={{width: `calc(${(props.end - props.start) * 20}% + 60px)`, 
															 marginLeft: `calc(${(props.start - 1) * 20}% + 10px)`}}> 
				  <b> {props.task} </b> 
				  <span className="task-desc-toggle" onClick={() => handleExpand()}>⬆</span>
				  <p> <b> Assigned To: </b> Stephen </p>
				  <p> <b> Description: </b> {props.descrip} </p>
				  <p> <b> Last Updates: </b> </p>
				  <button type="button" className="edit"> + Update </button>
				</div>
			)
		}
		
	} else {
		return (
			<div className={props.classLabel} style={{width: `${(props.end - props.start) * 20}%`, 
													  marginLeft: `calc(${(props.start - 1) * 20}% + 10px)`}}> 
			  <b> {props.task} </b> ({Math.round(props.progress * 100)}%)
			  <div className="progress-container">
				<div id="progress" style={{width: `${props.progress * 100}%`}}></div>
			  </div>
			</div>
		)
	}
	
  }