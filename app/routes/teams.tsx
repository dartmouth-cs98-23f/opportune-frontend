import { Form, Link, useLoaderData } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useCalendlyEventListener, InlineWidget, PopupButton } from "react-calendly";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
import axios from 'axios';
// import { motion } from 'framer-motion';

// const teamInfo = [
//     {
//         name: "Data Science",
//         description: "The Data Science Team is committed to leveraging data-driven approaches to support informed decision-making, optimize processes, and drive innovation within the company. We transform raw data into actionable insights, predictive models, and data products that contribute to the overall success of the organization.",
//         tech: "Python, R, scikit-learn, Tensorflow, Pytorch, AWS, Azure, SQL, PowerBI"
//     },
//     {
//         name: "Finance",
//         description: "The Finance Team is dedicated to maintaining financial stability, optimizing resource allocation, and providing accurate financial guidance to support the company's growth and sustainability. We are responsible for managing the company's finances, forecasting, and analyzing financial data, and ensuring regulatory compliance.",
//         tech: "EXCEL MONKEY EVERYDAY"
//     },
//     {
//         name: "Cybersecurity",
//         description: "The Cybersecurity Team is dedicated to protecting the company's digital assets, ensuring the confidentiality, integrity, and availability of data, and mitigating cyber threats. We implement robust security measures, conduct risk assessments, and stay vigilant in defending against evolving cyber threats.",
//         tech: "SIEM, IDPS, Antivirus / anti-malware software, encryption tools, vulnerability scanning, IAM platforms",
//     }
// ]

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");
	console.log(_action);

	const session = await getSession(
		request.headers.get("Cookie")
	);

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

		const response = await axios.get(process.env.BACKEND_URL + '/user/list-teams/', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			const data = response.data;
			// console.log(data);
			return json({ data });
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};

export default function Teams() {
	const [events, setEvents] = useState([]);

    useCalendlyEventListener({
        onEventScheduled: (event) => {
			fetchEvents(event.data.payload.event.uri);
        }
    });

	const formatTime = (time) => {
		const date = new Date(time);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		const formattedTime = `${formattedHours}:${formattedMinutes}${ampm}`;
		return formattedTime;
	}

	const fetchEvents = async(uri) => {

		const token = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjk5MzE0NjM2LCJqdGkiOiJkYjE0NzEwZS04NGM3LTQ0YmEtYTFmOC0wNDQzNjM0ZDgxNzYiLCJ1c2VyX3V1aWQiOiI5MzA0Yzg4OC1mN2E1LTRkZmItYTUzZC1lZjJjNzM5NWJkNWEifQ.f87XL5gBVApxKTQ2Oonlvdxed4zEWCsUvt6qko8qq54SvNJfL08WAqWvGlWARJW06uaOW40PISyBnxQJKWuLOw";

		try {
			const response = await fetch(uri, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			setEvents(prev => [...prev, data]);
		} catch (error) {
			console.error(error);
		}
	}

	const teamInfo = useLoaderData<typeof loader>();
	const teamInfoList = teamInfo.data.teams;
	console.log(teamInfoList);

    return (
        <div className="flex-container">
            <div id="sidebar">
                <img className="opportune-logo-small" src="opportune_logo.png"></img>

				<Form action="/teams" method="post">
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

                <div className="horiz-flex-container">
					<div className="teams-container">
						{teamInfoList.map((team) => {
							const [expanded, setExpanded] = useState(false);

							return <div className="team-box" key={team.name}>
								<div className="team-text">
									<h3>{team.name}</h3>
									<p> 
									<b>Tools and Technologies: </b>
									{team.skills.map((skill) => (skill.name + ", "))}
									</p>
									<p className='read-more-btn' onClick={() => setExpanded(!expanded)}>
										{expanded ? 'Read Less' : 'Read More'}  
									</p>

									{expanded && 
										<div className="expanded-content">
											<div className="text-content">
												<p>Description: {team.description}</p>
											</div>
											{/* <InlineWidget url="https://calendly.com/ryanl23" /> */}
											<PopupButton
												className='schedule-btn'
												url="https://calendly.com/ryanl23"
												key={team.name}
												/*
												* react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
												* specify the rootElement property to ensure that the modal is inserted into the correct domNode.
												*/
												rootElement={document.body}
												text="Schedule meeting"
											/>
										</div>
									}
								</div>
							</div>
						})}
					</div>
					<div className="meets-container">
						{events ? events.map((event) => {
							return <div className="team-box">
								<div className="team-text" key={event.resource.name}>
									<h3> {event.resource.name}</h3>
									<p>Date: {new Date(event.resource.start_time).toLocaleDateString()}</p>
									<p>Start Time: {formatTime(event.resource.start_time)}</p>
									<p>End Time: {formatTime(event.resource.end_time)}</p>
								</div>
							</div>
						}) : <p>No events booked yet!</p>}
					</div>
                </div>

                <p className="cta">
                    <Link to="/profile">Previous</Link>
                    <Link to="/matching">Next</Link>
                </p>
            </div>
        </div>
    )
}

export function links() {
    return [{ rel: 'stylesheet', href: loginStyle }];
}