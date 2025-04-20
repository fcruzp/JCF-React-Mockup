import { useState } from 'react';
import { Button, Card, TextInput, Select, SelectItem } from '@tremor/react';
import { format, startOfWeek, addDays} from 'date-fns';
import { Plus, X } from 'lucide-react';

interface Shift {
  id: string;
  officer: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'night';
}

const officers = [
  'Robert Brown',
  'Sarah Williams',
  'James Davis',
  'Lisa Anderson',
];

const shiftTypes = [
  { value: 'morning', label: 'Morning (6:00 AM - 2:00 PM)' },
  { value: 'afternoon', label: 'Afternoon (2:00 PM - 10:00 PM)' },
  { value: 'night', label: 'Night (10:00 PM - 6:00 AM)' },
];

const initialShifts: Shift[] = [
  {
    id: '1',
    officer: 'Robert Brown',
    date: '2024-03-18',
    startTime: '06:00',
    endTime: '14:00',
    type: 'morning',
  },
  {
    id: '2',
    officer: 'Sarah Williams',
    date: '2024-03-18',
    startTime: '14:00',
    endTime: '22:00',
    type: 'afternoon',
  },
];

export default function ShiftManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'morning',
  });

  const startDate = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleCreateShift = () => {
    if (!newShift.officer || !newShift.date || !newShift.type) return;

    const shiftTimes = {
      morning: { start: '06:00', end: '14:00' },
      afternoon: { start: '14:00', end: '22:00' },
      night: { start: '22:00', end: '06:00' },
    };

    const times = shiftTimes[newShift.type as keyof typeof shiftTimes];

    const shift: Shift = {
      id: Math.random().toString(36).substr(2, 9),
      officer: newShift.officer,
      date: newShift.date,
      startTime: times.start,
      endTime: times.end,
      type: newShift.type as 'morning' | 'afternoon' | 'night',
    };

    setShifts([...shifts, shift]);
    setIsModalOpen(false);
    setNewShift({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'morning',
    });
  };

  const getShiftsByDate = (date: Date) => {
    return shifts.filter(
      (shift) => shift.date === format(date, 'yyyy-MM-dd')
    );
  };

  const getShiftColor = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'afternoon':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'night':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-semibold dark:text-white">Shift Management</h1> */}
        <Button
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Create Shift
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day.toString()} className="min-h-[200px]">
            <Card className="h-full dark:bg-gray-800">
              <div className="font-semibold mb-3 dark:text-white">
                {format(day, 'EEE, MMM d')}
              </div>
              <div className="space-y-2">
                {getShiftsByDate(day).map((shift) => (
                  <div
                    key={shift.id}
                    className={`p-2 rounded-md ${getShiftColor(shift.type)}`}
                  >
                    <div className="font-medium">{shift.officer}</div>
                    <div className="text-sm">
                      {shift.startTime} - {shift.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>

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
                  value={newShift.officer}
                  onValueChange={(value) =>
                    setNewShift({ ...newShift, officer: value })
                  }
                >
                  {officers.map((officer) => (
                    <SelectItem key={officer} value={officer}>
                      {officer}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Date
                </label>
                <TextInput
                  type="date"
                  value={newShift.date}
                  onChange={(e) =>
                    setNewShift({ ...newShift, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  Shift Type
                </label>
                <Select
                  value={newShift.type}
                  onValueChange={(value) =>
                    setNewShift({ ...newShift, type: value as 'morning' | 'afternoon' | 'night' })
                  }
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