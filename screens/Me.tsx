
import React, { useState, useRef, useMemo } from 'react';
import { Settings, Edit2, Trophy, ChevronDown, Package, Users, ShoppingBag, Phone, Info, X, Check, Lock, Plus, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import ClientAvatarStar from '../components/ClientAvatarStar';

interface MeProps {
  salesGoal: number;
  onUpdateSalesGoal: (goal: number) => void;
  onOpenSettings: () => void;
  selectedMonthIdx: number;
  onMonthChange: (idx: number) => void;
}

const PERFORMANCE_DATA = [
  {
    month: 'December',
    year: 2025,
    absoluteCommission: 2500,
    data: [200, 200, 450, 450, 450, 700, 700, 700, 850, 1000, 1100, 1250, 1250, 1300, 1500, 1700, 2000, 2500, 2500, 2500, 2500, 2500, 2500, 2500]
  },
  {
    month: 'November',
    year: 2025,
    absoluteCommission: 2000,
    data: [100, 150, 200, 300, 500, 400, 450, 600, 800, 900, 1000, 950, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2000, 2000]
  },
  {
    month: 'October',
    year: 2025,
    absoluteCommission: 1250,
    data: [50, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1250, 1250, 1250, 1250, 1250, 1250, 1250]
  },
  {
    month: 'September',
    year: 2025,
    absoluteCommission: 3000,
    data: [300, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 2900, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000]
  },
  {
    month: 'August',
    year: 2025,
    absoluteCommission: 1800,
    data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1800, 1800, 1800, 1800, 1800, 1800]
  }
];

const TierIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v18M18 3v18M6 7h12M6 12h12M6 17h12" />
  </svg>
);

const Me: React.FC<MeProps> = ({ salesGoal, onUpdateSalesGoal, onOpenSettings, selectedMonthIdx, onMonthChange }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMonthSheetOpen, setIsMonthSheetOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState(salesGoal.toString());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, day: number, value: number } | null>(null);

  const activeMonth = PERFORMANCE_DATA[selectedMonthIdx];
  const previousMonth = PERFORMANCE_DATA[selectedMonthIdx + 1] || { absoluteCommission: 0, month: 'Previous' };
  
  const diffValue = activeMonth.absoluteCommission - previousMonth.absoluteCommission;
  const isUp = diffValue > 0;
  const isDown = diffValue < 0;
  const isNeutral = diffValue === 0;
  const absoluteDiff = Math.abs(diffValue);

  const dataPoints = activeMonth.data;

  const CHART_HEIGHT = 200;
  const CHART_WIDTH = 340;
  const GRAPH_X_OFFSET = 25;
  const DRAW_WIDTH = CHART_WIDTH - GRAPH_X_OFFSET;

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const clientX = ('touches' in e ? e.touches[0].clientX : e.clientX);
    const x = clientX - rect.left;
    const normalizedX = x - (GRAPH_X_OFFSET * (rect.width / CHART_WIDTH));
    const clampedX = Math.max(0, Math.min(normalizedX, DRAW_WIDTH * (rect.width / CHART_WIDTH)));
    const index = Math.min(Math.floor((clampedX / (DRAW_WIDTH * (rect.width / CHART_WIDTH))) * dataPoints.length), dataPoints.length - 1);
    const step = DRAW_WIDTH / (dataPoints.length - 1);
    const finalX = GRAPH_X_OFFSET + index * step;
    
    setTooltip({
      x: finalX,
      y: CHART_HEIGHT - (dataPoints[index] / 3000) * CHART_HEIGHT,
      day: index + 1,
      value: dataPoints[index]
    });
  };

  const handleOpenEdit = () => {
    setTempGoal(salesGoal.toString());
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    const newGoal = parseInt(tempGoal, 10);
    if (!isNaN(newGoal)) {
      onUpdateSalesGoal(newGoal);
      setToast({ message: 'Sales goal successfully set', type: 'success' });
      setIsEditModalOpen(false);
    }
  };

  const svgPath = useMemo(() => {
    const step = DRAW_WIDTH / (dataPoints.length - 1);
    const points = dataPoints.map((val, i) => {
      const x = GRAPH_X_OFFSET + i * step;
      const y = CHART_HEIGHT - (val / 3000) * CHART_HEIGHT;
      return `${x},${y}`;
    });
    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L ${CHART_WIDTH},${CHART_HEIGHT} L ${GRAPH_X_OFFSET},${CHART_HEIGHT} Z`;
    return { linePath, areaPath };
  }, [dataPoints, DRAW_WIDTH, GRAPH_X_OFFSET]);

  return (
    <div className="bg-[#F9F9F9] min-h-screen pb-40">
      {/* Toast */}
      {toast && (
        <div className="fixed top-8 left-0 right-0 z-[300] flex justify-center px-6 pointer-events-none">
          <div className={`${toast.type === 'success' ? 'bg-[#00965E]' : 'bg-[#EF4444]'} text-white px-5 py-2.5 rounded-full flex items-center space-x-3 shadow-xl pointer-events-auto border border-white/10`}>
            {toast.type === 'success' ? <Check size={14} strokeWidth={4} /> : <X size={14} strokeWidth={4} />}
            <span className="text-[14px] font-black">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="px-6 pt-6 flex flex-col items-center">
        <div className="w-full flex justify-end mb-4">
          <button onClick={onOpenSettings} className="p-2 text-gray-900 active:bg-gray-50 transition-colors">
            <Settings size={22} />
          </button>
        </div>

        <div className="relative mb-4">
          <img 
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=300&auto=format&fit=crop" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
            alt="Profile" 
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0047FF] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm active:scale-95 transition-all">
            <Edit2 size={14} />
          </button>
        </div>

        <div className="flex items-center space-x-1.5 text-gray-400 mb-2">
          <Trophy size={14} />
          <span className="text-[13px] font-bold">Ranked 14th</span>
        </div>

        <h1 className="text-[28px] font-black text-gray-900 mb-2">Palesa Thsabalala</h1>
        
        {/* Starling Banner */}
        <div className="relative mb-8">
          <div className="bg-[#C68D5F] text-white px-4 py-1.5 flex items-center justify-center relative z-10">
            <span className="text-[12px] font-black tracking-widest">Starling</span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex space-x-[50px] z-0">
             <div className="w-4 h-4 bg-[#A0714B] rotate-45 transform"></div>
             <div className="w-4 h-4 bg-[#A0714B] rotate-45 transform"></div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 w-full mb-10">
          <div className="flex items-center space-x-1.5">
            <Users size={20} className="text-gray-900" strokeWidth={2.5} />
            <p className="text-[15px] font-black text-gray-900">54 <span className="text-gray-900 font-bold ml-0.5">clients</span></p>
          </div>
          <div className="flex items-center space-x-1.5">
            <Package size={20} className="text-gray-900" strokeWidth={2.5} />
            <p className="text-[15px] font-black text-gray-900">
              542 <span className="text-gray-900 font-bold ml-0.5">orders</span>
              <span className="text-gray-300 mx-1.5 font-normal">·</span>
              1,241 <span className="text-gray-900 font-bold ml-0.5">items</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Tier Progression Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <TierIcon />
              <span className="text-[16px] font-black text-gray-900/60 tracking-tight">Tier progression</span>
            </div>
            <button className="text-[#0047FF] text-[15px] font-black tracking-tight">View more</button>
          </div>
          
          <div className="flex justify-between items-start pb-4">
            <div className="flex flex-col items-center">
              <div className="relative w-[68px] h-[78px] flex flex-col items-center mb-3">
                <div className="absolute inset-0 bg-[#C68D5F] rounded-t-2xl rounded-b-[40%] flex items-center justify-center shadow-md">
                  <div className="w-10 h-10 text-[#8E5E3D] flex items-center justify-center opacity-40">
                    <Trophy size={28} fill="currentColor" strokeWidth={0} />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-[#8E5E3D] scale-110">
                     <Trophy size={28} fill="currentColor" strokeWidth={0} />
                   </div>
                </div>
              </div>
              <div className="bg-[#EADACB] text-[#8E5E3D] px-2 py-0.5 rounded-[2px] text-[10px] font-black tracking-widest mt-1">
                Starling
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-[68px] h-[78px] bg-[#F1F6FE] rounded-t-2xl rounded-b-[40%] flex flex-col items-center justify-center border border-blue-50/50 shadow-sm">
                 <Lock size={14} className="text-[#D0DDFE] mb-1" />
                 <span className="text-[12px] font-black text-[#D0DDFE]">R10k</span>
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0047FF]/5 rounded-r-full"></div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-[68px] h-[78px] bg-[#E8E8E8] rounded-t-2xl rounded-b-[40%] flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                 <Lock size={14} className="text-[#B8B8B8] mb-1" />
                 <span className="text-[12px] font-black text-[#B8B8B8]">R15k</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-[68px] h-[78px] bg-[#D8D8D8] rounded-t-2xl rounded-b-[40%] flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                 <Lock size={14} className="text-[#989898] mb-1" />
                 <span className="text-[12px] font-black text-[#989898]">R20k</span>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-black/5 rounded-l-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Section */}
        <div className="bg-white rounded-[24px] py-12 px-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center space-x-2 text-gray-400 mb-4">
              <ShoppingBag size={18} />
              <span className="text-[13px] font-bold text-gray-900 tracking-tight">Monthly estimated commission</span>
            </div>
            <button 
              onClick={() => setIsMonthSheetOpen(true)}
              className="flex items-center space-x-2 bg-[#F1F3F4] px-5 py-2 rounded-full mb-8 active:scale-95 transition-transform focus:outline-none"
            >
              <span className="text-[14px] font-black text-gray-900">{activeMonth.month}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {/* PRIMARY VALUE - ABSOLUTE */}
            <h2 className="text-[42px] font-black text-gray-900 leading-none">± R {activeMonth.absoluteCommission.toLocaleString()}.00</h2>
            
            {/* COMPARATIVE LINE */}
            <div className="flex items-center space-x-2 mt-4">
              {isUp && (
                <div className="w-5 h-5 rounded-full bg-[#00965E] flex items-center justify-center text-white">
                  <ArrowUp size={12} strokeWidth={4} />
                </div>
              )}
              {isDown && (
                <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white">
                  <ArrowDown size={12} strokeWidth={4} />
                </div>
              )}
              {isNeutral && (
                <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white">
                  <Minus size={12} strokeWidth={4} />
                </div>
              )}

              <span className={`text-[14px] font-black tracking-tight ${
                isUp ? 'text-[#00965E]' : 
                isDown ? 'text-[#EF4444]' : 
                'text-gray-400'
              }`}>
                {isNeutral ? (
                  `No change vs. ${previousMonth.month.substring(0, 3)}`
                ) : (
                  `${isUp ? '+' : '–'} R ${absoluteDiff.toLocaleString()}.00 vs. ${previousMonth.month.substring(0, 3)}`
                )}
              </span>
            </div>
          </div>

          <div 
            className="relative h-[200px] w-full overflow-visible touch-none"
            ref={chartRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
            onTouchMove={handleMouseMove}
            onTouchEnd={() => setTooltip(null)}
          >
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1={GRAPH_X_OFFSET} y1={CHART_HEIGHT - (i * 66)} x2={CHART_WIDTH} y2={CHART_HEIGHT - (i * 66)} stroke="#F1F3F4" strokeDasharray="4 4" />
              ))}
              <text x="0" y="12" className="text-[9px] fill-gray-400 font-bold">R3k</text>
              <text x="0" y="78" className="text-[9px] fill-gray-400 font-bold">R2k</text>
              <text x="0" y="144" className="text-[9px] fill-gray-400 font-bold">R1k</text>
              <text x="0" y="195" className="text-[9px] fill-gray-400 font-bold">R0</text>
              
              <path d={svgPath.areaPath} fill="url(#gradient)" className="opacity-20 transition-all duration-500 ease-in-out" />
              <path d={svgPath.linePath} fill="none" stroke="#0047FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500 ease-in-out" />
              
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0047FF" className="transition-all duration-500" />
                  <stop offset="100%" stopColor="#0047FF" stopOpacity="0" className="transition-all duration-500" />
                </linearGradient>
              </defs>

              {tooltip && (
                <>
                  <line x1={tooltip.x} y1="0" x2={tooltip.x} y2={CHART_HEIGHT} stroke="#0047FF" strokeWidth="1.5" />
                  <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#0047FF" stroke="white" strokeWidth="2" />
                </>
              )}
            </svg>
            
            {tooltip && (
              <div 
                className="absolute bg-white px-3 py-2 rounded-lg shadow-2xl border border-gray-100 z-50 pointer-events-none -translate-x-1/2 -translate-y-[130%] animate-in fade-in zoom-in-90 duration-150"
                style={{ left: (tooltip.x / CHART_WIDTH) * 100 + '%', top: (tooltip.y / CHART_HEIGHT) * 100 + '%' }}
              >
                <p className="text-[10px] font-bold text-gray-400 tracking-tight mb-1">{tooltip.day} {activeMonth.month.substring(0, 3)}</p>
                <p className="text-[14px] font-black text-gray-900 whitespace-nowrap">± R {tooltip.value.toLocaleString()}</p>
              </div>
            )}

            <div className="flex justify-between mt-4 px-2 pl-[30px]">
              <span className="text-[10px] font-bold text-gray-400">5 {activeMonth.month.substring(0, 3)}</span>
              <span className="text-[10px] font-bold text-gray-400">15 {activeMonth.month.substring(0, 3)}</span>
              <span className="text-[10px] font-bold text-gray-400">25 {activeMonth.month.substring(0, 3)}</span>
            </div>
          </div>
        </div>

        {/* Suggested sales goal Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 text-gray-400">
              <ShoppingBag size={16} />
              <span className="text-[13px] font-bold text-gray-900 tracking-tight">Suggested sales goal</span>
            </div>
            <button onClick={handleOpenEdit} className="text-[#0047FF] text-[15px] font-black flex items-center space-x-1 focus:outline-none">
              <span>Edit</span>
              <Edit2 size={12} />
            </button>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <p className="text-[11px] text-gray-500 font-medium mb-1">{activeMonth.month} sales value</p>
              <p className="text-[28px] font-black text-gray-900 leading-tight">R1,250.00</p>
              <p className="text-[14px] text-gray-400 font-medium">of R{salesGoal.toLocaleString()}</p>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 overflow-visible" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#0047FF]" strokeDasharray="176" strokeDashoffset={176 - (176 * Math.min(1250 / salesGoal, 1))} />
              </svg>
              <span className="relative z-10 text-[14px] font-black text-gray-900 leading-none">{Math.round((1250 / salesGoal) * 100)}%</span>
            </div>
          </div>
          <div className="bg-[#E8F0FE] p-4 rounded-xl flex items-start space-x-3">
            <Info size={16} className="text-[#0047FF] mt-0.5" />
            <p className="text-[14px] text-gray-900 font-medium leading-relaxed">
              Only <span className="font-black">R{(salesGoal - 1250 > 0 ? salesGoal - 1250 : 0).toLocaleString()}</span> away from hitting your sales goal. Keep going Palesa!
            </p>
          </div>
        </div>

        {/* Community manager Section */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                className="w-12 h-12 rounded-full object-cover" 
                alt="Manager" 
              />
              <div>
                <p className="text-[11px] text-gray-500 font-medium tracking-tight">Community manager</p>
                <p className="text-[16px] font-black text-gray-900">Prue Matsepe</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center active:scale-95 transition-all">
              <Phone size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Month Selection Sheet */}
      {isMonthSheetOpen && (
        <div className="fixed inset-0 z-[500] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setIsMonthSheetOpen(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 flex flex-col shadow-2xl overflow-hidden pb-12">
            <div className="flex items-center justify-between px-6 pt-10 pb-6">
              <button onClick={() => setIsMonthSheetOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full focus:outline-none active:bg-gray-200">
                <X size={20} />
              </button>
              <h2 className="text-[17px] font-black text-gray-900">Select month</h2>
              <div className="w-10" />
            </div>
            <div className="px-2 space-y-1 overflow-y-auto no-scrollbar max-h-[400px]">
              {PERFORMANCE_DATA.map((item, idx) => (
                <button
                  key={item.month}
                  onClick={() => { onMonthChange(idx); setIsMonthSheetOpen(false); }}
                  className="w-full flex items-center justify-between px-6 py-4 active:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className={`text-[15px] font-bold ${selectedMonthIdx === idx ? 'text-[#0047FF]' : 'text-gray-900'}`}>
                    {item.month} {item.year}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedMonthIdx === idx ? 'border-[#0047FF] bg-[#0047FF]' : 'border-gray-200'
                  }`}>
                    {selectedMonthIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit goal Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 flex flex-col shadow-2xl overflow-hidden pb-12">
            <div className="flex items-center justify-between px-6 pt-10 pb-6">
              <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full focus:outline-none active:bg-gray-200"><X size={20} /></button>
              <h2 className="text-[17px] font-black text-gray-900">Edit goal</h2>
              <div className="w-10" />
            </div>
            <div className="px-6 flex flex-col items-center">
              <div className="w-full text-center py-10">
                <div className="flex items-center justify-center text-[48px] font-black text-gray-900">
                  <span className="mr-3">R</span>
                  <input
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
                  tempGoal && tempGoal !== '0' ? 'bg-[#0047FF] text-white shadow-lg active:scale-[0.98]' : 'bg-[#EBF1FF] text-[#0047FF]/40 cursor-not-allowed'
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

export default Me;
