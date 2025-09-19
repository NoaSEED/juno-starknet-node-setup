import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  Menu, 
  X, 
  LogOut, 
  User,
  Bell,
  Settings,
  CreditCard,
  ArrowUpDown,
  Building2
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home, path: '/' },
    { id: 'accounts', label: 'Cuentas', icon: CreditCard, path: '/accounts' },
    { id: 'cards', label: 'Tarjetas', icon: CreditCard, path: '/cards' },
    { id: 'transfers', label: 'Transferencias', icon: ArrowUpDown, path: '/transfers' },
    { id: 'payments', label: 'Pagos de servicios', icon: Building2, path: '/payments' },
    { id: 'business', label: 'Comercios', icon: Building2, path: '/business' },
    { id: 'dollars', label: 'Compra/Venta de Dólares', icon: DollarSign, path: '/dollars' },
    { id: 'staking', label: 'Staking ETH', icon: TrendingUp, path: '/staking', highlight: true },
    { id: 'trading', label: 'Trading USDT/USDC', icon: DollarSign, path: '/trading', highlight: true },
    { id: 'investments', label: 'Inversiones', icon: TrendingUp, path: '/investments', active: true },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-galicia-light-gray">
      {/* Sidebar */}
      <div className={`galicia-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-galicia-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-galicia-blue rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="ml-3 text-galicia-orange font-semibold text-sm">Negocios y Pymes</span>
          </div>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.path}
                className={`nav-item ${item.active ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User info en sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-galicia-border">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-galicia-blue rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-galicia-blue font-medium text-sm">{user?.name}</p>
              <p className="text-galicia-gray text-xs">Cuenta: {user?.accountNumber}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-galicia-gray hover:text-galicia-blue rounded-lg transition-colors duration-200 text-sm"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="galicia-main">
        {/* Header */}
        <header className="galicia-header">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-galicia-gray hover:text-galicia-blue mr-4"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-galicia-blue">
              Home Banking
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-galicia-gray hover:text-galicia-blue relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 text-galicia-gray hover:text-galicia-blue">
              <Settings className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-galicia-blue">{user?.name}</p>
                <p className="text-xs text-galicia-gray">Saldo: ${user?.balance?.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-galicia-blue rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="galicia-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
