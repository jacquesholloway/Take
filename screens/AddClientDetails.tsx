
import React, { useState, useMemo } from 'react';
import { X, ChevronDown } from 'lucide-react';
import ClientAvatarStar from '../components/ClientAvatarStar';

interface AddClientDetailsProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const AddClientDetails: React.FC<AddClientDetailsProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    referredBy: 'No clients added',
    notes: ''
  });

  const initials = useMemo(() => {
    const firstInitial = formData.name.trim().charAt(0).toUpperCase();
    const lastInitial = formData.surname.trim().charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }, [formData.name, formData.surname]);

  const isFormValid = formData.name.trim() !== '' && 
                      formData.surname.trim() !== '' && 
                      formData.phone.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    if (isFormValid) {
      onSave({ ...formData, initials });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-[100] bg-white flex items-center px-6 pt-12 pb-4 border-b border-gray-50">
        <button 
          onClick={onBack} 
          className="absolute left-6 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={18} />
        </button>
        <h1 className="w-full text-center text-[17px] font-bold text-gray-900">Add client</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32 no-scrollbar">
        {/* Avatar Placeholder */}
        <div className="flex justify-center mb-10">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 text-[#E8F0FE]">
              <ClientAvatarStar />
            </div>
            <span className="relative z-10 text-[24px] font-black text-[#0047FF]">
              {initials || ""}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#6B7280]">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none transition-all"
            />
          </div>

          {/* Surname */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#6B7280]">Surname</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none transition-all"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#6B7280]">Phone number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none transition-all"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#6B7280]">Email address (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=""
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none transition-all"
            />
          </div>

          {/* Referred By */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#6B7280]">Referred by (Optional)</label>
            <div className="relative">
              <div className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-[#9CA3AF] flex items-center justify-between">
                <span className="text-[15px]">{formData.referredBy}</span>
                <ChevronDown size={18} className="text-[#9CA3AF]" />
              </div>
            </div>
          </div>

          {/* Client Notes */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#6B7280]">Client notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder=""
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none transition-all resize-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA replacing nav */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[100] w-full max-w-[390px] mx-auto shadow-[0_-4px_10px_rgba(0,0,0,0.03)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="p-6">
          <button
            disabled={!isFormValid}
            onClick={handleAddClient}
            className={`w-full py-4 rounded-[6px] font-bold text-[15px] transition-all ${
              isFormValid 
                ? 'bg-[#0047FF] text-white shadow-lg active:scale-[0.98]' 
                : 'bg-[#0047FF] text-white opacity-40 cursor-not-allowed'
            }`}
          >
            Add client
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientDetails;
