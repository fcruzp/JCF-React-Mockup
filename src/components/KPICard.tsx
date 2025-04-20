import { Card, Text } from '@tremor/react';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

export default function KPICard({ title, value, description, className = '' }: KPICardProps) {
  return (
    <Card className={`${className} p-4`}>
      <Text className="text-sm text-gray-500 dark:text-gray-400">{title}</Text>
      <div className="mt-2">
        <Text className="text-2xl font-bold dark:text-white">{value}</Text>
      </div>
      {description && (
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</Text>
      )}
    </Card>
  );
}