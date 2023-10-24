interface Percent {
	pct: number;
}

export default function Progress(props:Percent) {
	return <div className="progress-container">
		     <div id="progress" style={{width: `${props.pct}%`}}></div>
		   </div>;
}