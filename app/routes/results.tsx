import { Link } from '@remix-run/react';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import SurveyUtil from '~/components/survey_qs/SurveyUtil';
import Progress from '~/components/survey_qs/Progress';
import Scale from '~/components/survey_qs/Scale';
import Ranking from '~/components/survey_qs/Ranking';
import Textbox from '~/components/survey_qs/Textbox';
import PlainText from '~/components/survey_qs/PlainText';
import { motion } from 'framer-motion';

const questionList = [
  <PlainText text="Let's get started!" />,
  <Scale question="How comfortable are you with Python?"/>,
  <Ranking id={2} question="Rank the following teams (best to worst)" />, 
  <Textbox question="What was the rationale behind your first choice team?" />, <PlainText text="Thank you for your responses. You are free to edit them until July 1, and matching results will be out on July 2." />
]


export default function Results() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo" src="opportune_logo.png"></img>
				<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
			</div>
			<div id="content">
				<h2>Welcome Oppenheim </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<motion.div initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}>
					<p>Matching results will be out on July 2.</p>
					<p className="cta"> <Link to="/matching">Edit Responses </Link></p>
				</motion.div>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}