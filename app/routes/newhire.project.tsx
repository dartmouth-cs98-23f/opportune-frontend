import { Form, Link, useLoaderData, useFetcher } from '@remix-run/react';
import { useState } from 'react';
import Checkbox from '~/components/Checkbox';
import TaskBubble from '~/components/TaskBubble';
import { json, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
import axios from 'axios';
import TRDropdown from '~/components/TRDropdown';

var matched = true; // check that company matching is complete
const createProjMode = false;

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);

	console.log("Auth: ", session.get("auth"));
	if (!session.get("auth")) {
		return redirect("/login")
	}

	const projRes = await axios.get(process.env.BACKEND_URL + '/api/v1/pm/newhire-view', {
		params: {
		  min_date: "2023-12-01",
		  max_date: "2024-02-01"
		},
		headers: {
		  "Authorization": session.get("auth"),
		  "Content-Type": "application/json"
	}}); 

	if (_action === "AddTask") {
		// construct subtask post request params
		if (projRes.data.length !== 0 && body.get("description")) {
			let myJson = {
				name: body.get("description"),
				project_id: projRes.data[body.get("projIdx")].project._id,
				start_date: projRes.data[body.get("projIdx")].project.start_date,
				end_date: projRes.data[body.get("projIdx")].project.end_date,
			};
			console.log("AddTask myJson: ", myJson);
			
			const response = await axios.post(process.env.BACKEND_URL + '/api/v1/pm/subtask', myJson, {
				headers: {
					"Authorization": session.get("auth"),
					"Content-Type": "application/json",
				},
			})
		}
	}

	if (_action === "AddUpdate") {
		const myJson = {};
		let update = "";
		for (const [key, value] of body.entries()) {
			if (key === "description") update = value;
			if (key === "_id") myJson["_id"] = value;
			if (key === "updates") {
				myJson[key] = JSON.parse(value);
				myJson[key].push(update);
			}
		}
		console.log("AddUpdate myJson: ", myJson)

		const response = await axios.patch(process.env.BACKEND_URL + '/api/v1/pm/subtask', myJson, {
			headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
			},
		})
	}

	if (_action === "DeleteTask") {
		let myJson = { _id: body.get("_id") };
		console.log("DeleteTask myJSON: ", myJson)

		// delete subtask given id
		const response = await axios.delete(process.env.BACKEND_URL + '/api/v1/pm/subtask', {
			headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
			}, data: { _id: myJson["_id"] }
		})
	}

	if (_action === "ToggleComplete") {
		let myJson = { 
			_id: body.get("_id"),
			complete: !(body.get("complete") === "true")
	 	};
		console.log("ToggleComplete myJSON: ", myJson)

		// toggle task completion status
		const response = await axios.patch(process.env.BACKEND_URL + '/api/v1/pm/subtask', myJson, {
			headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
			},
		})
	}

	if (_action === "LogOut") {
		return redirect("/login", {
			headers: {
				"Set-Cookie": await destroySession(session),
			},
		});
	}

	return redirect("/newhire/project");
}


export async function loader({request}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		console.log("Auth: ", session.get("auth"));
		if (!session.get("auth")) {
			return redirect("/login")
		}

		const profile = await axios.get(process.env.BACKEND_URL + '/api/v1/newhire/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
		}});

		console.log("Project user profile: ", profile.data.new_hire._id)
		console.log("Project Session Auth: ", session.get("auth"));

		const projRes = await axios.get(process.env.BACKEND_URL + '/api/v1/pm/newhire-view', {
			params: {
			  min_date: "2023-12-01",
			  max_date: "2024-02-01"
			},
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json"
		}});

		const companyRes = await axios.get(
			process.env.BACKEND_URL + "/api/v1/user/company-info",
			{
			  headers: {
				Authorization: session.get("auth"),
				"Content-Type": "application/json",
			  },
			}
		  );

		const nhRes = await axios.get(process.env.BACKEND_URL + '/api/v1/newhire/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json"
		}});


		return {
			projInfo: projRes.data,
			dates: projRes.config.params,
			profile: nhRes.data,
			company: companyRes.data
		};
	
	} catch (error) {
		console.log("Error in project loader: ", error);
		return null;
	}
};


export default function Project() {
	// load project info + start/end dates
	const { projInfo, dates, profile, company } = useLoaderData<typeof loader>();

	matched = company.company.matching_complete;
	
	console.log("Newhire project PROJINFO: ", projInfo);
	console.log("Newhire project PROFILE: ", profile);
	
	// build upcoming task lists
	const taskList = [];
	for (var i = 0; i < projInfo.length; ++i) {
		if (projInfo[i].subtasks.length > 0) {
			for (var j = 0; j < projInfo[i].subtasks.length; ++j) {
				taskList.push(projInfo[i].subtasks[j]);
			}
	  	}
	}

	console.log("Start - Loader ProjInfo: ", projInfo, dates);
	console.log("Start - TaskList: ", taskList);

	// states
	const [isEditing, setEditing] = useState(false);
	const [task, setTask] = useState('');
	const [currProj, setCurrProj] = useState(0);
	console.log("currProj: ", currProj);

	// create dates
	const createDate = (date: Date|string) => {
		const options = { month: '2-digit', day: '2-digit', year: '2-digit' };
		const formattedDate = new Date(date).toLocaleDateString('en-US', options);
		return formattedDate;
	}

	const today = createDate(new Date());
	const minDate = new Date(dates.min_date);
	const maxDate = new Date(dates.max_date);

	// todo and task bubble functions
	function handleEditClick() {
		setEditing(!isEditing);
		updateProj(0);
	}

	function updateTask(task:string) {
		setTask(task);
	}

	function updateProj(i:number) {
		setCurrProj(i);
	}

	function getProjName(task_proj_id:string) {
		const project = projInfo.find((p) => (p.project._id === task_proj_id));
		const projName = project ? project.project.name : null;
		return projName
	}

	function genDateArray(startDate:Date, endDate:Date, numElem=5) {
		const dateArray = [];
		const timeDifference = endDate.getTime() - startDate.getTime();
		const interval = timeDifference / (numElem - 1);
	  
		for (let i = 0; i < numElem; i++) {
		  const newDate = new Date(startDate.getTime() + i * interval);
		  dateArray.push(createDate(newDate));
		}

		return dateArray;
	}

	const navLabels = ["Profile", "Project", "Settings"]

	if (!matched) {
		return (
			<div className="flex-container">
				<div id="sidebar">
					<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
					<TRDropdown labels={navLabels} route="/newhire/project" userType="newhire" />
				</div>
				<div>
					<p className="unavailable-content">You will be able to see your project details after you are matched to a team.</p>
					<p className="cta"> <Link to="/newhire/results">Back to Results </Link></p>
				</div>
			</div>
		)
	} else {
		return (
			<div className="flex-container">
				<div id="sidebar">
					<img className="opportune-logo-small disable-select" 
					     src="../opportune_newlogo.svg" draggable={false}></img>
					<p className="text-logo disable-select"> Opportune </p>
					<TRDropdown labels={navLabels} route="/newhire/project" userType="newhire" />
				</div>
				<div id="sidebar-2">
					<h3> Timeline: {profile.new_hire.first_name} {profile.new_hire.last_name}
						<div id="date-bar">
							<button className="time-scale"> Today ↓</button>
							<button className="curr-date"> {today} </button>
						</div>
					</h3>
				</div>
				<div className="horiz-flex-container">
					<div id="pm-content">
						<div className="team-box task-list">
							<h3> Upcoming Tasks ({taskList.filter((task) => !task.complete).length}) 
								{!isEditing ? <button type="button" className="edit" 
									onClick={handleEditClick}> + </button> : null}
							</h3>

							<Form action="/newhire/project" method="post" onSubmit={() => handleEditClick()}>
							{!isEditing ? null :<div>  
								<textarea name="description" id="task-input" 
								onChange={(e) => updateTask(e.target.value)}/>

								Project: <select name="currProj" id="currProj" 
							          className="proj-dropdown" defaultValue={currProj} 
									  onChange={(e) => updateProj(e.target.selectedIndex)}>
								      <input name="projIdx" type="hidden" defaultValue={currProj}/>
								
								{projInfo.map(((proj: {project: any, subtasks: []}, i:number) => {
									return <option value={proj.project.name}> {proj.project.name} </option>
								}))} </select>
							</div>}
							{isEditing ? <div>
								<button className="edit" name="_action" value="AddTask">
								  Confirm
								</button>
								<button className="edit" onClick={() => handleEditClick()}>
								  Cancel
								</button> </div>: null}
							</Form>

							{taskList.filter((task) => !task.complete).map((task, i) => {
								return <Form method="post" action="/newhire/project"> 
								         <Checkbox task={task.name} classLabel="check-field"
								                 checked={task.complete} task_id={task._id} key={task._id} 
												 proj_name={getProjName(task.project_id)}
												 route="/newhire/project" />
										 <input name="_id" type="hidden" value={task._id}/>
										 <input name="complete" type="hidden" value={task.complete}/>
									   </Form>
							})}
						</div>
						<div className="team-box task-list">
							<h3> Completed Tasks ({taskList.filter((task) => task.complete).length}) </h3>
							{taskList.filter((task) => task.complete).map((task, i) => {
								return <Form method="post" action="/newhire/project"> 
									      <Checkbox task={task.name} classLabel="check-field"
									             checked={task.complete} task_id={task._id} key={task._id}
												 proj_name={getProjName(task.project_id)}
												 route="/newhire/project" />
										  <input name="_id" type="hidden" value={task._id}/>
										  <input name="complete" type="hidden" value={task.complete}/>
									   </Form>
							})}
						</div>
						<div className="div-line"></div>
					</div>
					<div id="timeline">
						<div className="horiz-flex-container time">
							{genDateArray(minDate, maxDate).map((time:string, i) => (
								<div key={i} className="time-markers">{ createDate(time) }</div>
							))}
						</div>
						<div className="horiz-flex-container time">
							{genDateArray(minDate, maxDate).map((time:string, i) => (
								<div key={i} className="time-markers">{ "-" }</div>
							))}
						</div>
						<div className="flex-container time">
							{projInfo.map((proj: {project: any, subtasks: []}, i:number) => {
								return <div key={i}>
									<TaskBubble classLabel={'team-box task-list proj'}
									    start={new Date(proj.project.start_date)} 
										end={new Date(proj.project.end_date)}  
										minDate={minDate}
										maxDate={maxDate}
										task={proj.project.name} descrip={""}
										progress={proj.subtasks.length !== 0 ? (taskList.filter((task) => 
									          (task.project_id === proj.project._id) && task.complete).length) / 
											  (taskList.filter((task) => (task.project_id === proj.project._id)).length) : 0} 
										taskID={proj.project._id}
										date={today} 
										updates={[]}
										route={"/newhire/project"} />
									
									{taskList.filter((task) => task.project_id === proj.project._id).map((task, i) => {
										return <TaskBubble classLabel={!task.complete ? 'task-box' : 'task-box done'} 
										        descrip={task.description} 
												start={new Date(proj.project.start_date)}  
												end={new Date(proj.project.end_date)} 
												minDate={minDate}
												maxDate={maxDate}
												task={task.name} 
												taskID={task._id}
												progress={-1} date={today} 
												updates={task.updates}
												route={"/newhire/project"} />
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
