interface Fields {
	label: string;
	classLabel: string;
	options: Array<String>;
	value: any;
}

export default function SelectField(props:Fields) {
  return (
	<div className="field-container">
		<label htmlFor={props.classLabel}> {props.label} </label>
		<select id={props.classLabel} name={props.classLabel} defaultValue={props.value} required>
			<option disabled selected value> Select an Option </option>
			{props.options.map((option) => {
				return (
					<option value={option}>{option}</option>
				)
			})}
		</select>
	</div>
  )
}
								