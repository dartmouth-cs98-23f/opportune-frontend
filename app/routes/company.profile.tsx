import { Link, Form, useLoaderData, useFetcher } from '@remix-run/react';
import styles from '~/styles/home.css';
import {
  ArrowLeftOnRectangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
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
import ReadMore from '~/components/ReadMore';
import ReactDatePicker from 'react-datepicker';
import datepicker from 'react-datepicker/dist/react-datepicker.css';
import { parseDate, convertDateToAPIFormat } from '~/lib/date';

// @ts-expect-error
const DatePicker = ReactDatePicker.default;

// ACTION FUNCTION
export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const _action = body.get('_action');

  const session = await getSession(request.headers.get('Cookie'));

  var myJson = {};
  for (const [key, value] of body.entries()) {
    myJson[key] = value;
  }

  console.log(myJson);

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
  } else if (_action === 'editNewHire') {
    try {
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
  const fetcher = useFetcher();

  // check that all surveys are complete in order to enable the next button
  const newhires = info.newHires.new_hires;
  const teams = info?.teams.teams;
  var allSurveysComplete = true;

  for(var team of teams) {
    if(team.survey_complete == false) {
      allSurveysComplete = false;
      break;
    }
  }

  if(allSurveysComplete) {
    for(var nh of newhires) {
      if(nh.survey_complete == false) {
        allSurveysComplete = false;
        break;
      }
    }
  }

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

  const [coverUrl, setCoverUrl] = useState('../defaultCover.png');

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

  const closeTeamModal = () => {
    setShowTeamModal(false);
  };

  const [showHireModal, setShowHireModal] = useState(false);

  const openHireModal = () => {
    setShowHireModal(true);
  };

  const closeHireModal = () => {
    setShowHireModal(false);
  };

  // const [isEditingName, setIsEditingName] = useState(null);

  const [editHire, setEditHire] = useState(false);
  const [editTeam, setEditTeam] = useState(false);

  const handleSave = (e) => {
    const value = e.target.value.split(' ');
    const first_name = value[0];
    const last_name = value[1];
    const email = value[2];
    fetcher.submit(
      {
        first_name,
        last_name,
        email,
        _action: 'editNewHire',
      },
      {
        method: 'patch',
        action: 'newhire/profile',
      },
    );
  };

  const [date, setDate] = useState(parseDate(info?.data.company.newhire_survey_deadline));

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
                      team.survey_complete
                        ? 'done-button'
                        : 'in-progress-button'
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
          <Modal open={showTeamModal} onClose={closeTeamModal} title={'Add a team'}>
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
                className="center"
                type="submit"
                name="_action"
                value="createTeam">
                Add Team
              </button>
            </Form>
          </Modal>
        </div>

        <div className="new-hire-container">
          <div className="company-teams-title">
            <h2>New Hire</h2>
          </div>
          <div className="teams-list">
            {info?.newHires?.new_hires.map((newHire) => (
              <div key={newHire._id} className="company-team">
                <h3>
                  {newHire.first_name} {newHire.last_name}
                </h3>

                <p>{newHire.email}</p>
                <div className="expanded-content">
                  <button
                    className="newhire-button"
                    name="_action"
                    value="newHireNudge">
                    Email nudge
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => setEditHire(true)}>
                    Edit
                  </button>
                </div>
                <Modal
                  open={editHire}
                  onClose={() => setEditHire(false)}
                  title={'Edit New Hire'}>
                  <Form action="/company/profile" method="post">
                    <TextField
                      label="First Name"
                      name="first_name"
                      value={newHire.first_name}
                    />
                    <TextField
                      label="Last Name"
                      name="last_name"
                      value={newHire.last_name}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      value={newHire.email}
                    />

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'flex-end',
                      }}>
                      <div className="buttons">
                        <button
                          className="delete-button"
                          name="_action"
                          value="editNewHire">
                          Delete
                        </button>
                        <button
                          className="save-button"
                          type="submit"
                          name="_action"
                          value="editNewHire">
                          Save
                        </button>
                      </div>
                    </div>
                  </Form>
                </Modal>
              </div>
            ))}
          </div>
          <p className="cta" style={{ textAlign: 'center' }}>
            <button onClick={openHireModal}>Add new hire</button>
          </p>
          <Modal
            open={showHireModal}
            onClose={closeHireModal}
            title={'Add new hire'}>
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
                className="center"
                type="submit"
                name="_action"
                value="createNewhire">
                Add New Hire
              </button>
            </Form>
          </Modal>
        </div>
      </div>
      <div className="row-container">
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
        <Form
          action="/company/profile"
          method="post"
          className="company-deadlines">
          <div className="company-teams-title">
            <h2>Deadlines:</h2>
          </div>
          <div className="row-container">
            <label>
              Team Survey Deadline:
              <DatePicker selected={date} onChange={(date) => setDate(date)} />
            </label>

            <label>
              New Hire Deadline:
              <DatePicker
                selected={date} // change to info.teams.team.survey_deadline or sth like that
                onChange={(newDate) => setDate(newDate)} // do fetcher.submit
              />
            </label>
          </div>
        </Form>
      </div>

      <p className="cta" style={{ textAlign: 'right' }}>
        {' '}
        {
          allSurveysComplete ? <Link to="/company/matching">Next</Link> :
          <div>Team Matching will be available when all surveys are complete or the deadline is reached.</div>
        }
        
      </p>
    </div>
  );
}

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: datepicker },
  ];
}
