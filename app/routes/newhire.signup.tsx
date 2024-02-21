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
	
	myJson["user_type"] = "new_hire";

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
		console.log(error)
		return redirect('/newhire/signup')
	}
  }

export default function SignUp() {

  const location = useLocation();

  // Access query parameters from location.search
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
	
  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="../opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Tuning the opportunities you will have at your company to the maximum.</p>
			<Form method="post" action="/newhire/signup" id="login">
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
