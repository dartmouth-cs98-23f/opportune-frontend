interface Slot {
	id: string;
	name: string;
	class: string;
}

export default function SlotCard(props:Slot) {
	return (
	<div className={props.class}>
		<p id={props.id}>{props.name}</p>
	</div>
	)
}


