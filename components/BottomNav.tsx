
import React from 'react';
import { Home, LayoutGrid, Users, Trophy, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  activeScreen: Screen;
  activeTab?: 'Clients' | 'Orders';
  onNavigate: (screen: Screen) => void;
  unassignedCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, activeTab, onNavigate, unassignedCount }) => {
  const tabs = [
    { id: Screen.DASHBOARD, label: 'Home', icon: Home },
    { id: Screen.FEED, label: 'Feed', icon: LayoutGrid },
    { id: Screen.CLIENTS_ROOT, label: 'Clients', icon: Users },
    { id: Screen.LEADERBOARD, label: 'Leaderboard', icon: Trophy },
    { id: Screen.ME, label: 'Me', icon: User },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-gray-100 px-2 pt-2 flex justify-around items-end z-[100]"
      style={{ 
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        height: 'calc(82px + env(safe-area-inset-bottom))'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        
        let isActive = false;
        if (tab.id === Screen.DASHBOARD) {
          isActive = activeScreen === Screen.DASHBOARD;
        } else if (tab.id === Screen.CLIENTS_ROOT) {
          isActive = (activeScreen === Screen.CLIENTS_ROOT || activeScreen === Screen.CLIENT_DETAILS);
        } else {
          isActive = activeScreen === tab.id;
        }

        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center group relative h-full justify-center px-1 focus:outline-none"
          >
            <div className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${
              isActive ? 'text-[#0047FF]' : 'text-[#374151]'
            }`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold mt-0.5 whitespace-nowrap ${isActive ? 'text-[#0047FF]' : 'text-[#374151]'}`}>
                {tab.label}
              </span>
            </div>
            
            {isActive && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-7 bg-[#0047FF] rounded-full" />
            )}
            
            {/* Show red dot for unassigned items on Clients tab if necessary */}
            {tab.id === Screen.CLIENTS_ROOT && unassignedCount > 0 && !isActive && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
