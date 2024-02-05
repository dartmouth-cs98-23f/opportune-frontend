import { Link, Form } from '@remix-run/react';
import { redirect, ActionFunctionArgs } from '@remix-run/node';
import loginStyle from '~/styles/home.css';
import axios from 'axios';
import { getSession, commitSession, destroySession } from "../utils/sessions";

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
	
	myJson["user_type"] = "company";

	try {
		var response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/register', myJson);

		if (response.status == 204) {
			alert("Username is already in use.");
			return null
		}

		response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/login', myJson, {
			headers: {
			"Authorization": session.get("auth"),
			"Content-Type": "application/json",
			},
		});
		const userType = response.data.user_type;
		session.set("auth", response.data.token);
		session.set("user_type", response.data.user_type);

		await axios.patch(process.env.BACKEND_URL + '/api/v1/company/profile', {"name": myJson["name"]}, {
			headers: {
			"Authorization": response.data.token,
			"Content-Type": "application/json",
			},
		});

		return redirect(`/login`, {
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		});

	} catch(error) {
		console.log(error)
		return redirect('/company/signup')
	}
  }

export default function SignUp() {

  return (
    <div className="block-container">
		<div className="landing-box">
			<img className="opportune-logo-large" src="../opportune_newlogo.svg"></img>
			<h1>Opportune</h1>
			<p>Find your new hires a team faster than ever before</p>
			<Form method="post" action="/company/signup" id="login">
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
			<p>Already have an account? <Link to="/login">Sign in</Link></p>
		</div>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}