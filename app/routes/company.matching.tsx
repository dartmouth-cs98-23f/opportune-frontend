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
import CustomPieChart from '~/components/CustomPieChart';
import React from 'react';
import Modal from '~/components/Modal';
import ModalLarge from '~/components/ModalLarge';
import { parseDate, parseDatePlus1 } from '~/lib/date';

function getDiversityMetrics(diversity) {
  const diversityBefore = diversity["diversity_before"];
  const diversityAfter = diversity["diversity_after"];

  // age before
  var ageBefore = [];
  var i = 0;
  if(diversityBefore["age"]) {
    const ageRangesBefore = diversityBefore["age"]["ranges"];
    for(var key in ageRangesBefore) {
      var percent = Math.floor(ageRangesBefore[key] * 100);
      if(ageRangesBefore[key] != 0) {
        ageBefore.push({x: i, y: ageRangesBefore[key], label: key + '\n' + percent + '%'});
      }
      i++;
    }
  } else {
    ageBefore = [{x: 0, y: 1, label: "No Data Available."}];
  }
  

  // age after
  var ageAfter = [];
  i = 0;
  if(diversityAfter["age"]) {
    const ageRangesAfter = diversityAfter["age"]["ranges"];
    for(var key in ageRangesAfter) {
      var percent = Math.floor(ageRangesAfter[key] * 100);
      if(ageRangesAfter[key] != 0) {
        ageAfter.push({x: i, y: ageRangesAfter[key], label: key + '\n' + percent + '%'});
      }
      i++;
    }
  } else {
    ageAfter = [{x: 0, y: 1, label: "No Data Available."}]; 
  }


  // race before
  var raceBefore = [];
  i = 0;
  const raceDivBefore = diversityBefore["race"];
  if(raceDivBefore) {
    for(var key in raceDivBefore) {
      var percent = Math.floor(raceDivBefore[key] * 100);
      if(key == 'White') {
        raceBefore.push({x: i, y: raceDivBefore[key], label: "White\n" + percent + '%'}); // get period to float out of the svg
      } else if(key == 'Black') {
        raceBefore.push({x: i, y: raceDivBefore[key], label: "Black\n" + percent + '%'}); // get period to float out of the svg
      } else {
        raceBefore.push({x: i, y: raceDivBefore[key], label: key + '\n' + percent + '%'});
      }
      i++;
    }
  } else {
    raceBefore = [{x: 0, y: 1, label: "No Data Available."}];
  }

  // race after
  var raceAfter = [];
  i = 0;
  const raceDivAfter = diversityAfter["race"];
  if(raceDivAfter) {
    for(var key in raceDivAfter) {
      var percent = Math.floor(raceDivAfter[key] * 100);
      if(key == 'White') {
        raceAfter.push({x: i, y: raceDivAfter[key], label: "White\n" + percent + '%'}); // get period to float out of the svg
      } else if(key == 'Black') {
        raceAfter.push({x: i, y: raceDivAfter[key], label: "Black\n" + percent + '%'}); // get period to float out of the svg
      } else {
        raceAfter.push({x: i, y: raceDivAfter[key], label: key + '\n' + percent + '%'});
      }
      i++;
    }
  } else {
    raceAfter = [{x: 0, y: 1, label: "No Data Available."}];
  }

  // sex before
  var sexBefore = [];
  i = 0;
  const sexDivBefore = diversityBefore["sex"];
  if(sexDivBefore) {
    for(var key in sexDivBefore) {
      var percent = Math.floor(sexDivBefore[key] * 100);
      sexBefore.push({x: i, y: sexDivBefore[key], label: key + '\n' + percent + '%'});
      i++;
    }
  } else {
    sexBefore = [{x: 0, y: 1, label: "No Data Available."}];
  }

  // sex after
  var sexAfter = [];
  i = 0;
  const sexDivAfter = diversityAfter["sex"];
  if(sexDivAfter) {
    for(var key in sexDivAfter) {
      var percent = Math.floor(sexDivAfter[key] * 100);
      sexAfter.push({x: i, y: sexDivAfter[key], label: key + '\n' + percent + '%'});
      i++;
    }
  } else {
    sexAfter = [{x: 0, y: 1, label: "No Data Available."}];
  }
  

  // diversity scores
  var diversityScoreBefore = Math.floor(diversity["diversity_before"]["score"]["score"] * 100);
  var diversityScoreAfter = Math.floor(diversity["diversity_after"]["score"]["score"] * 100);
  
  var change = diversityScoreAfter / diversityScoreBefore;

  return {
    diversityScoreBefore,
    diversityScoreAfter,
    ageBefore,
    ageAfter,
    raceBefore,
    raceAfter,
    sexBefore,
    sexAfter,
    change
  }
}

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

    // load team diversity information
    var diversity = [];
    for (var team of teamsRes.data.teams) {
      const diversityRes = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/diversity-metrics',
        {email: team.email},
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );

      if(diversityRes.status === 200) {
        diversity.push(diversityRes.data);
      }
    }

    if (
      newHireRes.status === 200 &&
      teamsRes.status === 200 &&
      companyRes.status == 200
    ) {
      const newHires = newHireRes.data;
      const teams = teamsRes.data;
      const data = companyRes.data;
      return json({ data, newHires, teams, diversity });
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function CompanyMatching() {
  const info = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // accumulate maps of all of the newhires and teams and ensure all surveys are complete
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

  const [diversityModal, setDiversityModal] = useState(null);

  // format diversity data
  const diversity = info?.diversity;
  /*const diversity = [{
      diversity_after: {
          age: {
              ranges: {
                  middle: 0.4,
                  older: 0.2,
                  young: 0.4
              },
              stddev: 8.58
          },
          race: {
              Asian: 0.4,
              Black: 0.2,
              "Hispanic/Latino": 0.2,
              White: 0.2
          },
          score: {
              centroid: [
                  0.9, 0.2, 0.2, 0.2, 0.4, 0, 0, 0, 0.4, 0.4, 0
              ],
              score: 0.65,
              std_dev: 1.13
          },
          sex: {
              Female: 0.4,
              Male: 0.4,
              Nonbinary: 0.2
          }
      },
      diversity_before: 
      {
          age: {
              ranges: {
                  middle: 0.5,
                  older: 0.17,
                  young: 0.33
              },
              stddev: 9.42
          },
          race: {
              Asian: 0.67,
              White: 0.33
          },
          score: {
              centroid: [
                  0.96, 0.3333333333333333, 0, 0, 0.6666666666666666, 0, 0, 0, 0.6666666666666666, 0.3333333333333333, 0
              ],
              score: 0.48,
              std_dev: 0.98
          },
          sex: {
              Female: 0.33,
              Male: 0.67
          }
      }
    }] */

  var parsedDiversity = []
  for(var i = 0; i < diversity.length; i++) {
    const metrics = diversity[i];
    parsedDiversity.push(getDiversityMetrics(metrics));
  }

  const getPercentage = (scoreBefore, scoreAfter) => {
    var percentage = (scoreAfter - scoreBefore) / scoreBefore;
    return Math.floor(percentage * 1000) / 10;
  }

  const getDiversityModalName = () => {
    return (<div>
      {'Diversity: ' + info.teams.teams[diversityModal].name}
      <div className='stat-box'>
        <div className='column' style={{width: '40%'}}>Before Matching </div>
        <div className='column' style={{width: '20%'}}></div>
        <div className='column' style={{width: '40%'}}>After Matching</div>
      </div>
    </div>)
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
              {info?.teams.teams.map((team, i) => (
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
                    <h3>Matched Hires: </h3>
                    <div className="member-container">
                      {teamNewHires[team._id]?.map((matchedHire) => (
                        <div className="row-container team-member-card1">
                          <div>
                            {matchedHire.first_name} {matchedHire.last_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ flexDirection: 'row', 'margin-top': '15px', 'margin-bottom': '15px' }}>
                    <button className='diversity' onClick={() => setDiversityModal(i)}>Diversity Metrics</button>
                  </div>
                </Collapsible>
              ))}
            </div>

            <ModalLarge
            open={diversityModal != null}
            onClose={() => setDiversityModal(null)}
            title={(diversityModal != null) ? getDiversityModalName() : 'Diversity' }>
              {diversityModal != null ? 
              <div className='scrollable'>

                <div className='stat-box'>
                  <h2 className='column' style={{width: '40%'}}>{parsedDiversity[diversityModal].diversityScoreBefore + "/100"}</h2>
                  <h2 className='column' style={{width: '20%'}}>Diversity Score</h2>
                  <div className='column' style={{width: '40%'}}>
                    <h2>
                      {parsedDiversity[diversityModal].diversityScoreAfter + "/100 "}

                      {getPercentage(parsedDiversity[diversityModal].diversityScoreBefore, parsedDiversity[diversityModal].diversityScoreAfter) > 0.0 ?
                        <span style={{color: 'green', 'font-size': '14px'}}>                        
                          {'(+' + getPercentage(parsedDiversity[diversityModal].diversityScoreBefore, parsedDiversity[diversityModal].diversityScoreAfter) + '%)'}
                        </span>
                        :
                        <span style={{color: 'red', 'font-size': '14px'}}>                        
                          {'(' + getPercentage(parsedDiversity[diversityModal].diversityScoreBefore, parsedDiversity[diversityModal].diversityScoreAfter) + '%)'}
                        </span>
                      }

                    </h2>
                  </div>
                </div>

                <div className='stat-box'> 
                  <p className='column' style={{width: '40%'}}>
                    <CustomPieChart
                      data={parsedDiversity[diversityModal].ageBefore}
                    />
                  </p>
                  <h2 className='column' style={{width: '20%'}}>Age Metrics</h2>
                  <p className='column' style={{width: '40%'}}>
                    <CustomPieChart
                      data={parsedDiversity[diversityModal].ageAfter}
                    />
                  </p>
                </div>

                <div className='stat-box'>
                  <p className='column' style={{width: '40%'}}>
                    <CustomPieChart
                      data={parsedDiversity[diversityModal].raceBefore}
                    />
                  </p>
                  <h2 className='column' style={{width: '20%'}}>Race Metrics</h2>
                  <p className='column' style={{width: '40%'}}>
                    <CustomPieChart
                      data={parsedDiversity[diversityModal].raceAfter}
                    />
                  </p>
                </div>
                
                <div className='stat-box'>
                  <p className='column' style={{width: '40%'}}>
                    <CustomPieChart
                      data={parsedDiversity[diversityModal].sexBefore}
                    />
                    </p>
                    <h2 className='column' style={{width: '20%'}}>Gender Identity Metrics</h2>
                    <p className='column' style={{width: '40%'}}>
                    <CustomPieChart
                      data={parsedDiversity[diversityModal].sexAfter}
                    />
                  </p>
                </div>

                {(diversityModal != null && diversityModal > 0) ? <button className='off-left' onClick={() => setDiversityModal(diversityModal - 1)}>←</button>: null} 
                {(diversityModal != null && diversityModal < info.teams.teams.length - 1) ? <button className='off-right' onClick={() => setDiversityModal(diversityModal + 1)}>→</button> : null} 
              </div>
            :
            null
            }
                
            </ModalLarge>
          </div>

          <div className="new-hire-container">
            <div className="company-teams-title">
              <h2>New Hire</h2>
            </div>
            <div className="teams-list">
              {info?.newHires.new_hires.map((newHire) => (
                <div key={newHire.name} className="company-hire">
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
                      onChange={handleSelectChange}
                      disabled={newHire.matched}>
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
        <div className="row-container" style={{ marginRight: '1rem' }}>
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
              <button
                className="match"
                type="submit"
                name="_action"
                value="matchingSurvey">
                Run Matching Survey
              </button>
              <div
                className="row-container"
                style={{ alignItems: 'center', marginRight: '1rem' }}>
                <p>Enable Diversity Matching?</p>
                <input
                  type="checkbox"
                  id="toggle-button"
                  className="toggle-button"
                />
                <label for="toggle-button" className="toggle-label"></label>
              </div>
            </Form>
          </p>
          <p className="cta">
            <Form action="/company/matching" method="post">
              <button
                className="match confirm"
                type="submit"
                name="_action"
                value="completeMatching">
                Confirm Team Matches
              </button>
            </Form>
          </p>
        </div>
      </div>
    );
  }
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}