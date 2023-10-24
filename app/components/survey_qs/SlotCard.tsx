import { useState } from "react";
import { useDrop } from "react-dnd";

interface Slot {
	id: string;
	name: string;
	class: string;
}

export default function SlotCard(props:Slot) {
	// const [slots, setSlots] = useState(SlotList);
	return (
	<div className={props.class}>
		<p id={props.id}>{props.name}</p>
	</div>
	)
}


