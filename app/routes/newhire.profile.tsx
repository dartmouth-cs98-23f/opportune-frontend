import { Link, Form, useLoaderData } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import TextField from '~/components/TextField';
import SelectField from '~/components/SelectField';
import DateField from '~/components/DateField';
import axios from 'axios';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  json,
  LoaderFunction,
} from '@remix-run/node';
import { useState } from 'react';
import { destroySession, getSession } from '../utils/sessions';
import { convertDateToAPIFormat } from '~/lib/date';
import ImageUpload from '~/components/ImageUpload';
import TRDropdown from '~/components/TRDropdown';
import datepicker from 'react-datepicker/dist/react-datepicker.css';
import styles from '~/styles/home.css';

// ACTION FUNCTION
export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const _action = body.get('_action');

  const session = await getSession(request.headers.get('Cookie'));

  var myJson = {};
  for (const [key, value] of body.entries()) {
    myJson[key] = value;
  }

  if (_action === 'LogOut') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  } else {
    try {
      myJson["birthday"] = convertDateToAPIFormat(myJson["birthday"]);

      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/newhire/profile',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return redirect('/newhire/teams');
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

// LOADER FUNCTION
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const session = await getSession(request.headers.get('Cookie'));

    if (
      !session.has('auth') ||
      (session.has('user_type') && session.get('user_type') !== 'new_hire')
    ) {
      return redirect('/login');
    }

    const response = await axios.get(
      process.env.BACKEND_URL + '/api/v1/newhire/profile',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      const data = response.data;
      return json({ data });
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function Profile() {
  const basicInfo = useLoaderData<typeof loader>();
  const basicInfoFields = basicInfo.data;

  const [url, updateUrl] = useState();
  const [error, updateError] = useState();
  const handleOnUpload = (error: any, result: any, widget: any) => {
    if (error) {
      updateError(error.statusText);
      widget.close({
        quiet: true,
      });
      return;
    }
    updateUrl(result?.info?.secure_url);
  };

  const navLabels = ["Profile", "Project", "Settings"]

  return (
    <div className="flex-container">
      <div id="sidebar">
		<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
		<p className="text-logo">Opportune</p>
		<TRDropdown labels={navLabels} route="/newhire/profile" userType="newhire"/>
      </div>
      <div id="content">
        <h2>
          Welcome{' '}
          {basicInfoFields.new_hire.first_name
            ? basicInfoFields.new_hire.first_name
            : 'New Hire'}
        </h2>
        <div id="menubar">
          <MainNavigation />
        </div>
        <div className="form-container">
          <div>
            <Form action="/newhire/profile" method="post" className="info-form">
              <div className="preview">
                {url ? (
                  <img src={url} alt="Uploaded" />
                ) : (
                  <img src="../defaultAvatar.png" alt="Placeholder" />
                )}

                <div>
                  <h1>
                    {basicInfoFields.new_hire.first_name
                      ? basicInfoFields.new_hire.first_name + ' '
                      : 'New Hire '}
                    {basicInfoFields.new_hire.last_name
                      ? basicInfoFields.new_hire.last_name
                      : 'Name'}
                  </h1>
                  <p>Software Engineer Intern</p>
                  <ImageUpload onUpload={handleOnUpload}>
                    {({ open }) => {
                      return (
                        <button
                          className="custom-file-upload"
                          onClick={open}
                          type="button">
                          Upload Image
                        </button>
                      );
                    }}
                  </ImageUpload>
                </div>
              </div>

              <h3>Demographics</h3>
              <TextField
                label="First Name"
                classLabel="first_name"
                value={basicInfoFields.new_hire.first_name}
                type="text"
              />
              <TextField
                label="Last Name"
                classLabel="last_name"
                value={basicInfoFields.new_hire.last_name}
                type="text"
              />
              <DateField
                 label="Birthday"
                 classLabel="birthday"
                 value={basicInfoFields.new_hire.birthday}
              />
              <SelectField
                label="Race"
                classLabel="race"
                options={[
                  'White',
                  'Black',
                  'Hispanic/Latino',
                  'Asian',
                  'American Indian',
                  'Pacific Islander',
                  'Other',
                  'Prefer Not to Say'
                ]}
                value={basicInfoFields.new_hire.race}
              />
              <SelectField
                label="Sex"
                classLabel="sex"
                options={['Male', 'Female', 'Nonbinary', 'Prefer Not to Say']}
                value={basicInfoFields.new_hire.sex}
              />

              <h3>Education</h3>
              <TextField
                label="School"
                classLabel="school"
                value={basicInfoFields.new_hire.school}
                type="text"
              />
              <SelectField
                label="Graduation month"
                classLabel="grad_month"
                options={[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ]}
                value={basicInfoFields.new_hire.grad_month}
              />
              <TextField
                label="Graduation year"
                classLabel="grad_year"
                value={basicInfoFields.new_hire.grad_year}
                type="number"
              />
              <TextField
                label="Major"
                classLabel="major"
                value={basicInfoFields.new_hire.major}
                type="text"
              />

              <h3>Address and basic info</h3>
              <TextField
                label="Address"
                classLabel="address"
                value={basicInfoFields.new_hire.address}
                type="text"
              />
              <TextField
                label="City"
                classLabel="city"
                value={basicInfoFields.new_hire.city}
                type="text"
              />
              <TextField
                label="State/Province"
                classLabel="state_province"
                value={basicInfoFields.new_hire.state_province}
                type="text"
              />
              <TextField
                label="Zip Code"
                classLabel="zip_code"
                value={basicInfoFields.new_hire.zip_code}
                type="text"

              />
              <p className="cta" style={{ textAlign: 'right' }}>
                <button type="submit" name="_action" value="updateProfile">
                  {"→"}
                </button>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function links() {
  return [
    { rel: 'stylesheet', href: datepicker },
    { rel: 'stylesheet', href: styles },
  ];
}
