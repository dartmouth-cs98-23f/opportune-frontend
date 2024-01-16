import { Link, Form, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import TextField from '~/components/TextField';
import SelectField from '~/components/SelectField';
import axios from 'axios';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, json, LoaderFunction } from '@remix-run/node';
import { useState } from 'react';
import { destroySession, getSession } from '../utils/sessions';
import ImageUpload from '~/components/ImageUpload';

export default function Tprofile() {
	let teamInfo = {
		name: "Data Science",
		description: "Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.",
		skills: [{name: "Python", score: "5"}, 
	             {name: "Javascript", score: "3"},
				 {name: "React", score: "4"}],
		members: ["Stephen Wang", "Eren Aldemir", "Ethan Chen", "Karina Montiel", "Ryan Luu"]
	};

	/* let teamInfo = {
		name: "Data Science",
		description: "Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.",
		skills: [],
		members: []
	}; */

	let companyInfo = {
		name: "OP Company",
	}

	// team description editing state
	const [isEditing, setEditing] = useState(false);
	const handleEditClick = () => {
		setEditing(!isEditing);
	};
	console.log(isEditing)

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
					<h3> {teamInfo.name} </h3>
				</div>
				<div className="horiz-flex-container">
					<div className="team-info">
						<h3> 
							Team Description
							{isEditing ? <button className="edit" onClick={handleEditClick}>✎</button> : 
							<button className="edit" onClick={handleEditClick}>Confirm</button>}
						</h3>
						<div className="team-box">
							{isEditing ? <p> {teamInfo.description} </p> :
							 <textarea id="textInput" rows={10} cols={50}
							 defaultValue={teamInfo.description}></textarea>}
							
						</div>
						<h3> 
							Team Preferences 
							<Link className="edit" to="/tprefs">✎</Link>
						</h3>
						<div className="team-box">
							{teamInfo.skills.length > 0 ? 
							teamInfo.skills.map((skill, i) => (
							<div>
								<p className="profile-skill-score" key={i + "a"}> {skill.score} </p>
								<p className="profile-skill-name" key={i + "b"}> {skill.name} </p>
							</div>
							)): <img src="empty.svg"></img>}
							<p><b> {teamInfo.skills.length > 0 ? null : 
							"No team preferences have been input yet."} </b></p>
						</div>
					</div>
					<div className="assigned-interns">
						<h3> Team Members </h3>
						<div className="team-box">
							{teamInfo.members.length > 0 ? 
							 teamInfo.members.map((member, i) => {
								return <p key={i}> {member} </p>
							}): <img src="empty.svg"></img>}
							<p><b> {teamInfo.members.length > 0 ? null : 
						    "No interns have been assigned yet."} </b></p>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	)
}

/* if matching complete, change the box listing the team members -> assigned interns */

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}