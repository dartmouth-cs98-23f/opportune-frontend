import { Link, Form, useLoaderData } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import TextField from '~/components/TextField';
import SelectField from '~/components/SelectField';
import axios from 'axios';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, json, LoaderFunction } from '@remix-run/node';
import { useState } from 'react';
import { destroySession, getSession } from '../utils/sessions';
import ImageUpload from '~/components/ImageUpload';

export async function loader({request}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		console.log("Auth: ", session.get("auth"));
		if (!session.get("auth")) {
			return redirect("/login")
		}

		const response = await axios.get(process.env.BACKEND_URL + '/api/v1/team/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			},
		});

		const response2 = await axios.get(process.env.BACKEND_URL + '/api/v1/user/list-newhires', {
			headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
			  },
			});

		if (response.status === 200 && response2.status === 200) {
			const teamInfo = response.data;
			const newhires = response2.data;
			console.log("Loader data: ", teamInfo);
			return json({ teamInfo, newhires });
		}
	} catch (error) {
		console.log("Error in tprofile loader: ", error);
		return null;
	}
};

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	console.log(body)
	const _action = body.get("_action");

	console.log("action: " + _action);

	const session = await getSession(
		request.headers.get("Cookie")
	);

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	// console.log("Basic info JSON");
	console.log("My json: ", JSON.stringify(myJson));

	if (_action === "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});
	} else if (_action === "updateDescription") {
		try {
			const response = await axios.patch(process.env.BACKEND_URL + '/api/v1/team/profile', myJson, {
				headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
				},
			})
			return redirect("/tprofile");	
		} catch (error) {
			console.log("Error in tprofile action: ", error);
			return null;
		}
	}

	return null;
}

export default function Tprofile() {
	const { teamInfo, newhires } = useLoaderData<typeof loader>();
	console.log(teamInfo, newhires)

	// const companyInfo = useLoaderData<typeof loader>();
	let companyInfo = {
		name: "OP Company",
	}

	// team description editing state
	const [isEditing, setEditing] = useState(false);
	const handleEditClick = () => {
		setEditing(!isEditing);
	};
	
	// companyInfo.name is still hardcoded

	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
				<Form action="/profile" method="post">
				<p className="text-logo">Opportune</p>
				<button className="logout-button" type="submit"
					    name="_action" value="LogOut"> 
					<ArrowLeftOnRectangleIcon /> 
				</button>
				</Form>
			</div>
			<div className="content">
				<div className="company-banner">
					<h1> {companyInfo.name} </h1>
					<h3> {teamInfo.team.name} </h3>
				</div>
				<div className="horiz-flex-container">
					<div className="team-info">
						{!isEditing ? <div> 
							<h3> Team Description 
							<button type="button" className="edit" onClick={handleEditClick}>✎</button></h3> 
						</div> : null}
						<Form action="/tprofile" method="post" onSubmit={handleEditClick}>
							{isEditing ? <div>
								<h3> Team Description 
								<button type="submit" name="_action" value="updateDescription" className="edit">Confirm</button></h3> 
							</div> : null}
							<div className="team-box">
								{!isEditing ? <p> {teamInfo.team.description} </p> :
								<textarea name="description" id="textInput" rows={10} cols={50} defaultValue={teamInfo.team.description}/>}
							</div>
						</Form>
						<h3> 
							Team Preferences 
							<Link className="edit" to="/tskills">✎</Link>
						</h3>
						<div className="team-box">
							{teamInfo.team.skills.length > 0 ? 
							teamInfo.team.skills.map((skill:{score:number, name:string}, i:number) => (
							<div>
								<p className="profile-skill-score" key={i + "a"}> {skill.score} </p>
								<p className="profile-skill-name" key={i + "b"}> {skill.name} </p>
							</div>
							)): <img src="empty.svg"></img>}
							<p><b> {teamInfo.team.skills.length > 0 ? null : 
							"No team preferences have been input yet."} </b></p>
						</div>
					</div>
					<div className="assigned-interns">
						<h3> Team Members </h3>
						<div className="team-box">
							{teamInfo.team.members.length > 0 ? 
							 teamInfo.team.members.map((member:string, i:number) => {
								return <p key={i}> {member} </p>
							}): <img src="empty.svg"></img>}
							<p><b> {teamInfo.team.members.length > 0 ? null : 
						    "No team members have been added yet."} </b></p>
						</div>
						<h3> Assigned Interns </h3>
						<div className="team-box">
							{newhires.new_hires.length > 0 ? 
							 newhires.new_hires.map((member:{first_name:string, last_name:string}, i) => {
								return <p key={i}> {member.first_name + " " + member.last_name} </p>
							}): <img src="empty.svg"></img>}
							<p><b> {newhires.new_hires.length > 0 ? null : 
						    "No interns have been assigned yet."} </b></p>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	)
}

/* if matching complete, change the box listing the team members -> assigned interns */