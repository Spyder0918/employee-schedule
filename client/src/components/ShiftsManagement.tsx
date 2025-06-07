import React, { useState, useEffect } from 'react';
import { format, isToday, isFuture, startOfDay } from 'date-fns';
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
  const [filterRole, setFilterRole] = useState<'generic_day' | 'generic_night' | ''>('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(true);

  // Filter shifts based on criteria
  const filteredShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.start_time);
    const matchesRole = !filterRole || shift.role === filterRole;
    const matchesAssignment = !showUnassignedOnly || !shift.user;
    // Include shifts from today onwards
    const isCurrentOrFuture = shiftDate >= startOfDay(new Date());
    return matchesRole && matchesAssignment && isCurrentOrFuture;
  });

  useEffect(() => {
    console.log('All shifts:', shifts);
    console.log('Filtered shifts:', filteredShifts);
    console.log('Filter criteria:', { filterRole, showUnassignedOnly });
  }, [shifts, filteredShifts, filterRole, showUnassignedOnly]);

  const handleAssignUser = async (shiftId: number, userId: string) => {
    try {
      if (userId) {
        await onAssignUser(shiftId, parseInt(userId, 10));
      }
    } catch (err) {
      setError('Failed to assign user to shift');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
        >
          <option value="">All Shifts</option>
          <option value="generic_day">Day Shifts (09:30-21:30)</option>
          <option value="generic_night">Night Shifts (21:30-09:30)</option>
        </select>
        
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            checked={showUnassignedOnly}
            onChange={(e) => setShowUnassignedOnly(e.target.checked)}
          />
          <span className="ml-2">Show unassigned shifts only</span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shift Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredShifts.map((shift) => (
              <tr key={shift.id} className={!shift.user ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shift.role === 'generic_day' ? 'Day Shift' : 'Night Shift'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(shift.start_time), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(shift.start_time), 'HH:mm')} - {format(new Date(shift.end_time), 'HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shift.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={shift.user?.id || ''}
                    onChange={(e) => handleAssignUser(shift.id, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
