import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Monday', completed: 12, pending: 4 },
  { name: 'Tuesday', completed: 18, pending: 5 },
  { name: 'Wednesday', completed: 15, pending: 3 },
  { name: 'Thursday', completed: 20, pending: 8 },
  { name: 'Friday', completed: 16, pending: 6 },
  { name: 'Saturday', completed: 8, pending: 2 },
  { name: 'Sunday', completed: 5, pending: 1 },
];

export default function TasksChart() {
  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
        Weekly Task Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" />
          <Bar dataKey="pending" fill="#F43F5E" name="Pending Tasks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}