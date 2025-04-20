import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from "react";

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

export function TaskManagement() {
  
    const tasks = [
    {
      id: 1,
      title: "Patrol North Kingston Area",
      priority: "Medium",
      assignedTo: "Robert Brown",
      dueDate: "Today",
      status: "In Progress",
      location: [18.0179, -76.8099], // Kingston coordinates
      description: "Regular patrol in commercial district"
    },
    {
      id: 2,
      title: "Investigate Reported Theft",
      priority: "High",
      assignedTo: "Sarah Williams",
      dueDate: "Today",
      status: "In Progress",
      location: [18.0161, -76.8013],
      description: "Investigate theft at local store"
    },
    {
      id: 3,
      title: "Traffic Control",
      priority: "Low",
      assignedTo: "James Davis",
      dueDate: "Today",
      status: "Pending",
      location: [18.0232, -76.8172],
      description: "Manage traffic at main intersection"
    }
  ];

  return (
    <div className="p-6">
      
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold dark:text-white"></h1>
            <button className="bg-indigo-900 text-white px-4 py-2 rounded-lg">
            Create New Task
            </button>
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
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Assigned To</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b dark:border-gray-700">
                    <td className="py-3 dark:text-gray-200">{task.title}</td>
                    <td>
                      <span className={`text-sm ${
                        task.priority === "High" 
                          ? "px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded" 
                          : task.priority === "Medium"
                          ? "px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded"
                          : "px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded"
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="dark:text-gray-200">{task.assignedTo}</td>
                    <td>
                      <span className={`text-sm ${
                        task.status === "In Progress" 
                          ? "px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded"
                          : "px-2 py-1 bg-gray-100 text-gray-800 dark:bg-grey-900 dark:text-grey-200 rounded "
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
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
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TaskManagement />
    </ErrorBoundary>
  );
}