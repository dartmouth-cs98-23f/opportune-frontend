import { Link } from '@remix-run/react';

export default function Go() {
  return (
    <div className="block-container">
      <div className="landing-box">
        <img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
        <h1>Opportune</h1>
        <p>
          Tuning the opportunities you will have at your company to the maximum.
        </p>
        <p className="cta">
          <Link to="/login">Login</Link>
          <Link to="/company/signup">Enroll Your Company</Link>
        </p>
      </div>
    </div>
  );
}
