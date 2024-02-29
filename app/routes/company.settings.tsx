import { Link, Form, useLoaderData, useLocation } from '@remix-run/react';
import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import TextField from '~/components/TextField';
import axios from 'axios';
import { getSession, commitSession, destroySession } from "../utils/sessions";
import TRDropdown from '~/components/TRDropdown';

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
            return null;
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
            return null;
          }
    } else {
        return null;
    }
}

export default function CompanySettings() {
    const info = useLoaderData<typeof loader>();

    return (
        <div className="company-container">
            <div id="sidebar">
                <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
                <p className="text-logo">Opportune</p>
                <TRDropdown skipLabel="Settings" route="/company/profile" userType="company" />
            </div>
            <div>Change Email: </div>
                <Form method="post" action="/company/settings">
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

                <div>Change Password: </div>
                <Form method="post" action="/company/settings">
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