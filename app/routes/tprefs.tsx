import { Form, Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import axios from 'axios';
import { destroySession, getSession } from '../utils/sessions';
import styles from '~/styles/home.css';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import SurveyUtil from '~/components/survey_qs/SurveyUtil';
import Progress from '~/components/survey_qs/Progress';
import Scale from '~/components/survey_qs/Scale';
import Ranking from '~/components/survey_qs/Ranking';
import Textbox from '~/components/survey_qs/Textbox';
import PlainText from '~/components/survey_qs/PlainText';
import SelectField from '~/components/SelectField';
import { Select } from '@mui/material';


export default function Tprefs() {
	let teamInfo = {
		name: "Data Science",
		description: "Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.",
		skills: ["Python", "Java"],
		members: ["Stephen Wang", "Eren Aldemir", "Ethan Chen", "Karina Montiel", "Ryan Luu"]
	};

	let companyInfo = {
		name: "OP Company",
	}

	// list of questions
	// <PlainText text="Let's get started!" key={1}/>
	// <Scale question="Set the importance of the following tech stack on your team: React" existingSkills={[{name: "React", score: 5}]} key={2}/>
	// <Scale question="What is the work arrangement for your team?" existingSkills={[]} key={3}/>
	// <Scale question="How independent do you expect your interns to be?" existingSkills={[]} key={4}/>

	const questionList = [
		<SelectField classLabel="skills" options={["Python", "Java", "React", "Javascript"]} value={""} />
    ];

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
						<h3> {teamInfo.name} </h3>
				</div>
				<div className="company-prefs">
					<h3> Fill Your Preferences </h3>
					<Progress pct={getProgress()}/>
					<Form action="/matching" method="post" 
						onSubmit={triggered === "next-q" ? next : previous}>
						{stepComp}
						<div className="team-box">
							Current Skills
							{teamInfo.skills.map((skill) => {
								return <Link className="edit" to="/preferences"> {skill + " ⤬"} </Link>
							})}
							<Link className="edit" to="/preferences"> + Other </Link>
						</div>
						<p className="cta">
							{(!isFirstStep && !isLastStep) ? <button type="submit" name="_action"
							value={stepComp.type.name} className="prev-button" onClick={(e) => setTriggered(e.currentTarget.id)} id="prev-q">Previous</button> : null}
							{!isLastStep ? <button type="submit" name="_action"
							value={stepComp.type.name} id="next-q" onClick={(e) => setTriggered(e.currentTarget.id)}>Next</button> : null}
							{isLastStep ? <Link to="/results">Done</Link> : null}
						</p>	
					</Form>
					
					<p className="cta">
						{(isFirstStep && !isLastStep) ? <Link to="/profile" className="prev-button">Cancel</Link> : null}
						<Link to="/profile" className="prev-button">Cancel</Link>
					</p>

				</div>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}