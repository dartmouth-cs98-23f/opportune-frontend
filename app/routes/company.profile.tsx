import { Link, Form, useLoaderData } from '@remix-run/react';
import styles from '~/styles/home.css';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import TextField from '~/components/TextField';
import axios from 'axios';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  json,
} from '@remix-run/node';
import { useState } from 'react';
import { destroySession, getSession } from '../utils/sessions';
import ImageUpload from '~/components/ImageUpload';
import Modal from '~/components/Modal';
import { TextareaAutosize } from '@mui/material';
import ReadMore from '~/components/ReadMore';

// ACTION FUNCTION
export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const _action = body.get('_action');

  const session = await getSession(request.headers.get('Cookie'));

  var myJson = {};
  for (const [key, value] of body.entries()) {
    myJson[key] = value;
  }

  // Actions
  if (_action === 'LogOut') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  } else if (_action === 'updateProfile') {
    try {
      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/company/profile',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'createTeam') {
    myJson['team_members'] = []; // TEMPORARY

    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/create-team',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      const response2 = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/invite-team',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'createNewhire') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/create-newhire',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      const response2 = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/invite-newhire',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'companySave') {
    try {
      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/company/profile',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );

      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else {
    return redirect('/company/matching');
  }
}

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
      },
    );

    const newHireRes = await axios.get(
      process.env.BACKEND_URL + '/api/v1/user/list-newhires',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      },
    );

    const teamsRes = await axios.get(
      process.env.BACKEND_URL + '/api/v1/user/list-teams',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      },
    );

    if (
      newHireRes.status === 200 &&
      teamsRes.status === 200 &&
      companyRes.status == 200
    ) {
      const newHires = newHireRes.data;
      const teams = teamsRes.data;
      const data = companyRes.data;
      return json({ data, newHires, teams });
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function CompanyProfile() {
  const info = useLoaderData<typeof loader>();

  const basicInfoFields = {
    name: 'Opportune',
    email: 'opportune@gmail.com',
    formFilled: 'True',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  };

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

  const [coverUrl, setCoverUrl] = useState('defaultCover.png');

  const handleCoverUpload = (error: any, result: any, widget: any) => {
    if (error) {
      updateError(error.statusText);
      widget.close({
        quiet: true,
      });
      return;
    }
    setCoverUrl(result?.info?.secure_url);
  };

  const [showTeamModal, setShowTeamModal] = useState(false);

  const openTeamModal = () => {
    setShowTeamModal(true);
  };

  const closeModal = () => {
    setShowTeamModal(false);
  };

  const [showHireModal, setShowHireModal] = useState(false);

  const openHireModal = () => {
    setShowHireModal(true);
  };

  const closeHireModal = () => {
    setShowHireModal(false);
  };

  return (
    <div>
      <div className="sidebar">
        <img
          className="opportune-logo-small"
          src="../opportune_newlogo.svg"></img>
        <Form action="/company/profile" method="post">
          <p className="text-logo">Opportune</p>
          <button
            className="logout-button"
            type="submit"
            name="_action"
            value="LogOut">
            <ArrowLeftOnRectangleIcon />
          </button>
        </Form>
      </div>

      <div
        className="company-preview"
        style={{ backgroundImage: `url(${coverUrl})` }}>
        {url ? (
          <img src={url} alt="Uploaded" />
        ) : (
          <img src="../defaultAvatar.png" alt="Placeholder" />
        )}

        <div>
          <h1>{info?.data.company.name}</h1>
          <p>Location: SF</p>
          <div className="upload-buttons">
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
            <ImageUpload onUpload={handleCoverUpload}>
              {({ open }) => (
                <button
                  className="custom-file-upload"
                  onClick={open}
                  style={{ marginLeft: '10px' }}>
                  Upload Cover
                </button>
              )}
            </ImageUpload>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Form
          action="/company/profile"
          method="post"
          className="company-description">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="company-teams-title">
              <h2>Description:</h2>
            </div>

            <textarea
              cols={60}
              name="description"
              classLabel="description"
              defaultValue={info?.data?.company.description}></textarea>

            <div
              style={{ display: 'flex', width: '100%', justifyContent: 'end' }}>
              <button
                type="submit"
                className="company-save"
                name="_action"
                value="companySave">
                Save
              </button>
            </div>
          </div>
        </Form>

        <div className="new-hire-container">
          <div className="company-teams-title">
            <h2>New Hire</h2>
          </div>
          <div className="teams-list">
            {info?.newHires?.new_hires.map(
              (
                newHire, // DISPLAY NEWHIRES HERE
              ) => (
                <div key={newHire.name} className="company-team">
                  <h3>
                    {newHire.first_name} {newHire.last_name}
                  </h3>
                  <p>{newHire.email}</p>
                  <button className="newhire-button">Email nudge</button>
                </div>
              ),
            )}
          </div>
          <p className="cta" style={{ textAlign: 'center' }}>
            <button onClick={openHireModal}>Add new hire</button>
          </p>
          <Modal open={showHireModal} onClose={closeHireModal}>
            <Form action="/company/profile" method="post">
              <TextField
                label="First Name"
                name="firstName"
                classLabel="first_name"
              />
              <TextField
                label="Last Name"
                name="lastName"
                classLabel="last_name"
              />
              <TextField label="Email" name="email" classLabel="email" />

              <button
                className="left"
                type="submit"
                name="_action"
                value="createNewhire">
                Add New Hire
              </button>
            </Form>
          </Modal>
        </div>
      </div>

      <div className="company-teams-container">
        <div className="company-teams-title">
          <h2>Teams</h2>
        </div>
        <div className="teams-list">
          {info?.teams.teams.map(
            (
              team, // DISPLAY TEAMS HERE
            ) => (
              <div key={team.name} className="company-team">
                <div>
                  <h3>{team.name}</h3>
                  <p>Org 1</p> {/* TO REMOVE AT SOME POINT */}
                  <div>Mountain View, California</div>{' '}
                  {/* TO REMOVE AT SOME POINT */}
                </div>
                <ReadMore text={team.description}></ReadMore>
                <button
                  className={
                    team.survey_complete ? 'done-button' : 'in-progress-button'
                  }>
                  {team.survey_complete ? 'Done' : 'In Progress'}
                </button>
                <button className="newhire-button">Email nudge</button>
              </div>
            ),
          )}
        </div>
        <p className="cta" style={{ textAlign: 'center' }}>
          <button onClick={openTeamModal}>Add team</button>
        </p>
        <Modal open={showTeamModal} onClose={closeModal} title={'Add a team'}>
          <Form action="/company/profile" method="post">
            <TextField
              className="add-team"
              label="Team Email"
              name="email"
              classLabel="email"
            />
            <TextField
              className="add-team"
              label="Team Name"
              name="name"
              classLabel="name"
            />
            <TextField
              className="add-team"
              label="Description"
              name="description"
              classLabel="description"
            />
            <TextField
              className="add-team"
              label="Calendly Link"
              name="calendlyLink"
              classLabel="calendly_link"
            />
            <TextField
              className="add-team"
              label="Capacity"
              name="capacity"
              classLabel="max_capacity"
            />
            <TextField
              className="add-team"
              label="Manager"
              name="manager"
              classLabel="manager"
            />
            <button
              className="left"
              type="submit"
              name="_action"
              value="createTeam">
              Add Team
            </button>
          </Form>
        </Modal>
      </div>
      <p className="cta" style={{ textAlign: 'right' }}>
        {' '}
        <Link to="/company/matching">Next</Link>
      </p>
    </div>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
