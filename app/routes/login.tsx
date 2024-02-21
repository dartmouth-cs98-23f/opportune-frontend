import { Link, Form, useLoaderData } from '@remix-run/react';
import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import axios from 'axios';
import { getSession, commitSession, destroySession } from "../utils/sessions";

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


// ACTION FUNCTIOn
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
		const userType = response.data.user_type;
		session.set("auth", response.data.token);
		session.set("user_type", response.data.user_type);

		// redirect based on user type
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
	} catch(error) {
		console.log(error)
		return redirect('/login', {
			headers: {
				"Set-Cookie": await commitSession(session),
			}
		})
	}
};


// Components
export default function Login() {
	useLoaderData<typeof loader>();

    return (
    <main className="block-container">
	  <div className="landing-box">
		<img className="opportune-logo-large" src="opportune_newlogo.svg"></img>
		<h1>Opportune</h1>
		<p>Tuning the opportunities you will have at your company to the maximum.</p>
		<Form method="post" action="/login" id="login">
			<p className="login-field">
				<label htmlFor="email"><b>Email address</b></label>
				<input type="email" name="email" />
			</p>

			<p className="login-field">
				<label htmlFor="password"><b>Password</b></label>
				<input type="password" name="password" />
			</p>
			<div className="form-actions">
				<button type="submit"> {'Login'} </button>
			</div>
		</Form>
		<p>Are you a company trying to signup? <Link to="/company/signup">Enroll Your Company</Link></p>
	  </div>
    </main>
  );
}
