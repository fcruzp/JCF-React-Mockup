import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Button, Card, Select, SelectItem } from '@tremor/react';
import { Plus, X } from 'lucide-react';
import './ShiftManagement.css';

interface Shift {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'morning' | 'afternoon' | 'night';
}

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const officers = [
  'Robert Brown',
  'Sarah Williams',
  'James Davis',
  'Lisa Anderson',
];

const shiftTypes = [
  { value: 'morning', label: 'Morning (6:00 AM - 2:00 PM)', start: '06:00', end: '14:00' },
  { value: 'afternoon', label: 'Afternoon (2:00 PM - 10:00 PM)', start: '14:00', end: '22:00' },
  { value: 'night', label: 'Night (10:00 PM - 6:00 AM)', start: '22:00', end: '06:00' },
];

const sampleShifts: Shift[] = [
  {
    id: '1',
    title: 'Morning Shift - Robert Brown',
    start: new Date(2025, 3, 1, 6, 0), // April 1, 2025, 6:00 AM
    end: new Date(2025, 3, 1, 14, 0), // April 1, 2025, 2:00 PM
    type: 'morning',
  },
  {
    id: '2',
    title: 'Afternoon Shift - Sarah Williams',
    start: new Date(2025, 3, 1, 14, 0), // April 1, 2025, 2:00 PM
    end: new Date(2025, 3, 1, 22, 0), // April 1, 2025, 10:00 PM
    type: 'afternoon',
  },
  {
    id: '3',
    title: 'Night Shift - James Davis',
    start: new Date(2025, 3, 1, 22, 0), // April 1, 2025, 10:00 PM
    end: new Date(2025, 3, 2, 6, 0), // April 2, 2025, 6:00 AM
    type: 'night',
  },
  {
    id: '4',
    title: 'Morning Shift - Lisa Anderson',
    start: new Date(2025, 3, 2, 6, 0), // April 2, 2025, 6:00 AM
    end: new Date(2025, 3, 2, 14, 0), // April 2, 2025, 2:00 PM
    type: 'morning',
  },
  {
    id: '5',
    title: 'Afternoon Shift - Robert Brown',
    start: new Date(2025, 3, 2, 14, 0), // April 2, 2025, 2:00 PM
    end: new Date(2025, 3, 2, 22, 0), // April 2, 2025, 10:00 PM
    type: 'afternoon',
  },
  {
    id: '6',
    title: 'Night Shift - Sarah Williams',
    start: new Date(2025, 3, 2, 22, 0), // April 2, 2025, 10:00 PM
    end: new Date(2025, 3, 3, 6, 0), // April 3, 2025, 6:00 AM
    type: 'night',
  },
  {
    id: '7',
    title: 'Morning Shift - James Davis',
    start: new Date(2025, 3, 3, 6, 0), // April 3, 2025, 6:00 AM
    end: new Date(2025, 3, 3, 14, 0), // April 3, 2025, 2:00 PM
    type: 'morning',
  },
  {
    id: '8',
    title: 'Afternoon Shift - Lisa Anderson',
    start: new Date(2025, 3, 3, 14, 0), // April 3, 2025, 2:00 PM
    end: new Date(2025, 3, 3, 22, 0), // April 3, 2025, 10:00 PM
    type: 'afternoon',
  },
  {
    id: '9',
    title: 'Night Shift - Robert Brown',
    start: new Date(2025, 3, 3, 22, 0), // April 3, 2025, 10:00 PM
    end: new Date(2025, 3, 4, 6, 0), // April 4, 2025, 6:00 AM
    type: 'night',
  },
];

export default function ShiftManagement() {
  const [shifts, setShifts] = useState<Shift[]>(sampleShifts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    type: 'morning',
  });

  const handleCreateShift = () => {
    if (!newShift.title || !newShift.start || !newShift.end || !newShift.type) return;

    const shift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      title: newShift.title!,
      start: newShift.start!,
      end: newShift.end!,
      type: newShift.type as 'morning' | 'afternoon' | 'night',
    };

    setShifts([...shifts, shift]);
    setIsModalOpen(false);
    setNewShift({ type: 'morning' });
  };

  const handleShiftTypeChange = (type: string) => {
    const selectedType = shiftTypes.find((shiftType) => shiftType.value === type);
    if (!selectedType) return;

    const date = newShift.start || new Date();
    const start = new Date(date);
    const [startHour, startMinute] = selectedType.start.split(':').map(Number);
    start.setHours(startHour, startMinute);

    const end = new Date(date);
    const [endHour, endMinute] = selectedType.end.split(':').map(Number);
    end.setHours(endHour, endMinute);

    setNewShift({
      ...newShift,
      type: type as 'morning' | 'afternoon' | 'night',
      start,
      end,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Create Shift
        </Button>
      </div>

      <Card className="p-4 bg-yellow dark:bg-gray-800">
        <Calendar
          localizer={localizer}
          events={shifts}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          className="bg-white dark:bg-gray-800 dark:text-white"
        />
      </Card>

      {/* Create Shift Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-md dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Create New Shift</h2>
              <Button
                icon={X}
                variant="light"
                onClick={() => setIsModalOpen(false)}
                className="dark:text-white"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Officer
                </label>
                <Select
                  value={newShift.title}
                  onChange={(e) =>
                    setNewShift({ ...newShift, title: (e.target as HTMLSelectElement).value })
                  }
                >
                  {officers.map((officer) => (
                    <SelectItem key={officer} value={`Shift - ${officer}`}>
                      {officer}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  value={newShift.start ? format(newShift.start, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setNewShift({ ...newShift, start: date, end: date });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Shift Type
                </label>
                <Select
                  value={newShift.type}
                  onChange={(e) => handleShiftTypeChange((e.target as HTMLSelectElement).value)}
                >
                  {shiftTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="light"
                  onClick={() => setIsModalOpen(false)}
                  className="dark:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateShift}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create Shift
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}