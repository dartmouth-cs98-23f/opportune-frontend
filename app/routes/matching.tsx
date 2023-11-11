import { Form, Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import axios from 'axios';
import { destroySession, getSession } from '../utils/sessions';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import SurveyUtil from '~/components/survey_qs/SurveyUtil';
import Progress from '~/components/survey_qs/Progress';
import Scale from '~/components/survey_qs/Scale';
import Ranking from '~/components/survey_qs/Ranking';
import Textbox from '~/components/survey_qs/Textbox';
import PlainText from '~/components/survey_qs/PlainText';


export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);

	const profile = await axios.get(process.env.BACKEND_URL + '/users/newhire/profile', {
		headers: {
		  "Authorization": session.get("auth"),
		  "Content-Type": "application/json",
		},
	})

	// 1-5 slider
	if (_action === "Scale") {
		// get the tech stack and score
		var myJson = {};
		for (const [key, value] of body.entries()) {
			if (key !== "_action") {
				console.log(key + ', ' + value); 
				myJson["name"] = key;
				myJson["score"] = parseInt(value, 10);
			}
		}

		try {
			// update/add to skill list
			const skillList = profile.data.new_hire.skills;
			const skillIdx = skillList.findIndex(skill => skill.name === myJson["name"]);
			if (skillIdx !== -1) {
				skillList[skillIdx].score = myJson["score"]
			} else {
				skillList.push(myJson);
			}
			
			// send new skills
			const newSkills = JSON.stringify({skills: skillList});
			const response = await axios.patch(process.env.BACKEND_URL + '/users/newhire/skills', 
				newSkills, {
				headers: {
				  "Authorization": session.get("auth"),
				  "Content-Type": "application/json",
				},
			});
			// console.log(response.data);
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	// team preferences
	if (_action === "Ranking") {
		console.log("Entered ranking body");
		// get the rankings
		let prefJsons = [];
		for (const [key, value] of body.entries()) {
			if (key !== "_action") {
				let prefJson = {};
				console.log(key + ', ' + value); 
				prefJson["name"] = key;
				prefJson["score"] = parseInt(value, 10);
				prefJsons.push(prefJson)
			}
		}
		console.log(prefJsons)
		
		// update team_prefs list
		try {
			let prefList = profile.data.new_hire.team_prefs;
			if (prefList) prefList = prefJsons
			else prefList.push(prefJsons);
			// send new preferences
			const newPrefs = JSON.stringify({team_prefs: prefList});
			const response = await axios.patch(process.env.BACKEND_URL + '/users/newhire/teamprefs', 
				newPrefs, {
				headers: {
				  "Authorization": session.get("auth"),
				  "Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	if (_action === "Textbox") {
		console.log("Entered textbox body");
	}

	if (_action === "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});
	}

	return redirect("/matching");
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

		async function getProfileRes() {
			const profileRes = await axios.get(process.env.BACKEND_URL + '/users/newhire/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			}});
			console.log("Getting profile: ", profileRes.data)
			return profileRes.data
		}

		async function getSkillRes() {
			const skillRes = await axios.get(process.env.BACKEND_URL + '/user/list-company-skills', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			}});
			console.log("Getting skills: ", skillRes.data)
			return skillRes.data
		}

		async function getTeamsRes() {
			const teamRes = await axios.get(process.env.BACKEND_URL + '/user/list-teams', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			}});
			console.log("Getting teams: ", teamRes.data)
			return teamRes.data
		}

		const [profileRes, skillRes, teamsRes] = await Promise.all([
			getProfileRes(),
			getSkillRes(),
			getTeamsRes()
		]);

		return json({ profile: profileRes, 
			          skills: skillRes,
					  teams: teamsRes });
	
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Matching() {
	const basicInfo = useLoaderData<typeof loader>();
	console.log("Reading basic info");

	const basicInfoPrefs = basicInfo.profile.new_hire.team_prefs;
	const basicInfoSkills = basicInfo.skills.skills;
	const allTeams = basicInfo.teams.teams;
	const newHireSkills = basicInfo.profile.new_hire.skills;

	// generate list of teams and slots
	let TeamList: { name: string; score: number; _id: string; }[] = [];

	if (basicInfoPrefs.length === 0) {
		for (let i = 0; i < allTeams.length; i++) {
			TeamList.push({name: allTeams[i].name, 
				           score: allTeams.length - i,
						   _id: allTeams[i].name})
		}
	} else {
		TeamList = basicInfoPrefs
	}

	console.log("Team List: ", TeamList);

	// list of questions
	const questionList = [<PlainText text="Let's get started!" />]

	// add skill questions
	console.log("Skills log: ", basicInfoSkills)
	for (var skill of basicInfoSkills) {
		questionList.push(<Scale question={`How comfortable are you with ${skill}?`} existingSkills={newHireSkills}/>)
	}

	// add ranking question and submission message
	questionList.push(<Ranking question="Rank the following teams (best to worst)" teams={TeamList} />)
	questionList.push(<PlainText text="Thank you for your responses. You are free to edit them until July 1, and matching results will be out on July 2." />)

	// console.log("matching questionList");
	// console.log(questionList);

	// <Scale question="How comfortable are you with Python?" existingSkills={basicInfoFields.new_hire.skills}/>,
	/* <Textbox question="What was the rationale behind your first choice team?" */

	const {step, stepComp, isFirstStep, isLastStep,
		   previous, next, getProgress} = SurveyUtil(questionList);
	const [triggered, setTriggered] = useState("next-q");

	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
				<Form action="/matching" method="post">
					<button className="logout-button" type="submit"
					name="_action" value="LogOut"> 
						<ArrowLeftOnRectangleIcon /> 
					</button>
				</Form>
			</div>
			<div id="content">
				<h2>Welcome Oppenheim </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<div>
					<Progress pct={getProgress()}/>
					<Form action="/matching" method="post" 
					      onSubmit={triggered === "next-q" ? next : previous}>
						{stepComp}
						<p className="cta">
							{(!isFirstStep && !isLastStep) ? <button type="submit" name="_action"
							value={stepComp.type.name} className="prev-button" onClick={(e) => setTriggered(e.currentTarget.id)} id="prev-q">Previous</button> : null}
							{!isLastStep ? <button type="submit" name="_action"
							value={stepComp.type.name} id="next-q" onClick={(e) => setTriggered(e.currentTarget.id)}>Next</button> : null}
							{isLastStep ? <Link to="/results">Done</Link> : null}
						</p>
					</Form>
					<p className="cta">
						{(isFirstStep && !isLastStep) ? <Link to="/teams" className="prev-button">Back to Teams</Link> : null}
					</p>
				</div>
			</div>
		</div>
	)
}
		
export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
