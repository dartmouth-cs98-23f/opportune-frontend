interface Fields {
	task: string;
	classLabel: string;
	checked: boolean;
	id: number;
	proj: string;
}

export default function Checkbox(props:Fields) {
  return (
	<div className={`check-field ${props.checked ? 'checked': ''}`} key={props.id}>
		<input type="checkbox" id={String(props.id)} name="checkboxGroup" 
		       defaultChecked={props.checked} />
		<label htmlFor={String(props.id)}>{`${props.task} (${props.proj})`}</label>
	</div>
  )
}

// onClick={() => props.onToggle(props.id)}
// onToggle: Function;