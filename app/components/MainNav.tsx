import { NavLink } from '@remix-run/react';

function MainNavigation() {
  return (
    <nav id="main-navigation">
      <ul>
        <li className="nav-item">
          <NavLink to="/dashboard">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/profile">Profile</NavLink>
        </li>
		<li className="nav-item">
          <NavLink to="/teams">Teams</NavLink>
        </li>
		<li className="nav-item">
          <NavLink to="/matching">Matching</NavLink>
        </li>
		<li className="nav-item">
          <NavLink to="/onboarding">Onboarding</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default MainNavigation;