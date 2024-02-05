import { Link, Form, useLoaderData } from '@remix-run/react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import styles from '~/styles/home.css'
import { useState } from 'react';
import axios from 'axios';
import ImageUpload from '~/components/ImageUpload';
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, json } from '@remix-run/node';
import ReadMore from '~/components/ReadMore';
import { destroySession, getSession } from '../utils/sessions';

// ACTION FUNCTION
export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");

	const session = await getSession(
		request.headers.get("Cookie")
	);

	var myJson = {};
	for (const [key, value] of body.entries()) {
		myJson[key] = value;
	}

  // Actions
	if (_action === "LogOut") { 
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});

	} else if (_action === "matchingSurvey") {
		try {

			const response = await axios.post(process.env.BACKEND_URL + '/api/v1/company/match', myJson, {
				headers: {
				"Authorization": session.get("auth"),
				"Content-Type": "application/json",
				},
			})
			return redirect("/company/matching");
		} catch (error) {
			console.log(error);
			return null;
		}

	} else {
  		return null;
  }
}

// LOADER FUNCTION
export async function loader({request}: LoaderFunctionArgs) {
  try {
    const session = await getSession(
			request.headers.get("Cookie")
		);

    if(!session.has("auth") || (session.has("user_type") && session.get("user_type") !== "company")) {
      return redirect("/login");
    }

     const companyRes = await axios.get(process.env.BACKEND_URL + '/api/v1/company/profile', {
       headers: {
         "Authorization": session.get("auth"),
         "Content-Type": "application/json",
       }
     });

    const newHireRes = await axios.get(process.env.BACKEND_URL + '/api/v1/user/list-newhires', {
      headers: {
        "Authorization": session.get("auth"),
        "Content-Type": "application/json",
      }  
    });

    const teamsRes = await axios.get(process.env.BACKEND_URL + '/api/v1/user/list-teams', {
      headers: {
        "Authorization": session.get("auth"),
        "Content-Type": "application/json",
      }
    });

    if (newHireRes.status === 200 && teamsRes.status === 200 && companyRes.status == 200) {
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

  var allSurveysCompleted = true;
  var teamIdMap = {};
  var nhIdMap = {};
  for(var team of info.teams.teams) {
    teamIdMap[team._id] = team;
    if(team.survey_complete == false) {
      allSurveysCompleted = false;
    }
  }
  for(var nh of info.newHires.new_hires) {
    nhIdMap[nh._id] = nh;
    if(!allSurveysCompleted) break;
    if(nh.survey_complete == false) {
      allSurveysCompleted = false;
    }
  }

  const [teams, setTeams] = useState([
    {  
      name: 'Team A',
      description: 'Mobile team',
      org: 'Org 1',
      location: 'Mountain View, CA',
      formFilled: 'True'
    },
    {
      name: 'Team B',
      description: 'Web team',
      org: 'Org 2',
      location: 'San Francisco, CA',
      formFilled: 'False'
    },
    {  
      name: 'Team A',
      description: 'Mobile team',
      org: 'Org 3',
      location: 'San Diego, CA',
      formFilled: 'True'
    },
  ]);

  const [newHires, setNewHires] = useState([
    {
      name: 'John Doe',
      email: 'john@email.com',
      formFilled: 'False'
    },
    {
      name: 'Jane Smith',
      email: 'jane@email.com',
      formFilled: 'True'
    },
    {
      name: 'Jane Smith',
      email: 'jane@email.com',
      formFilled: 'True'
    }
  ]);

  const [url, updateUrl] = useState();
	const [error, updateError] = useState();
	const handleOnUpload = (error:any, result:any, widget:any) => {
		if (error) {
			updateError(error.statusText);  
			widget.close({
				quiet: true,
			});
			return;
		}
		updateUrl(result?.info?.secure_url);
	}

  const [coverUrl, setCoverUrl] = useState('defaultCover.png');

  const handleCoverUpload = (error:any, result:any, widget:any) => {
    if (error) {
      updateError(error.statusText);  
      widget.close({
        quiet: true,
      });
      return;
    }
    setCoverUrl(result?.info?.secure_url);
	}

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="sidebar">
          <img className="opportune-logo-small" src="../opportune_newlogo.svg"></img>
          <Form action="/company/matching" method="post">
          <p className="text-logo">Opportune</p>
            <button className="logout-button" type="submit"
                    name="_action" value="LogOut"> 
                <ArrowLeftOnRectangleIcon /> 
            </button>
          </Form>
      </div>

      <div className="company-preview" style={{backgroundImage: `url(${coverUrl})`}}>
          {url ? (
              <img src={url} alt="Uploaded"/>
          ) : (
              <img src="../defaultAvatar.png" alt="Placeholder" />  
          )}
      
          <div>
              <h1>{info?.data.company.name}</h1>
              <p>Location: SF</p> { /* TO REMOVE */}
              <div className='upload-buttons'>
                  <ImageUpload onUpload={handleOnUpload}>
                  {({ open }) => {
                      return <button className="custom-file-upload" onClick={open}
                              type="button">Upload Image</button>;
                  }}
                  </ImageUpload>
                  <ImageUpload onUpload={handleCoverUpload}>
                      {({open}) => (
                          <button className="custom-file-upload" onClick={open} style={{marginLeft: '10px'}}>Upload Cover</button>  
                      )}
                  </ImageUpload>
              </div>
          </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div className='company-teams-container'>
          <div className='company-teams-title'>
            <h2>Teams</h2>
          </div>
          <div className="teams-list">
            {info.teams.teams.map(team => (
              <div key={team.name} className='company-team'>
                <div>
                  <h3>{team.name}</h3> 
              {/*   <p>{team.org}</p>   
                  <div>{team.location}</div> */}
                </div>
                <ReadMore text={team.description}></ReadMore>
                <button className={team.survey_complete ? 'done-button' : 'in-progress-button'}>{team.survey_complete ? 'Done' : 'In Progress'}</button>
                <button className="newhire-button">
                  Email nudge
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="new-hire-container">
          <div className='company-teams-title'>
            <h2>New Hire</h2>
          </div>
          <div className="teams-list">
            {info.newHires.new_hires.map(newHire => (
              <div key={newHire.name} className='company-team'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <h3>{newHire.first_name} {newHire.last_name}</h3> 
                  <p>{newHire.email}</p>
                  <p>{newHire.team_id ? teamIdMap[newHire.team_id].name : "Unmatched"}</p>
                </div>
                <button className={newHire.survey_complete ? 'done-button' : 'in-progress-button'}>{newHire.survey_complete ? 'Done' : 'Incomplete'}</button>
                <select>
                  {info.teams.teams.map(team => (
                    <option key={team.name} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <p className="cta" style={{textAlign: 'right'}}>
        
        {allSurveysCompleted ? 
        <Form action="/company/matching" method="post">
          <button type="submit" name="_action" value="matchingSurvey">
            Run matching survey
          </button> 
        </Form>
        
        :
        <></>}
        
      </p>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}