import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';

export default function Teams() {
	return (
		<div id="flex-container">
			<div id="sidebar">
				<MainNavigation />
			</div>
			<div id="content">
				<h1>Welcome, Intern</h1>
				<p className="cta">
					<h3>Team 1: Description, Projects, Calendly Link </h3>
					<h3>Team 2: Description, Projects, Calendly Link </h3>
					<h3>Team 3: Description, Projects, Calendly Link </h3>
				</p>
				<p className="cta">
					<Link to="/dashboard">Back</Link>
				</p>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}