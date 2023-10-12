import { Link, Form } from '@remix-run/react';
import loginStyle from '~/styles/home.css'

export default function Login() {
  return (
    <main id="block-container">
      <h1>Opportune</h1>
      <p>Tuning the opportunities you will have at your company to the maximum.</p>
	  <Form method="post" id="login">
		<p>
			<label htmlFor="username">Username</label>
			<input type="text" id="username" name="username" required />
		</p>
		<p>
			<label htmlFor="password">Password</label>
			<input type="password" name="password" required />
		</p>
		<div className="form-actions">
			<button> {'Login'} </button>
		</div>
		<p className="cta">
        	<Link to="/dashboard">Login</Link>
     	</p>
	  </Form>
	  <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </main>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}