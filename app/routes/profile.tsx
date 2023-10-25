import { Link, Form } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Scale from '~/components/survey_qs/Scale';
// import { motion } from "framer-motion";

{/* <Link className='profile-button' to=""> 
						<UserCircleIcon />
					</Link> */}

{/* <MainNavigation /> */}
export default function Profile() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo" src="opportune_logo.png"></img>
				<Link className='logout-button' to="/login">
					<ArrowLeftOnRectangleIcon /> 
				</Link>
			</div>
			<div id="content">
				<h2>Welcome Oppenheim </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<div className="form-container">
					<div>
						<Form action="/" method="post" className="education-form">
							<h3>Education</h3>
							<div className="field-container">
							<label htmlFor="school"> School </label>
							<input name="school" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="school-email"> School email </label>
							<input name="school-email" type="text" />
							</div>
							
							<div className="field-container">
							<label htmlFor="grad-month"> Graduation month </label>
							<input name="grad-month" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="grad-year"> Graduation year </label>
							<input name="grad-year" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="major"> Major </label>
							<input name="major" type="text" />
							</div>
							<p className="cta longer">
								<button type="submit">Save</button>
							</p>
						</Form>
					</div>
					<div>
						
						<Form action="/profile" method="post" className="education-form">
							<h3>Address and basic info</h3>
							<div className="field-container">
							<label htmlFor="full-name"> Full Name </label>
							<input name="full-name" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="email-address"> Email Address </label>
							<input name="email-address" type="text" />
							</div>
							
							<div className="field-container">
							<label htmlFor="address"> Address </label>
							<input name="address" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="city"> City </label>
							<input name="city" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="state"> State/Province </label>
							<input name="state" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="zip"> Zip Code </label>
							<input name="zip" type="text" />
							</div>

							<p className="cta longer">
								<button type="submit">Save</button>
							</p>
						</Form>
						<p className="cta bottom-right">
							<Link to="/teams">Next</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}


export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}