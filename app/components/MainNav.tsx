import { NavData } from '~/components/NavData';
import { NavLink } from 'react-router-dom';
import styles from '~/styles/home.css'

export default function MainNavigation() {
  return (
    <nav id="main-navigation">
		<ul className="nav-list">
			{NavData.map((val, key) => {
				return (
					<li className="nav-row" key={key}>
						<NavLink to={val.link}>
							<div>
								{val.icon}
								{val.title}
							</div>
						</NavLink>
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