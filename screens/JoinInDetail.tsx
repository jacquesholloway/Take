import React from 'react';
import { X, Share2, Download, ExternalLink, Play } from 'lucide-react';

interface JoinInDetailProps {
  post: {
    id: string;
    type: string;
    title: string;
    dateLabel: string;
    image: string;
    details?: string;
    link?: string;
    socialContent?: { type: 'video' | 'image'; poster: string }[];
    terms?: string;
  };
  onClose: () => void;
}

const JoinInDetail: React.FC<JoinInDetailProps> = ({ post, onClose }) => {
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
          {post.title}
        </h1>
        
        <div className="w-10" />
      </div>

      {/* Hero Image Section */}
      <div className="w-full relative aspect-[1/1.1] overflow-hidden">
        <img src={post.image} className="w-full h-full object-cover" alt="" />
        {/* The artwork elements seen in the reference */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6">
           <div className="bg-white rounded-full p-2 mb-2">
             <div className="text-[#0047FF] font-black text-[10px] leading-tight text-center">
               Takealot<br/>Personal<br/>Shopper
             </div>
           </div>
           
           <div className="bg-[#1C1C1E] p-4 text-center border-2 border-yellow-400 max-w-[240px]">
              <h4 className="text-white text-[24px] font-black uppercase tracking-tighter italic">World Smile Day</h4>
              <div className="flex items-center justify-center space-x-2 my-1">
                 <div className="w-2 h-2 rotate-45 bg-yellow-400" />
                 <span className="text-yellow-400 text-[16px] font-black">Big Spender</span>
                 <div className="w-2 h-2 rotate-45 bg-yellow-400" />
              </div>
              <h3 className="text-white text-[28px] font-black uppercase tracking-tighter italic leading-none">Competition</h3>
           </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 px-6 pt-6 pb-20">
        {/* Actions Row */}
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

        {/* Title & Metadata */}
        <h2 className="text-[28px] font-black text-gray-900 leading-tight mb-4">
          {post.title}
        </h2>
        
        <div className="inline-block mb-10">
          <div className="px-4 py-2 bg-[#F1F3F4] text-gray-900 rounded-lg text-[13px] font-black">
            When: {post.dateLabel}
          </div>
        </div>

        {/* Link Section */}
        {post.link && (
          <div className="mb-12">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-[#0047FF] rounded-full flex items-center justify-center text-white shrink-0">
                <ExternalLink size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-400 font-bold uppercase tracking-tight mb-0.5">Link</p>
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-black text-gray-900 truncate pr-4">
                    {post.link}
                  </p>
                  <Share2 size={16} className="text-gray-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Content Section */}
        {post.socialContent && post.socialContent.length > 0 && (
          <div className="mb-12">
            <h4 className="text-[17px] font-black text-gray-900 mb-6">Social content</h4>
            <div className="grid grid-cols-2 gap-4">
              {post.socialContent.map((asset, idx) => (
                <div key={idx} className="relative aspect-[4/5] rounded-[16px] overflow-hidden shadow-sm border border-gray-100">
                  <img src={asset.poster} className="w-full h-full object-cover" alt="" />
                  
                  {asset.type === 'video' && (
                    <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded flex items-center space-x-1 shadow-lg">
                      <Play size={10} fill="currentColor" />
                      <span className="text-[9px] font-black uppercase">Video</span>
                    </div>
                  )}

                  {/* Empty state texture seen in image */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

                  {/* Upload/Share Button */}
                  <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-md border border-gray-100 active:scale-95 transition-transform">
                    <Share2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details Section (Restyled as requested) */}
        <div className="pt-8 border-t border-gray-100 mb-8">
          <h4 className="text-[15px] font-black text-gray-900 mb-4">Details</h4>
          <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
            {post.details || "Spend more than R1500 on a single order and post a photo on instagram tagging Takealot in the photo."}
          </p>
        </div>

        {/* Terms & Conditions Section */}
        <div className="pt-8 border-t border-gray-100">
          <h4 className="text-[15px] font-black text-gray-900 mb-4">Terms & Conditions apply</h4>
          <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
            {post.terms || "Terms and conditions apply to this participation. Please refer to the official competition guidelines for more information."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinInDetail;