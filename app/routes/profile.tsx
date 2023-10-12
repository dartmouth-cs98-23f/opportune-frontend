import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';

export default function Profile() {
	return (
		<main id="content">
			<h1>Your Name</h1>
			<header>
				<MainNavigation />
			</header>
			<p className="cta">
				<Link to="/profile">Your Resume</Link>
			</p>
			<p className="cta">
				<Link to="/profile">Your Github</Link>
			</p>
		</main>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}