import { useEffect, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Team {
	id: string;
	name: string;
	class: string;
}

export default function TeamCard(props:Team) {
  const {
	attributes,
	listeners, 
	setNodeRef,
	transform,
	transition
  } = useSortable({id: props.id})

  const style = {
	transform: CSS.Transform.toString(transform),
	transition
  }

  return (
	<div className={props.class} style={style} ref={setNodeRef} {...attributes} {...listeners}>
		<p id={props.id}>{props.name}</p>
	</div>
  )
}
