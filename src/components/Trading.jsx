import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  RefreshCw,
  Info,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Trading = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [selectedPair, setSelectedPair] = useState('USDT/USDC');

  // Datos de ejemplo
  const prices = {
    'USDT/USDC': { price: 1.001, change: 0.1, volume: '2.5M' },
    'USDT/ARS': { price: 850.5, change: -0.5, volume: '1.8M' },
    'USDC/ARS': { price: 849.2, change: 0.3, volume: '1.2M' },
  };

  const balances = {
    USDT: 5000.0,
    USDC: 3000.0,
    ARS: 150000.0,
  };

  const priceHistory = [
    { time: '09:00', price: 1.000 },
    { time: '10:00', price: 1.001 },
    { time: '11:00', price: 0.999 },
    { time: '12:00', price: 1.002 },
    { time: '13:00', price: 1.001 },
    { time: '14:00', price: 1.003 },
    { time: '15:00', price: 1.001 },
  ];

  const recentTrades = [
    { id: 1, pair: 'USDT/USDC', type: 'buy', amount: 1000, price: 1.001, time: '15:30' },
    { id: 2, pair: 'USDT/ARS', type: 'sell', amount: 500, price: 850.5, time: '15:25' },
    { id: 3, pair: 'USDC/ARS', type: 'buy', amount: 2000, price: 849.2, time: '15:20' },
    { id: 4, pair: 'USDT/USDC', type: 'sell', amount: 1500, price: 1.000, time: '15:15' },
  ];

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatARS = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAmountChange = (value, isFrom) => {
    if (isFrom) {
      setFromAmount(value);
      if (value && !isNaN(value)) {
        const currentPrice = prices[selectedPair]?.price || 1;
        setToAmount((parseFloat(value) * currentPrice).toFixed(6));
      } else {
        setToAmount('');
      }
    } else {
      setToAmount(value);
      if (value && !isNaN(value)) {
        const currentPrice = prices[selectedPair]?.price || 1;
        setFromAmount((parseFloat(value) / currentPrice).toFixed(6));
      } else {
        setFromAmount('');
      }
    }
  };

  const handleTrade = () => {
    if (fromAmount && toAmount) {
      console.log(`${activeTab === 'buy' ? 'Compra' : 'Venta'}:`, {
        pair: selectedPair,
        fromAmount,
        toAmount,
        price: prices[selectedPair]?.price
      });
      // Simular trade
      setFromAmount('');
      setToAmount('');
    }
  };

  const getPairSymbols = (pair) => {
    const [from, to] = pair.split('/');
    return { from, to };
  };

  const { from: fromSymbol, to: toSymbol } = getPairSymbols(selectedPair);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-galicia-blue flex items-center">
              <ArrowUpDown className="w-8 h-8 mr-3" />
              Trading USDT/USDC
            </h1>
            <p className="text-gray-600 mt-1">Compra y vende stablecoins con las mejores tasas</p>
          </div>
          <button className="btn btn-outline">
            <RefreshCw className="w-4 h-4" />
            Actualizar Precios
          </button>
        </div>
      </div>

      {/* Selector de pares */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-galicia-blue mb-4">
          Seleccionar Par de Trading
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(prices).map(([pair, data]) => (
            <button
              key={pair}
              onClick={() => setSelectedPair(pair)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPair === pair
                  ? 'border-galicia-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-gray-900">{pair}</p>
                <p className="text-2xl font-bold text-galicia-blue">
                  {pair.includes('ARS') ? formatARS(data.price) : formatCurrency(data.price)}
                </p>
                <p className={`text-sm flex items-center ${
                  data.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {data.change > 0 ? '+' : ''}{data.change}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Vol: {data.volume}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de trading */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs de compra/venta */}
          <div className="card p-6">
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab('buy')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'buy'
                    ? 'bg-green-100 text-green-800 border-2 border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 inline mr-2" />
                Comprar
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'sell'
                    ? 'bg-red-100 text-red-800 border-2 border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 inline mr-2" />
                Vender
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'buy' ? 'Comprar' : 'Vender'} {fromSymbol}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => handleAmountChange(e.target.value, true)}
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-gray-600">{fromSymbol}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Disponible: {balances[fromSymbol]?.toFixed(2) || '0.00'} {fromSymbol}
                </p>
              </div>

              <div className="flex justify-center">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recibir {toSymbol}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => handleAmountChange(e.target.value, false)}
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-medium text-gray-600">{toSymbol}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Disponible: {balances[toSymbol]?.toFixed(2) || '0.00'} {toSymbol}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-medium">
                    {selectedPair.includes('ARS') 
                      ? formatARS(prices[selectedPair]?.price || 0)
                      : formatCurrency(prices[selectedPair]?.price || 0)
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Comisión:</span>
                  <span className="font-medium">0.1%</span>
                </div>
              </div>

              <button
                onClick={handleTrade}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  activeTab === 'buy'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={!fromAmount || !toAmount}
              >
                {activeTab === 'buy' ? 'Comprar' : 'Vender'} {fromSymbol}
              </button>
            </div>
          </div>

          {/* Gráfico de precios */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Precio de {selectedPair}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [
                  selectedPair.includes('ARS') ? formatARS(value) : formatCurrency(value),
                  'Precio'
                ]} />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#003366" 
                  strokeWidth={2}
                  dot={{ fill: '#003366', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Balances */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Mis Balances
            </h3>
            <div className="space-y-4">
              {Object.entries(balances).map(([currency, balance]) => (
                <div key={currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-galicia-blue rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">{currency.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{currency}</span>
                  </div>
                  <span className="font-semibold">
                    {currency === 'ARS' ? formatARS(balance) : balance.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trades recientes */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Trades Recientes
            </h3>
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{trade.pair}</p>
                    <p className="text-xs text-gray-500">{trade.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.type === 'buy' ? 'Compra' : 'Venta'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {trade.amount} @ {trade.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información del mercado */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Información del Mercado
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Spread 24h</span>
                <span className="text-sm font-medium">0.02%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Volumen 24h</span>
                <span className="text-sm font-medium">$5.2M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mejor Bid</span>
                <span className="text-sm font-medium">
                  {selectedPair.includes('ARS') 
                    ? formatARS(prices[selectedPair]?.price * 0.999)
                    : formatCurrency(prices[selectedPair]?.price * 0.999)
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mejor Ask</span>
                <span className="text-sm font-medium">
                  {selectedPair.includes('ARS') 
                    ? formatARS(prices[selectedPair]?.price * 1.001)
                    : formatCurrency(prices[selectedPair]?.price * 1.001)
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
