import { Link } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import Checkbox from '~/components/Checkbox';

const matched = true;
const upcomingTasks = ["Create User Profile", "Create Shop Profile", "Link Account Password Flag"]
const completedTasks = ["Gather User Names", "Create a Back Endpoint"]
// new format : [{name: "Task 1", complete: false}]

export default function Project() {
	const [isEditing, setEditing] = useState(false);
	const [upcoming, setUpcoming] = useState(upcomingTasks);
	const [completed, setCompleted] = useState(completedTasks);
	const [task, setTask] = useState('');

	function handleEditClick() {
		setEditing(!isEditing);
	}

	function handleTaskAdd(task:string) {
		setUpcoming([...upcoming, task]);
		setTask('');
		setEditing(!isEditing);
	}

	function updateTask(task:string) {
		console.log(task);
		setTask(task);
	}

	function handleTaskComplete(task:string) {
		setCompleted([...completed, task]);
	}

	console.log(upcoming.length)

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
					<p className="text-logo disable-select">Opportune</p>
					<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
				</div>
				<div id="sidebar-2">
					<h3> Timeline: Stephen 
						<div id="date-bar">
							<button id="time-scale"> Today </button>
							<button id="curr-date"> Jan 30, 2024 </button>
						</div>
					</h3>
				</div>
				<div id="content">
					<div className="team-box task-list">
						Stephen
					</div>
					<div className="team-box task-list">
						<h3> Upcoming Tasks ({upcoming.length}) 
							{!isEditing ? <button type="button" className="edit" 
								onClick={handleEditClick}> + </button> : null}
						</h3>
						{!isEditing ? null :<div className="team-box">  
							<input name="description" id="textInput" 
							onChange={(e) => updateTask(e.target.value)}/>
							</div>}
						{isEditing ?
							<button className="edit" onClick={() => handleTaskAdd(task)}>
								Confirm
							</button> : null}
						{upcoming.map((task, i) => {
							return <Checkbox task={task} classLabel="check-field" checked={false} key={i} />
						})}
					</div>
					<div className="team-box task-list">
						<h3> Completed Tasks ({completed.length}) </h3>
						{completed.map((task, i) => {
							return <Checkbox task={task} classLabel="check-field" checked={true} key={i} />
						})}
					</div>
					<div className="div-line"></div>
				</div>
				
			</div>
		)
	}
	
}

/* setCheckboxStates((prevCheckboxStates) => ({
      ...prevCheckboxStates,
      [checkboxName]: !prevCheckboxStates[checkboxName],
    })); */
