import { Link, Form } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Scale from '~/components/survey_qs/Scale';
import { motion } from "framer-motion";


{/* <MainNavigation /> */}
export default function Profile() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo" src="opportune_logo.png"></img>
				<div className="dropdown">
					<Link className='profile-button' to=""> 
						<UserCircleIcon />
					</Link>
					<div className="dropdown-content">
					<Link className='logout-button' to="login">
						<ArrowLeftOnRectangleIcon /> 
					</Link>
					</div>
				</div>
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
				<div>
					Upload a new photo
					<Form>
						
					</Form>
				</div>
				<div>
					Education
					<Form action="submit.php" method="post" className="education-form">
					<label htmlFor="school"> School </label>
					<input name="school" type="text" />

					<label htmlFor="school-email"> School email </label>
					<input name="school-email" type="text" />
					
					<label htmlFor="grad-month"> Graduation month </label>
					<input name="grad-month" type="text" />

					<label htmlFor="grad-year"> Graduation year </label>
					<input name="grad-year" type="text" />

					<label htmlFor="major"> Major </label>
					<input name="major" type="text" />
					</Form>
					<p className="cta">
				    	<Link to="/teams">Save</Link>
					</p>
				</div>
				</motion.div>
			</div>
		</div>
	)
}


export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}