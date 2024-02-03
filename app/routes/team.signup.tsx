import { Link, Form } from '@remix-run/react';
import { redirect, ActionFunctionArgs } from '@remix-run/node';
import axios from 'axios';

// ACTION FUNCTION
export async function action({
	request,
  }: ActionFunctionArgs) {
	const body = await request.formData();

	var myJson = {};
	for(const [key, value] of body.entries()) {
		myJson[key] = value;
	}
	
	myJson["user_type"] = "team";

	try {
		const response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/register-link', myJson);

		if (response.status == 204) {
			alert("Username is already in use.");
			return null
		}

	} catch(error) {
		console.log(error)
		return redirect('/team/signup')
	}
	
	return redirect(`/login`);
  }

export default function TsignUp() {

  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Tuning the opportunities you will have at your company to the maximum.</p>
			<Form method="post" action="/team/signup" id="login">
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
			<p>Already have an account? <Link to="/login">Sign in</Link></p>
		</div>
    </div>
  );
}
