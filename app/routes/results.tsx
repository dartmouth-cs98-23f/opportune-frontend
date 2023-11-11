import { Form, Link, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { useState } from 'react';
import { useCalendlyEventListener, InlineWidget, PopupButton, PopupModal } from "react-calendly";
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
		if (!session.get("auth")) {
			return redirect("/login")
		}

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
				<img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
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
	console.log("Team Info: " + teamInfo);

	if(teamInfo) {
		
		const team = teamInfo.data.team;
		const [expanded, setExpanded] = useState(false);
		const [isOpen, setIsOpen] = useState(false);

		const prefill={
			email: 'test@test.com',
			firstName: 'Jon',
			lastName: 'Snow',
			name: 'Jon Snow',
		}

		return (
			<div>
				<p>Congrats, we found you a team!</p>
				<p>We think you'd be an excellent match.</p>
				<div className="team-box" key={team.name}>
					<div className="team-text">
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
							<h3>{team.name}</h3>
						</div>
						
						<p> 
							<b>Tools and Technologies: </b>
							{team.skills.map(skills => skills.name).join(", ")}
						</p>
						<p className='read-more-btn' onClick={() => setExpanded(!expanded)}>
							{expanded ? 'Read Less' : 'Read More'}  
						</p>

						{expanded && 
							<div className="expanded-content">
								<div className="text-content">
									<p>Description: {team.description}</p>
								</div>

								<button
									className='schedule-btn'
									onClick={() => setIsOpen(true)}
									type='button'>
									Schedule meeting
								</button>
								{isOpen && 
								<div className='calendly-overlay'>
									<div className='calendly-close-overlay' onClick={() => setIsOpen(false)}></div>
									<div className='calendly-popup'>
										<div className='calendly-popup-content'>
											<InlineWidget url="https://calendly.com/ryanl23" 
												prefill={prefill}
											/>
										</div>
									</div>
								</div>
								}

							</div>
						}
					</div>
				</div>
			</div>
		)
	} else {
		return (<p>Matching results will be out on July 2.</p>)
	}
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}