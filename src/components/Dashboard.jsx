import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import JunoMonitor from './JunoMonitor';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff,
  ArrowLeft,
  LogOut,
  Server,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = React.useState(true);
  const [activeTab, setActiveTab] = useState('portfolio');

  // Datos de ejemplo para gráficos
  const balanceHistory = [
    { month: 'Ene', balance: 120000 },
    { month: 'Feb', balance: 122000 },
    { month: 'Mar', balance: 118000 },
    { month: 'Abr', balance: 125000 },
    { month: 'May', balance: 128000 },
    { month: 'Jun', balance: 125000 },
  ];

  const portfolioData = [
    { name: 'ARS', value: 75000, color: '#003366' },
    { name: 'ETH Staking', value: 25000, color: '#00a651' },
    { name: 'USDT', value: 15000, color: '#ff6600' },
    { name: 'USDC', value: 10000, color: '#0066cc' },
  ];

  const recentTransactions = [
    { id: 1, type: 'deposit', amount: 5000, description: 'Depósito a plazo fijo', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'staking', amount: 2000, description: 'Staking ETH', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'trading', amount: 1000, description: 'Compra USDT', date: '2024-01-13', status: 'completed' },
    { id: 4, type: 'withdrawal', amount: -3000, description: 'Transferencia', date: '2024-01-12', status: 'completed' },
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'staking': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'trading': return <DollarSign className="w-4 h-4 text-orange-600" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default: return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header con saldo */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-galicia-blue">Bienvenido, {user?.name}</h1>
            <p className="text-galicia-gray mt-1 text-sm">Resumen de tu cuenta</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-sm text-galicia-gray">Saldo disponible</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-galicia-gray hover:text-galicia-blue"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-2xl font-bold text-galicia-blue">
                {showBalance ? formatAmount(user?.balance) : '••••••'}
              </p>
            </div>
            <button
              onClick={logout}
              className="btn btn-outline text-sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>


      {/* Tabs para Portfolio y JUNO */}
      <div className="card p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-galicia-blue text-white'
                : 'text-galicia-gray hover:text-galicia-blue'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('juno')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'juno'
                ? 'bg-galicia-blue text-white'
                : 'text-galicia-gray hover:text-galicia-blue'
            }`}
          >
            <Server className="w-4 h-4 inline mr-2" />
            Nodo JUNO
          </button>
        </div>

        {/* Contenido de tabs */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Cards de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-galicia-gray">Staking ETH</p>
                    <p className="text-xl font-bold text-galicia-green">$25,000</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5% este mes
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-galicia-green" />
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-galicia-gray">Trading USDT/USDC</p>
                    <p className="text-xl font-bold text-galicia-orange">$15,000</p>
                    <p className="text-sm text-orange-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8.2% este mes
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-galicia-orange" />
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-galicia-gray">Depósitos</p>
                    <p className="text-xl font-bold text-galicia-blue">$50,000</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +5.8% anual
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-galicia-blue" />
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-galicia-gray">Rendimiento Total</p>
                    <p className="text-xl font-bold text-galicia-green">+$3,250</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2.6% este mes
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-galicia-green" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de evolución del saldo */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-galicia-blue mb-4">
                  Evolución del Saldo
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={balanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatAmount(value), 'Saldo']} />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#003366" 
                      strokeWidth={3}
                      dot={{ fill: '#003366', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de distribución del portfolio */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-galicia-blue mb-4">
                  Distribución del Portfolio
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatAmount(value), 'Valor']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {portfolioData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-galicia-gray">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transacciones recientes */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-galicia-blue mb-4">
                Transacciones Recientes
              </h3>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-galicia-light-gray rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-galicia-blue">{transaction.description}</p>
                        <p className="text-sm text-galicia-gray">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'juno' && <JunoMonitor />}
      </div>
    </div>
  );
};

export default Dashboard;
