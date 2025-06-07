import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, Shift } from './Calendar/types';

interface ShiftsManagementProps {
  users: User[];
  shifts: Shift[];
  onCreateShift: (shift: Omit<Shift, 'id'>) => Promise<void>;
  onUpdateShift: (id: number, shift: Partial<Shift>) => Promise<void>;
  onDeleteShift: (id: number) => Promise<void>;
  onAssignUser: (shiftId: number, userId: number) => Promise<void>;
}

export const ShiftsManagement: React.FC<ShiftsManagementProps> = ({
  users,
  shifts,
  onCreateShift,
  onUpdateShift,
  onDeleteShift,
  onAssignUser,
}) => {
  const [currentShift, setCurrentShift] = useState<Partial<Shift> | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-6 py-4 whitespace-nowrap">{shift.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shift.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(shift.start_time), 'PPp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(shift.end_time), 'PPp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={shift.user?.id || ''}
                    onChange={(e) => onAssignUser(shift.id, Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                    onClick={() => setCurrentShift(shift)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this shift?')) {
                        onDeleteShift(shift.id);
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
        onClick={() =>
          setCurrentShift({
            role: '',
            location: '',
            start_time: new Date().toISOString(),
            end_time: new Date().toISOString(),
          })
        }
      >
        Add New Shift
      </button>

      {/* Shift Edit Modal */}
      {currentShift && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {currentShift.id ? 'Edit Shift' : 'Add New Shift'}
              </h3>
              <form
                className="mt-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (!currentShift.id) {
                      await onCreateShift(currentShift as Omit<Shift, 'id'>);
                    } else {
                      await onUpdateShift(currentShift.id, currentShift);
                    }
                    setCurrentShift(null);
                  } catch (err) {
                    setError('Failed to save shift');
                  }
                }}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={currentShift.role || ''}
                    onChange={(e) =>
                      setCurrentShift({ ...currentShift, role: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={currentShift.location || ''}
                    onChange={(e) =>
                      setCurrentShift({ ...currentShift, location: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={format(
                      new Date(currentShift.start_time || new Date()),
                      "yyyy-MM-dd'T'HH:mm"
                    )}
                    onChange={(e) =>
                      setCurrentShift({
                        ...currentShift,
                        start_time: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={format(
                      new Date(currentShift.end_time || new Date()),
                      "yyyy-MM-dd'T'HH:mm"
                    )}
                    onChange={(e) =>
                      setCurrentShift({
                        ...currentShift,
                        end_time: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentShift(null)}
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
