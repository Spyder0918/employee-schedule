import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shift } from '../components/Calendar/types';
import { ShiftsManagement } from '../components/ShiftsManagement';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getShifts,
  createShift,
  updateShift,
  deleteShift,
  assignUserToShift,
} from '../services/api';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [fetchedUsers, fetchedShifts] = await Promise.all([
        getUsers(),
        getShifts(),
      ]);
      setUsers(fetchedUsers);
      setShifts(fetchedShifts);
    } catch (err) {
      setError('Failed to fetch data');
      if (err instanceof Error && err.message === 'Unauthorized') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleCreateShift = async (shift: Omit<Shift, 'id'>) => {
    await createShift(shift);
    await fetchData();
  };

  const handleUpdateShift = async (id: number, shift: Partial<Shift>) => {
    await updateShift(id, shift);
    await fetchData();
  };

  const handleDeleteShift = async (id: number) => {
    await deleteShift(id);
    await fetchData();
  };

  const handleAssignUser = async (shiftId: number, userId: number) => {
    await assignUserToShift(shiftId, userId);
    await fetchData();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Users Management Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Users Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => setCurrentUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            deleteUser(user.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => setCurrentUser({ id: 0, username: '', email: '', role: 'employee' })}
          >
            Add New User
          </button>
        </div>

        {/* Shifts Management Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Shifts Management</h2>
          <ShiftsManagement
            users={users}
            shifts={shifts}
            onCreateShift={handleCreateShift}
            onUpdateShift={handleUpdateShift}
            onDeleteShift={handleDeleteShift}
            onAssignUser={handleAssignUser}
          />
        </div>
      </div>

      {/* User Edit Modal */}
      {currentUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {currentUser.id === 0 ? 'Add New User' : 'Edit User'}
              </h3>
              <form className="mt-2" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (currentUser.id === 0) {
                    await createUser(currentUser);
                  } else {
                    await updateUser(currentUser.id, currentUser);
                  }
                  setCurrentUser(null);
                  // Refresh users list
                  const updatedUsers = await getUsers();
                  setUsers(updatedUsers);
                } catch (err) {
                  setError('Failed to save user');
                }
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={currentUser.username}
                    onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={currentUser.role}
                    onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentUser(null)}
                    className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
