import { Form, Link, useLoaderData } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { useState } from 'react';
import TaskBubble from '~/components/TaskBubble';
import { json, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
import axios from 'axios';
import ProjElem from '~/components/ProjElem';
import AddTask from '~/components/AddTask';
import AddProj from '~/components/AddProj';
import TRDropdown from '~/components/TRDropdown';

var matched = true; // check that company matching is complete

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

	const projRes = await axios.get(process.env.BACKEND_URL + '/api/v1/pm/team-view', {
		params: {
		  min_date: "2023-12-01",
		  max_date: "2024-02-01"
		},
		headers: {
		  "Authorization": session.get("auth"),
		  "Content-Type": "application/json"
	}}); 
	console.log("Team-View ProjRes: ", projRes);

	if (_action === "AddProj") {
		// construct project post request params
		let myJson = {
			name: body.get("name"),
			description: body.get("description"),
			start_date: body.get("start_date"),
			end_date: body.get("end_date"),
			assigned_team_id: body.get("team_id"),
			assigned_newhire_ids: body.get("assigned_newhire_ids")
		};
		console.log("AddProj myJson: ", myJson)
		
		const response = await axios.post(process.env.BACKEND_URL + '/api/v1/pm/project', myJson, {
			headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
			},
		})
	}

	if (_action === "AddTask") {
		if (projRes.data.length !== 0 && body.get("description")) {
			let assigned_ids = JSON.parse(body.get("assigned_ids"));
			if (!assigned_ids.includes(body.get("newhire_id"))) {
				assigned_ids.push(body.get("newhire_id"));
			}

			// construct subtask post request params
			let myJson = {
				name: body.get("description"),
				project_id: projRes.data[Number(body.get("projIdx"))].project._id,
				start_date: projRes.data[Number(body.get("projIdx"))].project.start_date,
				end_date: projRes.data[Number(body.get("projIdx"))].project.end_date,
				assigned_newhire_ids: assigned_ids
			};
			console.log("AddTask myJson: ", myJson)
			
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

	if (_action === "DeleteProj") {
		let myJson = { _id: body.get("_id") };
		console.log("DeleteProj myJSON: ", myJson)

		// delete project given id
		const response = await axios.delete(process.env.BACKEND_URL + '/api/v1/pm/project', {
			headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
			}, data: { _id: myJson["_id"] }
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

	return redirect("/team/project");
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

		const teamProfile = await axios.get(process.env.BACKEND_URL + '/api/v1/team/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
		}});

		const projRes = await axios.get(process.env.BACKEND_URL + '/api/v1/pm/team-view', {
			params: {
			  min_date: "2023-12-01",
			  max_date: "2024-02-01"
			},
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json"
		}});

		const nhRes = await axios.get(process.env.BACKEND_URL + '/api/v1/user/list-newhires', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
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

		return {
			projInfo: projRes.data,
			teamInfo: teamProfile.data,
			newHires: nhRes.data,
			dates: projRes.config.params,
			company: companyRes.data
		};
	
	} catch (error) {
		console.log("Error in project loader: ", error);
		return null;
	}
};


export default function Tproject() {
	// load project info + start/end dates
	const { projInfo, teamInfo, newHires, dates, company } = useLoaderData<typeof loader>();

	matched = company.company.matching_complete;
	
	console.log("Start - Loader ProjInfo: ", projInfo);
	console.log("Start - Loader TeamInfo: ", teamInfo);
	console.log("Start - Loader New Hires: ", newHires);
	console.log("Start - Loader Dates: ", dates);

	// build newhire id map
	var nhIdMap = {};
	for (var i = 0; i < newHires.new_hires.length; i++) {
		const nh = newHires.new_hires[i];
		nhIdMap[nh._id] = `${nh.first_name} ${nh.last_name}`;
	}
	
	// build upcoming task lists
	const taskList = [];
	for (var i = 0; i < projInfo.length; ++i) {
		if (projInfo[i].subtasks.length > 0) {
			console.log("Subtasks length: ", projInfo[i].subtasks.length);
			for (var j = 0; j < projInfo[i].subtasks.length; ++j) {
				taskList.push(projInfo[i].subtasks[j]);
			}
	  	}
	}
	console.log("Start - TaskList: ", taskList);

	// states
	const [pmMode, setPmMode] = useState('Team');

	// create dates
	const createDate = (date: Date|string) => {
		const options = { month: '2-digit', day: '2-digit', year: '2-digit' };
		const formattedDate = new Date(date).toLocaleDateString('en-US', options);
		return formattedDate;
	}

	const today = createDate(new Date());
	const minDate = new Date(dates.min_date);
	const maxDate = new Date(dates.max_date);

	function handleModeToggle() {
		if (pmMode === 'Team') setPmMode('Members')
		else setPmMode('Team') 
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

	function getAssignedTo(newhireIds:string[]) {
		var nameArray = [];

		for (var i = 0; i < newhireIds.length; i++) {
			var newhireId = newhireIds[i];
			var newhire = nhIdMap[newhireId];
			nameArray.push(newhire);
		}

		return nameArray;
	}

	const navLabels = ["Profile", "Project", "Settings"]

	if (!matched) {
		return (
			<div className="flex-container">
				<div id="sidebar">
					<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
					<TRDropdown labels={navLabels} route="/team/project" userType="team" />
				</div>
				<div id="content">
					<div>
						<p className="unavailable-content">You will be able to see the PM tool after team matching is complete!</p>
						<p className="cta"> <Link to="/team/profile">Back to Profile </Link></p>
					</div>
				</div>
			</div>
		)
	} else {
		if (pmMode === "Team") {
			return (
				<div className="flex-container">
					<div id="sidebar">
						<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
						<p className="text-logo">Opportune</p>
						<TRDropdown labels={navLabels} route="/team/project" userType="team" />
					</div>
					<div id="sidebar-2">
						<h3> Timeline: {teamInfo.team.name}
							<div id="date-bar">
								<button className="time-scale"> Today ↓</button>
								<button className="curr-date"> {today} </button>
								<button type="button" className={`pm-mode toggle ${pmMode.toLowerCase()}`}
										onClick={() => handleModeToggle()}> {pmMode} </button>
							</div>
						</h3>
					</div>
					<div className="horiz-flex-container">
						<div id="pm-content">
							<div className="team-box task-list">   
								<AddProj header={`Projects (${projInfo.length})`} label={"+ New"} 
								newHires={newHires} teamInfo={teamInfo} /> 
								
								{projInfo.map((proj) => {
									return <ProjElem proj_name={proj.project.name} proj_id={proj.project._id} 
											mode={pmMode} key={proj.project._id} />
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
								{projInfo.map((proj => {
									return <TaskBubble classLabel={'team-box task-list proj'}
											start={new Date(proj.project.start_date)} 
											end={new Date(proj.project.end_date)}  
											minDate={minDate}
											maxDate={maxDate}
											task={proj.project.name} descrip={""}
											progress={proj.subtasks.length !== 0 ? (taskList.filter((task) => 
												(task.project_id === proj.project._id) && task.complete).length) / 
												proj.subtasks.length : 0}
											taskID={proj.project._id}
											date={today} 
											updates={[]} 
											assignedTo={getAssignedTo(proj.project.assigned_newhire_ids)}
											route={"/team/project"}
											key={proj.project._id} />
								}))}
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="flex-container">
					<div id="sidebar">
						<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
						<p className="text-logo">Opportune</p>
						<TRDropdown labels={navLabels} route="/team/project" userType="team" />
					</div>
					<div id="sidebar-2">
						<h3> Timeline: {teamInfo.team.name}
							<div id="date-bar">
								<button className="time-scale"> Today ↓</button>
								<button className="curr-date"> {today} </button>
								<button type="button" className={`pm-mode toggle ${pmMode.toLowerCase()}`}
										onClick={() => handleModeToggle()}> {pmMode} </button>
							</div>
						</h3>
					</div>
					<div className="horiz-flex-container">
						<div id="members-timeline">
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
								{pmMode === "Team" ? 
								 projInfo.map((proj) => {
									return <TaskBubble classLabel={'team-box task-list proj'}
											start={new Date(proj.project.start_date)} 
											end={new Date(proj.project.end_date)}  
											minDate={minDate}
											maxDate={maxDate}
											task={proj.project.name} descrip={""}
											progress={proj.subtasks.length !== 0 ? (taskList.filter((task) => 
											(task.project_id === proj.project._id) && task.complete).length) / 
											proj.subtasks.length : 0}
											taskID={proj.project._id}
											date={today} 
											updates={[]}
											assignedTo={getAssignedTo(proj.project.assigned_newhire_ids)}
											route={"/team/project"}
											key={proj.project._id} />
								}) : null }
								{(projInfo.length > 0 && pmMode === "Members") ? newHires.new_hires.map((nh) => {
									return <div className="team-box task-list" key={nh._id}>
										<b> 
											<AddTask label={"+"} header={`${nh.first_name} ${nh.last_name}`} 
											 projInfo={projInfo} nh_id={nh._id} route="/team/project" />
										</b>
										{projInfo.filter((proj) => proj.project.assigned_newhire_ids.includes(nh._id))
										    .map((proj) => {
											return <div key={proj.project._id}> 
												<TaskBubble classLabel={'team-box task-list proj'}
													start={new Date(proj.project.start_date)} 
													end={new Date(proj.project.end_date)}  
													minDate={minDate}
													maxDate={maxDate}
													task={proj.project.name} 
													descrip={""}
													progress={proj.subtasks.length !== 0 ? (taskList.filter((task) => 
													(task.project_id === proj.project._id) && task.complete).length) / 
													proj.subtasks.length : 0}
													taskID={proj.project._id}
													date={today} 
													updates={[]} 
													assignedTo={getAssignedTo(proj.project.assigned_newhire_ids)}
													route={"/team/project"} />
												{taskList.filter((task) => (task.project_id === proj.project._id) &&
												 						   (proj.project.assigned_newhire_ids.includes(nh._id)))
												    .map((task) => {
														return <TaskBubble classLabel={!task.complete ? 'task-box-v2' : 'task-box-v2 done'}
																start={new Date(task.start_date)} 
																end={new Date(task.end_date)}  
																minDate={minDate}
																maxDate={maxDate}
																task={task.name} 
																descrip={""}
																progress={-1}
																taskID={task._id}
																date={today} 
																updates={[]} 
																assignedTo={getAssignedTo(proj.project.assigned_newhire_ids)}
																route={"/team/project"} />
													})}
												</div>
										})}
									</div>
								}): null }
								
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
}
