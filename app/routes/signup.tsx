import { Link, Form } from '@remix-run/react';
import { redirect, ActionFunctionArgs } from '@remix-run/node';
import loginStyle from '~/styles/home.css';
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
		const response = await axios.post('http://opportune_backend:3000/auth/register', myJson);

		if(response.status == 204) {
			console.log("Username is already in use.")
			return null
		}

	} catch(error) {
		console.log(error)
	}
	
	return redirect(`/login`);
  }

export default function SignUp() {

  return (
    <div className="block-container">
      	<h1>Opportune</h1>
		<img className="opportune-logo-large" src="opportune_logo.svg"></img>
		<p>Tuning the opportunities you will have at your company to the maximum.</p>
      	<Form method="post" action="/signup" id="login">
          <p className="login-field">
            <label id="username">Pick a username: </label>
            <input type="text" id="username" name="username" required />
          </p>
          <p className="login-field">
            <label id="password">Pick a strong password: </label>
            <input type="password" name="password" required />
          </p>
          <button type="submit">Submit</button>
	  	  </Form>
		<p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}