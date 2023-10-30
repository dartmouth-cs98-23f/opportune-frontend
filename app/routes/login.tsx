import { Link, Form } from '@remix-run/react';
import { redirect, ActionFunctionArgs } from '@remix-run/node';
import loginStyle from '~/styles/home.css'
import axios from 'axios';
import TextField from '~/components/TextField';

export async function action({
	request,
  }: ActionFunctionArgs) {
	const body = await request.formData();

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.post('http://opportune_backend:3000/auth/login', myJson);

	} catch(error) {
		console.log(error)
		return null
	}
	
	return redirect(`/dashboard`);
  }


export default function Login() {
  return (
    <main className="block-container">
      <h1>Opportune</h1>
	  <img className="opportune-logo-large" src="opportune_logo.svg"></img>
      <p>Tuning the opportunities you will have at your company to the maximum.</p>
	  <Form method="post" action="/login" id="login">
	  	<p className="login-field">
			<label htmlFor="username"><b>Email address</b></label>
			<input name="username" />
		</p>

		<p className="login-field">
			<label htmlFor="password"><b>Password</b></label>
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