import { Link, Form, useLoaderData, useLocation } from '@remix-run/react';
import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import axios from 'axios';
import { getSession, commitSession, destroySession } from "../utils/sessions";
import {
	InformationCircleIcon,
  } from '@heroicons/react/24/outline';

// LOADER FUNCTION
export async function loader({
	request,
}: LoaderFunctionArgs) {
	const session = await getSession(
		request.headers.get("Cookie")
	);

	if (session.has("auth")) {

		// redirect based on user type
		const userType = session.get("user_type");
		if (userType == 'new_hire') {
			return redirect(`/newhire/profile`, {
				headers: {
					"Set-Cookie": await commitSession(session),
				}
			})
	   } else if (userType == 'team') {
			return redirect(`/team/profile`, {
				headers: {
					"Set-Cookie": await commitSession(session),
				}
			}) 
	   } else if (userType == 'company') {
		   return redirect(`/company/profile`, {
			   headers: {
				   "Set-Cookie": await commitSession(session),
			   }
		   })
	   } else {
		   return redirect('/login', {
			   headers: {
				   "Set-Cookie": await destroySession(session),
			   }
		   })
	   }
	}

	return null;
}


// ACTION FUNCTION
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
		const response = await axios.post(process.env.BACKEND_URL + '/api/v1/auth/reset-password', myJson);
		return redirect('/login');
	} catch(error) {
		console.log(error)
		return redirect('/reset-password');
	}
};


// Components
export default function ResetPassword() {
	useLoaderData<typeof loader>();

	const location = useLocation();

	// Access query parameters from location.search
	const queryParams = new URLSearchParams(location.search);
	const email = queryParams.get('email');
    const key = queryParams.get('key');

    return (
    <main className="block-container">
	  <div className="landing-box">
		<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
		<h1>Opportune</h1>
		<p>Skills matched. Teams built. Projects delivered. Faster with Opportune.</p>
		<Form method="post" action="/reset-password" id="login">
            {key != null ? 
                <input
                    name="key"
                    value={key}
                    style={{ display: 'none' }}
				/> : null}

            {email != null ? 
                <input
                    name="email"
                    value={email}
                    style={{ display: 'none' }}
				/> : null}

			<p className="login-field">
				<label htmlFor="password"><b>New Password</b></label>
				<input type="password" name="password" />
			</p>
			<div className="form-actions">
				<button type="submit"> {'Reset Password'} </button>
			</div>
		</Form>
		<p>Remembered your password? <Link to="/login">Sign in</Link></p>
	  </div>
    </main>
  );
}