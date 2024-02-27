import { Form, Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import axios from 'axios';
import { destroySession, getSession } from '../utils/sessions';
import MainNavigation from '~/components/MainNav';
import {
  ArrowLeftOnRectangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import SurveyUtil from '~/components/survey_qs/SurveyUtil';
import Progress from '~/components/survey_qs/Progress';
import Scale from '~/components/survey_qs/Scale';
import Ranking from '~/components/survey_qs/Ranking';
import Textbox from '~/components/survey_qs/Textbox';
import PlainText from '~/components/survey_qs/PlainText';
import { parseDatePlus1, parseDate, formatDate } from '~/lib/date';
import TRDropdown from '~/components/TRDropdown';

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const _action = body.get('_action');

  const session = await getSession(request.headers.get('Cookie'));

  const profile = await axios.get(
    process.env.BACKEND_URL + '/api/v1/newhire/profile',
    {
      headers: {
        Authorization: session.get('auth'),
        'Content-Type': 'application/json',
      },
    },
  );

  // 1-5 slider
  if (_action === 'Scale') {
    // get the tech stack and score
    var myJson = {};
    for (const [key, value] of body.entries()) {
      if (key !== '_action') {
        myJson['name'] = key;
        myJson['score'] = parseInt(value, 10);
      }
    }

    try {
      // update/add to skill list
      const skillList = profile.data.new_hire.skills;
      const skillIdx = skillList.findIndex(
        (skill) => skill.name === myJson['name'],
      );
      if (skillIdx !== -1) {
        skillList[skillIdx].score = myJson['score'];
      } else {
        skillList.push(myJson);
      }

      // send new skills
      const newSkills = JSON.stringify({ skills: skillList });
      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/newhire/profile',
        newSkills,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // team preferences
  if (_action === 'Ranking') {
    // get the rankings
    let prefJsons = [];
    for (const [key, value] of body.entries()) {
      if (key !== '_action') {
        let prefJson = {};
        prefJson['name'] = key;
        prefJson['score'] = parseInt(value, 10);
        prefJsons.push(prefJson);
      }
    }

    // update team_prefs list
    try {
      let prefList = profile.data.new_hire.team_prefs;
      if (prefList) prefList = prefJsons;
      else prefList.push(prefJsons);
      // send new preferences
      const newPrefs = JSON.stringify({ team_prefs: prefList });
      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/newhire/profile',
        newPrefs,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  if (_action === 'LogOut') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  return redirect('/newhire/survey');
}

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

    async function getSkillRes() {
      const skillRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/user/list-company-skills',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return skillRes.data;
    }

    async function getTeamsRes() {
      const teamRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/user/list-teams',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return teamRes.data;
    }

    async function getCompanyRes() {
      const companyRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/user/company-info',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
      return companyRes.data;
    }

    const [profileRes, skillRes, teamsRes, companyRes] = await Promise.all([
      getProfileRes(),
      getSkillRes(),
      getTeamsRes(),
      getCompanyRes(),
    ]);

    return json({
      profile: profileRes,
      skills: skillRes,
      teams: teamsRes,
      company: companyRes,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function Matching() {
  const basicInfo = useLoaderData<typeof loader>();

  const basicInfoPrefs = basicInfo.profile.new_hire.team_prefs;
  const basicInfoSkills = basicInfo.skills.skills;
  const allTeams = basicInfo.teams.teams;
  const newHireSkills = basicInfo.profile.new_hire.skills;
  const companyInfo = basicInfo.company.company;

  // new addition
  const favoriteTeams = basicInfo.profile.new_hire.favorited_teams;

  // generate list of teams and slots
  const questionList = [];
  if (basicInfo.profile.new_hire.team_id === '') {
    let teamList: { name: string; score: number; _id: string }[] = [];

    if (favoriteTeams) {
      let maxScore = allTeams.length;
      for (let item of favoriteTeams) {
        // Find matching team
        const team = allTeams.find((t) => t.name === item);
        teamList.push({ name: team.name, score: maxScore--, _id: team.name });
      }
      // push remaining teams
      if (teamList.length != allTeams.length) {
        if (basicInfoPrefs.length === 0) {
          for (let team of allTeams) {
            if (!favoriteTeams.includes(team.name)) {
              teamList.push({
                name: team.name,
                score: allTeams.length - teamList.length,
                _id: team.name,
              });
            }
          }
        } else {
          for (let team of basicInfoPrefs) {
            if (!favoriteTeams.includes(team.name)) {
              teamList.push({
                name: team.name,
                score: team.score,
                _id: team._id,
              });
            }
          }
        }
      }
    } else {
      if (basicInfoPrefs.length === 0) {
        for (let i = 0; i < allTeams.length; i++) {
          teamList.push({
            name: allTeams[i].name,
            score: allTeams.length - i,
            _id: allTeams[i].name,
          });
        }
      } else {
        teamList = basicInfoPrefs;
      }
    }

    // list of questions
    questionList.push(<PlainText text="Let's get started!" />);

    // add skill questions
    for (var skill of basicInfoSkills) {
      questionList.push(
        <Scale
          question={`How comfortable are you with ${skill}?`}
          existingSkills={newHireSkills}
          labels={['1', '2', '3', '4', '5']}
        />,
      );
    }

    // add ranking question and submission message
    questionList.push(
      <Ranking
        question="Rank the following teams (best to worst)"
        teams={teamList}
        favoriteTeams={favoriteTeams}
      />,
    );
    questionList.push(
      <PlainText text="Thank you for your responses. You are free to edit them until July 1, and matching results will be out on July 2." />,
    );
  } else {
    // push results message if new hire already has team
    questionList.push(
      <PlainText text="Matching results are out already! Click the button below to view your match." />,
    );
  }

  const {
    step,
    stepComp,
    isFirstStep,
    isLastStep,
    previous,
    next,
    getProgress,
  } = SurveyUtil(questionList);
  const [triggered, setTriggered] = useState('next-q');

  // check if survey is open yet
  const currentDate = new Date();
  const surveyOpen = parseDatePlus1(companyInfo.team_survey_deadline);
  const surveyClosed = parseDatePlus1(companyInfo.newhire_survey_deadline);
  const lastDay = formatDate(parseDate(companyInfo.newhire_survey_deadline));

  if (currentDate.getTime() < surveyOpen.getTime()) {
    return (
      <div className="flex-container">
        <div id="sidebar">
          <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
          <p className="text-logo">Opportune</p>
		  <TRDropdown skipLabel="Project" route="/newhire/survey"/>
        </div>
        <div id="content">
          <h2>Welcome {basicInfo.profile.new_hire.first_name} </h2>
          <div id="menubar">
            <MainNavigation />
          </div>
        </div>
        <div className="unavailable-content">
          The survey will be released soon!
          <img src="../survey-unavailable.gif"></img>
        </div>
        <p className="cta" style={{ textAlign: 'center' }}>
          <Link to="/newhire/teams">Back</Link>
        </p>
      </div>
    );
  } else if (currentDate.getTime() >= surveyClosed.getTime()) {
    return (
      <div className="flex-container">
        <div id="sidebar">
          <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
          <p className="text-logo">Opportune</p>
		  <TRDropdown skipLabel="Project" route="/newhire/survey"/>
        </div>
        <div id="content">
          <h2>Welcome {basicInfo.profile.new_hire.first_name} </h2>
          <div id="menubar">
            <MainNavigation />
          </div>
        </div>
        <div className="unavailable-content">
          The team matching survey is closed!
        </div>

        <p className="cta">
          <Link to="/newhire/results">View Results</Link>
        </p>
      </div>
    );
  } else if (basicInfo.profile.new_hire.team_id === '') {
    return (
      <div className="flex-container">
        <div id="sidebar">
          <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
          <p className="text-logo">Opportune</p>
		  <TRDropdown skipLabel="Project" route="/newhire/survey"/>
        </div>
        <div id="content">
          <h2>Welcome {basicInfo.profile.new_hire.first_name} </h2>
          <div id="menubar">
            <MainNavigation />
          </div>
          <div className="survey-will-close">
            <InformationCircleIcon className="lock-icon" />
            <p>The Survey Will Close on {lastDay}.</p>
          </div>
          <div>
            <Progress pct={getProgress()} />
            <Form
              action="/newhire/survey"
              method="post"
              onSubmit={triggered === 'next-q' ? next : previous}>
              {stepComp}
              <p className="cta">
                {!isFirstStep && !isLastStep ? (
                  <button
                    type="submit"
                    name="_action"
                    value={stepComp.type.name}
                    className="prev-button"
                    onClick={(e) => setTriggered(e.currentTarget.id)}
                    id="prev-q">
                    Previous
                  </button>
                ) : null}
                {!isLastStep ? (
                  <button
                    type="submit"
                    name="_action"
                    value={stepComp.type.name}
                    id="next-q"
                    onClick={(e) => setTriggered(e.currentTarget.id)}>
                    Next
                  </button>
                ) : null}
                {isLastStep ? <Link to="/newhire/results">Done</Link> : null}
              </p>
            </Form>
            <p className="cta">
              {isFirstStep && !isLastStep ? (
                <Link to="/newhire/teams" className="prev-button">
                  Back to Teams
                </Link>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex-container">
        <div id="sidebar">
          <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
          <p className="text-logo">Opportune</p>
		  <TRDropdown skipLabel="Project" route="/newhire/survey"/>
        </div>
        <div id="content">
          <h2>Welcome {basicInfo.profile.new_hire.first_name} </h2>
          <div id="menubar">
            <MainNavigation />
          </div>
          <div>
            <Progress pct={100} />
            {stepComp}
            <p className="cta">
              <Link to="/newhire/results">View Results</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
