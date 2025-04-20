import React, { useState } from 'react';

// Define props interface to accept the navigation callback
interface UserProfileProps {
  onNavigate: (view: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('Maria Johnson');
  const [position, setPosition] = useState('Officer');
  const [supervisor, setSupervisor] = useState('Sgt. Davis');
  const [preferredShift, setPreferredShift] = useState('Day');
  const [team, setTeam] = useState('Alpha');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic (e.g., API call)
    console.log({
      fullName,
      position,
      supervisor,
      preferredShift,
      team,
      comments,
    });
    // alert('Profile updated successfully!'); // Optional: Keep or remove alert
    // Navigate back to Dashboard
    onNavigate('Dashboard');
  };

  return (
    <div className="p-6">
      <div className="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Position
          </label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Supervisor */}
        <div>
          <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supervisor
          </label>
          <input
            type="text"
            id="supervisor"
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Preferred Shift */}
        <div>
          <label htmlFor="preferredShift" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preferred Shift Hour
          </label>
          <select
            id="preferredShift"
            value={preferredShift}
            onChange={(e) => setPreferredShift(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option>Day</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
        </div>

        {/* Team */}
        <div>
          <label htmlFor="team" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Team
          </label>
          <select
            id="team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          >
            <option>Alpha</option>
            <option>Bravo</option>
            <option>Charlie</option>
            <option>Delta</option>
          </select>
        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Comments
          </label>
          <textarea
            id="comments"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default UserProfile;