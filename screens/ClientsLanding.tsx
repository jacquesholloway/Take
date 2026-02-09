
import React, { useState, useMemo, useEffect } from 'react';
import ClientAvatarStar from '../components/ClientAvatarStar';
import { Search, ShoppingBag, Heart, ArrowUpDown, Plus, Pencil, Wallet, X } from 'lucide-react';

interface ClientsLandingProps {
  clients: any[];
  activeTab: 'Clients' | 'Orders';
  onTabChange: (tab: 'Clients' | 'Orders') => void;
  onAddClient: () => void;
  onSelectClient: (index: number) => void;
  unassignedCountGlobal: number;
}

type FilterType = 'productRequest' | 'favourites' | 'unpaid' | null;
type SortType = 'AZ' | 'ZA' | 'AmountHigh' | 'AmountLow' | 'Newest' | 'Oldest';

const SORT_OPTIONS: { id: SortType; label: string; headerLabel: string }[] = [
  { id: 'AZ', label: 'Alphabetical (A - Z)', headerLabel: 'A - Z' },
  { id: 'ZA', label: 'Alphabetical (Z - A)', headerLabel: 'Z - A' },
  { id: 'AmountHigh', label: 'Order amount (High to low)', headerLabel: 'High to Low' },
  { id: 'AmountLow', label: 'Order amount (Low to high)', headerLabel: 'Low to High' },
  { id: 'Newest', label: 'Newest', headerLabel: 'Newest' },
  { id: 'Oldest', label: 'Oldest', headerLabel: 'Oldest' },
];

const ClientsLanding: React.FC<ClientsLandingProps> = ({ 
  clients, 
  activeTab, 
  onTabChange, 
  onAddClient,
  onSelectClient,
  unassignedCountGlobal
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [activeSort, setActiveSort] = useState<SortType>('AZ');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const counts = useMemo(() => {
    return {
      productRequest: clients.filter(c => c.productRequests?.length > 0).length,
      favourites: clients.filter(c => c.isFavourite).length,
      unpaid: clients.filter(c => c.unpaidCount > 0).length,
    };
  }, [clients]);

  const filteredAndSortedClients = useMemo(() => {
    let list = [...clients];

    if (activeFilter === 'productRequest') {
      list = list.filter(c => c.productRequests?.length > 0);
    } else if (activeFilter === 'favourites') {
      list = list.filter(c => c.isFavourite);
    } else if (activeFilter === 'unpaid') {
      list = list.filter(c => c.unpaidCount > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.surname.toLowerCase().includes(q) || 
        c.phone.includes(q)
      );
    }

    list.sort((a, b) => {
      switch (activeSort) {
        case 'AZ':
          return a.name.localeCompare(b.name);
        case 'ZA':
          return b.name.localeCompare(a.name);
        case 'AmountHigh':
          return (b.orderAmount || 0) - (a.orderAmount || 0);
        case 'AmountLow':
          return (a.orderAmount || 0) - (b.orderAmount || 0);
        case 'Newest':
          return (b.createdAt || 0) - (a.createdAt || 0);
        case 'Oldest':
          return (a.createdAt || 0) - (b.createdAt || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [clients, activeFilter, searchQuery, activeSort]);

  const groupedClients = useMemo(() => {
    const isAlphabetical = activeSort === 'AZ' || activeSort === 'ZA';
    if (!isAlphabetical) return null;

    const groups: { [key: string]: any[] } = {};
    filteredAndSortedClients.forEach(client => {
      const letter = client.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(client);
    });

    const orderedKeys = Object.keys(groups).sort((a, b) => 
      activeSort === 'AZ' ? a.localeCompare(b) : b.localeCompare(a)
    );

    const orderedGroups: { [key: string]: any[] } = {};
    orderedKeys.forEach(key => {
      orderedGroups[key] = groups[key];
    });

    return orderedGroups;
  }, [filteredAndSortedClients, activeSort]);

  const handleFilterToggle = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleSortSelect = (sortId: SortType) => {
    setActiveSort(sortId);
    setIsSortModalOpen(false);
  };

  const currentSortLabel = SORT_OPTIONS.find(o => o.id === activeSort)?.headerLabel || 'Sort';

  const Header = () => (
    <div className="header-container !pb-0 pt-1 relative transition-all duration-300">
      {/* Collapsible Tabs Section */}
      <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-14 opacity-100 mt-4'}`}>
        <div className="flex justify-center space-x-12 relative px-4">
          <button onClick={() => onTabChange('Clients')} className={`text-[17px] font-bold pb-2 transition-colors relative focus:outline-none ${activeTab === 'Clients' ? 'text-white' : 'text-white/60'}`}>
            Clients
            {activeTab === 'Clients' && <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />}
          </button>
          <button onClick={() => onTabChange('Orders')} className={`text-[17px] font-bold pb-2 transition-colors relative focus:outline-none ${activeTab === 'Orders' ? 'text-white' : 'text-white/60'}`}>
            Orders
            {activeTab === 'Orders' && <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />}
            {unassignedCountGlobal > 0 && (
              <div className="absolute top-0 -right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0047FF]" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar - Remains Sticky */}
      <div className={`px-4 transition-all duration-300 ${isScrolled ? 'mt-2' : 'mt-5'}`}>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client"
            className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all text-[16px]"
          />
        </div>
      </div>

      {/* Filter Pills - Remains Sticky */}
      <div className={`flex items-center space-x-2 px-4 transition-all duration-300 overflow-x-auto no-scrollbar ${isScrolled ? 'mt-3 pb-4' : 'mt-4 pb-0'}`}>
        <FilterPill id="productRequest" label="Product request" count={counts.productRequest} icon={ShoppingBag} />
        <FilterPill id="favourites" label="Favourites" count={counts.favourites} icon={Heart} />
        <FilterPill id="unpaid" label="Unpaid" count={counts.unpaid} icon={Wallet} />
      </div>

      {/* Collapsible Count/Sort Row */}
      <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-14 opacity-100 mt-4 pb-6'}`}>
        <div className="flex items-center justify-between px-4">
          <span className="text-white/70 text-[12px] font-bold">{filteredAndSortedClients.length} clients</span>
          <button 
            onClick={() => setIsSortModalOpen(true)}
            className="flex items-center space-x-1 text-white/70 active:text-white transition-colors focus:outline-none"
          >
            <ArrowUpDown size={12} />
            <span className="text-[12px] font-bold">{currentSortLabel}</span>
          </button>
        </div>
      </div>

      {/* Sawtooth Divider - Collapses on scroll */}
      <div className={`sawtooth-edge transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}></div>
    </div>
  );

  const FilterPill = ({ id, label, count, icon: Icon }: any) => {
    const isActive = activeFilter === id;
    return (
      <button 
        onClick={() => handleFilterToggle(id)}
        className={`flex items-center space-x-2 border rounded-full py-2 px-3 whitespace-nowrap transition-all duration-200 focus:outline-none ${
          isActive 
            ? 'bg-white border-white text-[#0047FF]' 
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
      >
        <Icon size={14} className={isActive ? 'text-[#0047FF]' : 'text-white'} />
        <span className="text-[12px] font-bold">{label} ({count})</span>
      </button>
    );
  };

  const ClientCard: React.FC<{ client: any }> = ({ client }) => {
    const globalIdx = clients.findIndex(c => c.id === client.id);
    return (
      <button
        onClick={() => onSelectClient(globalIdx)}
        className="w-full px-4 py-4 flex items-start space-x-3 active:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 focus:outline-none"
      >
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 text-[#E8F0FE]">
            <ClientAvatarStar />
          </div>
          <span className="relative z-10 text-[14px] font-black text-[#0047FF]">
            {client.initials}
          </span>
          {client.isFavourite && (
            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
              <Heart size={10} className="text-[#EF4444] fill-current" />
            </div>
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-start justify-between">
            <p className="text-[17px] font-black text-gray-900 truncate pr-2 leading-tight">
              {client.name} {client.surname}
            </p>
            {client.unpaidCount > 0 && (
              <span className="text-[11px] font-bold text-[#EF4444] bg-[#FEE2E2] px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {client.unpaidCount} unpaid item{client.unpaidCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[14px] text-gray-500 font-medium mt-0.5">{client.phone}</p>
          
          <div className="flex items-center space-x-2 mt-2 text-[12px] text-gray-500 font-bold uppercase tracking-tight">
            <span>{client.ordersCount || 0} orders</span>
            <span className="text-gray-300">•</span>
            <span>{client.itemsCount || 0} items</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-900 font-black">R {(client.orderAmount || 0).toLocaleString()}</span>
          </div>

          {client.productRequests?.length > 0 && (
            <div className="flex items-center space-x-1.5 mt-3 overflow-hidden">
              <div className="inline-flex items-center space-x-1.5 bg-[#F1F3F4] px-2.5 py-1.5 rounded-[6px] min-w-0">
                <Pencil size={12} className="text-gray-900 flex-shrink-0" />
                <span className="text-[13px] font-bold text-gray-900 truncate">
                  Needs an {client.productRequests[0].title}
                </span>
              </div>
              {client.productRequests.length > 1 && (
                <div className="bg-[#F1F3F4] px-2.5 py-1.5 rounded-[6px] text-[13px] font-bold text-gray-900 flex-shrink-0">
                  +{client.productRequests.length - 1}
                </div>
              )}
            </div>
          )}
        </div>
      </button>
    );
  };

  // EMPTY STATE (LANDING SCREEN)
  if (clients.length === 0 && activeTab === 'Clients') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
        {/* LANDING HEADER */}
        <div className="header-container pt-1 pb-4 relative">
          <div className="mt-4 flex justify-center space-x-12 relative px-4">
            <button onClick={() => onTabChange('Clients')} className="text-[17px] font-black pb-2 text-white relative focus:outline-none">
              Clients
              <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />
            </button>
            <button onClick={() => onTabChange('Orders')} className="text-[17px] font-bold pb-2 text-white/60 relative focus:outline-none">
              Orders
              {unassignedCountGlobal > 0 && (
                <div className="absolute top-0 -right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>
          </div>
          <div className="sawtooth-edge"></div>
        </div>

        {/* EMPTY STATE CONTENT */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-12 pb-40">
          <div className="relative mb-10 w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 text-[#E8F0FE] animate-pulse">
              <ClientAvatarStar />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-8 shadow-2xl border border-blue-50/50">
                <Plus size={54} className="text-[#0047FF] stroke-[4]" />
              </div>
            </div>
          </div>
          
          <h1 className="text-[28px] font-black text-gray-900 mb-4 leading-tight">Clients</h1>
          <h2 className="text-[19px] font-black text-gray-900/60 mb-4">No clients yet</h2>
          <p className="text-[#6B7280] text-[16px] leading-relaxed mb-12 max-w-[280px] font-medium">
            Your client list is empty. Add your first client to start assigning orders and managing requests.
          </p>
          
          <button
            onClick={onAddClient}
            className="w-full max-w-[260px] py-4 bg-[#0047FF] text-white rounded-[14px] font-black text-[17px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all focus:outline-none"
          >
            Add client
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] relative flex flex-col pb-32">
      <div className="sticky top-0 z-[80] bg-[#0047FF]">
        <Header />
      </div>
      <div className="pt-8">
        {filteredAndSortedClients.length > 0 ? (
          groupedClients ? (
            (Object.entries(groupedClients) as [string, any[]][]).map(([letter, groupClients]) => (
              <div key={letter} className="mb-2">
                <div className="px-4 mb-2 pt-2">
                  <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest">{letter}</h3>
                </div>
                <div className="bg-white">
                  {groupClients.map((client) => <ClientCard key={client.id} client={client} />)}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white">
              {filteredAndSortedClients.map((client) => <ClientCard key={client.id} client={client} />)}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-900 font-bold text-[17px] mb-2">No clients found</p>
            <p className="text-gray-500 text-[14px] leading-relaxed max-w-[240px]">
              No clients found matching your search or filter.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-[110px] right-4 z-50">
        <button
          onClick={onAddClient}
          className="flex items-center space-x-2 bg-[#0047FF] text-white px-5 py-4 rounded-full shadow-2xl shadow-blue-400 active:scale-95 transition-all focus:outline-none"
        >
          <Plus size={24} strokeWidth={3} />
          <span className="text-[16px] font-bold pr-1">Add client</span>
        </button>
      </div>

      {isSortModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setIsSortModalOpen(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 pb-12 pt-6 shadow-2xl">
            <div className="flex items-center justify-between px-6 mb-8">
              <button 
                onClick={() => setIsSortModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full active:bg-gray-200 transition-colors focus:outline-none"
              >
                <X size={18} />
              </button>
              <h2 className="text-[17px] font-bold text-gray-900">Sort by</h2>
              <div className="w-8" />
            </div>

            <div className="space-y-0.5">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSortSelect(option.id)}
                  className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    activeSort === option.id ? 'border-[#0047FF]' : 'border-gray-300'
                  }`}>
                    {activeSort === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0047FF]" />}
                  </div>
                  <span className={`text-[15px] font-medium text-gray-900 ${activeSort === option.id ? 'font-bold' : ''}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsLanding;
