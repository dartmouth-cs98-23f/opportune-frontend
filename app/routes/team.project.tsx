import { Form, Link, useLoaderData, useFetcher } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import Checkbox from '~/components/Checkbox';
import TaskBubble from '~/components/TaskBubble';
import { json, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
import axios from 'axios';
import ProjElem from '~/components/ProjElem';
import AddTask from '~/components/AddTask';
import AddProj from '~/components/AddProj';

const matched = true; // check that company matching is complete

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
		// construct subtask post request params
		let assigned_ids = JSON.parse(body.get("assigned_ids"));
		if (!assigned_ids.includes(body.get("newhire_id"))) {
			assigned_ids.push(body.get("newhire_id"));
		}

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

		return {
			projInfo: projRes.data,
			teamInfo: teamProfile.data,
			newHires: nhRes.data,
			dates: projRes.config.params,
		};
	
	} catch (error) {
		console.log("Error in project loader: ", error);
		return null;
	}
};


export default function Tproject() {
	// load project info + start/end dates
	const { projInfo, teamInfo, newHires, dates } = useLoaderData<typeof loader>();

	/* const projInfo = [{
		project: {
			_id: '65d5715f1c7cf2404e060451',
			name: 'Authorization',
			description: 'A necessary evil of backend',
			start_date: '2023-12-01T00:00:00.000Z',
			end_date: '2024-01-01T00:00:00.000Z',
			assigned_team_id: 'a972c358-3128-4ddb-be10-90a7b9aa0306',
			assigned_newhire_ids: ['65aebd6dd9dce799b35646cd'],
			__v: 0 
		},
		subtasks: []
	}, {
		project: {
			_id: '65d5715f1c7cf2404e060452',
			name: 'UI/UX',
			description: 'A necessary evil of frontend',
			start_date: '2023-12-01T00:00:00.000Z',
			end_date: '2024-01-01T00:00:00.000Z',
			assigned_team_id: 'a972c358-3128-4ddb-be10-90a7b9aa0306',
			assigned_newhire_ids: ['65aebd6dd9dce799b35646ce'],
			__v: 0 
		},
		subtasks: [{
			id: 'abcd',
			name: 'Pick Color Scheme',
			description: '',
			project_id: '65d5715f1c7cf2404e060452',
			start_date: '2023-12-01T00:00:00.000Z',
			end_date: '2024-01-01T00:00:00.000Z',
			updates: [], 
			assigned_newhire_ids: ['65aebd6dd9dce799b35646ce'],
			complete: false,
		}]
	}]

	const newHires = {
		new_hires: [{
		    age: null,
		    sex: '',
		    race: '',
		    school: '',
		    major: '',
		    grad_month: '',
		    grad_year: null,
		    address: '',
		    city: '',
		    state_province: '',
		    zip_code: '',
		    image_url: '',
		    favorited_teams: [],
		    survey_complete: false,
		    matched: false,
		    company_id: '',
		    _id: '65aebd6dd9dce799b35646cd',
		    email: 'email',
		    first_name: 'Eren',
		    last_name: 'Aldemir',
		    team_id: 'a972c358-3128-4ddb-be10-90a7b9aa0306',
		    skills: [],
		    team_prefs: [],
		    meetings: []
		  },
		  {
		    age: null,
		    sex: '',
		    race: '',
		    school: '',
		    major: '',
		    grad_month: '',
		    grad_year: null,
		    address: '',
		    city: '',
		    state_province: '',
		    zip_code: '',
		    image_url: '',
		    favorited_teams: [],
		    survey_complete: false,
		    matched: false,
		    company_id: '',
		    _id: '65aebd6dd9dce799b35646ce',
		    email: 'email',
		    first_name: 'Ethan',
		    last_name: 'Chen',
		    team_id: 'a972c358-3128-4ddb-be10-90a7b9aa0306',
		    skills: [],
		    team_prefs: [],
		    meetings: []
		  }
		]
	}

	const teamInfo = {
		email: 'john.doe.team.4@dartmouth.edu',
		team: {
			diversity_score: 0,
			_id: 'a972c358-3128-4ddb-be10-90a7b9aa0306',
			name: 'Design Research',
			description: 'This is a great team! Many opportunities for growth!',
			manager: '',
			members: [],
			calendly_link: '',
			survey_complete: false,
			max_capacity: 0,
			company_id: '',
			skills: [ [Object], [Object], [Object], [Object] ],
			__v: 84
		}
	}

	const dates = { min_date: '2023-12-01', max_date: '2024-02-01' }; */
	
	console.log("Start - Loader ProjInfo: ", projInfo);
	console.log("Start - Loader TeamInfo: ", teamInfo);
	console.log("Start - Loader New Hires: ", newHires);
	console.log("Start - Loader Dates: ", dates);
	
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

	if (!matched) {
		return (
			<div className="flex-container">
				<div id="sidebar">
					<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
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
		if (pmMode === "Team") {
			return (
				<div className="flex-container">
					<div id="sidebar">
						<img className="opportune-logo-small disable-select" 
							 src="../opportune_newlogo.svg" draggable={false}></img>
						<p className="text-logo disable-select">Opportune</p>
						<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
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
											mode={"team"}
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
						<img className="opportune-logo-small disable-select" 
							 src="../opportune_newlogo.svg" draggable={false}></img>
						<p className="text-logo disable-select">Opportune</p>
						<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
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
											mode={"team"}
											key={proj.project._id} />
								}) : null }
								{pmMode === "Members" ? newHires.new_hires.map((nh) => {
									return <div className="team-box task-list" key={nh._id}>
										<b> 
											<AddTask label={"+"} header={`${nh.first_name} ${nh.last_name}`} 
											 projInfo={projInfo} nh_id={nh._id} />
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
													mode={"team"} />
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
																mode={"team"} />
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
