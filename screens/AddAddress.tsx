
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, MapPin, Edit2, ChevronDown, Loader2 } from 'lucide-react';

interface AddAddressProps {
  onBack: () => void;
  onAdd: (address: {
    street: string;
    complex: string;
    suburb: string;
    city: string;
    province: string;
    postalCode: string;
  }) => void;
}

interface MockAddress {
  full: string;
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape"
];

// DATA STAGES
const FULL_RESULTS: MockAddress[] = [
  { full: "221 Utopia Road, Tokai, Cape Town, Western Cape, 7965", street: "221 Utopia Road", suburb: "Tokai", city: "Cape Town", province: "Western Cape", postalCode: "7965" },
  { full: "221 Utolla Street, Silverlakes, Pretoria, Gauteng, 2991", street: "221 Utolla Street", suburb: "Silverlakes", city: "Pretoria", province: "Gauteng", postalCode: "2991" },
  { full: "221 Utorah Street, Hatfield, Pretoria, Gauteng, 2995", street: "221 Utorah Street", suburb: "Hatfield", city: "Pretoria", province: "Gauteng", postalCode: "2995" }
];

const STAGE_2_HINTS = [
  { label: "221 U… Road · Cape Town" },
  { label: "221 Ut… Street · Pretoria" }
];

const STAGE_1_GENERIC = [
  "Searching nearby streets…",
  "Keep typing to refine address",
  "Results will appear as you type"
];

const AddAddress: React.FC<AddAddressProps> = ({ onBack, onAdd }) => {
  const [formData, setFormData] = useState({
    street: '',
    complex: '',
    suburb: '',
    city: '',
    province: 'Western Cape',
    postalCode: ''
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

  // Focus input immediately to bring up keyboard
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchStage = useMemo(() => {
    const len = formData.street.length;
    if (len === 0) return 0;
    if (len >= 1 && len <= 2) return 1;
    if (len >= 3 && len <= 5) return 2;
    if (len >= 6) return 3;
    return 0;
  }, [formData.street]);

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, street: val }));
    setShowSuggestions(val.length > 0);
    // User is refining/typing, selection state resets unless they specifically picked one
    setHasSelectedSuggestion(false);
  };

  const selectSuggestion = (s: MockAddress) => {
    // Selection auto-populates in-place, does NOT close the sheet
    setFormData({
      ...formData,
      street: s.street,
      suburb: s.suburb,
      city: s.city,
      province: s.province,
      postalCode: s.postalCode
    });
    setShowSuggestions(false);
    setHasSelectedSuggestion(true);
  };

  const handleManualSave = () => {
    if (isFormValid) {
      onAdd(formData);
    }
  };

  // CTA disabled until a full address is selected
  const isFormValid = hasSelectedSuggestion && formData.street && formData.suburb && formData.city && formData.postalCode;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white animate-in slide-in-from-bottom duration-300 overflow-hidden w-full max-w-[390px] mx-auto shadow-2xl">
      {/* Sticky Header */}
      <div className="sticky top-0 z-[220] bg-white pt-12 pb-4 px-6 border-b border-gray-100 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full active:scale-90 transition-transform focus:outline-none"
        >
          <X size={20} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-black text-gray-900">Add address</h1>
        <div className="w-10" />
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="px-6 pt-6 space-y-8">
          
          {/* Street Address Input */}
          <div className="space-y-2 relative">
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-wider">Street Address</label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={formData.street}
                onChange={handleStreetChange}
                placeholder="Search for address"
                className={`w-full pl-11 pr-4 py-4 bg-white border-2 rounded-2xl text-gray-900 font-bold text-[16px] focus:outline-none shadow-sm transition-all ${
                  showSuggestions ? 'border-[#0047FF]' : 'border-gray-200'
                }`}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${showSuggestions ? 'text-[#0047FF]' : 'text-gray-400'}`} size={20} />
            </div>
            
            <div className="flex justify-end">
              <span className="text-[10px] text-gray-400">powered by <span className="font-bold text-[#4285F4]">G</span><span className="font-bold text-[#EA4335]">o</span><span className="font-bold text-[#FBBC05]">o</span><span className="font-bold text-[#4285F4]">g</span><span className="font-bold text-[#34A853]">l</span><span className="font-bold text-[#EA4335]">e</span></span>
            </div>

            {/* PROGRESSIVE SUGGESTIONS OVERLAY */}
            {showSuggestions && searchStage > 0 && !hasSelectedSuggestion && (
              <div className="absolute top-[105px] left-0 right-0 z-[230] bg-white border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* Keep my address - Shown only while typing AND no selection made */}
                <button 
                  onClick={() => setShowSuggestions(false)}
                  className="w-full px-5 py-5 flex items-start space-x-3 hover:bg-gray-50 text-left border-b border-gray-50 transition-colors"
                >
                  <Edit2 size={22} className="text-gray-900 mt-1 shrink-0" />
                  <div>
                    <p className="text-[11px] text-gray-400 font-black uppercase mb-1">Keep my address as I entered it:</p>
                    <p className="text-[16px] font-black text-gray-900">{formData.street}</p>
                  </div>
                </button>

                <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                  {/* STAGE 1: Generic messages */}
                  {searchStage === 1 && STAGE_1_GENERIC.map((msg, i) => (
                    <div key={i} className="px-6 py-5 flex items-center space-x-4 border-b border-gray-50 last:border-0 opacity-60">
                      <Loader2 size={18} className="text-gray-400 animate-spin shrink-0" />
                      <span className="text-[15px] font-bold text-gray-500 italic">{msg}</span>
                    </div>
                  ))}

                  {/* STAGE 2: Hints */}
                  {searchStage === 2 && STAGE_2_HINTS.map((hint, i) => (
                    <div key={i} className="px-6 py-5 flex items-center space-x-4 border-b border-gray-50 last:border-0 opacity-80">
                      <MapPin size={22} className="text-gray-300 shrink-0" />
                      <span className="text-[15px] font-bold text-gray-400">{hint.label}</span>
                    </div>
                  ))}

                  {/* STAGE 3: Full Results */}
                  {searchStage === 3 && FULL_RESULTS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(s)}
                      className="w-full px-6 py-5 flex items-start space-x-4 hover:bg-blue-50/50 active:bg-blue-50 text-left border-b border-gray-50 last:border-0 transition-all group"
                    >
                      <MapPin size={24} className="text-[#0047FF] mt-1 shrink-0 group-active:scale-110 transition-transform" />
                      <p className="text-[16px] font-bold text-gray-900 leading-snug">
                        {s.full}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Fields */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-wider">Complex / building (Optional)</label>
              <input
                type="text"
                value={formData.complex}
                onChange={(e) => setFormData({...formData, complex: e.target.value})}
                placeholder="Complex or building name, unit number or floor"
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold text-[15px] focus:outline-none focus:border-[#0047FF] transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-wider">Suburb</label>
              <input
                type="text"
                value={formData.suburb}
                onChange={(e) => setFormData({...formData, suburb: e.target.value})}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold text-[15px] focus:outline-none focus:border-[#0047FF] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-wider">City / town</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold text-[15px] focus:outline-none focus:border-[#0047FF] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-wider">Province</label>
              <div className="relative">
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold text-[15px] focus:outline-none focus:border-[#0047FF] transition-all appearance-none"
                >
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-wider">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 font-bold text-[15px] focus:outline-none focus:border-[#0047FF] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-[250] w-full max-w-[390px] mx-auto shadow-[0_-15px_40px_rgba(0,0,0,0.06)]">
        <button
          disabled={!isFormValid}
          onClick={handleManualSave}
          className={`w-full py-[18px] rounded-2xl font-black text-[17px] transition-all duration-300 transform ${
            isFormValid 
              ? 'bg-[#0047FF] text-white shadow-2xl shadow-blue-500/40 active:scale-[0.98]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAddress;
