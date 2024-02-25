import { Form } from "@remix-run/react";
import { ChangeEvent, useState } from "react";

interface Field {
	label: string;
	header: string;
	newHires: any;
	teamInfo: any;
}

export default function AddProj(props:Field) {
	const [isEditing, setEditing] = useState(false);

	function handleEditClick() {
		setEditing(!isEditing);
	}

  return (
	<Form action="/tproject" method="post" onSubmit={() => handleEditClick()}>
	<div>
		<h3> {props.header}
		{!isEditing ? 
		 <button type="button" className="edit" onClick={() => handleEditClick()}> 
		 	{props.label}
		</button> : null} </h3>

		{!isEditing ? null : 
		<div className="create-proj-form">  
			<label htmlFor="proj-name"> Project Title </label>
			<input className="proj-form-field" id="proj-name" name="name" required />
			
			<label htmlFor="proj-start-date"> Start Date </label>
			<input type="date" className="proj-form-field" id="proj-start-date" name="start_date" required />
			
			<label htmlFor="proj-end-date"> End Date </label>
			<input type="date" className="proj-form-field" id="proj-end-date" name="end_date" required />
			
			<label htmlFor="proj-descrip"> Description </label>
			<textarea className="proj-form-field" id="proj-descrip" name="description" required/>

			<label htmlFor="proj-assignees"> Assigned To </label>
			<select className="proj-form-field" id="proj-assignees" name="assigned_newhire_ids">
				{props.newHires.new_hires.map((nh) => {
					return <option value={nh._id}> {nh.first_name} {nh.last_name} </option>
				})}
			</select>
			<input type="hidden" id="team-id" name="team_id" value={props.teamInfo.team._id} />
		</div> } 
		
		{isEditing ? <div>
			<button className="edit" name="_action" value="AddProj">
				Confirm
			</button>
			<button className="edit" onClick={() => handleEditClick()}>
				Cancel
			</button> </div>: null}
	</div>
	</Form>
  )
}
