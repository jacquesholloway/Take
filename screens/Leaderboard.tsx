import React, { useState } from 'react';
import { Info, Clock, ArrowUp, Package, Crown, Hash } from 'lucide-react';

type LeaderboardTab = 'ALL_SHOPPERS' | 'YOUR_GROUP';

interface LeaderboardItem {
  rank: number;
  name: string;
  badge: string;
  orders: number;
  avatar: string;
  isYou?: boolean;
}

const ALL_SHOPPERS_DATA: LeaderboardItem[] = [
  { rank: 1, name: 'Naledi', badge: 'Rising star', orders: 369, avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop' },
  { rank: 2, name: 'Katleho', badge: 'Superstar', orders: 342, avatar: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?q=80&w=200&auto=format&fit=crop' },
  { rank: 3, name: 'John', badge: 'Rising star', orders: 310, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
  { rank: 4, name: 'Brian', badge: 'Rising star', orders: 285, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { rank: 5, name: 'Frank', badge: 'Rising star', orders: 240, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
  { rank: 6, name: 'Grace', badge: 'Rising star', orders: 195, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
  { rank: 7, name: 'Henry', badge: 'Rising star', orders: 150, avatar: '' }, 
];

const YOUR_GROUP_DATA: LeaderboardItem[] = [
  { rank: 1, name: 'Palesa', badge: 'Rising star', orders: 45, avatar: 'https://i.pravatar.cc/150?u=palesa' },
  { rank: 2, name: 'Sipho', badge: 'Superstar', orders: 42, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
  { rank: 3, name: 'Tumi', badge: 'Rising star', orders: 38, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { rank: 4, name: 'Lebo', badge: 'Rising star', orders: 36, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop' },
  { rank: 5, name: 'Thabo', badge: 'Rising star', orders: 30, avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop' },
];

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('YOUR_GROUP');

  const data = activeTab === 'ALL_SHOPPERS' ? ALL_SHOPPERS_DATA : YOUR_GROUP_DATA;
  const top3 = data.slice(0, 3);
  const remaining = data.slice(3);
  const userRankValue = activeTab === 'YOUR_GROUP' ? 4 : 17;
  const userOrdersCount = activeTab === 'ALL_SHOPPERS' ? 141 : 36;
  const weeklyPlaces = activeTab === 'ALL_SHOPPERS' ? 2 : 4;
  const gapToTop3 = activeTab === 'YOUR_GROUP' ? 2 : 82;

  const Top3Podium = () => (
    <div className="flex items-end justify-center space-x-6 mb-10 pt-4">
      {/* 2nd Place */}
      {top3[1] && (
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <img src={top3[1].avatar} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" alt="" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-gray-400 text-white rounded-full flex items-center justify-center text-[13px] font-black border-2 border-white">2</div>
          </div>
          <p className="text-[16px] font-black text-gray-900">{top3[1].name}</p>
          <p className="text-[11px] text-gray-500 font-bold mb-1">{top3[1].badge}</p>
          <div className="flex items-center space-x-1 text-[12px] font-black text-gray-400"><Package size={14} /><span>{top3[1].orders}</span></div>
        </div>
      )}

      {/* 1st Place */}
      {top3[0] && (
        <div className="flex flex-col items-center text-center -translate-y-6">
          <div className="relative mb-3 scale-110">
            <img src={top3[0].avatar} className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-lg" alt="" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#8E8E93] text-white rounded-full flex items-center justify-center text-[14px] font-black border-2 border-white">1</div>
          </div>
          <p className="text-[18px] font-black text-gray-900 leading-tight">{top3[0].name}</p>
          <p className="text-[12px] text-gray-500 font-bold mb-1">{top3[0].badge}</p>
          <div className="flex items-center space-x-1 text-[13px] font-black text-gray-400"><Package size={16} /><span>{top3[0].orders}</span></div>
        </div>
      )}

      {/* 3rd Place */}
      {top3[2] && (
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <img src={top3[2].avatar} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" alt="" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 bg-gray-500 text-white rounded-full flex items-center justify-center text-[13px] font-black border-2 border-white">3</div>
          </div>
          <p className="text-[16px] font-black text-gray-900">{top3[2].name}</p>
          <p className="text-[11px] text-gray-500 font-bold mb-1">{top3[2].badge}</p>
          <div className="flex items-center space-x-1 text-[12px] font-black text-gray-400"><Package size={14} /><span>{top3[2].orders}</span></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-40 font-sans">
      <div className="px-6 pt-12">
        {/* Title & Info - Reduced font size for single line */}
        <h1 className="text-[26px] font-black text-gray-900 mb-1">Leaderboard - October</h1>
        <div className="flex items-center space-x-1.5 mb-8 text-gray-500">
          <span className="text-[15px] font-medium">Most qualifying orders</span>
          <Info size={16} />
        </div>

        {/* Tab Switching - Refined to match image pills */}
        <div className="flex items-center space-x-2 mb-10">
          <button 
            onClick={() => setActiveTab('YOUR_GROUP')}
            className={`px-4 py-2 rounded-full text-[14px] font-black transition-all ${activeTab === 'YOUR_GROUP' ? 'bg-[#1C1C1E] text-white' : 'bg-[#F1F3F4] text-gray-900'}`}
          >
            Your group
          </button>
          <button 
            onClick={() => setActiveTab('ALL_SHOPPERS')}
            className={`px-4 py-2 rounded-full text-[14px] font-black transition-all ${activeTab === 'ALL_SHOPPERS' ? 'bg-[#1C1C1E] text-white' : 'bg-[#F1F3F4] text-gray-900'}`}
          >
            All shoppers
          </button>
        </div>

        {/* Status Row */}
        <div className="flex justify-between items-center mb-12 px-2">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[13px] font-medium text-gray-400 mb-1">Time left</span>
            <div className="flex items-center space-x-1.5 text-gray-900 font-black text-[17px]">
              <Clock size={18} />
              <span>6 days</span>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[13px] font-medium text-gray-400 mb-1">This week</span>
            <div className="flex items-center space-x-1.5 text-gray-900 font-black text-[17px]">
              <div className="w-[18px] h-[18px] bg-[#00965E] rounded-full flex items-center justify-center">
                <ArrowUp size={12} className="text-white" strokeWidth={4} />
              </div>
              <span>{weeklyPlaces} places</span>
            </div>
          </div>
        </div>

        {/* Top 3 Section */}
        <Top3Podium />

        {/* Current User Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                <Hash size={14} className="text-gray-400" strokeWidth={3} />
              </div>
              <span className="text-[15px] font-black text-gray-900">{userRankValue}</span>
            </div>
            <img src="https://i.pravatar.cc/150?u=me" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
            <div>
              <p className="text-[15px] font-black text-gray-900 leading-tight">Jane Doe <span className="text-gray-400 font-bold">(You)</span></p>
              <p className="text-[12px] text-gray-400 font-bold">Rising star</p>
            </div>
          </div>
          <span className="text-[17px] font-black text-gray-900">{userOrdersCount}</span>
        </div>

        {/* Motivation Text */}
        <div className="text-center mb-10">
          <p className="text-[14px] font-medium text-gray-900">
            You're <span className="bg-[#FFCC00] px-1 font-black">{gapToTop3} orders</span> away from being in the top 3.
          </p>
        </div>

        {/* Remaining List */}
        <div className="space-y-6">
          {remaining.map((item) => (
            <div key={item.rank} className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-black text-gray-400">{item.rank}</span>
                  </div>
                </div>
                {item.avatar ? (
                  <img src={item.avatar} className="w-11 h-11 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-[14px] font-black text-gray-400 uppercase">
                    {item.name.substring(0, 1)}
                  </div>
                )}
                <div>
                  <p className="text-[15px] font-black text-gray-900 leading-tight">{item.name}</p>
                  <p className="text-[12px] text-gray-400 font-bold">{item.badge}</p>
                </div>
              </div>
              <span className="text-[16px] font-black text-gray-900">{item.orders}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center text-center px-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Crown size={24} className="text-gray-900" />
          </div>
          <h4 className="text-[17px] font-black text-gray-900 mb-2">More rankings to come</h4>
          <p className="text-[13px] text-gray-400 font-medium leading-relaxed max-w-[280px]">
            As personal shoppers place their first orders for the month, their rank will show.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;