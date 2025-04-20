import { Home, Users, CheckSquare, MapPin } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  onViewChange: (view: string) => void;
}

export default function Sidebar({ onViewChange }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('Dashboard');
  
  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Shift Management', icon: Users },
    { name: 'Task Management', icon: CheckSquare },
    { name: 'Officer Tracking', icon: MapPin },
  ];

  const handleItemClick = (name: string) => {
    setActiveItem(name);
    onViewChange(name);
  };

  return (
    <div className="w-64 bg-indigo-900 dark:bg-indigo-950 min-h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-indigo-900 font-bold">J</span>
        </div>
        <div className="text-white text-2xl font-bold">JCF WFM</div>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg mb-2 ${
                activeItem === item.name
                  ? 'bg-indigo-800 dark:bg-indigo-900 text-white'
                  : 'text-gray-300 hover:bg-indigo-800 dark:hover:bg-indigo-900 hover:text-white'
              }`}
              onClick={() => handleItemClick(item.name)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}