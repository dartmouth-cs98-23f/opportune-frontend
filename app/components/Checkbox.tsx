interface Fields {
	task: string;
	classLabel: string;
	checked: boolean;
	id: number;
	key: number;
	onToggle: Function;
	onRemove: Function;
}

export default function Checkbox(props:Fields) {
  return (
	<div className={`check-field ${props.checked ? 'checked': ''}`} key={props.key}>
		<input type="checkbox" id={String(props.id)} name="checkboxGroup" 
		     onClick={() => props.onToggle(props.id)} defaultChecked={props.checked} />
		<label htmlFor={String(props.key)}>{props.task}</label>
		<button className="edit-clear" onClick={() => props.onRemove(props.id)}> ❌ </button>
	</div>
  )
}
