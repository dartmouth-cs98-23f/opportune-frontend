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
							<div className={val.class ? val.class : ''}>
								<p className="icon-title">{val.title}</p>
							</div>
							
						</NavLink>
					</li>
				)
			})}
		</ul>
	</nav>
  );
}

// {val.icon}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}