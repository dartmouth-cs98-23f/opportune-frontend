import { Link, Form, useLoaderData, useFetcher } from '@remix-run/react';
import {
  ArrowLeftOnRectangleIcon,
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/24/outline';
import styles from '~/styles/home.css';
import { useState } from 'react';
import axios from 'axios';
import ImageUpload from '~/components/ImageUpload';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  json,
} from '@remix-run/node';
import ReadMore from '~/components/ReadMore';
import { destroySession, getSession } from '../utils/sessions';
import { Collapsible } from '~/components/Collapsible';
import { Checkbox } from '@mui/material';
import React from 'react';
import { parseDate, parseDatePlus1 } from '~/lib/date';

// ACTION FUNCTION
export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const _action = body.get('_action');
  console.log(_action);

  const session = await getSession(request.headers.get('Cookie'));

  var myJson = {};
  for (const [key, value] of body.entries()) {
    myJson[key] = value;
  }

  console.log(JSON.stringify(myJson));

  // Actions
  if (_action === 'LogOut') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  } else if (_action === 'matchingSurvey') {
    const diversifyOn = myJson['diversify'] == 'on';

    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/match',
        {},
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
          params: {
            diversify: diversifyOn,
          },
        },
      );
      return redirect('/company/matching');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'newHireLock') {
    myJson['locked'] = myJson['locked'] == 'true';

    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/newhire-lock',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return redirect('/company/matching');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'matchManual') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/match-manual',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return redirect('/company/matching');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'completeMatching') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/confirm-matches',
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
    return null;
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

export default function CompanyMatching() {
  const info = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  var allSurveysCompleted = true;
  var teamIdMap = {};
  var nhIdMap = {};
  var teamNewHires = {};
  for (var team of info.teams.teams) {
    teamIdMap[team._id] = team;
    if (team.survey_complete == false) {
      allSurveysCompleted = false;
    }
  }
  for (var nh of info.newHires.new_hires) {
    nhIdMap[nh._id] = nh;

    var teamId = nh.team_id;
    if (!teamNewHires[teamId]) {
      teamNewHires[teamId] = [];
    }
    teamNewHires[teamId].push(nh);
  }

  for (var nh of info.newHires.new_hires) {
    if (!allSurveysCompleted) break;
    if (nh.survey_complete == false) {
      allSurveysCompleted = false;
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

  const handleSelectChange = (event) => {
    const value = event.target.value.split(' ');
    const nhEmail = value[0];
    const teamEmail = value[1] ?? '';

    // programmatically submit a useFetcher form in Remix
    fetcher.submit(
      { newhire_email: nhEmail, team_email: teamEmail, _action: 'matchManual' },
      { method: 'post', action: '/company/matching' },
    );
  };

  // check if survey is open yet
  const currentDate = new Date();
  const surveyOpen = parseDatePlus1(info?.data.company.newhire_survey_deadline);

  if (currentDate.getTime() < surveyOpen.getTime()) {
    return (
      <div style={{ height: '100vh', textAlign: 'center' }}>
        <div className="sidebar">
          <img
            className="opportune-logo-small"
            src="../opportune_newlogo.svg"></img>
          <p className="text-logo">Opportune</p>
          <Form action="/company/matching" method="post">
            <button
              className="logout-button"
              type="submit"
              name="_action"
              value="LogOut">
              <ArrowLeftOnRectangleIcon />
            </button>
          </Form>
        </div>
        <div className="unavailable-content">
          The matching page is not available yet!
        </div>
        <p className="cta" style={{ textAlign: 'center' }}>
          <Link to="/company/profile">Back</Link>
        </p>
      </div>
    );
  } else {
    return (
      <div className="company-container">
        <div className="sidebar">
          <img
            className="opportune-logo-small"
            src="../opportune_newlogo.svg"></img>
            <p className="text-logo">Opportune</p>
          <Form action="/company/matching" method="post">
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
            <p>Location: SF</p> {/* TO REMOVE */}
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

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="company-teams-container">
            <div className="company-teams-title">
              <h2>Teams</h2>
            </div>
            <div className="teams-list">
              {info?.teams.teams.map((team) => (
                <Collapsible
                  trigger={
                    <div className="company-team">
                      <div>
                        <h3>{team.name}</h3>
                      </div>
                      <p>{team.email}</p>
                    </div>
                  }>
                  <div style={{ flexDirection: 'row' }}>
                    <p>Matched hires: </p>
                    {teamNewHires[team._id]?.map((matchedHire) => (
                      <p>
                        {matchedHire.first_name} {matchedHire.last_name},
                      </p>
                    ))}
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>

          <div className="new-hire-container">
            <div className="company-teams-title">
              <h2>New Hire</h2>
            </div>
            <div className="teams-list">
              {info?.newHires.new_hires.map((newHire) => (
                <div key={newHire.name} className="company-team">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3>
                      {newHire.first_name} {newHire.last_name}
                    </h3>
                    <p>{newHire.email}</p>
                    {/*<p>
                      {newHire.team_id
                        ? teamIdMap[newHire.team_id].name
                        : 'Unmatched'}
                      </p> */}
                  </div>
                  <div style={{ display: 'flex' }}>
                    <select
                      className={
                        !newHire.matched ? 'select-active' : 'select-inactive'
                      }
                      onChange={handleSelectChange}>
                      <option key={'None'} value={newHire.email}>
                        None
                      </option>
                      {info.teams.teams // first filter out the matched team from the first option
                        .map((team) =>
                          team._id === newHire.team_id ? (
                            <option
                              key={team.name}
                              value={newHire.email + ' ' + team.email}
                              selected>
                              {team.name}
                            </option>
                          ) : (
                            <option
                              key={team.name}
                              value={newHire.email + ' ' + team.email}>
                              {team.name}
                            </option>
                          ),
                        )}
                    </select>

                    <Form action="/company/matching" method="post">
                      <input
                        name="email"
                        type="hidden"
                        value={newHire.email}></input>
                      <input
                        name="locked"
                        type="hidden"
                        value={newHire.matched ? 'false' : 'true'}></input>
                      <button
                        className="lock-button"
                        type="submit"
                        name="_action"
                        value="newHireLock">
                        {!newHire.matched ? (
                          <LockOpenIcon className="lock-icon" />
                        ) : (
                          <LockClosedIcon className="lock-icon" />
                        )}
                      </button>
                      <span className="hover-message">
                        Click to manually override
                      </span>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="cta" style={{ textAlign: 'right' }}>
          {/* {allSurveysCompleted ? (
            <Form action="/company/matching" method="post">
              <button type="submit" name="_action" value="matchingSurvey">
                Run matching survey
              </button>
            </Form>
          ) : (
            <></>
          )} */}
          <Form action="/company/matching" method="post">
            <button type="submit" name="_action" value="matchingSurvey">
              Run matching survey
            </button>
            Enable Diversity Matching?
            <input type="checkbox" name="diversity" />
          </Form>
        </p>
        <p className="cta" style={{ textAlign: 'right' }}>
          <Form action="/company/matching" method="post">
            <button type="submit" name="_action" value="completeMatching">
              Complete Team-Matching
            </button>
          </Form>
        </p>
      </div>
    );
  }
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
