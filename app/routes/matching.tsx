import { Form, Link, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import SurveyUtil from '~/components/survey_qs/SurveyUtil';
import Progress from '~/components/survey_qs/Progress';
import Scale from '~/components/survey_qs/Scale';
import Ranking from '~/components/survey_qs/Ranking';
import Textbox from '~/components/survey_qs/Textbox';
import PlainText from '~/components/survey_qs/PlainText';
import axios from 'axios';
import { ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useState } from 'react';
// import { motion } from 'framer-motion';
import { getSession } from '../utils/sessions';

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);

	const profile = await axios.get('http://opportune_backend:3000/users/newhire/profile', {
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
			const skillList = profile.data.newHire.skills;
			const skillIdx = skillList.findIndex(skill => skill.name === myJson["name"]);
			if (skillIdx !== -1) {
				skillList[skillIdx].score = myJson["score"]
			} else {
				skillList.push(myJson);
			}
			
			// send new skills
			const newSkills = JSON.stringify({skills: skillList});
			const response = await axios.patch('http://opportune_backend:3000/users/newhire/skills', 
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
			let prefList = profile.data.newHire.team_prefs;
			if (prefList) prefList = prefJsons
			else prefList.push(prefJsons);
			// send new preferences
			const newPrefs = JSON.stringify({team_prefs: prefList});
			const response = await axios.patch('http://opportune_backend:3000/users/newhire/teamprefs', 
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

	return redirect("/matching");
}

export async function loader({
	request,
}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		const response = await axios.get('http://opportune_backend:3000/users/newhire/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			const data = response.data;
			console.log(data);
			return json({ data });
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Matching() {
	// const basicInfo = useLoaderData<typeof loader>();
	const basicInfo = {
		data: {
			email: "",
			newHire: {first_name: "", last_name: "", race: "", sex: "", 
				      school: "", grad_month: "", grad_year: "", major: "",
		              email: "", address: "", city: "", state_province: "", zip_code: "",
					  skills: [], team_prefs: []}
		}
	}

	const basicInfoFields = basicInfo.data;

	// generate list of teams and slots
	// const TeamList = basicInfoFields.newHire.team_prefs.length !== 0 ? 
	// basicInfoFields.newHire.team_prefs :
	// [
	// 	{name: "Finance", score: 0, _id: "Finance" },
	// 	{name: "ML/AI", score: 1, _id: "ML/AI"},
	// 	{name: "Cybersecurity", score: 2, _id: "Cybersecurity"}
	// ]

	const TeamList = [
		{name: "Finance", score: 0, _id: "Finance" },
		{name: "ML/AI", score: 1, _id: "ML/AI"},
		{name: "Cybersecurity", score: 2, _id: "Cybersecurity"}
	]

	// list of questions
	const questionList = [
		<PlainText text="Let's get started!" />,
		<Scale question="How comfortable are you with Python?" existingSkills={basicInfoFields.newHire.skills}/>,
		<Scale question="How comfortable are you with Java?" existingSkills={basicInfoFields.newHire.skills}/>,
		<Scale question="How comfortable are you with C++?" existingSkills={basicInfoFields.newHire.skills}/>,
		<Ranking question="Rank the following teams (best to worst)" teams={TeamList} />, 
		<PlainText text="Thank you for your responses. You are free to edit them until July 1, and matching results will be out on July 2." />
		/* <Textbox question="What was the rationale behind your first choice team?" />, 
		<Textbox question="What was the rationale behind your second choice team?" />,
		<Textbox question="What was the rationale behind your third choice team?" />, */
	]

	const {step, stepComp, isFirstStep, isLastStep,
		   previous, next, getProgress} = SurveyUtil(questionList);
	const [triggered, setTriggered] = useState("next-q");

	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_logo.png"></img>
				<Link className='logout-button' to="/login"> 
					<ArrowLeftOnRectangleIcon /> 
				</Link>
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
							{isFirstStep ? <button type="submit" name="_action"
							value={stepComp.type.name} className="prev-button" onClick={(e) => setTriggered(e.currentTarget.id)} id="prev-q">Previous</button> : null}
							{isLastStep ? <button type="submit" name="_action"
							value={stepComp.type.name} id="next-q" onClick={(e) => setTriggered(e.currentTarget.id)}>Next</button> : null}
							{!isLastStep ? <button type="submit">Submit</button> : null}
						</p>
					</Form>
					{/* <Form action="/matching" method="post">
						{stepComp}
						<p className="cta">
							{isFirstStep ? <Link to="" className="prev-button" id="prev-q" onClick={previous}>Previous</Link> : null}
							{isLastStep ? <Link to="" id="next-q" onClick={next}>Next</Link> : null}
							{!isLastStep ? <button type="submit">Submit</button> : null}
						</p>
					</Form> */}
					
					<p className="cta">
						<Link to="/teams" className="prev-button">Back to Teams</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

/* <Link to="/results">View Results </Link> */
/* <Form method="post" action="/matching" id="login"> </Form> */

/* motion.div initial={{ opacity: 0 }}
			     animate={{ opacity: 1 }}
			     exit={{ opacity: 0 }}
				 transition={{ duration: 0.5 }} */
		
export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}