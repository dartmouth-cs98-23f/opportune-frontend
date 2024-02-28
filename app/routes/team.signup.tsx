import { Link, Form, useLocation } from '@remix-run/react';
import { redirect, ActionFunctionArgs } from '@remix-run/node';
import axios from 'axios';
import { getSession, commitSession, destroySession } from "../utils/sessions";

// ACTION FUNCTION
export async function action({
	request,
  }: ActionFunctionArgs) {

	const session = await getSession(
		request.headers.get("Cookie")
	);

	const body = await request.formData();

	var myJson = {};
	for(const [key, value] of body.entries()) {
		myJson[key] = value;
	}
	
	myJson["user_type"] = "team";

	try {
		var response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/register-link', myJson);

		if (response.status == 204) {
			alert("Username is already in use.");
			return null
		}

		response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/login', myJson);
		const userType = response.data.user_type;
		session.set("auth", response.data.token);
		session.set("user_type", response.data.user_type);

		return redirect(`/login`, {
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		});

	} catch(error) {
		console.log(error.response)

		if(error.response.status == 400) {
			return redirect('/team/signup?failed=1')
		} else if(error.response.status == 409) {
			return redirect('/team/signup?failed=2')
		}
		return redirect('/team/signup')
	}
  }

export default function TsignUp() {

	const location = useLocation();

	// Access query parameters from location.search
	const queryParams = new URLSearchParams(location.search);
	const email = queryParams.get('email');
	const failstate = queryParams.get('failed');

	const renderFailState = () => {
	if(failstate == 1) {
		return (
			<p className='failed-auth'>
				Please use the email associated with your account.
			</p>
		)
	} else if(failstate == 2) {
		return (
			<p className='failed-auth'>
				This account has already been created.
			</p>
		)
	} else {
		return null;
	}
	}

  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="../opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Skills matched. Teams built. Projects delivered. Faster with Opportune.</p>
			<Form method="post" action="/team/signup" id="login">
				{renderFailState()}
				<p className="login-field">
					<label id="email">Enter Email: </label>
					<input type="email" id="email" name="email" defaultValue={email ?? ""} required />
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
