import { Form, Link, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
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

	if (_action == "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});
	} 
}

export async function loader({request}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		console.log("Auth: ", session.get("auth"));

		const response = await axios.get(process.env.BACKEND_URL + '/users/newhire/team-info', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			const data = response.data;
			console.log(data);
			return json({ data });
		} else if (response.status === 404) {
			return null;
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Results() {
	const teamInfo = useLoaderData<typeof loader> ();

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
					{matchingResults(teamInfo)}
					<p className="cta"> <Link to="/matching">Edit Responses </Link></p>
				</div>
			</div>
		</div>
	)
}

export function matchingResults(teamInfo: json) {
	if(teamInfo) {
		return (<p>Congrats! You were matched to {teamInfo.data.team.name}</p>)
	} else {
		return (<p>Matching results will be out on July 2.</p>)
	}
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}