import { Form } from "@remix-run/react";
import { ChangeEvent, useState } from "react";

interface Field {
	label: string;
	header: string;
	projInfo: any;
	nh_id: string;
}

export default function AddTask(props:Field) {
	const [isEditing, setEditing] = useState(false);
	const [task, setTask] = useState('');
	const [currProj, setCurrProj] = useState(0);

	function handleEditClick() {
		setEditing(!isEditing);
	}

	function updateTask(task:string) {
		setTask(task);
	}

	function updateProj(event:any) {
		setCurrProj(event.target.selectedIndex);
	}

	/* function getProjName(task_proj_id:string) {
		const project = props.projInfo.find((p) => (p.project._id === task_proj_id));
		const projName = project ? project.project.name : null;
		return projName
	} */

  return (
	<Form action="/tproject" method="post" onSubmit={() => handleEditClick()}>
	<div>
		<h3> {props.header}
		{!isEditing ? 
		 <button type="button" className="edit" onClick={() => handleEditClick()}> 
		 	{props.label}
		</button> : null} </h3>

		{!isEditing ? null : <div className="task-name-bar">
			<textarea className="team-add-task" name="description" id="task-input" 
			 onChange={(e) => updateTask(e.target.value)}/>
		 </div>}
						
		{!isEditing ? null : <div className="proj-dropdown-div">
			Project: <select name="currProj" id="currProj" 
						className="proj-dropdown" defaultValue={currProj} 
						onChange={(e) => updateProj(e)}>
			<input name="projIdx" type="hidden" defaultValue={currProj}/>
			{props.projInfo.map(((proj) => {
				return <option value={proj.project.name}> {proj.project.name} </option>
			}))} </select>
		</div>}	

		{isEditing ? <div className="proj-task-confirm">
			<button className="edit" name="_action" value="AddTask">
				Confirm
			</button>
			<button className="edit" onClick={() => handleEditClick()}>
				Cancel
			</button> </div> : null}
		<input type="hidden" name="assigned_ids" 
		       defaultValue={JSON.stringify(props.projInfo[currProj].project.assigned_newhire_ids)}/>
		<input type="hidden" name="newhire_id" defaultValue={props.nh_id}/>
	</div>
	</Form>
  )
}

// disable / edit form sections{!isEditing ? null : <div className="task-name-bar">
												