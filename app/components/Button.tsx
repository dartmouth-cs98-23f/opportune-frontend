import styles from '~/styles/home.css';
import { Link } from '@remix-run/react';

interface ButtonProps {
	text: string;
}

export default function Button(props:ButtonProps) {
  return (
	<p className="cta">
		<Link to="">{props.text}</Link>
	</p>
  )
}

function links() {
	return [{ rel: 'stylesheet', href: styles }];
}