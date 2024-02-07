import { useState } from "react";

interface Fields {
	classLabel: string;
	start: number;
	end: number;
	task: string;
	descrip: string;
	progress: number;
	date: string;
	updates: {date:string, name:string}[];
}

export default function TaskBubble(props:Fields) {
	const [expand, setExpand] = useState(false);
	const [isEditing, setEditing] = useState(false);
	const [update, setUpdate] = useState('');
	const handleExpand = () => {
		setExpand(!expand)
	}

	const handleEditClick = () => {
		setEditing(!isEditing);
	}

	const handleUpdate = (text:string) => {
		setUpdate(text)
	}

	function handleUpdateAdd(update: {date: string, name:string}) {
		if (update.name) props.updates.push(update);
		setUpdate('');
		setEditing(!isEditing);
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
				  <p> <b> Last Updates: { props.updates.map(update  => {
					return <li> {update.date}: {update.name} </li>
				  })} </b> </p>
				  {!isEditing ? <button type="button" className="edit" 
									onClick={handleEditClick}> + Update </button> : null}
				  {!isEditing ? null :<div> 
					 <textarea name="description" id="task-input"
					 onChange={(e) => handleUpdate(e.target.value)} /> 
					</div>}
				  {isEditing ? <div>
								<button className="edit" 
								onClick={() => handleUpdateAdd({date: props.date, name: update})}> Confirm </button>
								<button className="edit" onClick={() => handleEditClick()}> Cancel </button> 
							   </div> : null}
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