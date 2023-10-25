import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link, Form} from '@remix-run/react';
import loginStyle from '~/styles/home.css'

export default function SignUp() {
  return (
    <div className="block-container">
      	<h1>Opportune</h1>
      	<Form action="/api/signup" method="post" id="login">
			<p>
				<label id="username">Pick a username: </label>
				<input type="text" id="username" name="username" required />
			</p>
			<p>
				<label id="password">Pick a strong password: </label>
				<input type="password" name="password" required />
			</p>	
			<p className="cta">
				<button type="submit">Confirm</button>
			</p>
	  	</Form>
		
		<p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}