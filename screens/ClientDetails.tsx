
import React, { useState, useEffect } from 'react';
import { X, Edit2, Heart, Copy, Phone, Mail, ShoppingCart, Plus, Check, ShoppingBag, Trash2, Link as LinkIcon, MapPin, ChevronRight, Package, Banknote } from 'lucide-react';
import ClientAvatarStar from '../components/ClientAvatarStar';

interface ProductRequest {
  title: string;
  quantity: number;
  notes: string;
  link: string;
}

interface Address {
  street: string;
  complex: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

interface ClientDetailsProps {
  client: {
    id: number;
    name: string;
    surname: string;
    phone: string;
    email: string;
    initials: string;
    notes?: string;
    productRequests?: ProductRequest[];
    addresses?: Address[];
    deliveryPreference?: string;
    isFavourite?: boolean;
    unpaidCount?: number;
    isUserCreated?: boolean;
    ordersCount?: number;
    itemsCount?: number;
    orderAmount?: number;
    orderThumbnails?: string[];
    extraItemsCount?: number;
  };
  onClose: () => void;
  onAddProductRequest: () => void;
  onAddAddress: () => void;
  onSetDeliveryPreference: (pref: string) => void;
  onToggleFavourite: () => void;
  onDeleteProductRequest: (index: number) => void;
  onDeleteAddress: (index: number) => void;
  onViewOrderHistory?: () => void;
  toastMessage?: string | null;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ 
  client, 
  onClose, 
  onAddProductRequest, 
  onAddAddress,
  onDeleteProductRequest,
  onDeleteAddress,
  onViewOrderHistory,
  onSetDeliveryPreference,
  toastMessage = null 
}) => {
  const [toastVisible, setToastVisible] = useState(!!toastMessage);
  const [isDeliverySheetOpen, setIsDeliverySheetOpen] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      setToastVisible(true);
      const timer = setTimeout(() => setToastVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const Section = ({ title, description, actionText, onAction, children }: any) => (
    <div className="mb-6">
      <h3 className="text-[17px] font-bold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-[13px] text-gray-500 mb-3 leading-relaxed">{description}</p>}
      <div className="bg-white rounded-[12px] p-5 shadow-sm border border-gray-50">
        {actionText && (
          <button 
            onClick={onAction}
            className="flex items-center space-x-3 text-gray-900 font-bold text-[15px] mb-4 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#0047FF] flex items-center justify-center text-white">
              <Plus size={18} />
            </div>
            <span>{actionText}</span>
          </button>
        )}
        {children}
      </div>
    </div>
  );

  const deliveryOptions = [
    "None",
    "Client collects from shopper",
    "Shopper delivers to client",
    "Takealot delivers to client",
    "Client collects from Takealot"
  ];

  const handleSelectPreference = (pref: string) => {
    onSetDeliveryPreference(pref);
    setIsDeliverySheetOpen(false);
  };

  const hasOrders = (client.ordersCount || 0) > 0;
  const hasAddress = client.addresses && client.addresses.length > 0;
  
  // Rule: Show CTA if NO address OR if preference is None/empty
  const showDefaultDeliveryCTA = !hasAddress || !client.deliveryPreference || client.deliveryPreference === 'None';

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9] animate-in fade-in duration-300 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 relative z-20">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full focus:outline-none">
          <X size={18} />
        </button>

        <div className="flex-1 flex justify-center px-4">
          {toastVisible && toastMessage ? (
            <div className="bg-[#00965E] text-white px-4 py-1.5 rounded-full flex items-center space-x-2 animate-in zoom-in-95 duration-200 shadow-lg">
              <span className="text-[13px] font-bold">{toastMessage}</span>
            </div>
          ) : (
             <h1 className="text-[17px] font-bold text-gray-900">Client details</h1>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full focus:outline-none">
            <Edit2 size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full focus:outline-none">
            <Heart size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-12 no-scrollbar">
        <div className="flex flex-col items-center mt-4 mb-8 text-center">
          <div className="relative w-28 h-28 flex items-center justify-center mb-4">
            <div className="absolute inset-0 text-[#E8F0FE]">
              <ClientAvatarStar />
            </div>
            <span className="relative z-10 text-[24px] font-black text-[#0047FF]">
              {client.initials}
            </span>
          </div>
          <h2 className="text-[22px] font-black text-gray-900 flex items-center justify-center space-x-2">
            <span>{client.name} {client.surname}</span>
            <button className="focus:outline-none active:scale-95 transition-transform"><Copy size={16} className="text-gray-400" /></button>
          </h2>
          <p className="text-[13px] text-gray-400 font-medium mt-1">Added: 2 Dec '25</p>

          <div className="flex items-center justify-center space-x-4 mt-4 text-[13px] font-bold text-gray-900">
            <div className="flex items-center space-x-1.5">
              <Phone size={14} fill="currentColor" />
              <span>{client.phone}</span>
              <Copy size={12} className="text-gray-400 ml-1" />
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center space-x-1.5">
              <Mail size={14} />
              <span>{client.email || 'No email'}</span>
            </div>
          </div>
        </div>

        <Section title="Order history">
          {hasOrders ? (
            <button 
              onClick={onViewOrderHistory}
              className="bg-white rounded-xl border border-gray-50 p-4 shadow-sm w-full text-left active:scale-[0.98] transition-all focus:outline-none"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-900 text-white p-2 rounded-lg">
                    <Package size={20} />
                  </div>
                  <h4 className="text-[15px] font-black text-gray-900 leading-tight">
                    {client.ordersCount} orders • {client.itemsCount} items
                  </h4>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-[14px] font-bold text-gray-900">
                  Total: R{(client.orderAmount || 0).toLocaleString()}
                </p>
                {client.unpaidCount && client.unpaidCount > 0 && (
                  <div className="flex items-center space-x-1.5 bg-[#FEE2E2] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">
                    <Banknote size={12} />
                    <span>{client.unpaidCount} unpaid items</span>
                  </div>
                )}
              </div>

              {client.orderThumbnails && (
                <div className="flex items-center space-x-2">
                  {client.orderThumbnails.slice(0, 4).map((thumb, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={thumb} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                  {client.itemsCount && client.itemsCount > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-[#F1F3F4] border border-gray-100 flex items-center justify-center text-[14px] font-black text-gray-900 flex-shrink-0">
                      +{client.itemsCount - 4}
                    </div>
                  )}
                </div>
              )}
            </button>
          ) : (
            <div className="flex flex-col items-start py-2 text-left w-full">
              <div className="bg-gray-100 p-2.5 rounded-lg mb-3">
                <Package size={20} className="text-gray-900" />
              </div>
              <h4 className="text-[15px] font-bold text-gray-900 mb-1">No orders yet</h4>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                All order items assigned to this client will appear here.
              </p>
            </div>
          )}
        </Section>

        <Section 
          title="Product requests" 
          description="Add and manage what the client would like to purchase."
          actionText="Add product request"
          onAction={onAddProductRequest}
        >
          {client.productRequests && client.productRequests.length > 0 ? (
            <div className="space-y-4">
              {client.productRequests.map((req, idx) => (
                <div key={idx} className="bg-white rounded-[12px] p-4 border border-gray-100 flex flex-col relative shadow-sm">
                  <div className="flex items-start justify-between mb-2 pr-10">
                    <div className="flex items-center space-x-3">
                       <ShoppingBag size={18} className="text-gray-900" />
                       <span className="text-[15px] font-black text-gray-900">
                         {req.title} <span className="font-bold text-gray-400">· Qty: {req.quantity}</span>
                       </span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteProductRequest(idx); }} 
                      className="absolute top-4 right-3 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {req.notes && (
                    <p className="text-[13px] text-gray-600 mb-3 leading-relaxed pl-[30px]">
                      {req.notes}
                    </p>
                  )}
                  
                  {req.link && (
                    <div className="pl-[30px]">
                       <button className="flex items-center space-x-1 text-[#0047FF] text-[13px] font-bold">
                         <LinkIcon size={14} />
                         <span className="truncate max-w-[200px]">{req.link.replace(/^https?:\/\//, '')}</span>
                       </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-gray-400 py-2">No product requests yet.</p>
          )}
        </Section>

        <Section title="Client address" description="Add a maximum of 2.">
          <button 
            onClick={onAddAddress}
            className="flex items-center space-x-3 text-gray-900 font-bold text-[15px] mb-4 focus:outline-none active:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#0047FF] flex items-center justify-center text-white">
              <Plus size={18} />
            </div>
            <span>Add delivery address</span>
          </button>
          
          {client.addresses && client.addresses.length > 0 ? (
            <div className="space-y-4 mt-4">
              {client.addresses.map((address, idx) => (
                <div key={idx} className="bg-white rounded-[12px] p-4 border border-gray-100 flex flex-col relative shadow-sm">
                   <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                         <MapPin size={18} className="text-gray-900 mt-1" />
                         <div>
                            <h4 className="text-[15px] font-black text-gray-900 leading-tight">
                              {address.street}{address.complex ? `, ${address.complex}` : ''}
                            </h4>
                            <p className="text-[13px] text-gray-500 font-medium">
                              {address.suburb}, {address.city}, {address.postalCode}
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                         <button className="text-gray-400 p-1 focus:outline-none active:scale-95 transition-transform"><Copy size={16} /></button>
                         <button 
                           onClick={() => onDeleteAddress(idx)}
                           className="text-gray-400 p-1 focus:outline-none active:scale-95 transition-transform hover:text-red-500"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          ) : null}
        </Section>

        <Section title="Delivery preference" description="Specify how your client would like their products delivered.">
          {showDefaultDeliveryCTA ? (
            <button 
              onClick={() => setIsDeliverySheetOpen(true)}
              className="w-full flex items-center space-x-4 p-5 bg-white rounded-[20px] shadow-sm border border-gray-50 active:scale-[0.98] transition-all focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#0047FF] flex items-center justify-center text-white shrink-0">
                <Plus size={18} />
              </div>
              <span className="text-[15px] font-bold text-gray-900">Set delivery preference</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
               <span className="text-[15px] font-medium text-gray-900">{client.deliveryPreference}</span>
               <button 
                 onClick={() => setIsDeliverySheetOpen(true)}
                 className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full active:scale-95 transition-all focus:outline-none"
               >
                  <Edit2 size={16} />
               </button>
            </div>
          )}
        </Section>

        <Section title="Client note">
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[60px]">
            <p className="text-[15px] text-gray-700 leading-relaxed">{client.notes || 'No notes added.'}</p>
          </div>
        </Section>

        <Section title="Referrals">
          <p className="text-[12px] text-gray-500 font-medium mb-4 leading-relaxed">
            “Referred by” is who referred {client.name}.<br/>
            “Nr of referrals” is how many clients {client.name} has referred.
          </p>
          <div className="flex justify-between items-start pt-2">
            <div className="flex-1">
              <p className="text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Referred by</p>
              <p className="text-[15px] font-black text-gray-900">Naledi Lesemola</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Number of referrals</p>
              <p className="text-[15px] font-black text-gray-900">#</p>
            </div>
          </div>
        </Section>
      </div>

      {/* Delivery Preference Sheet */}
      {isDeliverySheetOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/40 animate-in fade-in duration-300" 
            onClick={() => setIsDeliverySheetOpen(false)} 
          />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 p-8 pt-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setIsDeliverySheetOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full active:scale-90 transition-transform focus:outline-none"
              >
                <X size={20} />
              </button>
              <h2 className="text-[17px] font-black text-gray-900">Set delivery preference</h2>
              <div className="w-10" />
            </div>

            <div className="space-y-6">
              {deliveryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectPreference(option)}
                  className="w-full flex items-center space-x-4 text-left focus:outline-none group"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    (client.deliveryPreference || 'None') === option ? 'border-[#0047FF]' : 'border-gray-200'
                  }`}>
                    {(client.deliveryPreference || 'None') === option && (
                      <div className="w-3 h-3 rounded-full bg-[#0047FF]" />
                    )}
                  </div>
                  <span className={`text-[15px] font-medium transition-colors ${
                    (client.deliveryPreference || 'None') === option ? 'text-[#0047FF] font-bold' : 'text-gray-900'
                  }`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
