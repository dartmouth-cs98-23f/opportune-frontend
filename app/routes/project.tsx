import { Link } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Project() {
	const matched = true;
	const upcomingTasks = ["Create User Profile", "Create Shop Profile", "Link Account Password Flag"]
	const completedTasks = ["Gather User Names", "Create a Back Endpoint"]

	if (!matched) {
		return (
			<div className="flex-container">
				<div id="sidebar">
					<img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
					<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
				</div>
				<div id="content">
					<h2> Welcome Oppenheim </h2>
					<div id="menubar">
						<MainNavigation />
					</div>
					<div>
						<p>You will be able to see your project details after you are matched on July 2.</p>
						<p className="cta"> <Link to="/results">Back to Results </Link></p>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div className="flex-container">
				<div id="sidebar">
					<img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
					<p className="text-logo">Opportune</p>
					<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
				</div>
				<div id="content">
					<h2> Welcome Oppenheim </h2>
					<div className="team-box task-list">
						Stephen +
					</div>
					<div className="team-box task-list">
						<h3> Upcoming Tasks: {upcomingTasks.length} Incomplete </h3>
						{upcomingTasks.map((task, i) => {
							return (<div className="check-field" key={i}>
								<input type="checkbox" id={`checkbox_u${i + 1}`} name="checkboxGroup" />
								<label htmlFor={`checkbox${i + 1}`}>{task}</label>
						  	</div>)
						})}
					</div>
					<div className="team-box task-list">
						<h3> Completed Tasks: {completedTasks.length} Complete </h3>
						{completedTasks.map((task, i) => {
							return (<div className="check-field" key={i}>
								<input type="checkbox" id={`checkbox_c${i + 1}`} name="checkboxGroup" checked/>
								<label htmlFor={`checkbox${i + 1}`}>{task}</label>
						  	</div>)
						})}
					</div>
				</div>
			</div>
		)
	}
	
}
