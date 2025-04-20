import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Eye, Edit2, Trash2, Plus, X } from 'lucide-react'; // Import Plus and X
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useState } from "react"; // Import useState
import { Button, Card, TextInput, Select, SelectItem, Textarea } from '@tremor/react'; // Import Tremor components

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<unknown>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<unknown>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    console.error("Error caught in getDerivedStateFromError:", error);
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Define Task interface ---
interface Task {
  id: number | string; // Allow string for temporary ID before saving
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  dueDate: string; // Use string for date input compatibility
  status: 'Pending' | 'In Progress' | 'Completed';
  location: [number, number];
  description: string;
}

// --- Sample officers list (replace with actual data source) ---
const officers = [
  'Robert Brown',
  'Sarah Williams',
  'James Davis',
  'Lisa Anderson',
  'Michael Chen',
];

export function TaskManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([ // Manage tasks with useState
    {
      id: 1,
      title: "Patrol North Kingston Area",
      priority: "Medium",
      assignedTo: "Robert Brown",
      dueDate: "2025-04-21", // Use YYYY-MM-DD format
      status: "In Progress",
      location: [18.0179, -76.8099],
      description: "Regular patrol in commercial district"
    },
    {
      id: 2,
      title: "Investigate Reported Theft",
      priority: "High",
      assignedTo: "Sarah Williams",
      dueDate: "2025-04-21",
      status: "In Progress",
      location: [18.0161, -76.8013],
      description: "Investigate theft at local store"
    },
    {
      id: 3,
      title: "Traffic Control",
      priority: "Low",
      assignedTo: "James Davis",
      dueDate: "2025-04-22",
      status: "Pending",
      location: [18.0232, -76.8172],
      description: "Manage traffic at main intersection"
    }
  ]);

  // --- State for the new task form ---
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    priority: 'Medium', // Default priority
    assignedTo: '',
    dueDate: '',
    description: '',
    location: [18.0179, -76.8099], // Default location, consider making this user-settable or map-clickable
    status: 'Pending', // Default status for new tasks
  });

  // --- Input Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Task, value: string) => {
    // Type assertion needed for priority and status if using string literals
    if (name === 'priority') {
        setNewTask(prev => ({ ...prev, [name]: value as 'Low' | 'Medium' | 'High'}));
    } else if (name === 'status') {
        setNewTask(prev => ({ ...prev, [name]: value as 'Pending' | 'In Progress' | 'Completed'}));
    } else {
        setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (coord: 'lat' | 'lon', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setNewTask(prev => {
        const currentLocation = prev.location || [0, 0]; // Fallback if location is somehow undefined
        const newLocation: [number, number] = coord === 'lat'
          ? [numValue, currentLocation[1]]
          : [currentLocation[0], numValue];
        return { ...prev, location: newLocation };
      });
    } else {
       // Handle invalid input - maybe clear the specific coordinate or show an error
       // For now, update state allowing potential NaN for validation later
       setNewTask(prev => {
         const currentLocation = prev.location || [0, 0];
         const newLocation: [number, number] = coord === 'lat'
           ? [NaN, currentLocation[1]]
           : [currentLocation[0], NaN];
         return { ...prev, location: newLocation };
       });
    }
  };

  // --- Form Submission ---
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate || !newTask.location || isNaN(newTask.location[0]) || isNaN(newTask.location[1])) {
      alert('Please fill in all required fields (Title, Assigned To, Due Date, valid Location).');
      return;
    }

    const taskToAdd: Task = {
      id: Date.now().toString(), // Simple unique ID generation for demo
      status: 'Pending', // Ensure status is set
      // Type assertions are necessary because newTask is Partial<Task>
      title: newTask.title!,
      priority: newTask.priority!,
      assignedTo: newTask.assignedTo!,
      dueDate: newTask.dueDate!,
      description: newTask.description || '', // Ensure description is at least an empty string
      location: newTask.location!,
    };

    setTasks(prevTasks => [...prevTasks, taskToAdd]);
    setIsModalOpen(false); // Close modal
    // Reset form fields
    setNewTask({
      title: '',
      priority: 'Medium',
      assignedTo: '',
      dueDate: '',
      description: '',
      location: [18.0179, -76.8099], // Reset to default location
      status: 'Pending',
    });
  };

  return (
    <div className="p-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
            {/* <h1 className="text-2xl font-semibold dark:text-white">Task Management</h1> */}
            {/* Use Tremor Button to open modal */}
            <Button
              icon={Plus}
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-none"
              // "
            >
              Create New Task
            </Button>
        </div>

      {/* Map Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Task Locations</h2>
        <MapContainer
          center={[18.0179, -76.8099]} // Default center coordinates
          zoom={13} // Default zoom level
          style={{ height: "400px", width: "100%" }} // Map dimensions
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {tasks.map((task) => (
            <Marker key={task.id} position={task.location as [number, number]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Assigned to:</span> {task.assignedTo}
                      </p>
                    </div>
                  </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* End of Map Section */}

        {/* Task List */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Active Tasks</h2>
            <div className="overflow-x-auto"> {/* Added for smaller screens */}
              <table className="w-full min-w-[650px]"> {/* Added min-width */}
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <th className="pb-3 px-2">Title</th>
                    <th className="pb-3 px-2">Priority</th>
                    <th className="pb-3 px-2">Assigned To</th>
                    <th className="pb-3 px-2">Due Date</th> {/* Added Due Date column */}
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"> {/* Added hover effect */}
                      <td className="py-3 px-2 dark:text-gray-200">{task.title}</td>
                      <td className="px-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ // Adjusted padding
                          task.priority === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-2 dark:text-gray-200">{task.assignedTo}</td>
                      <td className="py-3 px-2 dark:text-gray-200">{task.dueDate}</td> {/* Display Due Date */}
                      <td className="px-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ // Adjusted padding
                          task.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : task.status === "Pending"
                            ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200" // Adjusted Pending style
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" // Added Completed style
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-2">
                          {/* Add onClick handlers for actions later */}
                          <button 
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                          onClick={() => setIsModalOpen(true)}
                          > {/* Added padding */}
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                          className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1"
                           onClick={() => setIsModalOpen(true)}
                           > {/* Added padding */}
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"> {/* Added padding */}
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* --- Create Task Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"> {/* Changed z-50 to z-[1000] */}
          <Card className="w-full max-w-md dark:bg-gray-800"> {/* Added animation classes */}
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6"> {/* Added border */}
              <h2 className="text-xl font-semibold dark:text-white">Create New Task</h2>
              <Button
                icon={X}
                variant="light" // Light variant for less emphasis
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 -mr-2" // Adjusted styling
              />
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <TextInput
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Respond to incident at Main St"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400" // Added focus ring
                />
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Priority <span className="text-red-500">*</span>
                </label>
                <Select
                  id="priority"
                  name="priority"
                  value={newTask.priority ?? 'Medium'} // Add fallback just in case
                  onValueChange={(value) => handleSelectChange('priority', value)}
                  required
                  className="dark:[&>button]:bg-gray-700 dark:[&>button]:border-gray-600 dark:[&>button]:text-white" // Dark mode styles for Select button
                  // Add dark mode styles for dropdown list if needed via global CSS or Tailwind plugin
                >
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </Select>
              </div>

              {/* Assigned To */}
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Assigned To <span className="text-red-500">*</span>
                </label>
                <Select
                  id="assignedTo"
                  name="assignedTo"
                  value={newTask.assignedTo ?? ''} // Add fallback just in case
                  onValueChange={(value) => handleSelectChange('assignedTo', value)}
                  required
                  className="dark:[&>button]:bg-gray-700 dark:[&>button]:border-gray-600 dark:[&>button]:text-white"
                >
                  {newTask.assignedTo === '' && (
                    <div className="text-gray-500">Select Officer</div>
                  )}
                  {officers.map((officer) => (
                    <SelectItem key={officer} value={officer}>
                      {officer}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>

              {/* Location */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid */}
                 <div>
                   <label htmlFor="latitude" className="block text-sm font-medium mb-1 dark:text-gray-300">
                     Latitude <span className="text-red-500">*</span>
                   </label>
                   <TextInput
                     id="latitude"
                     name="latitude"
                     type="number" // Use number input type
                     step="any" // Allow decimals
                     value={newTask.location?.[0] !== undefined ? String(newTask.location[0]) : ''} // Convert number to string
                     onChange={(e) => handleLocationChange('lat', e.target.value)}
                     placeholder="e.g., 18.0179"
                     required
                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                   />
                 </div>
                 <div>
                   <label htmlFor="longitude" className="block text-sm font-medium mb-1 dark:text-gray-300">
                     Longitude <span className="text-red-500">*</span>
                   </label>
                   <TextInput
                     id="longitude"
                     name="longitude"
                     type="number"
                     step="any"
                     value={newTask.location?.[1] !== undefined ? String(newTask.location[1]) : ''}
                     onChange={(e) => handleLocationChange('lon', e.target.value)}
                     placeholder="e.g., -76.8099"
                     required
                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                   />
                 </div>
               </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Add any relevant details..."
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 mt-4 border-t dark:border-gray-700"> {/* Added border */}
                <Button
                  type="button" // Important: type="button" to prevent form submission
                  variant="secondary" // Use secondary style for cancel
                  onClick={() => setIsModalOpen(false)}
                  className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg">
                  Cancel
                </Button>
                <Button
                  type="submit" // This button submits the form
                  className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg"
                >
                  Create Task
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* --- End of Modal --- */}

    </div>
  );
}

// --- Main Export with Error Boundary ---
export default function TaskManagementWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <TaskManagement />
    </ErrorBoundary>
  );
}

// --- CSS animation example removed or re-typed ---
// You can either delete the comment block below entirely
// or re-type it carefully if you need to keep it.

/*
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-scale {
  animation: fadeInScale 0.2s ease-out forwards;
}
*/

// Ensure there are no characters after the final closing */ if you keep the comment.