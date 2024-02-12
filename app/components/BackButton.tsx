import styles from '~/styles/home.css';
import { Link } from '@remix-run/react';

export default function Button(text: string) {
  return (
	<p className="cta">
		<Link to="/dashboard">{text}</Link>
	</p>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}