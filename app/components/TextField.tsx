interface Field {
	label: string;
	classLabel: string;
	value: any;
	type: string;
}

export default function TextField(props:Field) {
  return (
	<div className="field-container">
		<label htmlFor={props.classLabel}> {props.label} </label>
		<input name={props.classLabel} type={props.type} defaultValue={props.value} required />
	</div>
  )
}

// disable / edit form sections