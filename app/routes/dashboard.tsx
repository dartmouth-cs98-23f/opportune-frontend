import { Link } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';

export default function DashBoard() {
	return (
		<div id="flex-container">
			<div id="sidebar">
				<MainNavigation />
			</div>
			<div id="content">
				<div id="menubar">
					<h1>Welcome, Intern</h1>
				</div>
				<p> 1. Fill out your profile - "Profile" </p>
				<p> | </p>
				<p> | </p>
				<p> 2. Research and meet with potential teams - "Teams" </p>
				<p> | </p>
				<p> | </p>
				<p> 3. Take the matching survey - "Matching" </p>
				<p> | </p>
				<p> | </p>
				<p> 4. View your matching results - "Matching" </p>
				<p> | </p>
				<p> | </p>
				<p> 5. Complete your onboarding tasks - "Onboarding / Events" </p>
				<p> | </p>
				<p> | </p>
				<p> 6. Track your project tasks - "Projects" </p>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}