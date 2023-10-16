import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import Survey from '~/components/Survey'
import MainNavigation from '~/components/MainNav';

export default function Matching() {
	return (
		<div id="flex-container">
			<div id="sidebar">
				<MainNavigation />
			</div>
			<div id="content">
				<h1>Matching Survey</h1>
				<Survey />
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