import { Form, Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import axios from 'axios';
import { destroySession, getSession } from '../utils/sessions';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import PlainText from '~/components/survey_qs/PlainText';
import { parseDatePlus1, parseDate, formatDate } from '~/lib/date';
import TRDropdown from '~/components/TRDropdown';

// ACTION FUNCTION
export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const _action = body.get('_action');

  const session = await getSession(request.headers.get('Cookie'));

  if (!session.get('auth')) {
    return redirect('/login');
  }

  // Actions
  if (_action === 'AddSkills') {
    try {
      const skillRes = await axios.get(
        process.env.BACKEND_URL + '/api/v1/team/profile',
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );

      let currSkills = skillRes.data.team.skills;
      var myJson = {};

      for (const [key, value] of body.entries()) {
        if (key === 'skills') {
          const skillList = value.split(',');
          myJson[key] = skillList.map((skill: string) => {
            const skillIdx = currSkills.findIndex(
              (entry) => entry.name === skill,
            );

            let obj = {};
            obj['name'] = skill;
            obj['score'] = skillIdx !== -1 ? currSkills[skillIdx].score : 5;

            return obj;
          });
        } else {
          myJson[key] = value;
        }
      }

      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/team/profile',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  } else if (_action === 'LogOut') {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }

  return redirect('/team/survey');
}

// LOADER FUNCTION
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const session = await getSession(request.headers.get('Cookie'));

    if (
      !session.has('auth') ||
      (session.has('user_type') && session.get('user_type') !== 'team')
    ) {
      return redirect('/login');
    }

    const profileRes = await axios.get(
      process.env.BACKEND_URL + '/api/v1/team/profile',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      },
    );

    const companyRes = await axios.get(
      process.env.BACKEND_URL + '/api/v1/user/company-info',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      },
    );

    return json({ profile: profileRes.data, company: companyRes.data });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function Tskills() {
  /* let teamInfo = {
		team: {
			name: "Data Science",
			description: "Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.Vis modo alienum adversarium ei. Et munere singulis rationibus usu, ius ex case cibo facete.",
			skills: [{"name": "Python", "score": 5}, {"name": "Java", "score": 5}],
			members: ["Stephen Wang", "Eren Aldemir", "Ethan Chen", "Karina Montiel", "Ryan Luu"]
		}
	}; */

  const info = useLoaderData<typeof loader>();
  const teamInfo = info?.profile;

  const companyInfo = info?.company.company;

  let techStacks = [
    'Python',
    'Javascript',
    'Typescript',
    'HTML/CSS',
    'SQL',
    'Rust',
    'C#',
    'Bash',
    'Go',
    'Java',
    'C++',
    'Kotlin',
    'C',
    'PHP',
    'Powershell',
    'Dart',
    'Swift',
    'Ruby',
    'Lua',
    'Elixir',
    'Assembly',
    'Zig',
    'Haskell',
    'R',
    'Scala',
    'Julia',
    'F#',
    'Delphi',
    'Clojure',
    'Lisp',
    'Solidity',
    'GDScript',
    'Erlang',
    'Visual Basic (.Net)',
    'Groovy',
    'MATLAB',
    'Perl',
    'OCaml',
    'Objective-C',
    'VBA',
    'Nim',
    'Ada',
    'Crystal',
    'Prolog',
    'Fortran',
    'Apex',
    'APL',
    'Cobol',
    'SAS',
    'Raku',
    'Flow',
    'Docker',
    'npm',
    'pip',
    'Homebrew',
    'Yarn',
    'Webpack',
    'Make',
    'Kubernetes',
    'NuGet',
    'Maven',
    'Gradle',
    'Vite',
    'Visual Studio Solution',
    'CMake',
    'Cargo',
    'GNU GCC',
    'Terraform',
    'MSBuild',
  ].sort();

  // tech stack search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string[]>(
    teamInfo.team.skills.map((skill) => skill.name),
  );

  const filteredOptions = searchTerm
    ? techStacks.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  // add and remove skills to preferences
  const addToSelected = (skill: string) => {
    if (filteredOptions.length === 0) {
      if (skill.length !== 0 && !selectedTech.includes(skill)) {
        setSelectedTech([...selectedTech, skill]);
      }
    } else if (!selectedTech.includes(skill)) {
      if (skill.length !== 0) {
        setSelectedTech([...selectedTech, skill]);
      }
    }
    setSearchTerm('');
  };

  const removeFromSelected = (skill: string) => {
    const updated = selectedTech.filter((item) => item !== skill);
    setSelectedTech(updated);
  };

  // check if survey is open yet
  const currentDate = new Date();
  const surveyClosed = parseDatePlus1(companyInfo.team_survey_deadline);
  const lastDay = formatDate(parseDate(companyInfo.team_survey_deadline));

  if (currentDate.getTime() > surveyClosed.getTime()) {
    return (
      <div className="flex-container">
        <div id="sidebar">
			<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
			<p className="text-logo">Opportune</p>
			<TRDropdown skipLabel="Project" route="/team/skills" userType="team" />
		</div>
        <div className="unavailable-content">The skills survey is closed. </div>
        <p className="cta" style={{ textAlign: 'center' }}>
          <Link to="/team/profile">Back</Link>
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex-container">
        <div id="sidebar">
			<img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
			<p className="text-logo">Opportune</p>
			<TRDropdown skipLabel="Project" route="/team/skills" userType="team" />
		</div>
        <div className="content">
          <div className="company-banner">
            <h1> {companyInfo.name} </h1>
            <h3> {teamInfo.team.name} — {teamInfo.team.location}</h3>
          </div>
          <div className="survey-will-close">
            <InformationCircleIcon className="lock-icon" />
            <p>The Survey Will Close on {lastDay}.</p>
          </div>
          <div className="company-prefs">
            <h3> Fill Your Preferences </h3>
            <Form action="/team/skills" method="post">
              <div className="team-box skills">
                <PlainText
                  text="Search and select all the tech stacks your team requires"
                  key={2}
                />
                <input
                  type="hidden"
                  name="skills"
                  value={selectedTech.join(',')}
                />
                <div className="full-skills">
                  {selectedTech.map((skill: string, i: number) => (
                    <li
                      key={i}
                      className="filtered-skill"
                      onClick={() => removeFromSelected(skill)}>
                      {skill + ' ✕'}
                    </li>
                  ))}
                </div>
                <div>
                  <input
                    className="skill-search"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="edit"
                    onClick={() => addToSelected(searchTerm)}>
                    + Custom
                  </button>
                  <div className="full-skills">
                    {filteredOptions.map((option, index) => (
                      <li
                        key={index}
                        className="filtered-skill"
                        onClick={() => addToSelected(option)}>
                        {option}
                      </li>
                    ))}
                  </div>
                </div>
              </div>
              <p className="cta">
                <Link to="/team/profile" className="prev-button">
                  Cancel
                </Link>
              </p>
              <p className="cta">
                <button name="_action" value="AddSkills">
                  Next
                </button>
              </p>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
