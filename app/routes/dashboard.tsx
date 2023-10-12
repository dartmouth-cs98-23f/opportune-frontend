import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';

export default function DashBoard() {
	return (
		<main id="content">
			<h1>Welcome, Intern</h1>
			<header>
				<MainNavigation />
			</header>
			<p className="cta">
				<Link to="/profile">Your Profile</Link>
			</p>
		</main>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}