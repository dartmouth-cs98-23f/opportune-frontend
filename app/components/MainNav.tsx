import { NavLink } from 'react-router-dom';

export default function MainNavigation() {
  const NavData = [
	{
		title: "Basic Info",
		link: "/profile",
		class: "pointer"
	},
	{
		title: "Available teams",
		link: "/teams",
		class: "pointer"
	},
	{
		title: "Matching",
		link: "/survey",
		class: "pointer"
	},
	{
		title: "Results",
		link: "/results",
		class: "pointer"
	},
	{
		title: "Project",
		link: "/project",
		class: "pointer icon-locked"
	},
  ]
	
  return (
    <nav id="main-navigation">
		<ul className="nav-list">
			{NavData.map((val, key) => {
				return (
					<li className="nav-row" key={key}>
						<NavLink to={"/newhire" + val.link}>
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
