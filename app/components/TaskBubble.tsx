interface Fields {
	classLabel: string;
	start: number;
	end: number;
	task: string;
}

export default function TaskBubble(props:Fields) {
	return (
		<div className={props.classLabel} style={{width: `${(props.end - props.start) * 20}%`, 
													 marginLeft: `calc(${(props.start - 1) * 20}% + 10px)`}}> 
		  {props.task}
		</div>
	)
  }