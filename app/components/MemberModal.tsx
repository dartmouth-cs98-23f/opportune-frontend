import React, { useState, useEffect } from 'react';

export const MemberModal = ({ open, member, onClose, title, addTeamMember }) => {
  const [firstName, setFirstName] = useState(member.first_name ?? '');
  const [lastName, setLastName] = useState(member.last_name ?? '');
  const [role, setRole] = useState(member.role ?? '');
  const [age, setAge] = useState(member.age ?? '');
  const [sex, setSex] = useState(member.sex ?? '');
  const [race, setRace] = useState(member.race ?? '');

  const handleAddMemberClick = () => {
    const memberData = {
      first_name: firstName,
      last_name: lastName,
      role: role,
      age: age,
      sex: sex,
      race: race,
    };

    addTeamMember(memberData); // Add the member to the teamMembers state in the parent component
    // Reset the input states
    setFirstName('');
    setLastName('');
    setRole('');
    setAge('');
    setSex('');
    setRace('');
    onClose(); // Close the modal
  };

  useEffect(() => {
    // Close the modal on ESC key press
    const onKeyDown = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h1 style={{ textAlign: 'center' }}>{title}</h1>
        <button className="right" onClick={onClose}>
          &times;
        </button>

        {/* Mimicking TextField Structure */}
        <div className="field-container">
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="field-container">
          <label htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="field-container">
          <label htmlFor="role">Role</label>
          <input
            name="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div className="field-container">
          <label htmlFor="age">Age</label>
          <input
            name="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        {/* Mimicking SelectField Structure */}
        <div className="field-container">
          <label htmlFor="sex">Sex</label>
          <select
            name="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required>
            <option disabled value="">
              Select Sex
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Nonbinary">Nonbinary</option>
            <option value="Prefer Not to Say">Prefer Not to Say</option>
          </select>
        </div>

        <div className="field-container">
          <label htmlFor="race">Race</label>
          <select
            name="race"
            value={race}
            onChange={(e) => setRace(e.target.value)}
            required>
            <option disabled value="">
              Select Race
            </option>
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Hispanic/Latino">Hispanic/Latino</option>
            <option value="Asian">Asian</option>
            <option value="American Indian">American Indian</option>
            <option value="Pacific Islander">Pacific Islander</option>
            <option value="Other">Other</option>
            <option value="Prefer Not to Say">Prefer Not to Say</option>
          </select>
        </div>

        <p className="cta" style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleAddMemberClick}>
            Save
          </button>
        </p>
      </div>
    </div>
  );
};
