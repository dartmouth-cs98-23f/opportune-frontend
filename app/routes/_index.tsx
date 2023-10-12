import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';

export default function Index() {
  return (
    <main id="content">
      	<h1>Opportune</h1>
      	<p>Tuning the opportunities you will have at your company to the maximum.</p>
		<p className="cta">
			<Link to="/signup">Get Started</Link>
		</p>
    </main>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}