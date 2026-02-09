
import React, { useState, useMemo } from 'react';
import { X, Search, Plus, UserMinus } from 'lucide-react';
import ClientAvatarStar from './ClientAvatarStar';

interface AssignClientSheetProps {
  clients: any[];
  onSelect: (clientId: number | null) => void;
  onAddClient: () => void;
  onClose: () => void;
  showUnassign?: boolean;
}

const AssignClientSheet: React.FC<AssignClientSheetProps> = ({ clients, onSelect, onAddClient, onClose, showUnassign }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.surname.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Fixed height h-[85%] to prevent shrinking */}
      <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 flex flex-col h-[85%] pb-12 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full"
          >
            <X size={18} />
          </button>
          <h2 className="text-[17px] font-black text-gray-900">
            {showUnassign ? 'Client' : 'Assign to client'}
          </h2>
          <div className="w-8" />
        </div>

        {/* Search */}
        <div className="px-6 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              autoFocus={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client"
              className={`w-full bg-white border rounded-lg py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all text-[15px] font-medium ${
                searchQuery ? 'border-[#0047FF] ring-2 ring-[#0047FF]/20' : 'border-gray-200'
              }`}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar mt-4">
          {!searchQuery && (
            <>
              <button className="w-full flex items-center justify-between px-6 py-3.5 active:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-full bg-gray-100 object-cover" alt="" />
                  <span className="text-[15px] font-bold text-gray-900">Palesa Nkosi (You)</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
              </button>

              {showUnassign && (
                <button 
                  onClick={() => onSelect(null)}
                  className="w-full flex items-center justify-between px-6 py-3.5 active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                      <UserMinus size={20} />
                    </div>
                    <span className="text-[15px] font-bold text-gray-900">Unassign</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                </button>
              )}

              <div className="px-6 py-3 mt-2">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Clients</h3>
              </div>

              <button 
                onClick={onAddClient}
                className="w-full flex items-center px-6 py-3.5 active:bg-gray-50 transition-colors space-x-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#0047FF] flex items-center justify-center text-white">
                  <Plus size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[15px] font-bold text-gray-900">Add client</span>
              </button>
            </>
          )}

          {filteredClients.map(client => (
            <button 
              key={client.id}
              onClick={() => onSelect(client.id)}
              className="w-full flex items-center justify-between px-6 py-3.5 active:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 text-[#E8F0FE]">
                    <ClientAvatarStar />
                  </div>
                  <span className="relative z-10 text-[13px] font-black text-[#0047FF]">
                    {client.initials}
                  </span>
                </div>
                <span className="text-[15px] font-bold text-gray-900">{client.name} {client.surname}</span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-gray-200 transition-all flex items-center justify-center group-active:border-[#0047FF] group-active:bg-[#0047FF]" />
            </button>
          ))}

          {filteredClients.length === 0 && searchQuery && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-medium">No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignClientSheet;