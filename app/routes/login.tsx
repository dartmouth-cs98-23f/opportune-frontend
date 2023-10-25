import { Link, Form } from '@remix-run/react';
import { redirect } from '@remix-run/node';
import loginStyle from '~/styles/home.css'
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
		const response = await axios.post('http://opportune_backend:3000/auth/login', myJson);

	} catch(error) {
		console.log(error)
		return null
	}
	
	return redirect(`/dashboard`);
  }

export default function Login() {
  return (
    <main id="block-container">
      <h1>Opportune</h1>
      <p>Tuning the opportunities you will have at your company to the maximum.</p>
	  <Form method="post" action="/login" id="login">
		<p>
			<label htmlFor="username">Username</label>
			<input type="text" id="username" name="username" required />
		</p>
		<p>
			<label htmlFor="password">Password</label>
			<input type="password" name="password" required />
		</p>
		<div className="form-actions">
			<button type="submit"> {'Login'} </button>
		</div>
		<p className="cta">
        	<Link to="/dashboard">Login</Link>
     	</p>
	  </Form>
	  <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </main>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}