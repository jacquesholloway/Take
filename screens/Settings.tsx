
import React from 'react';
import { X, ChevronRight, Phone, LogOut } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const SettingItem = ({ title, subtitle, icon: Icon, showArrow = true, color = "text-gray-900" }: any) => (
    <button className="w-full px-6 py-5 flex items-center justify-between bg-white border-b border-gray-100 active:bg-gray-50 transition-colors text-left">
      <div className="flex flex-col items-start">
        <span className={`text-[16px] font-black ${color}`}>{title}</span>
        {subtitle && <span className="text-[13px] text-gray-500 font-medium mt-1 text-left">{subtitle}</span>}
      </div>
      <div className="flex items-center">
        {Icon && <Icon size={20} className="text-gray-900" />}
        {showArrow && <ChevronRight size={20} className="text-gray-300 ml-2" />}
      </div>
    </button>
  );

  return (
    <div className="bg-[#F9F9F9] min-h-screen flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-6 pt-[16px] pb-6 bg-white">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full active:bg-gray-200 transition-colors">
          <X size={20} />
        </button>
        <h1 className="text-[17px] font-black text-gray-900">Settings</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1">
        <div className="px-6 py-6">
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">Account: palesa@gmail.com</span>
        </div>

        <div className="bg-white">
          <SettingItem title="Personal details" subtitle="Palesa Thsabalala • +27 32 532 5432 • palesa@gmai..." />
          <SettingItem title="Reset password" />
        </div>

        <div className="px-6 py-6 mt-4">
          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-tight">Support</span>
        </div>

        <div className="bg-white">
          <SettingItem 
            title="Community manager" 
            subtitle="Prue Matsepe • +27 43 432 6542" 
            icon={Phone}
            showArrow={false}
          />
          <SettingItem title="Update my banking details" />
          <SettingItem title="Terms of service" />
          <SettingItem title="Privacy policy" />
          <SettingItem title="Help" />
        </div>

        <div className="px-6 py-12">
          <button className="w-full py-4 border-2 border-[#0047FF] text-[#0047FF] rounded-xl font-black text-[16px] active:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
