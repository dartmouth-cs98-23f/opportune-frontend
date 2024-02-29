import { Form, Link, useLoaderData } from '@remix-run/react';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import {
  useCalendlyEventListener,
  InlineWidget,
  PopupButton,
  PopupModal,
} from 'react-calendly';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { destroySession, getSession } from '~/utils/sessions';
// import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import TRDropdown from '~/components/TRDropdown';
// import { motion } from 'framer-motion';

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
  if (_action == 'LogOut') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
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

    async function getProfileRes() {
      const profileRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/newhire/profile',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return profileRes.data;
    }

    async function getTeamInfoRes() {
      const teamInfoRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/newhire/team-info',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return teamInfoRes.data;
    }

    async function getCompanyInfoRes() {
      const companyRes = await axios.get(
        process.env.BACKEND_URL + "/api/v1/user/company-info",
        {
          headers: {
          Authorization: session.get("auth"),
          "Content-Type": "application/json",
          },
        }
        );
      return companyRes.data;
    }

    const [profileRes, teamInfoRes, companyRes] = await Promise.all([
      getProfileRes(),
      getTeamInfoRes(),
      getCompanyInfoRes()
    ]);

    return json({ profile: profileRes, teamInfo: teamInfoRes, companyInfo: companyRes });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function Results() {
  const resultsData = useLoaderData<typeof loader>();

  return (
    <div className="flex-container">
      <div id="sidebar">
        <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
        <p className="text-logo">Opportune</p>
        <TRDropdown skipLabel="Project" route="/newhire/results" userType="newhire" />
      </div>
      <div id="content">
        <h2>
          Welcome{' '}
          {resultsData.profile.new_hire.first_name
            ? resultsData.profile.new_hire.first_name
            : 'New Hire'}{' '}
        </h2>
        <div id="menubar">
          <MainNavigation />
        </div>
        <div>{matchingResults(resultsData)}</div>
      </div>
    </div>
  );
}

export function matchingResults(resultsData: json) {
  if (resultsData.teamInfo && resultsData.companyInfo.company.matching_complete) {
    const team = resultsData.teamInfo.team;
    const [expanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const prefill = {
      email: resultsData.profile.email,
      firstName: resultsData.profile.new_hire.first_name,
      lastName: resultsData.profile.new_hire.last_name,
      name:
        resultsData.profile.new_hire.first_name +
        ' ' +
        resultsData.profile.new_hire.last_name,
    };

    return (
      <div>
        <p>Congrats! You were matched to the following team: </p>
        <h1>{team.name}</h1>
        <div className="team-box" key={team.name}>
          <div className="team-text">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <h3>{team.name}</h3>
            </div>

            <p>
              <b>Tools and Technologies: </b>
              {team.skills.map((skills) => skills.name).join(', ')}
            </p>
            <p className="read-more-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Read Less' : 'Read More'}
            </p>

            {expanded && (
              <div className="expanded-content">
                <div className="text-content">
                  <p>Description: {team.description}</p>
                </div>

                <button
                  className="schedule-btn"
                  onClick={() => setIsOpen(true)}
                  type="button">
                  Schedule meeting
                </button>
                {isOpen && (
                  <div className="calendly-overlay">
                    <div
                      className="calendly-close-overlay"
                      onClick={() => setIsOpen(false)}></div>
                    <div className="calendly-popup">
                      <div className="calendly-popup-content">
                        <InlineWidget
                          url="https://calendly.com/ryanl23"
                          prefill={prefill}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Confetti
              colors={['#1E2578', '#4559B8', '#A9B2DC', '#EAF1FE', '#FF892F']}
            />
          </div>
        </div>
        <p className="cta">
          <Form action="/newhire/results" method="post">
            <button type="submit" name="_action" value="LogOut">
              Done
            </button>
          </Form>
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex-container">
		<div className="unavailable-content">
		  Matching results are not out yet.
          <img src="../survey-unavailable.gif"></img>
        </div>
        <p className="cta">
          <Link to="/newhire/survey">Edit Responses </Link>
        </p>
      </div>
    );
  }
}
