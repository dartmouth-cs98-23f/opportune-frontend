import { Form, Link } from "@remix-run/react";
import { useState } from "react";

interface Field {
	route: string;
	skipLabel: string;
}

export default function TRDropdown(props:Field) {
  const [trToggle, setTrToggle] = useState(false);
  const handleTrToggle = () => {
	  setTrToggle(!trToggle);
  }
  
  return (
	<span>
		{trToggle ? <button type="button" className="tr-button"
										onClick={() => handleTrToggle()}> ⬆ </button> :
					<button type="button" className="tr-button"
										onClick={() => handleTrToggle()}> ⬇ </button>}
		
		{trToggle ? 
			<Form className="tr-form" action={props.route} method="post">
				<Link className="profile-button" to={`/newhire/${props.skipLabel.toLowerCase()}`}> 
					{props.skipLabel} 
				</Link>
				<Link className="profile-button" to="/newhire/project"> Settings </Link>
				<button className="logout-button" name="_action" value="LogOut">
					Log out
				</button>
			</Form> : null}
	</span>
  )
}
								