interface Fields {
	task: string;
	classLabel: string;
	checked: boolean;
	id: number;
	onToggle: Function;
	onRemove: Function;
}

export default function Checkbox(props:Fields) {
  return (
	<div className={`check-field ${props.checked ? 'checked': ''}`} key={props.id}>
		<input type="checkbox" id={String(props.id)} name="checkboxGroup" 
		     onClick={() => props.onToggle(props.id)} defaultChecked={props.checked} />
		<label htmlFor={String(props.id)}>{props.task}</label>
		<button className="edit-clear" onClick={() => props.onRemove(props.id)}> ❌ </button>
	</div>
  )
}
