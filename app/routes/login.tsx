import { Link, Form } from '@remix-run/react';
import { redirect, ActionFunctionArgs } from '@remix-run/node';
import loginStyle from '~/styles/home.css'
import axios from 'axios';

export async function action({
	request,
  }: ActionFunctionArgs) {
	const body = await request.formData();

	var myJson = {};
	for(const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.post('http://opportune_backend:3000/auth/login', myJson);

	} catch(error) {
		console.log(error)
		return null
	}
	
	return redirect(`/profile`);
  }

// required tags on username and password
export default function Login() {
  return (
    <main className="block-container">
      <h1>Opportune</h1>
      <p>Tuning the opportunities you will have at your company to the maximum.</p>
	  <Form method="post" action="/login" id="login">
		<p>
			<label htmlFor="username">Username</label>
			<input type="text" id="username" name="username" required />
		</p>
		<p>
			<label htmlFor="password"><b>Password:</b></label>
			<input type="password" name="password" />
		</p>
		<div className="form-actions">
			<button type="submit"> {'Login'} </button>
		</div>
	  </Form>
	  <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </main>
  );
}

/* <button type="submit">Login</button> */

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}