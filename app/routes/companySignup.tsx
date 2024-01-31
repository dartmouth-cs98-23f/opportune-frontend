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
	
	myJson["user_type"] = "company";

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/register', myJson);

		if (response.status == 204) {
			console.log("Username is already in use.");
			alert("Username is already in use.");
			return null
		}

	} catch(error) {
		console.log(error)
		return redirect('/companySignup')
	}
	
	return redirect(`/companyLogin`);
  }

export default function SignUp() {

  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Find your new hires a team faster than ever before</p>
			<Form method="post" action="/companySignup" id="login">
      <p className="login-field">
        <label id="name">Company name: </label>
        <input type="text" id="name" name="name" required />
			</p>
      {/* <p className="login-field">
        <label id="location">Company location: </label>
        <input type="text" id="name" name="name" required />
			</p> */}
			<p className="login-field">
				<label id="email">Enter Email: </label>
				<input type="text" id="email" name="email" required />
			</p>
			<p className="login-field">
				<label id="password">Create a password: </label>
				<input type="password" name="password" required />
			</p>
			<p className="cta">
				<button type="submit">Sign Up</button>
			</p>
			</Form>
			<p>Already have an account? <Link to="/companyLogin">Sign in</Link></p>
		</div>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}