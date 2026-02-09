
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ArrowUpDown, MoreHorizontal, CheckCircle2, Pencil, Plus, Check, X, UserX, UserPlus, Wallet, AlertCircle, Users as UsersIcon, Copy, ShoppingBag } from 'lucide-react';
import AssignClientSheet from '../components/AssignClientSheet';
import ClientAvatarStar from '../components/ClientAvatarStar';

interface OrdersLandingProps {
  orders: any[];
  clients: any[];
  activeTab: 'Clients' | 'Orders';
  onTabChange: (tab: 'Clients' | 'Orders') => void;
  onAssignClient: (orderId: string, itemId: string, clientId: number | null) => void;
  onUpdateItemStatus: (itemIds: string[], isPaid: boolean) => void;
  onBatchAssign: (itemIds: string[], clientId: number | null) => void;
  onAddClientRequest: (orderId: string, itemId: string) => void;
  toastMessage?: string | null;
  onClearToast: () => void;
  unassignedCountGlobal: number;
  selectedFilterClientId: number | null;
  setSelectedFilterClientId: (id: number | null) => void;
  filterUnassigned: boolean;
  setFilterUnassigned: (active: boolean) => void;
}

type OrderSortType = 'Most recent' | 'Order value (High to low)' | 'Order value (Low to high)' | 'Item price (High to low)' | 'Item price (Low to high)';

const SORT_OPTIONS: { id: OrderSortType; label: string }[] = [
  { id: 'Most recent', label: 'Most recent' },
  { id: 'Order value (High to low)', label: 'Order value (High to low)' },
  { id: 'Order value (Low to high)', label: 'Order value (Low to high)' },
  { id: 'Item price (High to low)', label: 'Item price (High to low)' },
  { id: 'Item price (Low to high)', label: 'Item price (Low to high)' },
];

const ReplaceIllustration = () => (
  <div className="flex justify-center mb-6">
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 text-[#E8F0FE] transform rotate-12 scale-110">
        <ClientAvatarStar />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center -space-x-3">
          <div className="bg-white rounded-full p-2 shadow-sm border border-gray-100 opacity-60">
            <UserX size={20} className="text-gray-400" />
          </div>
          <div className="bg-white rounded-full p-3.5 shadow-md border border-blue-50 z-10">
            <UserPlus size={28} className="text-[#0047FF]" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ type: string }> = ({ type }) => {
  const isPaid = type === 'Paid';
  const isUnpaid = type === 'Unpaid';
  const isProcessing = type === 'Processing';
  return (
    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
      isPaid ? 'bg-[#E6F4EA] text-[#00965E]' : 
      isUnpaid ? 'bg-[#FEE2E2] text-[#EF4444]' :
      'bg-[#F1F3F4] text-black'
    }`}>
      {isPaid && <CheckCircle2 size={10} className="fill-current text-[#00965E]" />}
      {isUnpaid && <AlertCircle size={10} className="fill-current text-[#EF4444]" />}
      {isProcessing && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
      <span>{type}</span>
    </div>
  );
};

const OrdersLanding: React.FC<OrdersLandingProps> = ({ 
  orders, 
  clients, 
  activeTab,
  onTabChange, 
  onAssignClient, 
  onUpdateItemStatus,
  onBatchAssign,
  onAddClientRequest,
  toastMessage,
  onClearToast,
  unassignedCountGlobal,
  selectedFilterClientId,
  setSelectedFilterClientId,
  filterUnassigned,
  setFilterUnassigned
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningItem, setAssigningItem] = useState<{ orderId: string, itemId: string } | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isAssignSheetOpen, setIsAssignSheetOpen] = useState(false);
  const [filterUnpaid, setFilterUnpaid] = useState(false);
  const [activeSort, setActiveSort] = useState<OrderSortType>('Most recent');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isClientFilterSheetOpen, setIsClientFilterSheetOpen] = useState(false);
  const [clientFilterSearch, setClientFilterSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [pendingBatchClientId, setPendingBatchClientId] = useState<number | null>(null);
  const [showReassignConfirmation, setShowReassignConfirmation] = useState(false);

  const [activeOverflow, setActiveOverflow] = useState<{ id: string, title: string, type: 'order' | 'item', data: any } | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => onClearToast(), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unassignedCount = useMemo(() => {
    return orders.reduce((acc, order) => {
      return acc + order.items.filter((item: any) => !item.assignedClientId).length;
    }, 0);
  }, [orders]);

  // Requirement: Deactivate unassigned filter automatically when count reaches 0
  useEffect(() => {
    if (filterUnassigned && unassignedCount === 0 && selectedFilterClientId === null) {
      setFilterUnassigned(false);
    }
  }, [unassignedCount, filterUnassigned, selectedFilterClientId]);

  const unpaidCount = useMemo(() => {
    return orders.reduce((acc, order) => {
      return acc + order.items.filter((item: any) => item.status.includes('Unpaid')).length;
    }, 0);
  }, [orders]);

  const displayedOrders = useMemo(() => {
    let list = orders.map(order => {
      let filteredItems = order.items;
      if (selectedFilterClientId !== null) {
        filteredItems = filteredItems.filter((item: any) => item.assignedClientId === selectedFilterClientId);
      }
      if (filterUnassigned && selectedFilterClientId === null && !isSelectionMode) {
        filteredItems = filteredItems.filter((item: any) => !item.assignedClientId);
      }
      if (filterUnpaid) {
        filteredItems = filteredItems.filter((item: any) => item.status.includes('Unpaid'));
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredItems = filteredItems.filter((item: any) => 
          item.title.toLowerCase().includes(q) || 
          order.orderNumber.includes(q)
        );
      }
      return { ...order, items: filteredItems };
    }).filter(order => order.items.length > 0);

    list.sort((a, b) => {
      switch (activeSort) {
        case 'Most recent':
          return b.orderNumber.localeCompare(a.orderNumber);
        case 'Order value (High to low)':
          return b.totalAmount - a.totalAmount;
        case 'Order value (Low to high)':
          return a.totalAmount - b.totalAmount;
        case 'Item price (High to low)': {
          const maxA = Math.max(...a.items.map((i: any) => i.price));
          const maxB = Math.max(...b.items.map((i: any) => i.price));
          return maxB - maxA;
        }
        case 'Item price (Low to high)': {
          const minA = Math.min(...a.items.map((i: any) => i.price));
          const minB = Math.min(...b.items.map((i: any) => i.price));
          return minA - minB;
        }
        default:
          return 0;
      }
    });
    return list;
  }, [orders, searchQuery, isSelectionMode, filterUnassigned, filterUnpaid, selectedFilterClientId, activeSort]);

  const totalItemsCount = useMemo(() => {
    return displayedOrders.reduce((acc, order) => acc + order.items.length, 0);
  }, [displayedOrders]);

  const allFilteredItemIds = useMemo(() => {
    return displayedOrders.flatMap(o => o.items.map((i: any) => i.id));
  }, [displayedOrders]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === allFilteredItemIds.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(allFilteredItemIds);
    }
  };

  const handleBatchAssignIntent = (clientId: number | null) => {
    if (selectedItemIds.length === 0) return;
    
    const hasExistingAssignments = orders.some(order => 
      order.items.some((item: any) => 
        selectedItemIds.includes(item.id) && item.assignedClientId !== null
      )
    );

    if (hasExistingAssignments && clientId !== null) {
      setPendingBatchClientId(clientId);
      setShowReassignConfirmation(true);
      setIsAssignSheetOpen(false);
    } else {
      executeBatchAssign(clientId);
    }
  };

  const executeBatchAssign = (clientId: number | null) => {
    onBatchAssign(selectedItemIds, clientId);
    setIsSelectionMode(false);
    setSelectedItemIds([]);
    setIsAssignSheetOpen(false);
    setShowReassignConfirmation(false);
    setPendingBatchClientId(null);
  };

  const cancelBatchAssign = () => {
    setIsSelectionMode(false);
    setSelectedItemIds([]);
    setShowReassignConfirmation(false);
    setPendingBatchClientId(null);
  };

  const toggleOverflow = (e: React.MouseEvent, id: string, title: string, type: 'order' | 'item', data: any) => {
    e.stopPropagation();
    if (activeOverflow?.id === id) {
      setActiveOverflow(null);
    } else {
      setActiveOverflow({ id, title, type, data });
    }
  };

  const selectedFilterClient = useMemo(() => {
    if (selectedFilterClientId === -1) return { name: 'Palesa Nkosi', surname: '(You)' };
    return clients.find(c => c.id === selectedFilterClientId);
  }, [clients, selectedFilterClientId]);

  const filteredClientsForSearch = useMemo(() => {
    if (!clientFilterSearch.trim()) return clients;
    const q = clientFilterSearch.toLowerCase();
    return clients.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.surname.toLowerCase().includes(q)
    );
  }, [clients, clientFilterSearch]);

  const RadioButton = ({ selected }: { selected: boolean }) => (
    <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
      selected ? 'border-[#0047FF] bg-[#0047FF]' : 'border-gray-300 bg-white'
    }`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
    </div>
  );

  const handleOverflowAction = (action: string) => {
    if (!activeOverflow) return;

    if (activeOverflow.type === 'item') {
      const item = activeOverflow.data.item;
      const orderId = activeOverflow.data.orderId;

      switch (action) {
        case 'Assign to client':
          setAssigningItem({ orderId, itemId: item.id });
          break;
        case 'Mark as paid':
          onUpdateItemStatus([item.id], true);
          break;
        case 'Mark as unpaid':
          onUpdateItemStatus([item.id], false);
          break;
        case 'Select':
          setIsSelectionMode(true);
          setSelectedItemIds([item.id]);
          break;
      }
    } else if (activeOverflow.type === 'order') {
      const orderData = activeOverflow.data.order;
      const fullOrder = orders.find(o => o.id === orderData.id);
      if (!fullOrder) return;
      const allItemIds = fullOrder.items.map((i: any) => i.id);

      switch (action) {
        case 'Assign all items to client':
          setAssigningOrder(fullOrder.id);
          break;
        case 'Mark as unpaid':
          onUpdateItemStatus(allItemIds, false);
          break;
        case 'Mark as paid':
          onUpdateItemStatus(allItemIds, true);
          break;
      }
    }

    setActiveOverflow(null);
  };

  return (
    <div className="bg-[#F9F9F9] relative min-h-screen flex flex-col pb-48">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-[80] bg-[#0047FF] pt-2 pb-0 transition-all duration-300">
        <div className="absolute top-8 left-0 right-0 z-[90] flex justify-center px-6 pointer-events-none">
          {toastMessage && (
            <div className="bg-[#00965E] text-white px-5 py-2.5 rounded-full flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300 shadow-xl pointer-events-auto border border-white/10">
              <Check size={14} strokeWidth={4} />
              <span className="text-[14px] font-black">{toastMessage}</span>
            </div>
          )}
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-14 opacity-100 mt-3'}`}>
          <div className="flex justify-center space-x-12 relative px-4">
            <button onClick={() => !isSelectionMode && onTabChange('Clients')} className={`text-[17px] font-bold pb-2 transition-colors relative focus:outline-none ${activeTab === 'Orders' ? 'text-white/60' : 'text-white'} ${isSelectionMode ? 'opacity-50' : ''}`}>
              Clients
            </button>
            <button onClick={() => !isSelectionMode && onTabChange('Orders')} className={`text-[17px] font-bold pb-2 transition-colors relative focus:outline-none ${activeTab === 'Orders' ? 'text-white' : 'text-white/60'} ${isSelectionMode ? 'opacity-50' : ''}`}>
              Orders
              {activeTab === 'Orders' && <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />}
              {unassignedCountGlobal > 0 && (
                <div className="absolute top-0 -right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0047FF]" />
              )}
            </button>
          </div>
        </div>

        <div className={`px-4 transition-all duration-300 ${isScrolled ? 'mt-2' : 'mt-5'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search item, order number or client"
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all text-[16px]"
            />
          </div>
        </div>

        <div className={`flex items-center space-x-2 px-4 transition-all duration-300 overflow-x-auto no-scrollbar ${isScrolled ? 'mt-3 pb-4' : 'mt-4 pb-4'}`}>
          <button 
            onClick={() => { setFilterUnassigned(!filterUnassigned); setSelectedFilterClientId(null); }}
            className={`flex items-center space-x-2 rounded-full py-2 px-4 whitespace-nowrap border transition-all focus:outline-none ${
              (filterUnassigned && selectedFilterClientId === null) ? 'bg-white text-black' : 'bg-white/10 border-white/20 text-white'
            }`}
          >
             <span className="text-[12px] font-bold">Unassigned ({unassignedCount})</span>
          </button>
          <button 
            onClick={() => setIsClientFilterSheetOpen(true)}
            className={`flex items-center space-x-2 rounded-full py-2 px-4 whitespace-nowrap border transition-all focus:outline-none ${
              selectedFilterClientId !== null ? 'bg-white text-black' : 'bg-white/10 border-white/20 text-white'
            }`}
          >
            <span className="text-[12px] font-bold">
              {selectedFilterClientId !== null ? `${selectedFilterClient?.name} ${selectedFilterClient?.surname}` : 'Client'}
            </span>
            <ChevronDown size={14} />
          </button>
          <button onClick={() => setFilterUnpaid(!filterUnpaid)} className={`flex items-center space-x-2 rounded-full py-2 px-4 whitespace-nowrap border transition-all focus:outline-none ${filterUnpaid ? 'bg-white text-black' : 'bg-white/10 border-white/20 text-white'}`}>
            <span className="text-[12px] font-bold">Unpaid ({unpaidCount})</span>
          </button>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0 pointer-events-none' : 'h-14 opacity-100 mt-2 pb-6'}`}>
          <div className="flex items-center justify-between px-4">
            {isSelectionMode ? (
              <button onClick={toggleSelectAll} className="text-white text-[12px] font-bold flex items-center space-x-2 focus:outline-none">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedItemIds.length === allFilteredItemIds.length ? 'bg-white border-white' : 'border-white/50'}`}>
                  {selectedItemIds.length === allFilteredItemIds.length && <Check size={12} className="text-[#0047FF]" />}
                </div>
                <span>{selectedItemIds.length === allFilteredItemIds.length ? 'Deselect all' : 'Select all'}</span>
              </button>
            ) : (
              <span className="text-white/70 text-[12px] font-bold">{totalItemsCount} items</span>
            )}
            <div className="flex items-center space-x-4">
              {isSelectionMode ? (
                <button onClick={() => { setIsSelectionMode(false); setSelectedItemIds([]); }} className="text-white text-[12px] font-bold focus:outline-none">Cancel</button>
              ) : (
                <>
                  <button onClick={() => setIsSelectionMode(true)} className="text-white text-[12px] font-bold focus:outline-none">Select</button>
                  <button onClick={() => setIsSortModalOpen(true)} className="flex items-center space-x-1 text-white focus:outline-none"><ArrowUpDown size={12} /><span className="text-[12px] font-bold">{activeSort}</span></button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className={`sawtooth-edge transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}></div>
      </div>

      {/* ORDERS LIST */}
      <div className="pt-12 space-y-4">
        <div className="text-center">
          <p className="text-[12px] text-gray-500 font-medium">Updated: Today, 12:00</p>
        </div>
        {displayedOrders.length > 0 ? (
          displayedOrders.map(order => (
            <div key={order.id} className="bg-white mx-4 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="flex-1">
                  <h3 className="text-[16px] font-black text-gray-900 leading-none mb-1">Order #{order.orderNumber}</h3>
                  <p className="text-[12px] text-gray-400 font-medium">{order.date} <span className="mx-1">•</span> R{order.totalAmount.toLocaleString()}</p>
                </div>
                {/* ORDER OVERFLOW TRIGGER */}
                <button 
                  onClick={(e) => toggleOverflow(e, `order-${order.id}`, `Order #${order.orderNumber}`, 'order', { order })}
                  className={`p-1 relative z-10 rounded-full transition-colors focus:outline-none ${activeOverflow?.id === `order-${order.id}` ? 'bg-gray-100 text-[#0047FF]' : 'text-gray-400 active:bg-gray-50'}`}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {order.items.map((item: any) => {
                  const assignedClient = clients.find(c => c.id === item.assignedClientId);
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div key={item.id} className={`p-4 flex space-x-3 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`} onClick={() => isSelectionMode && toggleItemSelection(item.id)}>
                      <div className="pt-2">
                        {isSelectionMode ? (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#0047FF] border-[#0047FF]' : 'border-gray-200'}`}>
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                        ) : (
                          <div className="w-5" />
                        )}
                      </div>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                        <img src={item.image} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1 mb-1.5">{item.status.map((s: string) => <StatusBadge key={s} type={s} />)}</div>
                          {/* ITEM OVERFLOW TRIGGER */}
                          <button 
                            onClick={(e) => toggleOverflow(e, `item-${item.id}`, item.title, 'item', { item, orderId: order.id })}
                            className={`p-1 -mt-1 -mr-1 relative z-10 rounded-full transition-colors focus:outline-none ${activeOverflow?.id === `item-${item.id}` ? 'bg-gray-100 text-[#0047FF]' : 'text-gray-400 active:bg-gray-50'}`}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        <h4 className="text-[14px] font-black text-gray-900 leading-tight mb-0.5">{item.title}</h4>
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <p className="text-[15px] font-black text-gray-900">R {item.price.toLocaleString()}</p>
                          {item.commission && (
                            <p className="text-[11px] font-bold text-[#00965E]">(+R{item.commission.toLocaleString()} Commission)</p>
                          )}
                        </div>
                        
                        <div className="mt-2">
                          {item.assignedClientId ? (
                            <div 
                              onClick={(e) => { 
                                if (!isSelectionMode) {
                                  e.stopPropagation(); 
                                  setAssigningItem({ orderId: order.id, itemId: item.id }); 
                                }
                              }}
                              className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full focus:outline-none ${
                                isSelectionMode 
                                  ? 'bg-[#F1F3F4]' 
                                  : 'bg-[#E8EDFA] text-[#0047FF] cursor-pointer active:bg-[#D0D9F7]'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 ${
                                isSelectionMode 
                                  ? 'bg-black' 
                                  : 'bg-[#0047FF]'
                              }`}>
                                {assignedClient?.initials}
                              </div>
                              <span className={`text-[13px] font-bold truncate ${
                                isSelectionMode ? 'text-gray-900' : 'text-[#0047FF]'
                              }`}>
                                {assignedClient?.name} {assignedClient?.surname}
                              </span>
                              {!isSelectionMode && <ChevronDown size={14} className="text-[#0047FF]" />}
                            </div>
                          ) : (
                            !isSelectionMode && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setAssigningItem({ orderId: order.id, itemId: item.id }); }} 
                                className="inline-flex items-center space-x-1 bg-white border border-[#0047FF] text-[#0047FF] px-4 py-2 rounded-full text-[13px] font-black focus:outline-none"
                              >
                                <Plus size={14} strokeWidth={3} />
                                <span>Assign client</span>
                                <ChevronDown size={14} />
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-900 font-bold text-[17px] mb-2">No orders match filters</p>
            <p className="text-gray-500 text-[14px] leading-relaxed max-w-[260px]">
              Try adjusting your search or filters to see more orders.
            </p>
          </div>
        )}
      </div>

      {/* OVERFLOW SHEET (ORDER & ITEM) */}
      {activeOverflow && (
        <div className="fixed inset-0 z-[250] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setActiveOverflow(null)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 pb-12 pt-8 shadow-2xl flex flex-col">
            {/* Design-matched Header: X on left, Bold center title */}
            <div className="flex items-center px-6 mb-8">
              <button 
                onClick={() => setActiveOverflow(null)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full active:bg-gray-200 transition-colors focus:outline-none shrink-0"
              >
                <X size={20} />
              </button>
              <h2 className="flex-1 text-center text-[17px] font-black text-gray-900 truncate px-4">
                {activeOverflow.title}
              </h2>
              <div className="w-10" />
            </div>

            {/* Contextual Action List */}
            <div className="flex flex-col space-y-1">
              {activeOverflow.type === 'item' ? (
                <>
                  <button onClick={() => handleOverflowAction('Assign to client')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <UserPlus size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Assign to client</span>
                  </button>
                  <button onClick={() => handleOverflowAction('Mark as unpaid')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <Wallet size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Mark as unpaid</span>
                  </button>
                  <button onClick={() => handleOverflowAction('Mark as paid')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <Wallet size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Mark as paid</span>
                  </button>
                  <button onClick={() => handleOverflowAction('Select')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <Copy size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Select</span>
                  </button>
                </>
              ) : (
                <>
                  {/* ORDER LEVEL ACTIONS */}
                  <button onClick={() => handleOverflowAction('Assign all items to client')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <UserPlus size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Assign all items to client</span>
                  </button>
                  <button onClick={() => handleOverflowAction('Mark as unpaid')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <Wallet size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Mark as unpaid</span>
                  </button>
                  <button onClick={() => handleOverflowAction('Mark as paid')} className="w-full flex items-center space-x-4 px-6 py-4 active:bg-gray-50 transition-colors text-left focus:outline-none">
                    <Wallet size={24} className="text-[#0047FF]" />
                    <span className="text-[15px] font-bold text-gray-900">Mark as paid</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RE-ASSIGNMENT CONFIRMATION */}
      {showReassignConfirmation && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setShowReassignConfirmation(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 p-8 shadow-2xl">
            <ReplaceIllustration />
            <h3 className="text-[19px] font-black text-gray-900 mb-3 text-center">Replace assignment?</h3>
            <p className="text-[15px] text-gray-500 mb-8 leading-relaxed text-center">
              Some of these items are already assigned to a client. Would you like to replace the existing assignment?
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => executeBatchAssign(pendingBatchClientId)}
                className="w-full py-4 bg-[#0047FF] text-white rounded-[6px] font-bold text-[15px] focus:outline-none"
              >
                Replace & assign
              </button>
              <button 
                onClick={cancelBatchAssign}
                className="w-full py-4 bg-gray-100 text-gray-900 rounded-[6px] font-bold text-[15px] focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER SHEETS & ASSIGN SHEETS */}
      {isClientFilterSheetOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setIsClientFilterSheetOpen(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 flex flex-col h-[85%] pb-12 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-10 pb-4">
              <button onClick={() => setIsClientFilterSheetOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full focus:outline-none active:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
              <h2 className="text-[17px] font-bold text-gray-900">Client</h2>
              <div className="w-10" />
            </div>
            <div className="px-6 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search client" 
                  value={clientFilterSearch} 
                  onChange={e => setClientFilterSearch(e.target.value)} 
                  className="w-full border border-gray-200 rounded-lg py-3.5 pl-11 pr-4 text-[15px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all shadow-sm" 
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {!clientFilterSearch && (
                <div className="mt-1">
                  <button onClick={() => { setSelectedFilterClientId(null); setIsClientFilterSheetOpen(false); }} className="w-full flex items-center justify-between px-6 py-4 active:bg-gray-50 transition-colors focus:outline-none">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#EBF1FF] flex items-center justify-center text-[#0047FF]"><UsersIcon size={24} /></div>
                      <span className="text-[15px] font-bold text-gray-900">All</span>
                    </div>
                    <RadioButton selected={selectedFilterClientId === null} />
                  </button>
                  <button onClick={() => { setSelectedFilterClientId(-1); setFilterUnassigned(false); setIsClientFilterSheetOpen(false); }} className="w-full flex items-center justify-between px-6 py-4 active:bg-gray-50 transition-colors focus:outline-none">
                    <div className="flex items-center space-x-4">
                      <img src="https://i.pravatar.cc/150?u=me" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" alt="Profile" />
                      <span className="text-[15px] font-bold text-gray-900">Palesa Nkosi (You)</span>
                    </div>
                    <RadioButton selected={selectedFilterClientId === -1} />
                  </button>
                </div>
              )}
              <div className="px-6 pt-6 pb-2"><h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">Clients</h3></div>
              <div className="space-y-0.5">
                {filteredClientsForSearch.map(client => (
                  <button key={client.id} onClick={() => { setSelectedFilterClientId(client.id); setFilterUnassigned(false); setIsClientFilterSheetOpen(false); }} className="w-full flex items-center justify-between px-6 py-1.5 active:bg-gray-50 transition-colors focus:outline-none">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 flex items-center justify-center"><div className="absolute inset-0 text-[#E8F0FE]"><ClientAvatarStar /></div><span className="relative z-10 text-[14px] font-black text-[#0047FF]">{client.initials}</span></div>
                      <span className="text-[15px] font-bold text-gray-900">{client.name} {client.surname}</span>
                    </div>
                    <RadioButton selected={selectedFilterClientId === client.id} />
                  </button>
                ))}
              </div>
              <div className="h-12" />
            </div>
          </div>
        </div>
      )}

      {assigningItem && (
        <AssignClientSheet 
          clients={clients}
          onSelect={(clientId) => { onAssignClient(assigningItem.orderId, assigningItem.itemId, clientId); setAssigningItem(null); }}
          onAddClient={() => { onAddClientRequest(assigningItem.orderId, assigningItem.itemId); setAssigningItem(null); }}
          onClose={() => setAssigningItem(null)}
        />
      )}

      {assigningOrder && (
        <AssignClientSheet 
          clients={clients}
          onSelect={(clientId) => { 
            const order = orders.find(o => o.id === assigningOrder);
            if (order) {
              const allItemIds = order.items.map((i: any) => i.id);
              onBatchAssign(allItemIds, clientId); 
            }
            setAssigningOrder(null); 
          }}
          onAddClient={() => { 
            const order = orders.find(o => o.id === assigningOrder);
            if (order && order.items.length > 0) {
              onAddClientRequest(assigningOrder, order.items[0].id);
            }
            setAssigningOrder(null); 
          }}
          onClose={() => setAssigningOrder(null)}
        />
      )}

      {isAssignSheetOpen && (
        <AssignClientSheet 
          clients={clients}
          onSelect={handleBatchAssignIntent}
          onAddClient={() => setIsAssignSheetOpen(false)}
          onClose={() => setIsAssignSheetOpen(false)}
          showUnassign
        />
      )}

      {isSortModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={() => setIsSortModalOpen(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 pb-12 pt-10 shadow-2xl">
            <div className="flex items-center justify-between px-6 mb-8">
              <button onClick={() => setIsSortModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full active:bg-gray-200 transition-colors focus:outline-none"><X size={18} /></button>
              <h2 className="text-[17px] font-bold text-gray-900">Sort by</h2>
              <div className="w-8" />
            </div>
            <div className="space-y-0.5">
              {SORT_OPTIONS.map((option) => (
                <button key={option.id} onClick={() => { setActiveSort(option.id); setIsSortModalOpen(false); }} className="w-full flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left focus:outline-none">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${activeSort === option.id ? 'border-[#0047FF]' : 'border-gray-300'}`}>
                    {activeSort === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0047FF]" />}
                  </div>
                  <span className={`text-[15px] font-medium text-gray-900 ${activeSort === option.id ? 'font-bold' : ''}`}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SELECTION MODE BAR */}
      {isSelectionMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 z-[110] shadow-2xl animate-in slide-in-from-bottom duration-200 w-full max-w-[390px] mx-auto" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
          <div className="flex flex-col space-y-3">
            <div className="flex space-x-3">
              <button onClick={() => { onUpdateItemStatus(selectedItemIds, false); setIsSelectionMode(false); setSelectedItemIds([]); }} className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-[6px] text-[15px] font-black">Mark as unpaid</button>
              <button onClick={() => { onUpdateItemStatus(selectedItemIds, true); setIsSelectionMode(false); setSelectedItemIds([]); }} className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-[6px] text-[15px] font-black">Mark as paid</button>
            </div>
            <button onClick={() => selectedItemIds.length > 0 && setIsAssignSheetOpen(true)} className={`w-full py-4 rounded-[6px] text-[15px] font-black transition-all ${selectedItemIds.length > 0 ? 'bg-[#0047FF] text-white shadow-lg' : 'bg-[#0047FF] text-white opacity-40'}`}>Assign client ({selectedItemIds.length})</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersLanding;
