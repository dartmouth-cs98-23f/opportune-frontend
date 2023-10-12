import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';

export default function Teams() {
	return (
		<main id="content">
			<h1>Welcome, Intern</h1>
			<header>
				<MainNavigation />
			</header>
			<p className="cta">
				<h3>Team 1: Description, Projects, Calendly Link </h3>
				<h3>Team 2: Description, Projects, Calendly Link </h3>
				<h3>Team 3: Description, Projects, Calendly Link </h3>
			</p>
			<p className="cta">
				<Link to="/dashboard">Back</Link>
			</p>
		</main>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}