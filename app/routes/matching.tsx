import { Link } from '@remix-run/react';
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
import { ActionFunctionArgs, redirect } from '@remix-run/node';
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

/* export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.post('http://opportune_backend:3000/match?algorithm={algorithm}', myJson);
	} catch(error) {
		console.log(error)
		return null
	}
	
	return redirect('/results');
} */

export default function Matching() {
	const {step, stepComp, isFirstStep, isLastStep,
		   previous, next, getProgress} = SurveyUtil(questionList)

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
					{stepComp}
					<p className="cta">
						{isFirstStep ? <Link to="" onClick={previous}>Previous</Link> : null}
						{isLastStep ? <Link to="" onClick={next}>Next</Link> : null}
						{!isLastStep ? <button type="submit">Submit</button> : null}
					</p>
					<p className="cta">
						<Link to="/teams">Back to Teams</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

/* <Link to="/results">View Results </Link> */
/* <Form method="post" action="/matching" id="login"> </Form> */

// keep a state list of form responses with parameters? 

/* motion.div initial={{ opacity: 0 }}
			     animate={{ opacity: 1 }}
			     exit={{ opacity: 0 }}
				 transition={{ duration: 0.5 }} */
		
export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}