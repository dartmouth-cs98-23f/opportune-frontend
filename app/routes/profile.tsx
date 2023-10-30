import { Link, Form } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import ImageUpload from '~/components/ImageUpload';
import TextField from '~/components/TextField';
import SelectField from '~/components/SelectField';
// import { motion } from "framer-motion";

export default function Profile() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_logo.svg"></img>
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
						<Form action="/" method="post" className="info-form">
							<h3>Demographics</h3>
							<TextField label="First Name" classLabel="first-name"/>
							<TextField label="Last Name" classLabel="last-name"/>
							<SelectField label="Race" classLabel="race" 
							 options={["White", "Black", "Hispanic/Latino", "Asian", "American Indian", "Pacific Islander", "Other"]} />
							<SelectField label="Sex" classLabel="sex" 
							 options={["Male", "Female"]} />

							<h3>Education</h3>
							<SelectField label="Graduation month" classLabel="grad-month" 
							 options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} />
							<TextField label="Graduation year" classLabel="grad-year"/>
							<TextField label="Major" classLabel="major"/>

							<h3>Address and basic info</h3>
							<TextField label="Email Address" classLabel="email-address"/>
							<TextField label="Address" classLabel="address"/>
							<TextField label="City" classLabel="city"/>
							<TextField label="State/Province" classLabel="state"/>
							<TextField label="Zip Code" classLabel="zip"/>

							<h3>Profile Picture</h3>
							<ImageUpload />
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

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
