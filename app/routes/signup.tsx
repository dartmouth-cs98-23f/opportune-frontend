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
	
	myJson["user_type"] = "new_hire";

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.post(process.env.BACKEND_URL + '/auth/register', myJson);

		if (response.status == 204) {
			console.log("Username is already in use.");
			alert("Username is already in use.");
			return null
		}

	} catch(error) {
		console.log(error)
		return redirect('/signup')
	}
	
	return redirect(`/login`);
  }

export default function SignUp() {

  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Tuning the opportunities you will have at your company to the maximum.</p>
			<Form method="post" action="/signup" id="login">
			<p className="login-field">
				<label id="email">Pick a username: </label>
				<input type="text" id="email" name="email" required />
			</p>
			<p className="login-field">
				<label id="password">Pick a strong password: </label>
				<input type="password" name="password" required />
			</p>
			<p className="cta">
				<button type="submit">Submit</button>
			</p>
			</Form>
			<p>Already have an account? <Link to="/login">Sign in</Link></p>
		</div>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}