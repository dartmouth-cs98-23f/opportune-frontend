import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface Fields {
	task: string;
	classLabel: string;
	checked: boolean;
	task_id: number;
	proj_name: string;
}

export default function Checkbox(props:Fields) {
  const fetcher = useFetcher();
  const [checked, setChecked] = useState(props.checked);

  const handleCheckChange = (e) => {
	const isChecked = e.target.checked
	// console.log("isChecked: ", isChecked)
	setChecked(isChecked);

    fetcher.submit(e.currentTarget.form, {
		method: "PATCH"
	});
  };
  
  return (
	<div className={`check-field ${checked ? 'checked': ''}`} key={props.task_id}>
		<fetcher.Form method="post" action="/project">
			<input type="checkbox" id={String(props.task_id)} checked={checked} 
			       onClick={(e) => handleCheckChange(e)} />
			<label htmlFor={String(props.task_id)}>{`${props.task} (${props.proj_name})`}</label>
			<input type="hidden" name="_action" value="ToggleComplete" />
			<input type="hidden" name="_id" value={props.task_id} />
			<input type="hidden" name="complete" value={String(checked)} />
		</fetcher.Form>
	</div>
  )
}

// onClick={() => props.onToggle(props.id)}
// onToggle: Function;