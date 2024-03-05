import { Form } from "@remix-run/react";
import { useState } from "react";

interface Fields {
	classLabel: string;
	start: Date;
	end: Date;
	minDate: Date;
	maxDate: Date;
	task: string;
	taskID: string;
	descrip: string;
	progress: number;
	date: string;
	updates: string[];
	assignedTo: string[];
	route: string;
}

export default function TaskBubble(props:Fields) {
	const [expand, setExpand] = useState(false);
	const [isEditing, setEditing] = useState(false);
	const [update, setUpdate] = useState('');

	const totDiff = calcDayDiff(props.minDate, props.maxDate)
	const startScaled = (calcDayDiff(props.minDate, props.start) / totDiff) * 5
	const endScaled = (calcDayDiff(props.minDate, props.end) / totDiff) * 5
	
	const handleExpand = () => {
		setExpand(!expand)
	}

	const handleEditClick = () => {
		setEditing(!isEditing);
	}

	const handleUpdate = (text:string) => {
		setUpdate(text)
	}

	function calcDayDiff(date1:Date, date2:Date) {
		return (date2 - date1) / (1000 * 60 * 60 * 24)
	}
	
	if (props.progress < 0) {
		if (!expand) {
			return (
				<div className={props.classLabel} style={{width: `${(endScaled - startScaled) * 20}%`, 
															 marginLeft: `calc(${startScaled * 20}% + 10px)`}}> 
				  <b> {props.task} </b> 
				  <span className="task-desc-toggle" onClick={() => handleExpand()}>⬇</span>
				</div>
			)
		} else {
			return (
				<Form action={props.route} 
				      method="post" onSubmit={() => handleEditClick()}>
				<div className={props.classLabel} style={{width: `calc(${(endScaled - startScaled) * 20}%)`, marginLeft: `calc(${startScaled * 20}% + 10px)`}}> 
				  <b> {props.task} </b> 
				  <span className="task-desc-toggle" onClick={() => handleExpand()}>⬆</span>
				  {props.route === "/newhire/project" ? <p> <b> Assigned To: </b> {props.assignedTo.join(', ')} </p> : null}
				  <p> <b> Description: </b> {props.descrip} </p>
				  <p> <b> Last Updates: </b> {props.updates.map(update  => {
					return <li> {update} </li>
				  })} </p>
				  
				  {(props.route === "/newhire/project") && !isEditing ? 
				    <button type="button" className="edit" 
							onClick={() => handleEditClick()}> + Update </button> : null}
				  
				  {props.route === "/team/project" ? 
				    <button className="edit" name="_action" value="DeleteTask"> - Delete </button> : null}
				  
				  {!isEditing ? null :<div> 
					 <textarea name="description" id="task-input"
					 onChange={(e) => handleUpdate(e.target.value)} /> 
					</div>}
				 
				  {isEditing ? <div>
						<button className="edit" name="_action" value="AddUpdate"> Confirm </button>
						<button type="button" className="edit" 
						 onClick={() => handleEditClick()}> Cancel </button> 
					</div> : null}
				   <input type="hidden" name="_id" defaultValue={props.taskID}/>
				   <input type="hidden" name="updates" defaultValue={JSON.stringify(props.updates)}/>
				</div>
				</Form>
			)
		}
	} else {
		const totDiff = calcDayDiff(props.minDate, props.maxDate)
		const startScaled = (calcDayDiff(props.minDate, props.start) / totDiff) * 5
		const endScaled = (calcDayDiff(props.minDate, props.end) / totDiff) * 5

		return (
			<div className={props.classLabel} style={{width: `${(endScaled - startScaled) * 20}%`, 
													  marginLeft: `calc(${startScaled * 20}% + 10px)`}}> 
			 	<div className="proj-progress-txt">
					<b> {props.task} </b> ({Math.round(props.progress * 100)}%)
				</div>
				<div className="progress-container">
					<div id="progress" style={{width: `${props.progress * 100}%`}}></div>
				</div>
			</div>
		)
	}
}
