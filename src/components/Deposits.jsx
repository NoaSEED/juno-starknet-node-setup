import React, { useState } from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Lock,
  Unlock,
  Info,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Deposits = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('30');
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Datos de ejemplo
  const depositRates = {
    '30': { rate: 5.8, minAmount: 10000, maxAmount: 1000000 },
    '60': { rate: 6.2, minAmount: 25000, maxAmount: 2000000 },
    '90': { rate: 6.8, minAmount: 50000, maxAmount: 5000000 },
    '180': { rate: 7.5, minAmount: 100000, maxAmount: 10000000 },
    '365': { rate: 8.2, minAmount: 200000, maxAmount: 20000000 },
  };

  const activeDeposits = [
    {
      id: 1,
      amount: 500000,
      rate: 6.8,
      term: 90,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'active',
      earnedInterest: 8500
    },
    {
      id: 2,
      amount: 250000,
      rate: 5.8,
      term: 30,
      startDate: '2024-02-01',
      endDate: '2024-03-03',
      status: 'matured',
      earnedInterest: 1200
    },
    {
      id: 3,
      amount: 1000000,
      rate: 7.5,
      term: 180,
      startDate: '2023-10-01',
      endDate: '2024-04-01',
      status: 'active',
      earnedInterest: 37500
    }
  ];

  const interestHistory = [
    { month: 'Ene', interest: 2500 },
    { month: 'Feb', interest: 3200 },
    { month: 'Mar', interest: 2800 },
    { month: 'Abr', interest: 4100 },
  ];

  const totalDeposited = activeDeposits
    .filter(d => d.status === 'active')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalEarned = activeDeposits
    .reduce((sum, d) => sum + d.earnedInterest, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateInterest = (amount, rate, term) => {
    return (amount * rate * term) / (100 * 365);
  };

  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) >= depositRates[selectedTerm].minAmount) {
      console.log('Nuevo depósito:', {
        amount: parseFloat(depositAmount),
        term: selectedTerm,
        rate: depositRates[selectedTerm].rate
      });
      setShowDepositModal(false);
      setDepositAmount('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'matured':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'matured':
        return 'Vencido';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'matured':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-galicia-blue flex items-center">
              <PiggyBank className="w-8 h-8 mr-3" />
              Depósitos a Plazo Fijo
            </h1>
            <p className="text-gray-600 mt-1">Invierte tu dinero con tasas competitivas y seguridad garantizada</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Tasa promedio</p>
            <p className="text-2xl font-bold text-galicia-green">6.7%</p>
          </div>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Depositado</p>
              <p className="text-2xl font-bold text-galicia-blue">{formatCurrency(totalDeposited)}</p>
              <p className="text-sm text-gray-600">{activeDeposits.filter(d => d.status === 'active').length} depósitos activos</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-galicia-blue" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Intereses Ganados</p>
              <p className="text-2xl font-bold text-galicia-green">{formatCurrency(totalEarned)}</p>
              <p className="text-sm text-green-600">+12.5% este año</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-galicia-green" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa Promedio</p>
              <p className="text-2xl font-bold text-galicia-orange">6.7%</p>
              <p className="text-sm text-orange-600">+0.3% vs mes anterior</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-galicia-orange" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próximo Vencimiento</p>
              <p className="text-2xl font-bold text-galicia-blue">15 días</p>
              <p className="text-sm text-gray-600">$500,000</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-galicia-blue" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de nuevo depósito */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Nuevo Depósito
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto a depositar
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent"
                  placeholder="10000"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Mínimo: {formatCurrency(depositRates[selectedTerm].minAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent"
                >
                  {Object.entries(depositRates).map(([term, data]) => (
                    <option key={term} value={term}>
                      {term} días - {data.rate}% TNA
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Info className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Resumen</span>
                </div>
                <div className="space-y-1 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Monto:</span>
                    <span>{depositAmount ? formatCurrency(parseFloat(depositAmount)) : '$0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plazo:</span>
                    <span>{selectedTerm} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa:</span>
                    <span>{depositRates[selectedTerm].rate}% TNA</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Interés estimado:</span>
                    <span>
                      {depositAmount ? formatCurrency(calculateInterest(parseFloat(depositAmount), depositRates[selectedTerm].rate, parseInt(selectedTerm))) : '$0'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDepositModal(true)}
                className="w-full btn btn-primary"
                disabled={!depositAmount || parseFloat(depositAmount) < depositRates[selectedTerm].minAmount}
              >
                <Lock className="w-4 h-4" />
                Crear Depósito
              </button>
            </div>
          </div>
        </div>

        {/* Lista de depósitos activos */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Mis Depósitos
            </h3>
            <div className="space-y-4">
              {activeDeposits.map((deposit) => (
                <div key={deposit.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getStatusIcon(deposit.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                        {getStatusText(deposit.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-galicia-blue">
                        {formatCurrency(deposit.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {deposit.rate}% TNA - {deposit.term} días
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Fecha inicio</p>
                      <p className="font-medium">{deposit.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha vencimiento</p>
                      <p className="font-medium">{deposit.endDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interés ganado</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(deposit.earnedInterest)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Días restantes</p>
                      <p className="font-medium">
                        {deposit.status === 'active' ? '45' : 'Vencido'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Intereses Ganados por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interestHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Intereses']} />
              <Bar dataKey="interest" fill="#00a651" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Tasas de Interés por Plazo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Object.entries(depositRates).map(([term, data]) => ({ term: `${term} días`, rate: data.rate }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="term" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Tasa']} />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#003366" 
                strokeWidth={3}
                dot={{ fill: '#003366', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Confirmar Depósito
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Monto:</span>
                    <span className="font-medium text-blue-800">
                      {formatCurrency(parseFloat(depositAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Plazo:</span>
                    <span className="font-medium text-blue-800">{selectedTerm} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Tasa:</span>
                    <span className="font-medium text-blue-800">
                      {depositRates[selectedTerm].rate}% TNA
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-blue-200 pt-2">
                    <span className="text-blue-800">Interés estimado:</span>
                    <span className="text-blue-800">
                      {formatCurrency(calculateInterest(parseFloat(depositAmount), depositRates[selectedTerm].rate, parseInt(selectedTerm)))}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeposit}
                  className="flex-1 btn btn-primary"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;
