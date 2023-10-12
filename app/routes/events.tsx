import { Link } from '@remix-run/react';
import styles from '~/styles/home.css'
import MainNavigation from '~/components/MainNav';

export default function Events() {
	return (
		<div id="flex-container">
			<div id="sidebar">
				<MainNavigation />
			</div>
			<div id="content">
				<h1>Upcoming Events</h1>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}