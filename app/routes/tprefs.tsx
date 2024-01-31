import { Form, Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import axios from 'axios';
import { destroySession, getSession } from '../utils/sessions';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import SurveyUtil from '~/components/survey_qs/SurveyUtil';
import Progress from '~/components/survey_qs/Progress';
import Scale from '~/components/survey_qs/Scale';
import Ranking from '~/components/survey_qs/Ranking';
import PlainText from '~/components/survey_qs/PlainText';
import { Select } from '@mui/material';
import ScaleT from '~/components/survey_qs/ScaleT';

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);
	

	const teamInfo = await axios.get(process.env.BACKEND_URL + '/api/v1/team/profile', {
		headers: {
		  "Authorization": session.get("auth"),
		  "Content-Type": "application/json",
		},
	})

	// 1-5 slider
	if (_action === "Scale" || _action === "ScaleT") {
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
			const skillList = teamInfo.data.team.skills;
			const skillIdx = skillList.findIndex(skill => skill.name === myJson["name"]);
			if (skillIdx !== -1) {
				skillList[skillIdx].score = myJson["score"]
			} else {
				skillList.push(myJson);
			}
			
			// send new skills
			const newSkills = JSON.stringify({skills: skillList});
			const response = await axios.patch(process.env.BACKEND_URL + '/api/v1/team/profile', 
				newSkills, {
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

	if (_action === "PlainText") {
		console.log("Entered plain textbox body");
	}

	if (_action === "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});
	}

	return redirect("/tprefs");
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

		const profileRes = await axios.get(process.env.BACKEND_URL + '/api/v1/team/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			}});
		
		console.log("Getting profile: ", profileRes.data)
		return json(profileRes.data)
	
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Tprefs() {
	// let teamInfo = {
	// 	name: "Data Science",
	// 	description: "Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.",
	// 	skills: ["Python", "Java"],
	// 	members: ["Stephen Wang", "Eren Aldemir", "Ethan Chen", "Karina Montiel", "Ryan Luu"]
	// };

	const teamInfo = useLoaderData<typeof loader>();
	console.log(teamInfo)

	let companyInfo = {
		name: "OP Company",
	}

	// TODO: list of questions to incorporate in this order, make sure the survey works with the requests
	// TODO: the Scale react component has been revised to generalize for more dynamic labels on the scale
	// CHECK that both this team and original matching survey have no broken scales
	// implement Scales component

	// const questionList = [
	// 	
	// 	[<PlainText text="List and rank the importance of tech stacks you require" key={2}/>,
	// 	 <Scale question="React" existingSkills={[{name: "React", score: 5}]} 
	// 	 labels={["1", "2", "3", "4", "5"]} key={2}/>,
	// 	 <Scale question="Python" existingSkills={[{name: "Python", score: 3}]} 
	// 			labels={["1", "2", "3", "4", "5"]} key={2}/>,
	// 	 <Scale question="Javascript" existingSkills={[{name: "Javascript", score: 4}]} 
	// 			labels={["1", "2", "3", "4", "5"]} key={2}/>,
	// 	 <button className="edit"> + Other Skill </button>
	// 	],
	// 	
	// 	
    // ];

	// list of questions
	const questionList = []
	questionList.push(<PlainText text="Let's get started!" />)

	// add skill questions
	for (var skill of teamInfo.team.skills) {
		questionList.push(<ScaleT question={skill.name} skill={skill.name}
								  existing={teamInfo.team.skills}
								  labels={["1", "2", "3", "4", "5"]}/>)
	}

	/* questionList.push(<ScaleQ question="What is the work arrangement for your team?" 
							 existingSkills={[]} labels={["Remote", "Hybrid", "In-Person"]} />)
	questionList.push(<ScaleQ question="How independent do you expect your interns to be?" 
							 existingSkills={[]} labels={["Needs frequent assistance", "", "Needs some assistance", "", "Very independent"]} key={4}/>) */
	questionList.push(<PlainText text="Thanks for filling out your team preferences!" />)

	const {step, stepComp, isFirstStep, isLastStep,
		previous, next, getProgress} = SurveyUtil(questionList);
	
 	const [triggered, setTriggered] = useState("next-q");

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
				<div className="company-prefs">
					<h3> Fill Your Preferences </h3>
					<Progress pct={getProgress()}/>
					<Form action="/tprefs" method="post" 
						onSubmit={triggered === "next-q" ? next : previous}>
						{stepComp}
						<p className="cta">
							{(!isFirstStep && !isLastStep) ? <button type="submit" name="_action"
							value={stepComp.type.name} className="prev-button" onClick={(e) => setTriggered(e.currentTarget.id)} id="prev-q">Previous</button> : null}
							{!isLastStep ? <button type="submit" name="_action"
							value={stepComp.type.name} id="next-q" onClick={(e) => setTriggered(e.currentTarget.id)}>Next</button> : null}
							{isLastStep ? <Link to="/tprofile">Done</Link> : null}
						</p>	
					</Form>
					
					<p className="cta">
						{/*(isFirstStep && !isLastStep) ? <Link to="/tprofile" className="prev-button">Cancel</Link> : null*/}
						<Link to="/tprofile" className="prev-button">Cancel</Link>
					</p>

				</div>
			</div>
		</div>
	)
}
