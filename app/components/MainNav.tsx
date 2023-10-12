import { Link } from '@remix-run/react';
import { NavData } from '~/components/NavData';
import styles from '~/styles/main.css'

export default function MainNavigation() {
  return (
    <nav id="main-navigation">
		<ul className="nav-list">
			{NavData.map((val, key) => {
				return (
					<li className="nav-row" key={key}>
						<Link to={val.link}>
							<div>
								{val.icon}
								{val.title}
							</div>
						</Link>
					</li>
				)
			})}
		</ul>
	</nav>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}