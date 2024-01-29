import { Link, Form, useLoaderData } from '@remix-run/react';
import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import loginStyle from '~/styles/home.css'
import axios from 'axios';
import { getSession, commitSession } from "../utils/sessions";

export async function loader({
	request,
}: LoaderFunctionArgs) {
	const session = await getSession(
		request.headers.get("Cookie")
	);

	if (session.has("auth")) {
		return redirect('/companyProfile');
	}

	const data = { error: session.get("error")};

	return json(data, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	})
}

export async function action({
	request,
  }: ActionFunctionArgs) {
	const body = await request.formData();

	const session = await getSession(
		request.headers.get("Cookie")
	);

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	console.log(JSON.stringify(myJson));

	try {
		const response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/login', myJson);
		session.set("auth", response.data.token);

	} catch(error) {
		console.log(error)
		return redirect('/companyLogin', {
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		})
	}
	
	return redirect(`/companyProfile`, {
		headers: {
			"Set-Cookie": await commitSession(session),
		}
	})
};


export default function Login() {
	const { currentUser, error } = useLoaderData<typeof loader>();

    return (
    <main className="block-container">
	  <div className="landing-box">
		<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
		<h1>Opportune</h1>
		<p>Tuning the opportunities you will have at your company to the maximum.</p>
		<Form method="post" action="/login" id="login">
			<p className="login-field">
				<label htmlFor="email"><b>Company email</b></label>
				<input name="email" />
			</p>

			<p className="login-field">
				<label htmlFor="password"><b>Password</b></label>
				<input type="password" name="password" />
			</p>
			<div className="form-actions">
				<button type="submit"> {'Login'} </button>
			</div>
		</Form>
		<p>Don't have an account? <Link to="/companySignup">Sign up</Link></p>
	  </div>
    </main>
  );
}

/* <button type="submit">Login</button> */

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}