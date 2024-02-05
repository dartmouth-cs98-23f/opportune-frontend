import { Form, Link, useLoaderData } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon, StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as SolidStarIcon} from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import { useCalendlyEventListener, InlineWidget, PopupButton, PopupModal } from "react-calendly";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getSession, destroySession } from '~/utils/sessions';
import axios from 'axios';

// ACTION FUNCTION
export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();

	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);

	const favoriteJson = body.get("favorites");

	// Actions
	if (_action == "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});

	} else {
		try {
			const newFavs = {favorited_teams: favoriteJson ? favoriteJson.split(",") : []};
			const response = await axios.patch(process.env.BACKEND_URL + '/api/v1/newhire/profile', newFavs, {
				headers: {
					"Authorization": session.get("auth"),
					"Content-Type": "application/json",
				},
			})
			return null;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}

// LOADER FUNCTION
export async function loader({request}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		if(!session.has("auth") || (session.has("user_type") && session.get("user_type") !== "new_hire")) {
			return redirect("/login");
		}

		async function getTeamsRes() {
			const teamRes = await axios.get(process.env.BACKEND_URL + '/api/v1/user/list-teams', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			}});
			return teamRes.data
		}

		async function getProfileRes() {
			const profileRes = await axios.get(process.env.BACKEND_URL + '/api/v1/newhire/profile', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			}});
			return profileRes.data
		}

		const [profileRes, teamsRes] = await Promise.all([
			getProfileRes(),
			getTeamsRes()
		]);

		return json({ profile: profileRes, teams: teamsRes });
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
	const teamInfoList = teamInfo.teams.teams;

	const favoritedTeamList = teamInfo.profile.new_hire.favorited_teams;
	const [favoritedTeams, setFavoritedTeams] = useState(favoritedTeamList);
	const [isOpen, setIsOpen] = useState(false);

	const prefill={
		email: teamInfo.profile.email,
		firstName: teamInfo.profile.new_hire.first_name,
		lastName: teamInfo.profile.new_hire.last_name,
		name: teamInfo.profile.new_hire.first_name + teamInfo.profile.new_hire.last_name,
	}

    return (
        <div id="portal-root" className="flex-container">
            <div id="sidebar">
                <img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
				<Form action="/newhire/teams" method="post">
					<button className='logout-button' type="submit" 
					name="_action" value="LogOut">
					<ArrowLeftOnRectangleIcon /> 
					</button>
				</Form>
            </div>
            <div id="content">
                <h2>Welcome {teamInfo.profile.new_hire.first_name ? 
				             teamInfo.profile.new_hire.first_name : "New Hire"} </h2>
                <div id="menubar">
                    <MainNavigation />
                </div>

                <div className="horiz-flex-container">
					<Form action="/newhire/teams" method="post" className="teams-container">
						{teamInfoList.map((team) => {
							const [expanded, setExpanded] = useState(false);

							const handleFavorite = (teamName) => {
								setFavoritedTeams(prevTeams => {

								// If already favorited, remove it 
								if (prevTeams.includes(teamName)) {
									return prevTeams.filter(team => team !== teamName);
								} else {
									return [...prevTeams, teamName];
								}
							});

							}

							return <div className="team-box" key={team.name}>
								<div className="team-text">
									<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
										<h3>{team.name}</h3>
										<input type="hidden" name="favorites" defaultValue={favoritedTeams} value={favoritedTeams}/>
										{favoritedTeamList.includes(team.name) ? (  
											<button type="submit" name="_action" className="favorite-btn" onClick={() => handleFavorite(team.name)} value="updateFavorite">
												<SolidStarIcon className="star-icon"/>
											</button>
											
										) : (
											<button type="submit" name="_action" className="favorite-btn" onClick={() => handleFavorite(team.name)} value="updateFavorite">
												<StarIcon className="star-icon"/>
											</button>
										)}
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
						})}
					</Form>
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
                    <Link to="/newhire/profile">{"←"}</Link>
                    <Link to="/newhire/survey">{"→"}</Link>
                </p>
            </div>
        </div>
    )
}
