import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';

export default function Profile() {
	return (
		<div id="flex-container">
			<div id="sidebar">
				<MainNavigation />
			</div>
			<div id="content">
				<h1>Your Name</h1>
				<p className="cta">
					<Link to="/profile">Your Resume</Link>
				</p>
				<p className="cta">
					<Link to="/profile">Your Github</Link>
				</p>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}