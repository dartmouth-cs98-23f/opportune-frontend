import { Form } from "@remix-run/react";

interface Fields {
	proj_name: string;
	proj_id: string;
	mode: string;
}

export default function ProjElem(props:Fields) {
  return (
	<div>
		<Form method="post" action="/team/project">
		    <label> {props.proj_name} </label>
			{props.mode === "Team" ?
			<button className="edit-clear" name="_action" value="DeleteProj"> ❌ </button>: null}
			<input type="hidden" name="_id" value={props.proj_id}/>
		</Form>
	</div>
  )
}
