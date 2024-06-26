import { Link, Form, useLoaderData, useFetcher } from '@remix-run/react';
import styles from '~/styles/home.css';
import {
  ArrowLeftOnRectangleIcon,
  InformationCircleIcon,
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
import { MemberModal } from '~/components/MemberModal';
import { Collapsible } from '~/components/Collapsible';
import TRDropdown from '~/components/TRDropdown';

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
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'postProfilePic') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/user/profile-picture',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'postCoverPic') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/cover-picture',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'createTeam') {
    if (myJson['team_members'])
      myJson['team_members'] = JSON.parse(myJson['team_members']);

    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/create-team',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      const response2 = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/invite-team',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'teamNudge') {
    try {
      myJson['subject'] = 'Urgent: Complete Your Team Preferences Survey';
      myJson[
        'content'
      ] = `Dear ${myJson['name']}, \n\nI wanted to gently remind you about the importance of completing our team preferences survey. Your insights are invaluable in helping us understand your team's needs and preferences, which in turn allows us to match you with the most suitable new hires.\n\nBy filling out the survey, you're not only helping us enhance your recruitment experience but also ensuring that we provide you with the best possible candidates for your team.\n\nIf you haven't already, please take a few moments to log in to your team portal and complete the survey. Should you have any questions or need assistance, don't hesitate to reach out to us!\n\nWarm regards,\nOpportune Team`;
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/mail',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'newHireNudge') {
    try {
      myJson['subject'] = 'Please fill out your New Hire Preferences Survey';
      myJson[
        'content'
      ] = `Dear ${myJson['name']}, \n\nWe wanted to remind you about the importance of completing your new hire preferences survey. Your input is crucial in helping us match you with the most suitable team and projects, ensuring a seamless integration into the company culture.\n\nBy sharing your preferences, you're not only helping us understand your needs better but also ensuring that your experience is tailored to your preferences and aspirations.\n\nIf you haven't already, please take a few moments to fill out the survey. Your feedback is highly valued.\n\nShould you encounter any difficulties or have any questions, feel free to reach out to us. Thank you for your cooperation and support.\n\nWarm regards,\nOpportune Team`;
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/mail',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
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
        }
      );
      const response2 = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/invite-newhire',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
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
        }
      );

      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'editNewHire') {
    try {
      myJson['newhire'] = {
        email: myJson['newemail'],
        first_name: myJson['first_name'],
        last_name: myJson['last_name'],
      };

      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/edit-newhire',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );

      // reinvite if changed email
      if (myJson['newemail'] != myJson['email']) {
        const response2 = await axios.post(
          process.env.BACKEND_URL + '/api/v1/company/invite-newhire',
          { email: myJson['newemail'] },
          {
            headers: {
              Authorization: session.get('auth'),
              'Content-Type': 'application/json',
            },
          }
        );
      }
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'deleteNewHire') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/delete-newhire',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'editTeam') {
    try {
      myJson['team'] = {
        email: myJson['newemail'],
        name: myJson['name'],
        description: myJson['description'],
        calendly_link: myJson['calendly_link'],
        max_capacity: myJson['max_capacity'],
        location: myJson['location'],
        members: JSON.parse(myJson['team_members']),
      };

      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/edit-team',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );

      // reinvite if changed email
      if (myJson['newemail'] != myJson['email']) {
        const response2 = await axios.post(
          process.env.BACKEND_URL + '/api/v1/company/invite-team',
          { email: myJson['newemail'] },
          {
            headers: {
              Authorization: session.get('auth'),
              'Content-Type': 'application/json',
            },
          }
        );
      }
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'deleteTeam') {
    try {
      const response = await axios.post(
        process.env.BACKEND_URL + '/api/v1/company/delete-team',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
      );
      return redirect('/company/profile');
    } catch (error) {
      console.log(error);
      return null;
    }
  } else if (_action === 'dateSave') {
    // update json to correct format
    myJson['team_survey_deadline'] = convertDateToAPIFormat(
      myJson['team_survey_deadline']
    );
    myJson['newhire_survey_deadline'] = convertDateToAPIFormat(
      myJson['newhire_survey_deadline']
    );

    try {
      const response = await axios.patch(
        process.env.BACKEND_URL + '/api/v1/company/profile',
        myJson,
        {
          headers: {
            Authorization: session.get('auth'),
            'Content-Type': 'application/json',
          },
        }
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
      }
    );

    const newHireRes = await axios.get(
      process.env.BACKEND_URL + '/api/v1/user/list-newhires',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      }
    );

    const teamsRes = await axios.get(
      process.env.BACKEND_URL + '/api/v1/user/list-teams',
      {
        headers: {
          Authorization: session.get('auth'),
          'Content-Type': 'application/json',
        },
      }
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

  for (var team of teams) {
    if (team.survey_complete == false) {
      allSurveysComplete = false;
      break;
    }
  }

  if (allSurveysComplete) {
    for (var nh of newhires) {
      if (nh.survey_complete == false) {
        allSurveysComplete = false;
        break;
      }
    }
  }

  // const [url, updateUrl] = useState();
  const [error, updateError] = useState();
  const handleOnUpload = (error: any, result: any, widget: any) => {
    if (error) {
      updateError(error.statusText);
      widget.close({
        quiet: true,
      });
      return;
    }
    // updateUrl(result?.info?.secure_url);
    const formData = new FormData(); // Extract form data
    formData.append('_action', 'postProfilePic');
    formData.append('url', result?.info?.secure_url);

    // Submit form data to the server
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });
  };

  // const [coverUrl, setCoverUrl] = useState('../defaultCover.png');

  const handleCoverUpload = (error: any, result: any, widget: any) => {
    if (error) {
      updateError(error.statusText);
      widget.close({
        quiet: true,
      });
      return;
    }
    // setCoverUrl(result?.info?.secure_url);
    const formData = new FormData(); // Extract form data
    formData.append('_action', 'postCoverPic');
    formData.append('url', result?.info?.secure_url);

    // Submit form data to the server
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });
  };

  const [showTeamModal, setShowTeamModal] = useState(false);

  const openTeamModal = () => {
    setShowTeamModal(true);
  };

  const closeTeamModal = () => {
    setShowTeamModal(false);
    setTeamMembers([]);
  };

  const [showHireModal, setShowHireModal] = useState(false);

  const openHireModal = () => {
    setShowHireModal(true);
  };

  const closeHireModal = () => {
    setShowHireModal(false);
  };

  // return the state to null before sending the server-side request
  const handleCreateHireSubmit = async (event) => {
    event.preventDefault();
    setShowHireModal(false); // Update state before form submission

    const formData = new FormData(event.target); // Extract form data
    const action = formData.get('_action');
    formData.append('_action', 'createNewhire');

    // Submit form data to the server
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });
  };

  const handleCreateTeamSubmit = async (event) => {
    event.preventDefault();
    setShowTeamModal(false); // Update state before form submission

    const formData = new FormData(event.target); // Extract form data
    formData.append('team_members', JSON.stringify(teamMembers));
    formData.append('_action', 'createTeam');

    setTeamMembers([]); // reset the list back to none

    // Submit form data to the server
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });
  };

  // const [isEditingName, setIsEditingName] = useState(null);

  const [editHire, setEditHire] = useState(null);
  const [editTeam, setEditTeam] = useState(null);

  const handleSetEditTeam = (i) => {
    setEditTeam(i);
    setTeamMembers(teams[i].members);
  };

  const handleCloseEditTeam = () => {
    setEditTeam(null);
    setTeamMembers([]);
  }

  // return the state to null before sending the server-side request
  const handleEditHireSubmit = async (event) => {
    event.preventDefault();
    setEditHire(null); // Update state before form submission

    const formData = new FormData(event.target); // Extract form data
    formData.append('_action', 'editNewHire');

    // Submit form data to the server
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });
  };

  const handleEditTeamSubmit = async (event) => {
    event.preventDefault();
    setEditTeam(null); // Update state before form submission

    const formData = new FormData(event.target); // Extract form data
    formData.append('_action', 'editTeam');
    formData.append('team_members', JSON.stringify(teamMembers));

    setTeamMembers([]);
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });

    // Submit form data to the server
    fetcher.submit(formData, { method: 'post', action: '/company/profile' });
  };

  const validateDates = (nhDate, teamDate) => {
    var nhDateAsDate = new Date(nhDate);
    var teamDateAsDate = new Date(teamDate);

    if (nhDateAsDate.getTime() <= teamDateAsDate.getTime()) {
      return false;
    } else {
      return true;
    }
  };

  const [nhDate, setNHDate] = useState(
    parseDate(info?.data.company.newhire_survey_deadline)
  );
  const [teamDate, setTeamDate] = useState(
    parseDate(info?.data.company.team_survey_deadline)
  );
  const [dateButtonDisabled, setDateButtonDisabled] = useState(
    !validateDates(nhDate, teamDate)
  );

  const handleNHDateChange = (date) => {
    setNHDate(date);

    if (!validateDates(date, teamDate)) {
      setDateButtonDisabled(true);
    } else {
      setDateButtonDisabled(false);
    }
  };

  const handleTeamDateChange = (date) => {
    setTeamDate(date);

    if (!validateDates(nhDate, date)) {
      setDateButtonDisabled(true);
    } else {
      setDateButtonDisabled(false);
    }
  };

  const date = new Date();
  const surveysClosedDate = parseDate(
    info?.data.company.newhire_survey_deadline
  );

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(null);

  // Function to toggle the member addition modal
  const openMemberModal = () => {
    setShowMemberModal(true);
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
  };

  const [teamMembers, setTeamMembers] = useState([]);

  // append to the members state
  const addTeamMember = (member) => {
    setTeamMembers((currentMembers) => [...currentMembers, member]);
  };

  // remove by index
  const handleMemberDelete = (index) => {
    var editedMembers = [];
    for (var i = 0; i < teamMembers.length; i++) {
      if (i == index) continue;
      editedMembers.push(teamMembers[i]);
    }

    setTeamMembers(editedMembers);
  };

  // update by index
  const handleMemberEdit = (member, index) => {
    var editedMembers = [];
    for (var i = 0; i < teamMembers.length; i++) {
      if (i == index) editedMembers.push(member);
      else editedMembers.push(teamMembers[i]);
    }

    setTeamMembers(editedMembers);
  };

  const navLabels = ["Profile", "Matching", "Settings"]

  return (
    <div className="company-container">
      <div id="sidebar">
        <img
          className="opportune-logo-small"
          src="../opportune_newlogo.svg"></img>
        <p className="text-logo">Opportune</p>
        <TRDropdown labels={navLabels} route="/company/profile" userType="company" />
      </div>
      <div
        className="company-preview"
        style={{
          backgroundImage: `url(${
            info?.data.company.cover_url
              ? info?.data.company.cover_url
              : '../defaultCover.png'
          })`,
        }}>
        {info?.data.company.image_url ? (
          <img src={info?.data.company.image_url} alt="Uploaded" />
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
                team,
                i // DISPLAY TEAMS HERE
              ) => (
                <Collapsible
                  trigger={
                    <div key={team.name} className="company-team">
                      <div>
                        <h3>{team.name}</h3>
                        <div>{team.location}</div>{' '}
                      </div>
                      <div className="row-container">
                        <button
                          className={
                            team.survey_complete
                              ? 'done-button'
                              : 'in-progress-button'
                          }
                          style={{ height: '55%' }}>
                          {team.survey_complete ? 'Done' : 'In Progress'}
                        </button>
                        <div className="expanded-content">
                          <Form action="/company/profile" method="post">
                            <button
                              className="newhire-button"
                              type="submit"
                              name="_action"
                              value="teamNudge">
                              Email nudge
                            </button>
                            <input
                              name="email"
                              value={team.email}
                              style={{ display: 'none' }}
                            />
                            <input
                              name="name"
                              value={team.name}
                              style={{ display: 'none' }}
                            />
                          </Form>

                          <div className="row-container">
                            <button
                              className="edit-button"
                              type="button"
                              onClick={() => handleSetEditTeam(i)}>
                              <PencilIcon />
                            </button>
                            <Form action="/company/profile" method="post">
                              <button
                                className="edit-button trash"
                                type="submit"
                                name="_action"
                                value="deleteTeam">
                                <TrashIcon />
                              </button>
                              <input
                                name="email"
                                value={team.email}
                                style={{ display: 'none' }}
                              />
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  }>
                  <div>
                    <h3>Team Description: </h3>
                    {team.description}
                  </div>
                  <div>
                    <h3>Team Members: </h3>
                    <div className="member-container">
                      {team.members?.map((member) => (
                        <div className="row-container team-member-card1">
                          <div>
                            {member.first_name} {member.last_name}
                          </div>
                          {/* <button
                            className="edit-icon"
                            onClick={() => handleMemberTrash(team.email, i)}>
                            <TrashIcon />
                      </button> */}
                        </div>
                      ))}
                    </div>
                    <span>
                      <h3>
                        Email:
                        <span style={{ fontWeight: '100', fontSize: '1rem' }}>
                          {' '}
                          {team.email}
                        </span>
                      </h3>
                    </span>
                  </div>
                </Collapsible>
              )
            )}
          </div>
          <p className="cta" style={{ textAlign: 'center' }}>
            <button onClick={openTeamModal}>Add team</button>
          </p>
          <Modal
            open={showTeamModal}
            onClose={closeTeamModal}
            title={'Add a team'}>
            <Form
              action="/company/profile"
              method="post"
              onSubmit={handleCreateTeamSubmit}>
              <TextField
                className="add-team"
                label="Team Email"
                name="email"
                classLabel="email"
                type="email"
              />
              <TextField
                className="add-team"
                label="Team Name"
                name="name"
                classLabel="name"
                type="text"
              />
              <TextField
                className="add-team"
                label="Location"
                name="location"
                classLabel="location"
                type="text"
              />
              <TextField
                className="add-team"
                label="Description"
                name="description"
                classLabel="description"
                type="text"
              />
              <TextField
                className="add-team"
                label="Calendly Link"
                name="calendlyLink"
                classLabel="calendly_link"
                type="text"
              />
              <TextField
                className="add-team"
                label="New Hire Capacity"
                name="capacity"
                classLabel="max_capacity"
                type="number"
              />
              <div className="field-container">
                <label>Team Members</label>
                <div
                  className="row-container"
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card">
                      <span>
                        {member.first_name} {member.last_name}
                      </span>
                      <PencilIcon
                        className="edit-icon"
                        onClick={() => {
                          setShowEditMemberModal(index);
                          console.log(index);
                          console.log(teamMembers);
                          console.log(teamMembers[index]);
                        }}
                      />
                      <TrashIcon
                        className="edit-icon trash"
                        onClick={() => handleMemberDelete(index)}
                      />
                    </div>
                  ))}
                  <button className="add-member-btn" onClick={openMemberModal}>
                    Add Member
                  </button>
                </div>
              </div>
              <MemberModal
                open={showMemberModal}
                member={{}}
                onClose={closeMemberModal}
                addTeamMember={addTeamMember}
                title="Add team member"></MemberModal>
              {showEditMemberModal != null ? (
                <MemberModal
                  open={showEditMemberModal != null}
                  member={teamMembers[showEditMemberModal] ?? {}}
                  onClose={() => setShowEditMemberModal(null)}
                  addTeamMember={(m) =>
                    handleMemberEdit(m, showEditMemberModal)
                  }
                  title="Add team member"></MemberModal>
              ) : null}

              {!showMemberModal && showEditMemberModal == null && (
                <button
                  className="center"
                  type="submit"
                  name="_action"
                  value="createTeam">
                  Add Team
                </button>
              )}
            </Form>
          </Modal>
          <Modal
            open={editTeam != null}
            onClose={handleCloseEditTeam}
            title={'Edit Team'}
          >
            {editTeam != null ? (
              <Form
                action="/company/profile"
                method="post"
                onSubmit={handleEditTeamSubmit}>
                <input
                  name="email"
                  classLabel="email"
                  value={info?.teams.teams[editTeam].email}
                  style={{ display: 'none' }}
                />
                <TextField
                  className="add-team"
                  label="Team Email"
                  name="newemail"
                  classLabel="newemail"
                  value={info?.teams.teams[editTeam].email}
                  type="email"
                />
                <TextField
                  className="add-team"
                  label="Team Name"
                  name="name"
                  classLabel="name"
                  value={info?.teams.teams[editTeam].name}
                  type="text"
                />
                <TextField
                  className="add-team"
                  label="Location"
                  name="location"
                  classLabel="location"
                  value={info?.teams.teams[editTeam].location}
                  type="text"
                />
                <TextField
                  className="add-team"
                  label="Description"
                  name="description"
                  classLabel="description"
                  value={info?.teams.teams[editTeam].description}
                  type="text"
                />
                <TextField
                  className="add-team"
                  label="Calendly Link"
                  name="calendlyLink"
                  classLabel="calendly_link"
                  value={info?.teams.teams[editTeam].calendly_link}
                  type="text"
                />
                <TextField
                  className="add-team"
                  label="Capacity"
                  name="capacity"
                  classLabel="max_capacity"
                  value={info?.teams.teams[editTeam].max_capacity}
                  type="number"
                />
                <div className="field-container">
                  <label>Team Members</label>
                  <div className="row-container">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="team-member-card">
                        <span>
                          {member.first_name} {member.last_name}
                        </span>
                        <PencilIcon
                          className="edit-icon"
                          onClick={() => {
                            setShowEditMemberModal(index);
                          }}
                        />
                        <TrashIcon
                          className="edit-icon trash"
                          onClick={() => handleMemberDelete(index)}
                        />
                      </div>
                    ))}
                    <button
                      className="add-member-btn"
                      onClick={openMemberModal}>
                      Add Member
                    </button>
                  </div>
                </div>
                <MemberModal
                  open={showMemberModal}
                  member={{}}
                  onClose={closeMemberModal}
                  addTeamMember={addTeamMember}
                  title="Add team member"></MemberModal>
                {showEditMemberModal != null ? (
                  <MemberModal
                    open={showEditMemberModal != null}
                    member={teamMembers[showEditMemberModal] ?? {}}
                    onClose={() => setShowEditMemberModal(null)}
                    addTeamMember={(m) =>
                      handleMemberEdit(m, showEditMemberModal)
                    }
                    title="Add team member"></MemberModal>
                ) : null}

                {!showMemberModal && showEditMemberModal == null && (
                  <div className="buttons">
                    <button
                      className="save-button"
                      type="submit"
                      name="_action"
                      value="editTeam">
                      Save
                    </button>
                  </div>
                )}
              </Form>
            ) : null}
          </Modal>
        </div>

        <div className="new-hire-container">
          <div className="company-teams-title">
            <h2>New Hire</h2>
          </div>
          <div className="teams-list">
            {info?.newHires?.new_hires.map((newHire, i) => (
              <div key={newHire._id} className="company-hire">
                <h3>
                  {newHire.first_name} {newHire.last_name}
                </h3>

                <p>{newHire.email}</p>
                <button
                  className={
                    newHire.survey_complete
                      ? 'done-button'
                      : 'in-progress-button'
                  }>
                  {newHire.survey_complete ? 'Done' : 'In Progress'}
                </button>
                <div className="expanded-content">
                  <Form action="/company/profile" method="post">
                    <button
                      className="newhire-button"
                      type="submit"
                      name="_action"
                      value="newHireNudge">
                      Email nudge
                    </button>
                    <input
                      name="email"
                      value={newHire.email}
                      style={{ display: 'none' }}
                    />
                    <input
                      name="name"
                      value={newHire.first_name}
                      style={{ display: 'none' }}
                    />
                  </Form>
                  <div className="row-container">
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() => setEditHire(i)}>
                      <PencilIcon />
                    </button>
                    <Form action="/company/profile" method="post">
                      <button
                        className="edit-button trash"
                        type="submit"
                        name="_action"
                        value="deleteNewHire">
                        <TrashIcon />
                      </button>
                      <input
                        name="email"
                        value={newHire.email}
                        style={{ display: 'none' }}
                      />
                    </Form>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="cta" style={{ textAlign: 'center' }}>
            <button onClick={openHireModal}>Add new hire</button>
          </p>
          <Modal
            open={editHire != null}
            onClose={() => setEditHire(null)}
            title={'Edit New Hire'}>
            {editHire != null ? (
              <Form
                action="/company/profile"
                method="post"
                onSubmit={handleEditHireSubmit}>
                <input
                  name="email"
                  classLabel="email"
                  value={info?.newHires.new_hires[editHire].email}
                  style={{ display: 'none' }}
                />
                <TextField
                  label="First Name"
                  name="first_name"
                  classLabel="first_name"
                  value={info?.newHires.new_hires[editHire].first_name}
                  type="text"
                />
                <TextField
                  label="Last Name"
                  name="last_name"
                  classLabel="last_name"
                  value={info?.newHires.new_hires[editHire].last_name}
                  type="text"
                />
                <TextField
                  label="Email"
                  name="newemail"
                  classLabel="newemail"
                  value={info?.newHires.new_hires[editHire].email}
                  type="email"
                />

                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                  }}>
                  <div className="buttons">
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
            ) : null}
          </Modal>
          <Modal
            open={showHireModal}
            onClose={closeHireModal}
            title={'Add new hire'}>
            <Form
              action="/company/profile"
              method="post"
              onSubmit={handleCreateHireSubmit}>
              <TextField
                label="First Name"
                name="firstName"
                classLabel="first_name"
                type="text"
              />
              <TextField
                label="Last Name"
                name="lastName"
                classLabel="last_name"
                type="text"
              />
              <TextField
                label="Email"
                name="email"
                classLabel="email"
                type="email"
              />

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
          <div className="row-container-start">
            <label className="date-container">
              Team Survey Deadline:
              <DatePicker
                selected={teamDate}
                onChange={(date) => handleTeamDateChange(date)}
                name="team_survey_deadline"
              />
            </label>
            <label className="date-container">
              New Hire Survey Deadline:
              <DatePicker
                selected={nhDate} // change to info.teams.team.survey_deadline or sth like that
                onChange={(date) => handleNHDateChange(date)} // do fetcher.submit
                name="newhire_survey_deadline"
              />{' '}
              {/* TODO CSS */}
            </label>
            {dateButtonDisabled ? (
              <button
                type="submit"
                name="_action"
                className="company-save"
                style={{ 'background-color': 'gray', cursor: 'auto' }}
                value="dateSave"
                disabled={true}>
                Save
              </button>
            ) : (
              <button
                type="submit"
                name="_action"
                className="company-save"
                value="dateSave"
                disabled={false}>
                Save
              </button>
            )}
          </div>
        </Form>
      </div>

      <p className="cta" style={{ textAlign: 'right', marginRight: '2rem' }}>
        {' '}
        {allSurveysComplete && date.getTime() > surveysClosedDate.getTime() ? (
          <Link to="/company/matching">Next</Link>
        ) : (
          <div className="matching-unavailable">
            <InformationCircleIcon className="lock-icon" />
            <p style={{ marginLeft: '0.5rem' }}>
              Team Matching will be available when all surveys are complete or
              the deadline is reached.
            </p>
          </div>
        )}
      </p>
    </div>
  );
}

export function links() {
  return [
    { rel: 'stylesheet', href: datepicker },
    { rel: 'stylesheet', href: styles },
  ];
}
