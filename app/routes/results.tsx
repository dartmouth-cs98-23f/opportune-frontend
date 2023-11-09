import { Form, Link } from '@remix-run/react';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
// import { motion } from 'framer-motion';

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	// console.log(JSON.stringify(myJson));

	if (_action == "getMatch") {
		try {
			const response = await axios.get('http://opportune_backend:3000/match-algorithm', myJson);
		} catch(error) {
			console.log(error)
			return null
		}
	}

	if (_action == "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});
	} 
}

export default function Results() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_logo.png"></img>
				<Form action="/results" method="post">
					<button className='logout-button' type="submit"
					name="_action" value="LogOut"> 
						<ArrowLeftOnRectangleIcon /> 
					</button>
				</Form>
			</div>
			<div id="content">
				<h2>Welcome Oppenheim </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<div>
					<p>Matching results will be out on July 2.</p>
					<p className="cta"> <Link to="/matching">Edit Responses </Link></p>
				</div>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}