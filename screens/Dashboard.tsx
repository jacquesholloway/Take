import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, ChevronRight, Edit2, Info, Package, Users, Tag, Calendar, Trophy, Plus, X, Check, Lock, Hash } from 'lucide-react';
import { Screen } from '../types';
import ClientAvatarStar from '../components/ClientAvatarStar';

interface DashboardProps {
  onNavigateToUnassigned: () => void;
  onAddClient: () => void;
  totalClients: number;
  unassignedCount: number;
  salesGoal: number;
  onUpdateSalesGoal: (goal: number) => void;
  onNavigate: (screen: Screen) => void;
  onNavigateToFeed?: (tab: 'Deals' | 'Join in') => void;
}

const TierIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v18M18 3v18M6 7h12M6 12h12M6 17h12" />
  </svg>
);

const ALL_SHOPPERS_PODIUM = [
  { name: 'Katleho', rank: 2, badge: 'Superstar', orders: 128, avatar: 'https://i.pravatar.cc/150?u=kat' },
  { name: 'Naledi', rank: 1, badge: 'Rising star', orders: 131, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { name: 'John', rank: 3, badge: 'Rising star', orders: 98, avatar: 'https://i.pravatar.cc/150?u=john' },
];

const YOUR_GROUP_PODIUM = [
  { name: 'Sipho', rank: 2, badge: 'Superstar', orders: 42, avatar: 'https://i.pravatar.cc/150?u=sipho' },
  { name: 'Buhle', rank: 1, badge: 'Rising star', orders: 45, avatar: 'https://i.pravatar.cc/150?u=buhle' },
  { name: 'Tumi', rank: 3, badge: 'Rising star', orders: 38, avatar: 'https://i.pravatar.cc/150?u=tumi' },
];

const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateToUnassigned, 
  onAddClient, 
  totalClients, 
  unassignedCount,
  salesGoal,
  onUpdateSalesGoal,
  onNavigate,
  onNavigateToFeed
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState(salesGoal.toString());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [leaderboardTab, setLeaderboardTab] = useState<'YOUR_GROUP' | 'ALL_SHOPPERS'>('YOUR_GROUP');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (isEditModalOpen && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isEditModalOpen]);

  const handleOpenEdit = () => {
    setTempGoal(salesGoal.toString());
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    try {
      const newGoal = parseInt(tempGoal, 10);
      if (isNaN(newGoal)) throw new Error('Invalid number');
      onUpdateSalesGoal(newGoal);
      setToast({ message: 'Sales goal successfully set', type: 'success' });
      setIsEditModalOpen(false);
    } catch (e) {
      setToast({ message: 'Failed to set sales goal', type: 'error' });
    }
  };

  const podiumData = leaderboardTab === 'YOUR_GROUP' ? YOUR_GROUP_PODIUM : ALL_SHOPPERS_PODIUM;
  const userRank = leaderboardTab === 'YOUR_GROUP' ? 4 : 17;
  const userOrders = leaderboardTab === 'YOUR_GROUP' ? 36 : 141;
  const gapToTop3 = leaderboardTab === 'YOUR_GROUP' ? 2 : 82;

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-32 relative">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-8 left-0 right-0 z-[300] flex justify-center px-6 pointer-events-none">
          <div className={`${
            toast.type === 'success' ? 'bg-[#00965E]' : 'bg-[#EF4444]'
          } text-white px-5 py-2.5 rounded-full flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300 shadow-xl pointer-events-auto border border-white/10`}>
            {toast.type === 'success' ? <Check size={14} strokeWidth={4} /> : <X size={14} strokeWidth={4} />}
            <span className="text-[14px] font-black">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-[#0047FF] pt-12 pb-16 px-6 relative text-white text-center">
        <div className="flex justify-between items-center mb-10">
          <div className="w-10" />
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-black tracking-tight">Takealot</span>
              <div className="w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-[#0047FF] rounded-full"></div>
              </div>
            </div>
            <span className="text-[14px] font-black tracking-[0.05em] leading-none mt-0.5">Personal shopper</span>
          </div>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-lg active:scale-95 transition-all">
            <Bell size={22} strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-[82px] h-[92px] flex flex-col items-center mb-4">
            <div className="absolute inset-0 bg-[#C68D5F] rounded-t-xl rounded-b-[35%] flex items-center justify-center shadow-xl">
              <div className="text-[#8E5E3D] scale-125">
                <Trophy size={28} fill="currentColor" strokeWidth={0} />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[100px] z-20">
              <div className="bg-[#EADACB] text-[#8E5E3D] px-2 py-1 flex items-center justify-center shadow-md relative">
                <span className="text-[10px] font-black tracking-widest">Starling</span>
                <div className="absolute -left-1 -bottom-1 w-1.5 h-1.5 bg-[#8E5E3D] rotate-45 transform -z-10"></div>
                <div className="absolute -right-1 -bottom-1 w-1.5 h-1.5 bg-[#8E5E3D] rotate-45 transform -z-10"></div>
              </div>
            </div>
          </div>
          
          <p className="text-[14px] font-medium opacity-90 mb-2 mt-2">Estimated commission: October</p>
          <h1 className="text-[48px] font-black leading-none mb-6">± R 2,500.00</h1>
          
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-8">
            <div className="w-5 h-5 rounded-full bg-[#56D69E] flex items-center justify-center text-white">
              <Plus size={14} strokeWidth={4} />
            </div>
            <span className="text-[14px] font-black">± R 150.99 vs. Sep</span>
          </div>

          <button 
            onClick={() => onNavigate(Screen.ME)}
            className="bg-white text-[#0047FF] px-10 py-3.5 rounded-full text-[15px] font-black active:scale-95 transition-all shadow-xl"
          >
            See more
          </button>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Sales Goal Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Info size={16} />
              <span className="text-[13px] font-bold text-gray-900 tracking-tight">Suggested sales goal</span>
            </div>
            <button 
              onClick={handleOpenEdit}
              className="text-[#0047FF] text-[13px] font-bold flex items-center space-x-1 uppercase focus:outline-none"
            >
              <span>Edit</span>
              <Edit2 size={12} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[11px] text-gray-500 font-medium mb-1">October sales value</p>
              <p className="text-[24px] font-black text-gray-900 leading-tight">R1,250.00</p>
              <p className="text-[12px] text-gray-400 font-medium">of R{salesGoal.toLocaleString()}</p>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#0047FF]" strokeDasharray="176" strokeDashoffset={176 - (176 * Math.min(1250 / salesGoal, 1))} />
              </svg>
              <span className="relative z-10 text-[13px] font-black text-gray-900 leading-none">
                {Math.round((1250 / salesGoal) * 100)}%
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-start space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
            <div className="mt-0.5"><Bell size={16} className="text-[#0047FF]" /></div>
            <p className="text-[12px] text-gray-900 font-medium leading-relaxed">
              Only <span className="font-black">R{(salesGoal - 1250 > 0 ? salesGoal - 1250 : 0).toLocaleString()}</span> away from hitting your sales goal. Keep going Palesa!
            </p>
          </div>
        </div>

        <h3 className="text-[19px] font-black text-gray-900 pt-2 px-2">Quick actions</h3>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onNavigateToUnassigned}
            className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left transition-all active:scale-[0.99] focus:outline-none"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#0047FF]">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
            <p className="text-[12px] text-gray-500 font-bold tracking-tight mb-1">Orders</p>
            <h4 className="text-[22px] font-black text-gray-900 mb-4">24 Orders • 148 Items</h4>
            
            {unassignedCount > 0 ? (
              <div className="w-full bg-[#0047FF] text-white py-3.5 rounded-xl font-black text-[14px] flex items-center justify-center space-x-2 shadow-lg shadow-blue-100">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>View {unassignedCount} unassigned</span>
              </div>
            ) : (
              <p className="text-[15px] font-black text-gray-900 leading-tight">All items assigned 🎉</p>
            )}
          </button>

          <button 
            onClick={() => onNavigate(Screen.CLIENTS_ROOT)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left transition-all active:scale-[0.99] focus:outline-none"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#0047FF]">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
            <p className="text-[12px] text-gray-500 font-bold tracking-tight mb-1">Clients</p>
            <h4 className="text-[22px] font-black text-gray-900 mb-4">{totalClients}</h4>
            <div 
              onClick={(e) => { e.stopPropagation(); onAddClient(); }}
              className="bg-[#0047FF] text-white px-4 py-2 rounded-lg font-bold text-[13px] inline-flex items-center space-x-1.5 focus:outline-none active:scale-95 transition-all"
            >
              <Plus size={14} strokeWidth={3} />
              <span>Add client</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigateToFeed?.('Deals')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left transition-all active:scale-[0.99] focus:outline-none"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#0047FF]">
                <Tag size={20} strokeWidth={2.5} />
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
            <p className="text-[12px] text-gray-500 font-bold tracking-tight mb-1">Deals</p>
            <h4 className="text-[22px] font-black text-gray-900 mb-4">32</h4>
            <span className="text-[#0047FF] text-[13px] font-bold">3 New</span>
          </button>

          <button 
            onClick={() => onNavigateToFeed?.('Join in')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left transition-all active:scale-[0.99] focus:outline-none"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#0047FF]">
                <Calendar size={20} strokeWidth={2.5} />
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
            <p className="text-[12px] text-gray-500 font-bold tracking-tight mb-1">Events</p>
            <h4 className="text-[22px] font-black text-gray-900 mb-4">12</h4>
            <span className="text-[#0047FF] text-[13px] font-bold">3 New</span>
          </button>

          <button 
            onClick={() => onNavigateToFeed?.('Join in')}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left transition-all active:scale-[0.99] focus:outline-none"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-[#E8F0FE] rounded-full flex items-center justify-center text-[#0047FF]">
                <Trophy size={20} strokeWidth={2.5} />
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
            <p className="text-[12px] text-gray-500 font-bold tracking-tight mb-1">Competitions</p>
            <h4 className="text-[22px] font-black text-gray-900">15</h4>
          </button>
        </div>

        {/* Tier Progression */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mt-4">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2 text-gray-400">
                 <TierIcon />
                 <span className="text-[16px] font-black text-gray-900/60 tracking-tight">Tier progression</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-col">
                <p className="text-[11px] text-gray-500 font-medium mb-1">October sales value</p>
                <p className="text-[24px] font-black text-gray-900 leading-tight">R1,250.00</p>
                <p className="text-[12px] text-gray-400 font-medium">of R10,000</p>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                  <circle cx="48" cy="48" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#0047FF]/20" strokeDasharray="213" strokeDashoffset="185" />
                </svg>
                <span className="absolute text-[15px] font-black text-gray-900 leading-none">13%</span>
              </div>
            </div>

            <div className="flex justify-between items-start pb-8">
              <div className="flex flex-col items-center">
                <div className="relative w-[62px] h-[72px] flex flex-col items-center mb-2">
                  <div className="absolute inset-0 bg-[#C68D5F] rounded-t-xl rounded-b-[40%] flex items-center justify-center shadow-md">
                    <div className="w-8 h-8 text-[#8E5E3D] flex items-center justify-center opacity-40">
                      <Trophy size={24} fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[#8E5E3D] scale-110">
                      <Trophy size={24} fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </div>
                <div className="bg-[#EADACB] text-[#8E5E3D] px-1.5 py-0.5 rounded-[2px] text-[8px] font-black tracking-widest mt-1">
                  Starling
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-[62px] h-[72px] bg-[#F1F6FE] rounded-t-xl rounded-b-[40%] flex flex-col items-center justify-center border border-blue-50/50 shadow-sm">
                   <Lock size={12} className="text-[#D0DDFE] mb-1" />
                   <span className="text-[10px] font-black text-[#D0DDFE]">R10k</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-[62px] h-[72px] bg-[#E8E8E8] rounded-t-xl rounded-b-[40%] flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                   <Lock size={12} className="text-[#B8B8B8] mb-1" />
                   <span className="text-[10px] font-black text-[#B8B8B8]">R15k</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-[62px] h-[72px] bg-[#D8D8D8] rounded-t-xl rounded-b-[40%] flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                   <Lock size={12} className="text-[#989898] mb-1" />
                   <span className="text-[10px] font-black text-[#989898]">R20k</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
              <div className="mt-0.5"><Bell size={16} className="text-[#0047FF]" /></div>
              <p className="text-[12px] text-gray-900 font-medium leading-relaxed">
                Only <span className="font-black">R7,750.00</span> away from unlocking the next tier. Keep it up!
              </p>
            </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4 mb-10">
          <h3 className="text-[19px] font-black text-gray-900 mb-1">Leaderboard</h3>
          <p className="text-[13px] text-gray-500 font-medium mb-8">Most orders: October</p>

          {/* TAB SWITCHER */}
          <div className="flex items-center space-x-2 mb-10">
            <button 
              onClick={() => setLeaderboardTab('YOUR_GROUP')}
              className={`px-4 py-2 rounded-full text-[13px] font-black transition-all ${leaderboardTab === 'YOUR_GROUP' ? 'bg-[#1C1C1E] text-white' : 'bg-[#F1F3F4] text-gray-900'}`}
            >
              Your group
            </button>
            <button 
              onClick={() => setLeaderboardTab('ALL_SHOPPERS')}
              className={`px-4 py-2 rounded-full text-[13px] font-black transition-all ${leaderboardTab === 'ALL_SHOPPERS' ? 'bg-[#1C1C1E] text-white' : 'bg-[#F1F3F4] text-gray-900'}`}
            >
              All shoppers
            </button>
          </div>

          <div className="flex items-end justify-center space-x-6 mb-10 pt-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img src={podiumData[0].avatar} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" alt="" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">2</div>
              </div>
              <p className="text-[14px] font-black text-gray-900">{podiumData[0].name}</p>
              <p className="text-[11px] text-gray-500 font-bold mb-1">{podiumData[0].badge}</p>
              <div className="flex items-center space-x-1 text-[11px] font-black text-gray-900"><Package size={12} /><span>{podiumData[0].orders}</span></div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center text-center -translate-y-4">
              <div className="relative mb-3 scale-110">
                <img src={podiumData[1].avatar} className="w-20 h-20 rounded-full object-cover border-4 border-[#0047FF] shadow-lg" alt="" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0047FF] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">1</div>
              </div>
              <p className="text-[16px] font-black text-gray-900 leading-tight">{podiumData[1].name}</p>
              <p className="text-[11px] text-[#0047FF] font-bold mb-1 tracking-wider">{podiumData[1].badge}</p>
              <div className="flex items-center space-x-1 text-[12px] font-black text-gray-900"><Package size={14} /><span>{podiumData[1].orders}</span></div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img src={podiumData[2].avatar} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" alt="" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#C68D5F] text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">3</div>
              </div>
              <p className="text-[14px] font-black text-gray-900">{podiumData[2].name}</p>
              <p className="text-[11px] text-gray-400 font-bold mb-1">{podiumData[2].badge}</p>
              <div className="flex items-center space-x-1 text-[11px] font-black text-gray-900"><Package size={12} /><span>{podiumData[2].orders}</span></div>
            </div>
          </div>

          <div className="bg-[#F1F3F4]/50 p-4 rounded-xl border border-gray-100 flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-black text-gray-400">{userRank}</span>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
              <div>
                <p className="text-[14px] font-black text-gray-900 leading-tight">Palesa <span className="text-gray-400">(You)</span></p>
                <p className="text-[11px] text-gray-500 font-bold">Rising star</p>
              </div>
            </div>
            <span className="text-[15px] font-black text-gray-900">{userOrders}</span>
          </div>

          <div className="text-center mb-6">
            <p className="text-[13px] font-medium text-gray-900">You're <span className="bg-[#FFCC00] px-1 font-black">{gapToTop3} orders</span> away from being in the top 3.</p>
          </div>

          <button 
            onClick={() => onNavigate(Screen.LEADERBOARD)}
            className="w-full bg-[#0047FF] text-white py-4 rounded-xl font-black text-[15px] focus:outline-none active:scale-[0.99] transition-all"
          >
            View all
          </button>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 flex flex-col shadow-2xl overflow-hidden pb-12">
            <div className="flex items-center justify-between px-6 pt-10 pb-6">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full focus:outline-none active:bg-gray-200"
              >
                <X size={20} />
              </button>
              <h2 className="text-[17px] font-black text-gray-900">Edit goal</h2>
              <div className="w-10" />
            </div>

            <div className="px-6 flex flex-col items-center">
              <div className="w-full text-center py-10">
                <div className="flex items-center justify-center text-[48px] font-black text-gray-900">
                  <span className="mr-3 select-none">R</span>
                  <input
                    ref={inputRef}
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="bg-transparent border-none outline-none focus:ring-0 text-center w-full max-w-[240px]"
                    autoFocus
                  />
                </div>
                <div className="w-full h-px bg-gray-100 mt-2" />
              </div>

              <div className="w-full flex justify-between items-center mb-8">
                <span className="text-[15px] font-medium text-gray-500">Suggested goal</span>
                <span className="text-[15px] font-black text-gray-900">R2,500</span>
              </div>

              <button 
                onClick={handleSave}
                disabled={!tempGoal || tempGoal === '0'}
                className={`w-full py-4 rounded-xl text-[17px] font-black transition-all ${
                  tempGoal && tempGoal !== '0' 
                    ? 'bg-[#0047FF] text-white shadow-lg active:scale-[0.98]' 
                    : 'bg-[#EBF1FF] text-[#0047FF]/40 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;