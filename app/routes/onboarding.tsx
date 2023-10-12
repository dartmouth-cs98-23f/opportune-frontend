import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';

export default function Onboarding() {
	return (
		<main id="content">
			<h1>Onboarding</h1>
			<header>
				<MainNavigation />
			</header>
			<p className="cta">
				<h3>Module 1: Description </h3>
				<h3>Module 2: Description </h3>
				<h3>Module 3: Description </h3>
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