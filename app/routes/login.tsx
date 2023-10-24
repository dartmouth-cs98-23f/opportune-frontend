import { Link, Form } from '@remix-run/react';
import loginStyle from '~/styles/home.css'

// required tags on username and password
export default function Login() {
  return (
    <main className="block-container">
      <h1>Opportune</h1>
      <p>Tuning the opportunities you will have at your company to the maximum.</p>
	  <Form method="post" id="login">
		<p><b>Username:</b> john.doe.24@dartmouth.edu </p>
		<p>
			<label htmlFor="password"><b>Password:</b></label>
			<input type="password" name="password" />
		</p>
		<div className="form-actions">
			<Link to="/profile"> {'Login'} </Link>
		</div>
	  </Form>
	  <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </main>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}