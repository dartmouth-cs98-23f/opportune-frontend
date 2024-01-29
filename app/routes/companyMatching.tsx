import { Form, useLoaderData } from '@remix-run/react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import styles from '~/styles/home.css'
import { useState } from 'react';
import ImageUpload from '~/components/ImageUpload';
import ReadMore from '~/components/ReadMore';

export default function CompanyMatching() {
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
          <img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
          <Form action="/profile" method="post">
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
              <img src="defaultAvatar.png" alt="Placeholder" />  
          )}
      
          <div>
              <h1>Company name</h1>
              <p>Location: SF</p>
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
            {teams.map(team => (
              <div key={team.name} className='company-team'>
                <div>
                  <h3>{team.name}</h3> 
                  <p>{team.org}</p>
                  <div>{team.location}</div>
                </div>
                <ReadMore text={team.description}></ReadMore>
                <button className={team.formFilled ? 'done-button' : 'in-progress-button'}>{team.formFilled ? 'Done' : 'In Progress'}</button>
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
            {newHires.map(newHire => (
              <div key={newHire.name} className='company-team'>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <h3>{newHire.name}</h3> 
                  <p>{newHire.email}</p>
                  <p>Unmatched</p>
                </div>
                <button className={newHire.formFilled ? 'done-button' : 'in-progress-button'}>{newHire.formFilled ? 'Done' : 'Incomplete'}</button>
                <select>
                  {teams.map(team => (
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
        <button type="submit" name="_action" value="matchingSurvey">
          Run matching survey
        </button>
      </p>
    </div>
  );
}

export function links() {
	return [{ rel: 'stylesheet', href: styles }];
}