import { Link, Form, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import ImageUpload from '~/components/ImageUpload';
import TextField from '~/components/TextField';
import SelectField from '~/components/SelectField';
import axios from 'axios';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, json, LoaderFunction } from '@remix-run/node';
import { useState } from 'react';
import { getSession } from '../utils/sessions';
// import { motion } from "framer-motion";

export async function action({request}: ActionFunctionArgs) {
	
	const body = await request.formData();

	const session = await getSession(
		request.headers.get("Cookie")
	);

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.patch('http://opportune_backend:3000/users/newhire/profile', myJson, {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.log(error);
		return null;
	}

	return redirect(`/teams`);
}

export async function loader({
	request,
}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		console.log("here");
		console.log(session);

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

export default function Profile() {
	const basicInfo = useLoaderData<typeof loader>();
	const basicInfoFields = basicInfo.data.newHire

	/* const basicInfoFields = {
		first_name: "", last_name: "", race: "", sex: "", 
		school: "", grad_month: "", grad_year: "", major: "",
		email: "", address: "", city: "", state_province: "", zip_code: ""
	} */

	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_logo.svg"></img>
				<Link className='logout-button' to="/login">
					<ArrowLeftOnRectangleIcon /> 
				</Link>
			</div>
			<div id="content">
				<h2>Welcome {basicInfoFields.first_name ? 
				             basicInfoFields.first_name : "Intern"} </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<div className="form-container">
					<div>
						<Form action="/profile" method="post" className="info-form">
							<h3>Demographics</h3>
							<TextField label="First Name" classLabel="first_name" value={basicInfoFields.first_name}/>
							<TextField label="Last Name" classLabel="last_name" value={basicInfoFields.last_name} />
							<SelectField label="Race" classLabel={basicInfoFields.race}
							 options={["White", "Black", "Hispanic/Latino", "Asian", "American Indian", "Pacific Islander", "Other"]} value={basicInfoFields.race} />
							<SelectField label="Sex" classLabel={basicInfoFields.sex}
							 options={["Male", "Female"]} value={basicInfoFields.sex} />

							<h3>Education</h3>
							<TextField label="School" classLabel="school" value={basicInfoFields.school} />
							<SelectField label="Graduation month" classLabel={basicInfoFields.grad_month}
							 options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]} value={basicInfoFields.grad_month} />
							<TextField label="Graduation year" classLabel="grad_year" value={basicInfoFields.grad_year} />
							<TextField label="Major" classLabel="major" value={basicInfoFields.major} />

							<h3>Address and basic info</h3>
							<TextField label="Email Address" classLabel="email-address" value={basicInfoFields.email}/>
							<TextField label="Address" classLabel="address" value={basicInfoFields.address}/>
							<TextField label="City" classLabel="city" value={basicInfoFields.city}/>
							<TextField label="State/Province" classLabel="state_province" value={basicInfoFields.state_province}/>
							<TextField label="Zip Code" classLabel="zip_code" value={basicInfoFields.zip_code}/>

							<h3>Profile Picture</h3>
							<ImageUpload file={basicInfoFields.image_url}/>
							<p className="cta">
								<button type="submit">Next</button>
							</p>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

/* <Link to="/teams">Next</Link> */

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}
