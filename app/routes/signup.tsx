import { Link, Form} from '@remix-run/react';
import loginStyle from '~/styles/home.css'

export default function SignUp() {
  return (
    <main id="content">
      	<h1>Opportune</h1>
      	<Form method="post" id="login">
			<p>
				<label htmlFor="username">Pick a username: </label>
				<input type="text" id="username" name="username" required />
			</p>
			<p>
				<label htmlFor="password">Pick a strong password: </label>
				<input type="password" name="password" required />
			</p>	
	  	</Form>
		<p className="cta">
			<Link to="/login">Confirm</Link>
		</p>
		

    </main>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}