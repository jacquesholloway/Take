
import React, { useState, useMemo } from 'react';
import { Play, Share2, ArrowUpDown, Flame, Ticket, MoreHorizontal, Calendar, Trophy, Info, Plus, Mail, Upload } from 'lucide-react';

interface Deal {
  id: string;
  type: 'boosted' | 'discount' | 'combo' | 'freebie';
  hasVideo?: boolean;
  bannerImage?: string;
  productImage?: string;
  badges: { type: 'boosted' | 'discount'; label: string }[];
  heading: string;
  commissionInfo?: string;
  discountInfo?: string;
  expiryDate: string;
  daysLeft: number;
  expiringSoon?: boolean;
  createdAt: number;
  details?: string;
  link?: string;
  socialContent?: { type: 'video' | 'image'; poster: string }[];
  terms?: string;
}

interface JoinInPost {
  id: string;
  type: 'Event' | 'Competition' | 'Invitation' | 'Live show';
  title: string;
  dateLabel: string;
  image: string;
  expiringSoon?: boolean;
  createdAt: number;
  details?: string;
  link?: string;
  socialContent?: { type: 'video' | 'image'; poster: string }[];
  terms?: string;
}

const DEFAULT_TERMS = "Offer valid from 01 November to 15 November 2025, or while stocks last. Discount applies at checkout. Shopper only has 4 redeemable coupons. This offer cannot be combined with any other promotions, discounts, or coupons. Excludes sale or clearance items unless otherwise stated. Prices and availability are subject to change without notice. The company reserves the right to modify or cancel the offer at any time.";
const DEFAULT_DETAILS = "Add Ripple Aroma diffuser to your cart and apply the coupon code BrekkieDeals at checkout to enjoy R200 commission on your purchase. This offer can be used up to four times per shopper during the promotion period.";

const generateMockDeals = (): Deal[] => {
  const deals: Deal[] = [
    {
      id: 'd1',
      type: 'boosted',
      hasVideo: true,
      badges: [{ type: 'boosted', label: 'Boosted' }],
      heading: 'Ripple Watermelon Aroma diffuser',
      commissionInfo: '10% commission',
      expiryDate: '12 Dec ‘25',
      daysLeft: 3,
      expiringSoon: true,
      createdAt: Date.now() - 100000,
      details: DEFAULT_DETAILS,
      terms: DEFAULT_TERMS,
      link: 'https://takealot.com/invite/ih/yuasdf...',
      productImage: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?q=80&w=400&auto=format&fit=crop',
      socialContent: [{ 
        type: 'video', 
        poster: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?q=80&w=400&auto=format&fit=crop' 
      }]
    },
    {
      id: 'd2',
      type: 'boosted',
      badges: [{ type: 'boosted', label: 'Boosted' }],
      heading: '.dealHeading',
      commissionInfo: '+ R40 commission',
      expiryDate: '30 Dec ‘25',
      daysLeft: 21,
      expiringSoon: false,
      createdAt: Date.now() - 200000,
      details: DEFAULT_DETAILS,
      terms: DEFAULT_TERMS,
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'd3',
      type: 'discount',
      badges: [{ type: 'discount', label: 'Coupon' }],
      heading: 'Save R200 on Aroma Diffusers',
      commissionInfo: 'R200 commission',
      expiryDate: '15 Dec ‘25',
      daysLeft: 6,
      expiringSoon: true,
      createdAt: Date.now() - 300000,
      details: DEFAULT_DETAILS,
      terms: DEFAULT_TERMS,
      productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop'
    }
  ];

  // Fill up to 15 deals
  const types: ('boosted' | 'discount' | 'combo' | 'freebie')[] = ['boosted', 'discount', 'combo', 'freebie'];
  const titles = [
    'Summer Fashion Essentials', 'Tech Upgrade Deals', 'Home & Living Refresh', 
    'Beauty Best Sellers', 'Outdoor Adventures', 'Kitchen Hero Appliances',
    'Gaming Gear Boost', 'Wellness & Health', 'Pet Care Specials', 
    'Travel Luggage Set', 'Luxury Watch Deal', 'Premium Audio Gear'
  ];

  for (let i = 4; i <= 15; i++) {
    const type = types[i % types.length];
    deals.push({
      id: `d${i}`,
      type: type,
      hasVideo: i % 5 === 0,
      badges: [{ type: type === 'boosted' ? 'boosted' : 'discount', label: type === 'boosted' ? 'Boosted' : 'Coupon' }],
      heading: titles[i - 4] || `Deal Heading ${i}`,
      commissionInfo: i % 2 === 0 ? '15% commission' : '+ R100 commission',
      expiryDate: '31 Jan ‘26',
      daysLeft: 54,
      expiringSoon: false,
      createdAt: Date.now() - (i * 1000000),
      details: DEFAULT_DETAILS,
      terms: DEFAULT_TERMS,
      productImage: `https://picsum.photos/seed/deal${i}/400/400`
    });
  }

  return deals;
};

const MOCK_DEALS = generateMockDeals();

const MOCK_JOIN_IN: JoinInPost[] = [
  {
    id: 'j1',
    type: 'Competition',
    title: 'World Smile Day',
    dateLabel: '15 Sept, 13:00',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&auto=format&fit=crop',
    createdAt: 1733300000000,
    expiringSoon: false,
  },
  {
    id: 'j2',
    type: 'Live show',
    title: 'Heritage Day themed Ingenile Live Show',
    dateLabel: '15 Sept, 13:00',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=400&auto=format&fit=crop',
    expiringSoon: true,
    createdAt: 1733200000000,
  },
  {
    id: 'j3',
    type: 'Competition',
    title: 'Sunday unique order competition',
    dateLabel: '20 Oct, 09:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=400&auto=format&fit=crop',
    createdAt: 1733100000000,
  },
  {
    id: 'j4',
    type: 'Invitation',
    title: 'House of beauty VIP launch',
    dateLabel: '14 - 20 Oct',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop',
    createdAt: 1733000000000,
  },
  {
    id: 'j5',
    type: 'Event',
    title: 'Cape Town Shopper Meetup',
    dateLabel: '25 Oct, 14:00',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop',
    createdAt: 1732900000000,
  }
];

interface FeedProps {
  onSelectDeal: (deal: Deal) => void;
  onSelectJoinIn: (post: JoinInPost) => void;
  activeTab: 'Deals' | 'Join in';
  onTabChange: (tab: 'Deals' | 'Join in') => void;
}

const Feed: React.FC<FeedProps> = ({ onSelectDeal, onSelectJoinIn, activeTab, onTabChange }) => {
  const [dealsFilters, setDealsFilters] = useState<string[]>([]);
  const [joinInFilters, setJoinInFilters] = useState<string[]>([]);
  const [sortType, setSortType] = useState<'Most recent' | 'Oldest'>('Most recent');

  const toggleDealsFilter = (filter: string) => {
    setDealsFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const toggleJoinInFilter = (filter: string) => {
    setJoinInFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const toggleSort = () => {
    setSortType(prev => prev === 'Most recent' ? 'Oldest' : 'Most recent');
  };

  const filteredDeals = useMemo(() => {
    let list = [...MOCK_DEALS];
    if (dealsFilters.length > 0) {
      list = list.filter(deal => {
        const matchBoosted = dealsFilters.includes('Boosted') && (deal.type === 'boosted' || deal.type === 'combo');
        const matchCoupons = dealsFilters.includes('Coupons') && (deal.type === 'discount' || deal.type === 'freebie' || deal.type === 'combo');
        return matchBoosted || matchCoupons;
      });
    }
    list.sort((a, b) => sortType === 'Most recent' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    return list;
  }, [dealsFilters, sortType]);

  const filteredJoinIn = useMemo(() => {
    let list = [...MOCK_JOIN_IN];
    if (joinInFilters.length > 0) {
      list = list.filter(post => {
        if (joinInFilters.includes('Events') && (post.type === 'Event' || post.type === 'Live show')) return true;
        if (joinInFilters.includes('Competitions') && post.type === 'Competition') return true;
        if (joinInFilters.includes('Invitations') && post.type === 'Invitation') return true;
        return false;
      });
    }
    list.sort((a, b) => sortType === 'Most recent' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
    return list;
  }, [joinInFilters, sortType]);

  const FilterPill = ({ label, count, isActive, onClick, icon: Icon }: any) => (
    <button 
      onClick={onClick}
      className={`flex items-center space-x-2 rounded-full py-2 px-4 whitespace-nowrap border transition-all duration-200 focus:outline-none ${
        isActive 
          ? 'bg-white border-white text-[#0047FF]' 
          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      }`}
    >
      {Icon && <Icon size={14} fill={isActive ? '#0047FF' : 'white'} className="mr-1" />}
      <span className="text-[13px] font-bold">{label} ({count})</span>
    </button>
  );

  const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => (
    <div 
      onClick={() => onSelectDeal(deal)}
      className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 mb-6 transition-all active:scale-[0.99] cursor-pointer"
    >
      {/* Artwork Header */}
      <div className="relative aspect-[16/10] bg-[#00A8B8] overflow-hidden flex items-center justify-center p-6">
        {/* Background Circles - Simple simulation of the artwork */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[100%] border border-white/20 rounded-full" />
        <div className="absolute top-[30%] right-[-15%] w-[70%] h-[100%] border border-white/20 rounded-full" />
        
        <div className="relative z-10 w-full h-full flex items-center justify-between">
          <div className="flex flex-col items-start text-white">
            <div className="bg-white rounded-full p-2 mb-2 w-14 h-14 flex items-center justify-center">
              <div className="text-[#0047FF] font-black text-[9px] leading-tight text-center">
                Takealot<br/>Personal<br/>Shopper
              </div>
            </div>
            <div className="text-[14px] font-black uppercase tracking-tight leading-none opacity-90 mb-1">Personal Shopper</div>
            <div className="text-[44px] font-black uppercase leading-none tracking-tighter mb-2 italic">Deals</div>
            <div className="bg-[#FFEB3B] text-[#0047FF] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
              Deals for your wallet
            </div>
            <div className="text-[10px] font-bold uppercase mt-1 opacity-80">Cash-saving steals!</div>
          </div>

          <div className="relative w-1/2 h-full flex items-center justify-center">
             {/* Product Circle */}
             <div className="w-[120%] aspect-square bg-white rounded-full shadow-2xl flex items-center justify-center p-4">
                <img src={deal.productImage} className="w-full h-full object-contain" alt="" />
             </div>
             {/* Commission Badge */}
             <div className="absolute top-1/2 left-[-15%] -translate-y-1/2 w-24 h-24 bg-[#FFEB3B] rounded-full border-2 border-white flex flex-col items-center justify-center text-[#0047FF] shadow-lg z-20">
                <span className="text-[18px] font-black leading-none">{deal.id === 'd1' ? '10%' : '20%'}</span>
                <span className="text-[8px] font-black uppercase leading-none mt-1">Commission</span>
             </div>
          </div>
        </div>

        {/* Video Tag */}
        {deal.hasVideo && (
          <div className="absolute top-4 left-4 bg-black text-white px-2 py-1.5 rounded flex items-center space-x-2 shadow-lg z-30">
            <Play size={10} fill="currentColor" />
            <span className="text-[11px] font-black uppercase tracking-tighter">Video</span>
          </div>
        )}

        {/* Share Button Overlay */}
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-xl border border-gray-100 z-30 active:scale-90 transition-transform"
        >
          <Upload size={18} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-3">
          {deal.badges.map((badge, idx) => (
            <div 
              key={idx}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-black ${
                badge.type === 'boosted' 
                  ? 'bg-[#E6F4EA] text-[#00965E]' 
                  : 'bg-[#EBF1FF] text-[#0047FF]'
              }`}
            >
              {badge.type === 'boosted' && <Flame size={12} fill="currentColor" />}
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        <h3 className="text-[18px] font-black text-gray-900 leading-tight mb-3 line-clamp-2">
          {deal.heading}
        </h3>

        {deal.commissionInfo && (
          <p className="text-[15px] font-bold text-[#00965E] mb-4">
            {deal.commissionInfo}
          </p>
        )}

        <div className="inline-block">
          <div className={`px-3 py-1.5 rounded-lg text-[13px] font-bold bg-[#F1F3F4] text-gray-600`}>
            {`Expires: ${deal.expiryDate} (${deal.daysLeft} days left)`}
          </div>
        </div>
      </div>
    </div>
  );

  const JoinInCard: React.FC<{ post: JoinInPost }> = ({ post }) => (
    <div 
      onClick={() => onSelectJoinIn(post)}
      className="flex flex-col mb-6 animate-in fade-in duration-300 cursor-pointer"
    >
      <div className="relative aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden mb-3 shadow-sm">
        <img src={post.image} className="w-full h-full object-cover" alt="" />
        <button 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white focus:outline-none active:bg-white/40"
        >
           <MoreHorizontal size={18} />
        </button>
      </div>
      <h3 className="text-[15px] font-black text-gray-900 leading-tight mb-1 line-clamp-2">
        {post.title}
      </h3>
      <p className="text-[13px] text-gray-500 font-bold mb-2">{post.dateLabel}</p>
      {post.expiringSoon && (
        <div className="inline-block">
          <span className="text-[11px] font-black text-[#EF4444] bg-[#FEE2E2] px-2.5 py-1 rounded-lg">
            Expiring soon
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#F9F9F9] min-h-screen flex flex-col pb-40">
      <div className="bg-[#0047FF] pt-4 relative">
        <div className="flex justify-center space-x-12 px-4 mb-4">
          <button 
            onClick={() => onTabChange('Deals')} 
            className={`text-[17px] font-bold pb-2 transition-all relative focus:outline-none ${activeTab === 'Deals' ? 'text-white' : 'text-white/60'}`}
          >
            Deals
            {activeTab === 'Deals' && <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />}
          </button>
          <button 
            onClick={() => onTabChange('Join in')} 
            className={`text-[17px] font-bold pb-2 transition-all relative focus:outline-none ${activeTab === 'Join in' ? 'text-white' : 'text-white/60'}`}
          >
            Join in
            {activeTab === 'Join in' && <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />}
          </button>
        </div>

        <div className="flex items-center space-x-2 px-4 py-4 overflow-x-auto no-scrollbar">
          {activeTab === 'Deals' ? (
            <>
              <FilterPill 
                label="Boosted commission" 
                count={MOCK_DEALS.filter(d => d.type === 'boosted' || d.type === 'combo').length} 
                isActive={dealsFilters.includes('Boosted')} 
                onClick={() => toggleDealsFilter('Boosted')} 
                icon={Flame} 
              />
              <FilterPill 
                label="Coupons" 
                count={MOCK_DEALS.filter(d => d.type === 'discount' || d.type === 'freebie' || d.type === 'combo').length} 
                isActive={dealsFilters.includes('Coupons')} 
                onClick={() => toggleDealsFilter('Coupons')} 
                icon={Ticket} 
              />
            </>
          ) : (
            <>
              <FilterPill 
                label="Events" 
                count={MOCK_JOIN_IN.filter(j => j.type === 'Event' || j.type === 'Live show').length} 
                isActive={joinInFilters.includes('Events')} 
                onClick={() => toggleJoinInFilter('Events')} 
                icon={Calendar} 
              />
              <FilterPill 
                label="Competitions" 
                count={MOCK_JOIN_IN.filter(j => j.type === 'Competition').length} 
                isActive={joinInFilters.includes('Competitions')} 
                onClick={() => toggleJoinInFilter('Competitions')} 
                icon={Trophy} 
              />
              <FilterPill 
                label="Invitations" 
                count={MOCK_JOIN_IN.filter(j => j.type === 'Invitation').length} 
                isActive={joinInFilters.includes('Invitations')} 
                onClick={() => toggleJoinInFilter('Invitations')} 
                icon={Mail} 
              />
            </>
          )}
        </div>

        <div className="bg-[#0047FF] px-4 pb-8 flex items-center justify-between text-white/80">
          <span className="text-[13px] font-black uppercase tracking-tight">
            {activeTab === 'Deals' ? `${filteredDeals.length} deals` : `${filteredJoinIn.length} posts`}
          </span>
          <button onClick={toggleSort} className="flex items-center space-x-1 focus:outline-none active:text-white transition-colors">
            <ArrowUpDown size={14} />
            <span className="text-[13px] font-black">{sortType}</span>
          </button>
        </div>
        
        <div className="sawtooth-edge transition-opacity duration-300 opacity-100"></div>
      </div>

      <div className="px-4 pt-10">
        {activeTab === 'Deals' ? (
          <div className="bg-[#F9F9F9]">
            {filteredDeals.length > 0 ? (
              filteredDeals.map(deal => <DealCard key={deal.id} deal={deal} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Info className="text-gray-300 mb-2" size={32} />
                <p className="text-gray-500 font-bold">No deals match your filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 pt-2">
            {filteredJoinIn.length > 0 ? (
              filteredJoinIn.map(post => <JoinInCard key={post.id} post={post} />)
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                <Info className="text-gray-300 mb-2" size={32} />
                <p className="text-gray-500 font-bold">No posts match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
