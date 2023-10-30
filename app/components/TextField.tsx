interface Field {
	label: string;
	classLabel: string;
}

export default function TextField(props:Field) {
  return (
	<div className="field-container">
		<label htmlFor={props.classLabel}> {props.label} </label>
		<input name={props.classLabel} type="text" />
	</div>
  )
}
