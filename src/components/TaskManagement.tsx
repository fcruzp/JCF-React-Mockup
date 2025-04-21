import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Eye, Edit2, Trash2, Plus, X, AlertTriangle } from 'lucide-react'; // Import AlertTriangle
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useState, useMemo, useEffect } from "react";
import { Button, Card, TextInput, Select, SelectItem, Textarea } from '@tremor/react';

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

// Define filter type
type TaskFilter = 'All' | 'Pending' | 'In Progress' | 'Completed';

export function TaskManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Renamed for clarity
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirmation modal
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | string | null>(null); // State for ID of task to delete
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State for the task being viewed/edited
  const [tasks, setTasks] = useState<Task[]>([
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
    },
    { // Add a completed task for testing filter
      id: 4,
      title: "File Incident Report",
      priority: "Medium",
      assignedTo: "Robert Brown",
      dueDate: "2025-04-20",
      status: "Completed",
      location: [18.0190, -76.8050],
      description: "Complete report for yesterday's incident"
    },
    // Add the new task record here
    {
      id: 5, // New unique ID
      title: "Respond to Noise Complaint", // Example title
      priority: "Low", // Example priority
      assignedTo: "Unassigned", // Set assignedTo as requested
      dueDate: "2025-04-23", // Example due date
      status: "Pending", // Example status
      location: [18.0205, -76.8150], // Example location near Kingston
      description: "Check noise levels at residential address" // Example description
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

  const [editingTaskData, setEditingTaskData] = useState<Partial<Task>>({}); // State for data in edit form
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>('All'); // State for the active filter

  // Effect to update editingTaskData when selectedTask changes for the edit modal
  useEffect(() => {
    if (selectedTask && isEditModalOpen) {
      // Pre-fill editingTaskData with the selected task's details
      setEditingTaskData({ ...selectedTask });
    } else {
      // Clear editingTaskData if no task is selected or the edit modal is closed
      setEditingTaskData({});
    }
  }, [selectedTask, isEditModalOpen]);

  // --- Input Handlers for Create Form ---
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

  // --- Input Handlers for Edit Form ---
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (name: keyof Task, value: string) => {
     if (name === 'priority') {
        setEditingTaskData(prev => ({ ...prev, [name]: value as 'Low' | 'Medium' | 'High'}));
    } else if (name === 'status') {
        setEditingTaskData(prev => ({ ...prev, [name]: value as 'Pending' | 'In Progress' | 'Completed'}));
    } else {
        setEditingTaskData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditLocationChange = (coord: 'lat' | 'lon', value: string) => {
    const numValue = parseFloat(value);
    const currentLoc = editingTaskData.location || [0, 0];
    const newLocation: [number, number] = coord === 'lat'
      ? [isNaN(numValue) ? NaN : numValue, currentLoc[1]]
      : [currentLoc[0], isNaN(numValue) ? NaN : numValue];
    setEditingTaskData(prev => ({ ...prev, location: newLocation }));
  };

  // --- Form Submission (Create Task) ---
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
    closeModal(); // Use closeModal to reset states
  };

  // --- Form Submission (Update Task) ---
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return; // Should not happen if modal is open, but good practice

    // Basic validation for edit form
    if (!editingTaskData.title || !editingTaskData.assignedTo || !editingTaskData.dueDate || !editingTaskData.location || isNaN(editingTaskData.location[0]) || isNaN(editingTaskData.location[1])) {
      alert('Please fill in all required fields (Title, Assigned To, Due Date, valid Location).');
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, ...editingTaskData } // Merge updated data, keeping original ID
          : task
      )
    );
    closeModal(); // Use closeModal to reset states
  };

  // --- Filtered Tasks ---
  const filteredTasks = useMemo(() => {
    if (currentFilter === 'All') {
      return tasks;
    }
    return tasks.filter(task => task.status === currentFilter);
  }, [tasks, currentFilter]); // Recalculate only when tasks or filter changes

  // --- Action Handlers ---
  const handleViewClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(false); // Ensure edit modal is closed
    setIsConfirmModalOpen(false); // Ensure confirm modal is closed
    setIsViewModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task); // Set the task to be edited
    setIsViewModalOpen(false); // Ensure view modal is closed
    setIsConfirmModalOpen(false); // Ensure confirm modal is closed
    setIsEditModalOpen(true); // Open the edit modal
    // The useEffect hook will handle populating editingTaskData
  };

  // Opens the confirmation modal
  const handleDeleteClick = (taskId: number | string) => {
    setTaskToDeleteId(taskId); // Store the ID of the task to potentially delete
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  // Performs the actual deletion
  const handleConfirmDelete = () => {
    if (taskToDeleteId !== null) {
      console.log('Deleting task:', taskToDeleteId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDeleteId));
      // Close other modals if the deleted task was the selected one
      if (selectedTask && selectedTask.id === taskToDeleteId) {
          setSelectedTask(null);
          setIsViewModalOpen(false);
          setIsEditModalOpen(false);
      }
    }
    closeConfirmModal(); // Close the confirmation modal
  };

  // Closes the confirmation modal without deleting
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTaskToDeleteId(null);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false); // Close edit modal as well
    setIsConfirmModalOpen(false); // Also close confirm modal if open
    setSelectedTask(null);
    setNewTask({ // Reset create form state
      title: '', priority: 'Medium', assignedTo: '', dueDate: '',
      description: '', location: [18.0179, -76.8099], status: 'Pending',
    });
    setEditingTaskData({}); // Reset edit form state
    setTaskToDeleteId(null); // Reset task to delete ID
  };

  return (
    <div className="p-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
            <Button
              icon={Plus}
              onClick={() => setIsCreateModalOpen(true)} // Open create modal
              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-none"
            >
              Create New Task
            </Button>
        </div>

      {/* Map Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Task Locations</h2>
        <MapContainer
          center={[18.0179, -76.8099]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Map markers should probably show ALL tasks regardless of filter, or adjust based on requirements */}
          {tasks.map((task) => (
            <Marker key={task.id} position={task.location as [number, number]}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <p className="text-sm mt-1">
                        <span className="font-semibold">Assigned to:</span> {task.assignedTo}
                      </p>
                       <p className="text-sm">
                        <span className="font-semibold">Due:</span> {task.dueDate}
                      </p>
                       <p className="text-sm">
                        <span className="font-semibold">Status:</span> {task.status}
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
                <div className="flex justify-between items-center mb-4"> {/* Container for title and filters */}
                  <h2 className="text-lg font-semibold dark:text-white">Active Tasks</h2>
                  {/* Filter Buttons */}
                  <div className="flex space-x-2">
                    {(['All', 'Pending', 'In Progress', 'Completed'] as TaskFilter[]).map((filter) => (
                      <Button
                        key={filter}
                        variant={currentFilter === filter ? 'primary' : 'secondary'} // Highlight active filter
                        onClick={() => setCurrentFilter(filter)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          currentFilter === filter
                            ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {filter === 'All' ? 'All Tasks' : filter}
                      </Button>
                    ))}
                  </div>
                </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <th className="pb-3 px-2">Title</th>
                    <th className="pb-3 px-2">Priority</th>
                    <th className="pb-3 px-2">Assigned To</th>
                    <th className="pb-3 px-2">Due Date</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Use filteredTasks here */}
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr key={task.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-2 dark:text-gray-200">{task.title}</td>
                        <td className="px-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            task.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : task.priority === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-2 dark:text-gray-200">{task.assignedTo}</td>
                        <td className="py-3 px-2 dark:text-gray-200">{task.dueDate}</td>
                        <td className="px-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            task.status === "In Progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : task.status === "Pending" ? "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <button
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
                            onClick={() => handleViewClick(task)} // Call handleViewClick
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                            className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1"
                            onClick={() => handleEditClick(task)} // Call handleEditClick
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {/* Delete Button now calls the updated handleDeleteClick */}
                            <button
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                            onClick={() => handleDeleteClick(task.id)} // Call handleDeleteClick
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Display a message when no tasks match the filter
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No tasks found for the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* --- Create Task Modal --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"> {/* Changed z-50 to z-[1000] */}
          <Card className="w-full max-w-md bg-gray-500 dark:bg-gray-800"> {/* Added animation classes */}
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6"> {/* Added border */}
              <h2 className="text-xl font-semibold text-white">Create New Task</h2>
              <Button
                icon={X}
                variant="light" // Light variant for less emphasis
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 -mr-2" // Adjusted styling
              />
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
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
                <label htmlFor="priority" className="block text-sm font-medium mb-1 text-gray-300">
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
                <label htmlFor="assignedTo" className="block text-sm font-medium mb-1 text-gray-300">
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
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-gray-300">
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
                   <label htmlFor="latitude" className="block text-sm font-medium mb-1 text-gray-300">
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
                   <label htmlFor="longitude" className="block text-sm font-medium mb-1 text-gray-300">
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
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
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
                  onClick={closeModal}
                  className="dark:text-white dark:border-gray-600 hover:bg-gray-700 rounded-lg">
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

      {/* --- View Task Modal --- */}
      {isViewModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg  bg-gray-500 dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-white">Task Details</h2>
              <Button icon={X} variant="light" onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 -mr-2" />
            </div>
            {/* Modal Content - Display Only */}
            <div className="space-y-4">
              {/* Use simple divs or paragraphs to display data */}
              <div>
                <label className="block text-sm font-medium text-white dark:text-gray-400">Title</label>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.title}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white dark:text-gray-400">Priority</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.priority}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white dark:text-gray-400">Status</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-white dark:text-gray-400">Assigned To</label>
                   <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.assignedTo}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-white dark:text-gray-400">Due Date</label>
                   <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.dueDate}</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-white dark:text-gray-400">Latitude</label>
                   <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.location[0]}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-white dark:text-gray-400">Longitude</label>
                   <p className="mt-1 text-gray-900 dark:text-white">{selectedTask.location[1]}</p>
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white dark:text-gray-400">Description</label>
                <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">{selectedTask.description || 'N/A'}</p> {/* Handle empty description */}
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end pt-4 mt-4 border-t dark:border-gray-700">
                <Button variant="secondary" onClick={closeModal} className="text-white dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg">Close</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* --- End of View Task Modal --- */}

      {/* --- Edit Task Modal --- */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-gray-500 dark:bg-gray-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-white">Edit Task</h2>
              <Button icon={X} variant="light" onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 -mr-2" />
            </div>
            {/* Modal Form */}
            <form onSubmit={handleUpdateTask} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium mb-1 text-gray-300">
                  Title <span className="text-red-500">*</span>
                </label>
                <TextInput
                  id="edit-title"
                  name="title"
                  value={editingTaskData.title ?? ''}
                  onChange={handleEditInputChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-black focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
              {/* Priority */}
              <div>
                <label htmlFor="edit-priority" className="block text-sm font-medium mb-1 text-gray-300">
                  Priority <span className="text-red-500">*</span>
                </label>
                <Select
                  id="edit-priority"
                  name="priority"
                  value={editingTaskData.priority ?? 'Medium'}
                  onValueChange={(value) => handleEditSelectChange('priority', value)}
                  required
                  className="dark:[&>button]:bg-gray-700 dark:[&>button]:border-gray-600 dark:[&>button]:text-white"
                >
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </Select>
              </div>
               {/* Status */}
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium mb-1 text-gray-300">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  id="edit-status"
                  name="status"
                  value={editingTaskData.status ?? 'Pending'}
                  onValueChange={(value) => handleEditSelectChange('status', value)}
                  required
                  className="dark:[&>button]:bg-gray-700 dark:[&>button]:border-gray-600 dark:[&>button]:text-white"
                >
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </Select>
              </div>
              {/* Assigned To */}
              <div>
                <label htmlFor="edit-assignedTo" className="block text-sm font-medium mb-1 text-gray-300">
                  Assigned To <span className="text-red-500">*</span>
                </label>
                <Select
                  id="edit-assignedTo"
                  name="assignedTo"
                  value={editingTaskData.assignedTo ?? ''}
                  onValueChange={(value) => handleEditSelectChange('assignedTo', value)}
                  required
                  className="dark:[&>button]:bg-gray-700 dark:[&>button]:border-gray-600 dark:[&>button]:text-white"
                >
                  <SelectItem value="">Select Officer</SelectItem>
                  {officers.map((officer) => (
                    <SelectItem key={officer} value={officer}>
                      {officer}
                    </SelectItem>
                  ))}
                   <SelectItem key="Unassigned" value="Unassigned">Unassigned</SelectItem>
                </Select>
              </div>
              {/* Due Date */}
              <div>
                <label htmlFor="edit-dueDate" className="block text-sm font-medium mb-1 text-gray-300">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-dueDate"
                  name="dueDate"
                  type="date"
                  value={editingTaskData.dueDate ?? ''}
                  onChange={handleEditInputChange}
                  required
                  className="block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:[color-scheme:dark]"
                />
              </div>
              {/* Location */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label htmlFor="edit-latitude" className="block text-sm font-medium mb-1 text-gray-300">
                     Latitude <span className="text-red-500">*</span>
                   </label>
                   <TextInput
                     id="edit-latitude"
                     name="latitude"
                     type="number"
                     step="any"
                     value={editingTaskData.location?.[0] !== undefined ? String(editingTaskData.location[0]) : ''}
                     onChange={(e) => handleEditLocationChange('lat', e.target.value)}
                     placeholder="e.g., 18.0179"
                     required
                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                   />
                 </div>
                 <div>
                   <label htmlFor="edit-longitude" className="block text-sm font-medium mb-1 text-gray-300">
                     Longitude <span className="text-red-500">*</span>
                   </label>
                   <TextInput
                     id="edit-longitude"
                     name="longitude"
                     type="number"
                     step="any"
                     value={editingTaskData.location?.[1] !== undefined ? String(editingTaskData.location[1]) : ''}
                     onChange={(e) => handleEditLocationChange('lon', e.target.value)}
                     placeholder="e.g., -76.8099"
                     required
                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                   />
                 </div>
               </div>
              {/* Description */}
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium mb-1 text-gray-300">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editingTaskData.description ?? ''}
                  onChange={handleEditInputChange}
                  rows={3}
                  placeholder="Add any relevant details..."
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 mt-4 border-t dark:border-gray-700">
                <Button type="button" variant="secondary" onClick={closeModal} className="text-white dark:border-gray-600 hover:bg-gray-700 rounded-lg">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg">Update Task</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      {/* --- End of Edit Task Modal --- */}

      {/* --- Confirmation Modal --- */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1050] flex items-center justify-center p-4"> {/* Higher z-index */}
          <Card className="w-full max-w-sm bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mb-4" />
              <h2 className="text-lg font-semibold mb-2 dark:text-white">Confirm Deletion</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4 w-full">
                <Button
                  variant="secondary"
                  onClick={closeConfirmModal} // Use specific closer
                  className="flex-1 dark:text-white dark:border-gray-600 hover:bg-gray-500 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 rounded-lg"
                >
                  Delete Task
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* --- End of Confirmation Modal --- */}

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
