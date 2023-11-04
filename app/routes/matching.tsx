import { Form, Link } from '@remix-run/react';
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
import { ActionFunctionArgs, LoaderFunction, json, redirect } from '@remix-run/node';
import { useState } from 'react';
// import { motion } from 'framer-motion';

const questionList = [
  <PlainText text="Let's get started!" />,
  <Scale question="How comfortable are you with Python?"/>,
  <Scale question="How comfortable are you with Java?"/>,
  <Scale question="How comfortable are you with C++?"/>,
  <Ranking question="Rank the following teams (best to worst)" />, 
  <Textbox question="What was the rationale behind your first choice team?" />, 
  <Textbox question="What was the rationale behind your second choice team?" />,
  <Textbox question="What was the rationale behind your third choice team?" />,
  <PlainText text="Thank you for your responses. You are free to edit them until July 1, and matching results will be out on July 2." />
]

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const profile = await axios.get('http://opportune_backend:3000/users/newhire/profile', {
		headers: {
		  "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lLjMwQGRhcnRtb3V0aC5lZHUiLCJpYXQiOjE2OTg4NjEzNjl9.Bdy4kf7oiYVKyiTZOTG8Ns7oE9BmAiBXtnQurAo_1jA",
		  "Content-Type": "application/json",
		},
	})

	// handle field based on question type
	if (_action === "Scale") {
		// format: {name: "Python", score: "5"}
		var myJson = {};
		for (const [key, value] of body.entries()) {
			if (key !== "_action") {
				console.log(key + ', ' + value); 
				myJson["name"] = key;
				myJson["score"] = parseInt(value, 10);
			}
		}

		try {
			profile.data.newHire.skills.push(myJson)
			const newSkills = JSON.stringify(profile.data);
			console.log(profile.data.newHire.skills);
			console.log(newSkills);
			const response = await axios.patch('http://opportune_backend:3000/users/newhire/skills', 
				newSkills, {
				headers: {
				  "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lLjMwQGRhcnRtb3V0aC5lZHUiLCJpYXQiOjE2OTg4NjEzNjl9.Bdy4kf7oiYVKyiTZOTG8Ns7oE9BmAiBXtnQurAo_1jA",
				  "Content-Type": "application/json",
				},
			});
			console.log("Post");
			console.log(response.data);
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	if (_action === "Ranking") {
		console.log("Entered ranking body");
	}

	if (_action === "Textbox") {
		console.log("Entered textbox body");
	}
	
	return redirect("/matching");
}

export let loader: LoaderFunction = async() => {
	try {
		const response = await axios.get('http://opportune_backend:3000/users/newhire/profile', {
			headers: {
			  "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lLjMwQGRhcnRtb3V0aC5lZHUiLCJpYXQiOjE2OTg4NjEzNjl9.Bdy4kf7oiYVKyiTZOTG8Ns7oE9BmAiBXtnQurAo_1jA",
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
	const {step, stepComp, isFirstStep, isLastStep,
		   previous, next, getProgress} = SurveyUtil(questionList);
	const [matchData, setMatchData] = useState({});

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
					<Form action="/matching" method="post">
						{stepComp}
						<p className="cta">
							{isFirstStep ? <Link to="" onClick={previous} className="prev-button">Previous</Link> : null}
							{isLastStep ? <button type="submit" name="_action" 
							               value={stepComp.type.name} >Save</button> : null}
							{isLastStep ? <button onClick={next} >Next</button> : null}
							{!isLastStep ? <button type="submit">Submit</button> : null}
						</p>
					</Form>
					
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