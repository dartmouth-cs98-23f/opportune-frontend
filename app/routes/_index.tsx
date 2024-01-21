import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';

export default function Index() {
  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Tuning the opportunities you will have at your company to the maximum.</p>
			<p className="cta">
				<Link to="/signup">New Hires</Link>
				<Link to="/tsignup">Teams</Link>
			</p>
		</div>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}