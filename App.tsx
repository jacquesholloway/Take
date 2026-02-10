import React, { useState, useMemo, useEffect } from 'react';
import { Screen } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import ClientsLanding from './screens/ClientsLanding';
import OrdersLanding from './screens/OrdersLanding';
import AddClientDetails from './screens/AddClientDetails';
import ClientDetails from './screens/ClientDetails';
import Me from './screens/Me';
import Settings from './screens/Settings';
import Leaderboard from './screens/Leaderboard';
import Feed from './screens/Feed';
import DealDetail from './screens/DealDetail';
import JoinInDetail from './screens/JoinInDetail';
import AddProductRequest from './screens/AddProductRequest';
import AddAddress from './screens/AddAddress';

const PRELOADED_CLIENTS_DATA = [
  { id: 1, name: 'Jordan', surname: 'Smith', phone: '082 123 4567', initials: 'JS', unpaidCount: 1, productRequests: [{ title: 'iPhone 15', quantity: 1, notes: '', link: '' }], orderAmount: 12500, isFavourite: true, ordersCount: 5, itemsCount: 12, addresses: [{ street: '12 Blue Lane', complex: '', suburb: 'Green Point', city: 'Cape Town', province: 'Western Cape', postalCode: '8005' }] },
  { id: 2, name: 'Naledi', surname: 'Khumalo', phone: '071 987 6543', initials: 'NK', unpaidCount: 0, productRequests: [], orderAmount: 4500, ordersCount: 2, itemsCount: 5, addresses: [{ street: '88 Heritage Close', complex: 'Unit 12', suburb: 'Morningside', city: 'Sandton', province: 'Gauteng', postalCode: '2196' }] },
  { id: 3, name: 'Themba', surname: 'Maseko', phone: '060 555 0199', initials: 'TM', unpaidCount: 3, productRequests: [{ title: 'Philips Airfryer XXL', quantity: 1, notes: '', link: '' }, { title: 'Macbook Air M3', quantity: 1, notes: '', link: '' }], orderAmount: 8900, ordersCount: 8, itemsCount: 18, addresses: [{ street: '45 Whispering Crag Road', complex: '', suburb: 'Woodstock', city: 'Cape Town', province: 'Western Cape', postalCode: '7915' }] },
  { id: 4, name: 'Noah', surname: 'Williams', phone: '083 444 2211', initials: 'NW', unpaidCount: 0, productRequests: [], orderAmount: 0, ordersCount: 0, itemsCount: 0, addresses: [{ street: '7 Oak Street', complex: '', suburb: 'Constantia', city: 'Cape Town', province: 'Western Cape', postalCode: '7806' }] },
  { id: 5, name: 'Priya', surname: 'Naidoo', phone: '072 000 9988', initials: 'PN', unpaidCount: 0, productRequests: [{ title: 'Neutrogena Sunscreen', quantity: 2, notes: '', link: '' }], orderAmount: 300, ordersCount: 1, itemsCount: 3, addresses: [{ street: '15 Curry Avenue', complex: 'Sea View', suburb: 'Umhlanga', city: 'Durban', province: 'KwaZulu-Natal', postalCode: '4319' }] },
  { id: 6, name: 'Aisha', surname: 'Khan', phone: '072 111 2233', initials: 'AK', unpaidCount: 1, productRequests: [], orderAmount: 1200, ordersCount: 3, itemsCount: 7, addresses: [{ street: '22 Bazaar Road', complex: '', suburb: 'Fordsburg', city: 'Johannesburg', province: 'Gauteng', postalCode: '2092' }] },
  { id: 7, name: 'Thandi', surname: 'Newton', phone: '072 222 3344', initials: 'TN', unpaidCount: 0, productRequests: [], orderAmount: 2500, ordersCount: 4, itemsCount: 9, addresses: [{ street: '59 Protea Way', complex: '', suburb: 'Newlands', city: 'Cape Town', province: 'Western Cape', postalCode: '7700' }] },
  { 
    id: 8, 
    name: 'Ben', 
    surname: 'Wall', 
    phone: '071 222 5566', 
    initials: 'BW', 
    unpaidCount: 2, 
    productRequests: [], 
    orderAmount: 42353, 
    ordersCount: 2, 
    itemsCount: 10,
    addresses: [{
      street: '123 Sunshine Avenue',
      complex: 'Apt 4B',
      suburb: 'Sea Point',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8005'
    }],
    orderThumbnails: [
      'https://media.direct.playstation.com/is/image/psdirect/ps5-pro-console-hero?fmt=png-alpha&wid=400',
      'https://images.unsplash.com/photo-1546868871-70ca48370afd?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop'
    ],
    extraItemsCount: 6
  }
];

const PRELOADED_CLIENTS = PRELOADED_CLIENTS_DATA.map(c => ({
  email: `${c.name.toLowerCase()}@example.com`,
  notes: '',
  addresses: c.addresses || [],
  deliveryPreference: 'None',
  isFavourite: false,
  unpaidCount: 0,
  isUserCreated: false,
  orderAmount: 0,
  createdAt: Date.now(),
  ...c
}));

const INITIAL_ORDERS = [
  {
    id: 'order-1',
    orderNumber: '235677',
    date: "Thu, 4 Dec '25",
    totalAmount: 26754,
    items: [
      {
        id: 'item-1',
        title: 'Playstation 5 Pro Console (PS5 PRO)',
        price: 19858,
        commission: 496.45,
        status: ['Paid', 'Processing'],
        image: 'https://media.direct.playstation.com/is/image/psdirect/ps5-pro-console-hero?fmt=png-alpha&wid=800',
        assignedClientId: 8
      },
      {
        id: 'item-2',
        title: 'NA231/00 Philips 2000 Series 6.2L Digital Window Airfryer',
        price: 1599,
        commission: 39.97,
        status: ['Paid', 'Processing'],
        image: 'https://images.philips.com/is/image/PhilipsConsumer/NA231_00-IMS-en_ZA?$jpglarge$&wid=1250',
        assignedClientId: 8
      },
      {
        id: 'item-3',
        title: 'The North Face Base Camp Duffel (Medium) Sulphur Spring',
        price: 3399,
        commission: 84.97,
        status: ['Paid', 'Processing'],
        image: 'https://images.thenorthface.com/is/image/TheNorthFace/NF0A52ST_79L_hero?$720x720$',
        assignedClientId: null
      },
      {
        id: 'item-restored-1',
        title: 'Logitech G502 HERO Wired Mouse',
        price: 1499,
        commission: 74.95,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      },
      {
        id: 'item-restored-2',
        title: 'S24 Silicone Case – Dark Violet',
        price: 399,
        commission: 19.95,
        status: ['Unpaid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1603915121226-068305739815?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      }
    ]
  },
  {
    id: 'order-2',
    orderNumber: '235689',
    date: "Fri, 5 Dec '25",
    totalAmount: 21395,
    items: [
      {
        id: 'item-ben-1',
        title: 'Apple Watch Series 10 - Jet Black Aluminum Case',
        price: 8999,
        commission: 224.97,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1546868871-70ca48370afd?q=80&w=200&auto=format&fit=crop',
        assignedClientId: 8
      },
      {
        id: 'item-ben-2',
        title: 'Sony WH-1000XM5 Noise Cancelling Wireless Headphones',
        price: 7499,
        commission: 187.47,
        status: ['Unpaid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop',
        assignedClientId: 8
      },
      {
        id: 'item-ben-3',
        title: 'Nike Air Max 270 Trainers - White/Black',
        price: 2799,
        commission: 69.97,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop',
        assignedClientId: 8
      },
      {
        id: 'item-ben-4',
        title: 'Adidas Stan Smith Primegreen Shoes',
        price: 1599,
        commission: 39.97,
        status: ['Unpaid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=400&auto=format&fit=crop',
        assignedClientId: 8
      },
      {
        id: 'item-restored-3',
        title: 'Apple 20W USB-C Power Adapter',
        price: 499,
        commission: 24.95,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      }
    ]
  },
  {
    id: 'order-3',
    orderNumber: '235912',
    date: "Sat, 6 Dec '25",
    totalAmount: 12496,
    items: [
      {
        id: 'item-unassigned-1',
        title: 'Nespresso Vertuo Pop Coffee Machine',
        price: 3499,
        commission: 87.48,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      },
      {
        id: 'item-unassigned-2',
        title: 'Hydro Flask 32oz Wide Mouth Bottle',
        price: 1299,
        commission: 32.48,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1602143307185-8140bc83196a?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      },
      {
        id: 'item-unassigned-3',
        title: 'JBL Flip 6 Waterproof Portable Speaker',
        price: 2499,
        commission: 62.48,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7ff?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      },
      {
        id: 'item-unassigned-4',
        title: 'Instant Pot Duo 7-in-1 Smart Cooker',
        price: 5199,
        commission: 129.98,
        status: ['Paid', 'Processing'],
        image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?q=80&w=400&auto=format&fit=crop',
        assignedClientId: null
      }
    ]
  }
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DASHBOARD);
  const [activeTab, setActiveTab] = useState<'Clients' | 'Orders'>('Clients');
  const [feedActiveTab, setFeedActiveTab] = useState<'Deals' | 'Join in'>('Deals');
  const [clients, setClients] = useState<any[]>(PRELOADED_CLIENTS); 
  const [orders, setOrders] = useState<any[]>(INITIAL_ORDERS);
  const [selectedClientIndex, setSelectedClientIndex] = useState<number | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [selectedJoinIn, setSelectedJoinIn] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingAssignment, setPendingAssignment] = useState<{ orderId: string, itemId: string } | null>(null);
  const [salesGoal, setSalesGoal] = useState(2500);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0); 
  const [ordersFilterClientId, setOrdersFilterClientId] = useState<number | null>(null);
  const [ordersFilterUnassigned, setOrdersFilterUnassigned] = useState(true);

  // Auto-scroll to top on any navigation or state change that alters the view
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentScreen, activeTab, feedActiveTab, selectedClientIndex, selectedDeal, selectedJoinIn, showSettings]);

  const unassignedCount = useMemo(() => {
    return orders.reduce((acc, order) => {
      return acc + order.items.filter((item: any) => !item.assignedClientId).length;
    }, 0);
  }, [orders]);

  const handleNavigate = (screen: Screen) => {
    if (screen === Screen.HOME || screen === Screen.DASHBOARD) {
      setCurrentScreen(Screen.DASHBOARD);
      setShowSettings(false);
    } else if (screen === Screen.CLIENTS_ROOT) {
      setActiveTab('Clients');
      setCurrentScreen(Screen.CLIENTS_ROOT);
      setShowSettings(false);
    } else if (screen === Screen.ME) {
      setCurrentScreen(Screen.ME);
      setShowSettings(false);
    } else {
      setCurrentScreen(screen);
      setShowSettings(false);
    }
    setToastMessage(null);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateClient = (clientId: number, updates: any) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  const handleAssignClient = (orderId: string, itemId: string, clientId: number | null) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        items: order.items.map((item: any) => {
          if (item.id !== itemId) return item;
          return { ...item, assignedClientId: clientId };
        })
      };
    }));
    showToast(clientId ? 'Items assigned to client' : 'Unassigned');
  };

  const handleBatchAssign = (itemIds: string[], clientId: number | null) => {
    setOrders(prevOrders => prevOrders.map(order => ({
      ...order,
      items: order.items.map((item: any) => {
        if (itemIds.includes(item.id)) {
          return { ...item, assignedClientId: clientId };
        }
        return item;
      })
    })));
    showToast(clientId ? 'Items assigned to client' : 'Items unassigned');
  };

  const handleUpdateItemStatus = (itemIds: string[], isPaid: boolean) => {
    setOrders(prevOrders => prevOrders.map(order => ({
      ...order,
      items: order.items.map((item: any) => {
        if (itemIds.includes(item.id)) {
          const baseStatus = item.status.filter((s: string) => s !== 'Paid' && s !== 'Unpaid');
          return {
            ...item,
            status: [isPaid ? 'Paid' : 'Unpaid', ...baseStatus]
          };
        }
        return item;
      })
    })));
    showToast(isPaid ? 'Items marked as paid' : 'Items marked as unpaid');
  };

  const handleSaveProductRequest = (request: any) => {
    if (selectedClientIndex === null) return;
    const updatedClients = [...clients];
    const client = updatedClients[selectedClientIndex];
    client.productRequests = [request, ...(client.productRequests || [])];
    setClients(updatedClients);
    setCurrentScreen(Screen.CLIENT_DETAILS);
    showToast('Product request added');
  };

  const handleDeleteProductRequest = (reqIdx: number) => {
    if (selectedClientIndex === null) return;
    const updatedClients = [...clients];
    const client = updatedClients[selectedClientIndex];
    client.productRequests = client.productRequests.filter((_: any, i: number) => i !== reqIdx);
    setClients(updatedClients);
  };

  const handleSaveAddress = (address: any) => {
    if (selectedClientIndex === null) return;
    const clientToUpdate = clients[selectedClientIndex];
    const updatedAddresses = [...(clientToUpdate.addresses || []), address];
    handleUpdateClient(clientToUpdate.id, { addresses: updatedAddresses });
    setCurrentScreen(Screen.CLIENT_DETAILS);
    showToast('Address added');
  };

  const handleDeleteAddress = (addrIdx: number) => {
    if (selectedClientIndex === null) return;
    const clientToUpdate = clients[selectedClientIndex];
    const updatedAddresses = clientToUpdate.addresses.filter((_: any, i: number) => i !== addrIdx);
    handleUpdateClient(clientToUpdate.id, { addresses: updatedAddresses });
  };

  const handleViewOrderHistory = (clientId: number) => {
    setOrdersFilterClientId(clientId);
    setOrdersFilterUnassigned(false);
    setActiveTab('Orders');
    setCurrentScreen(Screen.CLIENTS_ROOT);
  };

  const renderScreen = () => {
    if (showSettings) {
      return <Settings onClose={() => setShowSettings(false)} />;
    }

    switch (currentScreen) {
      case Screen.DASHBOARD:
        return (
          <Dashboard 
            unassignedCount={unassignedCount} 
            totalClients={clients.length}
            salesGoal={salesGoal}
            onUpdateSalesGoal={setSalesGoal}
            onNavigate={handleNavigate}
            onNavigateToFeed={(tab) => {
              setFeedActiveTab(tab);
              setCurrentScreen(Screen.FEED);
            }}
            onNavigateToUnassigned={() => {
              setActiveTab('Orders');
              setCurrentScreen(Screen.CLIENTS_ROOT);
              setOrdersFilterUnassigned(true);
              setOrdersFilterClientId(null);
            }} 
            onAddClient={() => setCurrentScreen(Screen.ADD_CLIENT)} 
          />
        );
      case Screen.CLIENTS_ROOT:
        if (activeTab === 'Clients') {
          return <ClientsLanding clients={clients} activeTab="Clients" onTabChange={setActiveTab} onAddClient={() => setCurrentScreen(Screen.ADD_CLIENT)} onSelectClient={(idx) => { setSelectedClientIndex(idx); setCurrentScreen(Screen.CLIENT_DETAILS); }} unassignedCountGlobal={unassignedCount} />;
        } else {
          return <OrdersLanding 
            orders={orders} 
            clients={clients} 
            activeTab={activeTab}
            onTabChange={setActiveTab} 
            onAssignClient={handleAssignClient} 
            onUpdateItemStatus={handleUpdateItemStatus} 
            onBatchAssign={handleBatchAssign} 
            onAddClientRequest={(orderId, itemId) => {
              setPendingAssignment({ orderId, itemId });
              setCurrentScreen(Screen.ADD_CLIENT);
            }} 
            toastMessage={toastMessage} 
            onClearToast={() => setToastMessage(null)} 
            unassignedCountGlobal={unassignedCount}
            selectedFilterClientId={ordersFilterClientId}
            setSelectedFilterClientId={setOrdersFilterClientId}
            filterUnassigned={ordersFilterUnassigned}
            setFilterUnassigned={setOrdersFilterUnassigned}
          />;
        }
      case Screen.ADD_CLIENT:
        return <AddClientDetails 
          onBack={() => {
            setCurrentScreen(Screen.DASHBOARD);
            setPendingAssignment(null);
          }} 
          onSave={(c) => { 
            const newClient = { ...c, id: Date.now(), productRequests: [], addresses: [] };
            const newClients = [newClient, ...clients];
            setClients(newClients); 
            
            setSelectedClientIndex(0);
            setCurrentScreen(Screen.CLIENT_DETAILS);
            
            if (pendingAssignment) {
              handleAssignClient(pendingAssignment.orderId, pendingAssignment.itemId, newClient.id);
              setPendingAssignment(null);
            } else {
              showToast('Client added');
            }
          }} 
        />;
      case Screen.CLIENT_DETAILS:
        if (selectedClientIndex === null) return null;
        return <ClientDetails 
          client={clients[selectedClientIndex]} 
          onClose={() => setCurrentScreen(Screen.CLIENTS_ROOT)} 
          onAddProductRequest={() => setCurrentScreen(Screen.ADD_PRODUCT_REQUEST)} 
          onAddAddress={() => setCurrentScreen(Screen.ADD_ADDRESS)} 
          onSetDeliveryPreference={(pref) => handleUpdateClient(clients[selectedClientIndex].id, { deliveryPreference: pref })} 
          onToggleFavourite={() => {}} 
          onDeleteProductRequest={handleDeleteProductRequest} 
          onDeleteAddress={handleDeleteAddress} 
          onViewOrderHistory={() => handleViewOrderHistory(clients[selectedClientIndex].id)}
          toastMessage={toastMessage}
        />;
      case Screen.ADD_PRODUCT_REQUEST:
        return <AddProductRequest onBack={() => setCurrentScreen(Screen.CLIENT_DETAILS)} onAdd={handleSaveProductRequest} />;
      case Screen.ADD_ADDRESS:
        return <AddAddress onBack={() => setCurrentScreen(Screen.CLIENT_DETAILS)} onAdd={handleSaveAddress} />;
      case Screen.ME:
        return <Me 
          salesGoal={salesGoal} 
          onUpdateSalesGoal={setSalesGoal} 
          onOpenSettings={() => setShowSettings(true)}
          selectedMonthIdx={selectedMonthIdx}
          onMonthChange={setSelectedMonthIdx}
        />;
      case Screen.LEADERBOARD:
        return <Leaderboard />;
      case Screen.FEED:
        return <Feed 
          activeTab={feedActiveTab}
          onTabChange={setFeedActiveTab}
          onSelectDeal={(deal) => {
            setSelectedDeal(deal);
            setCurrentScreen(Screen.DEAL_DETAIL);
          }} 
          onSelectJoinIn={(post) => {
            setSelectedJoinIn(post);
            setCurrentScreen(Screen.JOIN_IN_DETAIL);
          }}
        />;
      case Screen.DEAL_DETAIL:
        if (!selectedDeal) return null;
        return <DealDetail deal={selectedDeal} onClose={() => setCurrentScreen(Screen.FEED)} />;
      case Screen.JOIN_IN_DETAIL:
        if (!selectedJoinIn) return null;
        return <JoinInDetail post={selectedJoinIn} onClose={() => setCurrentScreen(Screen.FEED)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[390px] mx-auto bg-white relative font-sans flex flex-col shadow-2xl">
      <div className="flex-1 relative">
        {renderScreen()}
      </div>
      {!showSettings && 
       currentScreen !== Screen.ADD_CLIENT && 
       currentScreen !== Screen.DEAL_DETAIL && 
       currentScreen !== Screen.JOIN_IN_DETAIL && 
       currentScreen !== Screen.ADD_PRODUCT_REQUEST && 
       currentScreen !== Screen.ADD_ADDRESS && (
        <BottomNav activeScreen={currentScreen} activeTab={activeTab} onNavigate={handleNavigate} unassignedCount={unassignedCount} />
      )}
    </div>
  );
};

export default App;