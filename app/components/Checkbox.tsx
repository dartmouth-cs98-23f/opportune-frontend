import { useState } from "react";

interface Fields {
	task: string;
	classLabel: string;
	checked: boolean;
	key: number;
}

export default function Checkbox(props:Fields) {
  const [checked, setChecked] = useState(props.checked);

  const handleCheck = () => {
	setChecked(!checked)

	
  }

  return (
	<div className={`check-field ${checked ? 'checked': ''}`} key={props.key}>
		<input type="checkbox" id={`checkbox_u${props.key + 1}`} name="checkboxGroup" 
		       onClick={() => handleCheck()} />
		<label htmlFor={`checkbox${props.key + 1}`}>{props.task}</label>
	</div>
  )
}
