
import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

interface AddProductRequestProps {
  onBack: () => void;
  onAdd: (product: { title: string; quantity: number; notes: string; link: string }) => void;
}

const AddProductRequest: React.FC<AddProductRequestProps> = ({ onBack, onAdd }) => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');

  const isFormValid = title.trim().length > 0;

  const handleAdd = () => {
    if (isFormValid) {
      onAdd({ title, quantity, notes, link });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 relative">
      {/* Header */}
      <div className="flex items-center px-6 pt-12 pb-4 relative border-b border-gray-50">
        <button 
          onClick={onBack} 
          className="absolute left-6 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full focus:outline-none"
        >
          <X size={18} />
        </button>
        <h1 className="w-full text-center text-[17px] font-bold text-gray-900">Add product request</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-40">
        <div className="space-y-6">
          {/* Title of product */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Title of product</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of product"
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 focus:outline-none transition-all ${
                title ? 'border-[#0047FF] ring-2 ring-[#0047FF]/20' : 'border-gray-200'
              }`}
            />
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none ${
                  quantity <= 1 ? 'bg-gray-100 text-gray-300' : 'bg-[#0047FF] text-white'
                }`}
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 max-w-[100px] h-12 border border-gray-200 rounded-lg flex items-center justify-center text-[17px] font-black text-gray-900">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-[#0047FF] text-white flex items-center justify-center focus:outline-none"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Note budget, brand etc"
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] transition-all resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Product Link */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Product Link (Optional)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Product Link"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0047FF]/20 focus:border-[#0047FF] transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 w-full max-w-[390px] mx-auto z-50">
        <button
          disabled={!isFormValid}
          onClick={handleAdd}
          className={`w-full py-4 rounded-[8px] font-black text-[16px] transition-all ${
            isFormValid 
              ? 'bg-[#0047FF] text-white shadow-xl shadow-blue-500/10 active:scale-[0.98]' 
              : 'bg-[#F1F3F4] text-gray-400 cursor-not-allowed'
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddProductRequest;
