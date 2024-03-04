import { Link, Form, useLoaderData, useLocation } from '@remix-run/react';
import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import TextField from '~/components/TextField';
import styles from '~/styles/home.css';
import axios from 'axios';
import { getSession, commitSession, destroySession } from "../utils/sessions";
import TRDropdown from '~/components/TRDropdown';
import {
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

// LOADER FUNCTION
export async function loader({ request }: LoaderFunctionArgs) {
    try {
      const session = await getSession(request.headers.get('Cookie'));
  
      if (
        !session.has('auth') ||
        (session.has('user_type') && session.get('user_type') !== 'company')
      ) {
        return redirect('/login');
      }

      const companyRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/company/profile',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );

      const data = companyRes.data;
      return json({ data });
    } catch(error) {
        console.log(error);
        return null;
    }
}

// ACTION FUNCTION
export async function action({
	request,
  }: ActionFunctionArgs) {
	const body = await request.formData();
    const _action = body.get('_action');

	const session = await getSession(
		request.headers.get("Cookie")
	);

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

	console.log(JSON.stringify(myJson));

    if(_action === 'changeEmail') {
        try {
            const response = await axios.patch(
              process.env.BACKEND_URL + '/api/v1/company/profile',
              myJson,
              {
                headers: {
                  Authorization: session.get('auth'),
                  'Content-Type': 'application/json',
                },
              }
            );
            return redirect('/login', {
                headers: {
                    "Set-Cookie": await destroySession(session),
                }
            });
        } catch (error) {
            console.log(error);
            return redirect('/company/settings?failed=1');
        }
    } else if(_action === 'changePassword') {
        try {
            const response = await axios.post(
              process.env.BACKEND_URL + '/api/v1/user/change-password',
              myJson,
              {
                headers: {
                  Authorization: session.get('auth'),
                  'Content-Type': 'application/json',
                },
              }
            );
            return redirect('/login', {
                headers: {
                    "Set-Cookie": await destroySession(session),
                }
            });
          } catch (error) {
            console.log(error);
            return redirect('/company/settings?failed=2');
          }
    } else {
        return null;
    }
}

const navLabels = ["Profile", "Matching", "Settings"]

export default function CompanySettings() {
    const info = useLoaderData<typeof loader>();

    const location = useLocation();

    // Access query parameters from location.search
    const queryParams = new URLSearchParams(location.search);
    const failstate = queryParams.get('failed');

    const renderFailState = () => {
      if(failstate == 1) {
        return (
          <p className='failed-auth' style={{margin: "0 2rem"}}>
            The email change failed. Please ensure you have entered a valid email that is not currently in use, then try again.
          </p>
        )
      } else if(failstate == 2) {
        return (
          <p className='failed-auth' style={{margin: "0 2rem"}}>
            The password change failed. Please ensure you have entered  the correct password.
          </p>
        )
      } else {
        return null;
      }
      }

    return (
        <div className="company-container">
            <div id="sidebar">
                <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
                <p className="text-logo">Opportune</p>
                <TRDropdown labels={navLabels} route="/company/profile" userType="company" />
            </div>
            <h1 style={{margin: "2rem 2rem"}}>Settings</h1>
            {renderFailState()}
            <h2 style={{margin: "2rem 2rem"}}>Change Email: </h2>
            <Form method="post" action="/company/settings" className="info-form form-left">
              <div className="matching-unavailable" style={{"justify-content": "flex-start"}}>
                <InformationCircleIcon className="lock-icon" />
                <p style={{ marginLeft: '0.5rem' }}>
                  This action will log you out.
                </p>
              </div>
              <TextField
                  label="Email"
                  classLabel="email"
                  value={info?.data.company.email}
                  type="email"
              />
              <div className="form-actions">
                  <button type="submit" name="_action" value="changeEmail">Save</button>
              </div>
            </Form>

            <h2 style={{margin: "2rem 2rem"}}>Change Password: </h2>
            <Form method="post" action="/company/settings" className="info-form form-left">
              <div className="matching-unavailable" style={{"justify-content": "flex-start"}}>
                <InformationCircleIcon className="lock-icon" />
                <p style={{ marginLeft: '0.5rem' }}>
                  This action will log you out.
                </p>
              </div>
              <TextField
                  label="Old Password"
                  classLabel="old_password"
                  value=""
                  type="password"
              />
              <TextField
                  label="New Password"
                  classLabel="new_password"
                  value=""
                  type="password"
              />
              <div className="form-actions">
                  <button type="submit" name="_action" value="changePassword">Save</button>
              </div>
            </Form>
        </div>
      );
}

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
  ];
}