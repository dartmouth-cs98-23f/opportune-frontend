import { Link } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import Checkbox from '~/components/Checkbox';
import TaskBubble from '~/components/TaskBubble';

const matched = true;

const projList = [{name: "Authorization", start: 1, end: 4},
				  {name: "UI/UX", start: 4, end: 5}]
const taskList = [{id: 1, name: "Create User Profile", complete: false, project: "Authorization"}, 
			      {id: 2, name: "Create Shop Profile", complete: false, project: "Authorization"},
			      {id: 3, name: "Link Account Password Flag", complete: false, project: "Authorization"},
				  {id: 4, name: "Pick Logo Colors", complete: false, project: "UI/UX"}]

export default function Project() {
	const [isEditing, setEditing] = useState(false);
	const [tasks, setTasks] = useState(taskList);
	const [task, setTask] = useState('');

	function handleEditClick() {
		setEditing(!isEditing);
	}

	function handleTaskAdd(task: {id: number, name:string, complete:boolean, project:string}) {
		if (task.name) {
			setTasks([...tasks, task]);
		setTask('');
		setEditing(!isEditing);
	}}

	function updateTask(task:string) {
		setTask(task);
	}

	function handleToggle(taskId: number) {
		console.log(tasks);
		const modTasks = tasks.map((task) => 
			task.id === taskId ? { ...task, complete: !task.complete } : task
		)
		setTasks(modTasks);
		console.log(tasks);
	};

	function handleRemove(taskId: number) {
		console.log(tasks);
		const modTasks = tasks.filter((task) => task.id !== taskId)
		setTasks(modTasks);
		console.log(tasks);
	}

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
					<img className="opportune-logo-small disable-select" 
					     src="opportune_newlogo.svg" draggable={false}></img>
					<p className="text-logo disable-select">Opportune</p>
					<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
				</div>
				<div id="sidebar-2">
					<h3> Timeline: Stephen 
						<div id="date-bar">
							<button id="time-scale"> Today ↓</button>
							<button id="curr-date"> Feb 1, 2024 </button>
						</div>
					</h3>
				</div>
				<div className="horiz-flex-container">
					<div id="pm-content">
						<div className="team-box task-list">
							Stephen
						</div>
						<div className="team-box task-list">
							<h3> Upcoming Tasks ({tasks.filter((task) => !task.complete).length}) 
								{!isEditing ? <button type="button" className="edit" 
									onClick={handleEditClick}> + </button> : null}
							</h3>
							{!isEditing ? null :<div>  
								<textarea name="description" id="task-input" 
								onChange={(e) => updateTask(e.target.value)}/>
							</div>}
							{isEditing ? <div>
								<button className="edit" onClick={() => handleTaskAdd(
								  {id: tasks.length + 1, name: task, complete: false, project: "Authorization"})}>
								  Confirm
								</button>
								<button className="edit" onClick={() => handleEditClick()}>
									Cancel
								</button> </div>: null}
							{tasks.filter((task) => !task.complete).map((task, i) => {
								return <Checkbox task={task.name} classLabel="check-field"
								                 checked={task.complete} onToggle={handleToggle} onRemove={handleRemove}
												 id={task.id} />
							})}
						</div>
						<div className="team-box task-list">
							<h3> Completed Tasks ({tasks.filter((task) => task.complete).length}) </h3>
							{tasks.filter((task) => task.complete).map((task, i) => {
								return <Checkbox task={task.name} classLabel="check-field"
									             checked={task.complete} onToggle={handleToggle} onRemove={handleRemove}
												 id={task.id} key={task.id}/>
							})}
						</div>
						<div className="div-line"></div>
					</div>
					<div id="timeline">
						<div className="horiz-flex-container time">
							<div className="time-markers"> 1 </div>
							<div className="time-markers"> 2 </div>
							<div className="time-markers"> 3 </div>
							<div className="time-markers"> 4 </div>
							<div className="time-markers"> 5 </div>
						</div>
						<div className="flex-container time">
							{projList.map((proj, i) => {
								return <div>
									<TaskBubble classLabel={'team-box task-list proj'}
									start={proj.start} end={proj.end} task={proj.name} />
									{tasks.filter((task) => task.project === proj.name).map((task, i) => {
										return <TaskBubble classLabel={!task.complete ? 'task-box' : 'task-box done'}
												start={proj.start} end={proj.end} task={task.name} />
									})}
								</div>
							})} 
						</div>
					</div>
				</div>
			</div>
		)
	}
}

/* Under TaskBubble, add the individual subtasks bubbles underneath */
