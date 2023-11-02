interface Fields {
	label: string;
	classLabel: string;
	options: Array<String>;
}

export default function SelectField(props:Fields) {
  return (
	<div className="field-container">
		<label htmlFor={props.classLabel}> {props.label} </label>
		<select id={props.classLabel} name={props.classLabel} required>
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
								