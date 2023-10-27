import { Link } from '@remix-run/react';
import styles from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
// import { motion } from 'framer-motion';


export default function Results() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo" src="opportune_logo.png"></img>
				<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
			</div>
			<div id="content">
				<h2>Welcome Oppenheim </h2>
				<div id="menubar">
					<MainNavigation />
				</div>
				<div>
					<p>Matching results will be out on July 2.</p>
					<p className="cta"> <Link to="/matching">Edit Responses </Link></p>
				</div>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}