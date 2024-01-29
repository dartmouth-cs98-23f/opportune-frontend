import { Form, Link, useLoaderData } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { useState } from 'react';
import { useCalendlyEventListener, InlineWidget, PopupButton, PopupModal } from "react-calendly";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
// import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
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

		async function getProfileRes() {
			const profileRes = await axios.get(process.env.BACKEND_URL + '/api/v1/newhire/profile', {
				headers: {
					"Authorization": session.get("auth"),
					"Content-Type": "application/json",
				}
			});
			console.log("Getting profile: ", profileRes.data)
			return profileRes.data
		}

		async function getTeamInfoRes() {
			const teamInfoRes = await axios.get(process.env.BACKEND_URL + '/api/v1/newhire/team-info', {
				headers: {
					"Authorization": session.get("auth"),
					"Content-Type": "application/json",
				},
			});
			return teamInfoRes.data
		}

		const [profileRes,teamInfoRes] = await Promise.all([
			getProfileRes(),
			getTeamInfoRes()
		]);

		return json({ profile: profileRes, teamInfo: teamInfoRes });
		
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Results() {
	const resultsData = useLoaderData<typeof loader> ();
	console.log("team: ", resultsData); // why is this whole thing null?? resultsData.profile should still be populated with profile data

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
				<h2>Welcome {resultsData.profile.new_hire.first_name ? 
				             resultsData.profile.new_hire.first_name : "New Hire"} </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<div>
					{matchingResults(resultsData)}
				</div>
			</div>
		</div>
	)
}

export function matchingResults(resultsData: json) {
	if(resultsData.teamInfo) {
		
		const team = resultsData.teamInfo.team;
		const [expanded, setExpanded] = useState(false);
		const [isOpen, setIsOpen] = useState(false);

		const prefill={
			email: resultsData.profile.email,
			firstName: resultsData.profile.new_hire.first_name,
			lastName: resultsData.profile.new_hire.last_name,
			name: resultsData.profile.new_hire.first_name + " " + resultsData.profile.new_hire.last_name,
		}

		return (
			<div>
				<p>Congrats! You were matched to the following team: </p>
				<h1>{team.name}</h1>
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
						<Confetti colors={['#1E2578', '#4559B8', '#A9B2DC', '#EAF1FE', '#FF892F']}/>
					</div>
				</div>
				<p className="cta">
					<Form action="/results" method="post">
						<button type="submit" name="_action" value="LogOut">Done</button>
					</Form>
				</p>
			</div>
		
		)
	} else {
		return (<div>
				  <p>Matching results will be out on July 2.</p>
				  <p className="cta"> <Link to="/matching">Edit Responses </Link></p>
			    </div>)
	}
}
