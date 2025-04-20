import { BarChart, Card } from '@tremor/react';

const data = [
  {
    name: 'Monday',
    'Completed Tasks': 12,
    'Pending Tasks': 4,
  },
  {
    name: 'Tuesday',
    'Completed Tasks': 18,
    'Pending Tasks': 5,
  },
  {
    name: 'Wednesday',
    'Completed Tasks': 15,
    'Pending Tasks': 3,
  },
  {
    name: 'Thursday',
    'Completed Tasks': 20,
    'Pending Tasks': 8,
  },
  {
    name: 'Friday',
    'Completed Tasks': 16,
    'Pending Tasks': 6,
  },
];

export default function TasksChart() {
  return (
    <Card className="mt-4 dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Weekly Task Distribution</h3>
      <BarChart
        data={data}
        index="name"
        categories={['Completed Tasks', 'Pending Tasks']}
        colors={['emerald', 'red']}
        yAxisWidth={48}
        className="dark:text-gray-200"
      />
    </Card>
  );
}