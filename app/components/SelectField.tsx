interface Fields {
	label: string;
	classLabel: string;
	options: string[];
	value: any;
}

export default function SelectField(props:Fields) {
  return (
	<div className="field-container">
		<label htmlFor={props.classLabel}> {props.label} </label>
		<select name={props.classLabel} id={props.classLabel}  
		        defaultValue={props.value ? props.value: "init"} required>
			<option disabled value="init"> Select an Option </option>
			{props.options.map((option) => {
				return (
					<option value={option}>{option}</option>
				)
			})}
		</select>
	</div>
  )
}
								