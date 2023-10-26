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
							<h3>Personal</h3>
							
							<div className="field-container">
								<label htmlFor="first-name"> First Name </label>
								<input name="first-name" type="text" />
							</div>

							<div className="field-container">
								<label htmlFor="last-name"> Last Name </label>
								<input name="last-name" type="text" />
							</div>

							<div className="field-container">
								<label htmlFor="race"> Race </label>
								<select id="race" name="race">
									<option value="White">White</option>
									<option value="Black">Black</option>
									<option value="Hispanic/Latino">Hispanic/Latino</option>
									<option value="Asian">Asian</option>
									<option value="American Indian">American Indian</option>
									<option value="Pacific Islander">Pacific Islander</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<div className="field-container">
								<label htmlFor="sex"> Sex </label>
								<select id="sex" name="sex">
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>

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
							<select id="grad-month" name="grad-month">
								<option value="January">January</option>
								<option value="February">February</option>
								<option value="March">March</option>
								<option value="April">April</option>
								<option value="May">May</option>
								<option value="June">June</option>
								<option value="July">July</option>
								<option value="August">August</option>
								<option value="September">September</option>
								<option value="October">October</option>
								<option value="November">November</option>
								<option value="December">December</option>
							</select>
							</div>
							

							<div className="field-container">
							<label htmlFor="grad-year"> Graduation year </label>
							<input name="grad-year" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="major"> Major </label>
							<input name="major" type="text" />
							</div>

							<h3>Address and basic info</h3>
							<div className="field-container">
							<label htmlFor="email-address"> Email Address </label>
							<input name="email-address" type="text" />
							</div>
							
							<div className="field-container">
							<label htmlFor="address"> Address </label>
							<input name="address" type="text" />
							</div>

							<div className="field-container">
							<label htmlFor="city"> City  </label>
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
						</Form>
					</div>
				</div>
				<p className="cta">
					<Link to="/teams">Next</Link>
				</p>
			</div>
		</div>
	)
}

// https://egghead.io/blog/validating-remix-form-data-using-zod-and-typescript-in-action-functions

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}