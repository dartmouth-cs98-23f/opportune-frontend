import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import Survey from '~/components/Survey'
import MainNavigation from '~/components/MainNav';
// import BackButton from '~/components/BackButton';

export default function Matching() {
	return (
		<main id="content">
			<h1>Matching Survey</h1>
			<header>
				<MainNavigation />
			</header>
			<p>Start your internship off in the team of best opportunity.</p>
			<Survey />
		</main>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}