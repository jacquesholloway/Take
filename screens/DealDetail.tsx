
import React from 'react';
import { X, Share2, Download, Flame, ExternalLink, Play, Upload, Ticket } from 'lucide-react';

interface DealDetailProps {
  deal: {
    id: string;
    type: string;
    bannerImage?: string;
    productImage?: string;
    heading: string;
    commissionInfo?: string;
    discountInfo?: string;
    expiryDate: string;
    daysLeft: number;
    expiringSoon?: boolean;
    badges: { type: string; label: string }[];
    details?: string;
    link?: string;
    socialContent?: { type: 'video' | 'image'; poster: string }[];
    terms?: string;
  };
  onClose: () => void;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal, onClose }) => {
  // Logic: 100% off removes commission
  const isOneHundredPercentOff = deal.discountInfo?.includes('100%');
  const showCommission = !isOneHundredPercentOff && deal.commissionInfo;

  return (
    <div className="bg-white min-h-screen flex flex-col animate-in fade-in duration-300">
      {/* Sticky White Header */}
      <div className="bg-white sticky top-0 z-[100] pt-12 pb-4 px-6 flex items-center justify-between border-b border-gray-50">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full active:bg-gray-200 transition-colors focus:outline-none"
        >
          <X size={20} />
        </button>
        
        <h1 className="flex-1 text-center text-gray-900 text-[17px] font-black truncate px-4">
          {deal.heading}
        </h1>
        
        <div className="w-10" />
      </div>

      {/* Hero Section - Exactly matching Feed's Artwork Header */}
      <div className="relative aspect-[16/10] bg-[#00A8B8] overflow-hidden flex items-center justify-center p-6">
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
             <div className="w-[120%] aspect-square bg-white rounded-full shadow-2xl flex items-center justify-center p-4">
                <img src={deal.productImage} className="w-full h-full object-contain" alt="" />
             </div>
             <div className="absolute top-1/2 left-[-15%] -translate-y-1/2 w-24 h-24 bg-[#FFEB3B] rounded-full border-2 border-white flex flex-col items-center justify-center text-[#0047FF] shadow-lg z-20">
                <span className="text-[18px] font-black leading-none">{deal.id === 'd1' ? '10%' : '20%'}</span>
                <span className="text-[8px] font-black uppercase leading-none mt-1">Commission</span>
             </div>
          </div>
        </div>

        {deal.id === 'd1' && (
          <div className="absolute top-4 left-4 bg-black text-white px-2 py-1.5 rounded flex items-center space-x-2 shadow-lg z-30">
            <Play size={10} fill="currentColor" />
            <span className="text-[11px] font-black uppercase tracking-tighter">Video</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-6 pb-20">
        {/* Primary Actions */}
        <div className="flex space-x-3 mb-8">
          <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-[#F1F3F4] text-gray-900 rounded-lg font-black text-[15px] active:bg-gray-200 transition-colors">
            <Download size={18} />
            <span>Download</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-[#0047FF] text-white rounded-lg font-black text-[15px] active:bg-blue-600 transition-colors">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>

        {/* Metadata Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {deal.badges.map((badge, idx) => (
            <div 
              key={idx}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-black ${
                badge.type === 'boosted' 
                  ? 'bg-[#E6F4EA] text-[#00965E]' 
                  : 'bg-[#EBF1FF] text-[#0047FF]'
              }`}
            >
              {badge.type === 'boosted' ? <Flame size={12} fill="currentColor" /> : <Ticket size={12} />}
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-[28px] font-black text-gray-900 leading-tight mb-3">
          {deal.heading}
        </h2>

        {deal.discountInfo && (
          <p className="text-[16px] font-bold text-[#0047FF] mb-1">
            {deal.discountInfo}
          </p>
        )}

        {showCommission && (
          <p className="text-[16px] font-bold text-[#00965E] mb-6">
            {deal.commissionInfo}
          </p>
        )}

        {/* Expiry Badge - Only show if nearing expiry */}
        {deal.daysLeft < 30 && (
          <div className="inline-block mb-10">
            <div className={`px-3 py-1.5 rounded-lg text-[13px] font-bold ${
              deal.expiringSoon ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#F1F3F4] text-gray-600'
            }`}>
              {deal.expiringSoon 
                ? `Expiring soon: ${deal.expiryDate} (${deal.daysLeft} days left)` 
                : `Expires: ${deal.expiryDate} (${deal.daysLeft} days left)`}
            </div>
          </div>
        )}

        {/* Details Section */}
        {deal.details && (
          <div className="mb-10">
            <h4 className="text-[17px] font-black text-gray-900 mb-3">Details</h4>
            <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
              {deal.details}
            </p>
          </div>
        )}

        {/* Link Section */}
        {deal.link && (
          <div className="mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#0047FF] rounded-full flex items-center justify-center text-white shrink-0">
                <ExternalLink size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-400 font-bold uppercase tracking-tight mb-0.5">Link</p>
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-black text-[#0047FF] truncate pr-4">
                    {deal.link}
                  </p>
                  <Share2 size={16} className="text-gray-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Content Section */}
        {deal.socialContent && deal.socialContent.length > 0 && (
          <div className="mb-12">
            <h4 className="text-[17px] font-black text-gray-900 mb-6">Social content</h4>
            <div className="grid grid-cols-1 gap-6">
              {deal.socialContent.map((asset, idx) => (
                <div key={idx} className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-sm">
                  <img src={asset.poster} className="w-full h-full object-cover" alt="" />
                  
                  {asset.type === 'video' && (
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 rounded flex items-center space-x-2 shadow-lg z-20">
                      <Play size={12} fill="currentColor" />
                      <span className="text-[11px] font-black uppercase tracking-tight">Video</span>
                    </div>
                  )}

                  {/* Artwork Overlay Placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
                    <div className="text-yellow-400 font-black text-center drop-shadow-lg">
                      <p className="text-[16px] leading-tight mb-2 uppercase">CHECK OUT ALL MY</p>
                      <h4 className="text-[36px] font-black bg-black text-white px-3 italic uppercase leading-tight">TOP PICKS!</h4>
                    </div>
                  </div>

                  {/* Share Button Overlay (Save Icon) */}
                  <button className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-2xl border border-gray-100 active:scale-90 transition-transform">
                    <Upload size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions Section */}
        {deal.terms && (
          <div className="pt-8 border-t border-gray-100">
            <h4 className="text-[15px] font-black text-gray-900 mb-4">Terms & Conditions apply</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              {deal.terms}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetail;
