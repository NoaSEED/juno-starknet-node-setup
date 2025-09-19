import React, { useState } from 'react';
import { 
  TrendingUp, 
  Lock, 
  Unlock, 
  DollarSign, 
  Calendar,
  Info,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Staking = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);

  // Datos de ejemplo
  const ethPrice = 2500;
  const stakingAPY = 5.2;
  const totalStaked = 10.5;
  const totalRewards = 0.85;
  const availableBalance = 2.3;

  // Datos para gráficos
  const stakingHistory = [
    { date: '2024-01-01', staked: 8.0, rewards: 0.0 },
    { date: '2024-01-15', staked: 8.5, rewards: 0.1 },
    { date: '2024-02-01', staked: 9.0, rewards: 0.2 },
    { date: '2024-02-15', staked: 9.5, rewards: 0.35 },
    { date: '2024-03-01', staked: 10.0, rewards: 0.5 },
    { date: '2024-03-15', staked: 10.5, rewards: 0.7 },
    { date: '2024-04-01', staked: 10.5, rewards: 0.85 },
  ];

  const rewardsHistory = [
    { month: 'Ene', rewards: 0.05 },
    { month: 'Feb', rewards: 0.12 },
    { month: 'Mar', rewards: 0.18 },
    { month: 'Abr', rewards: 0.25 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatETH = (amount) => {
    return `${amount.toFixed(4)} ETH`;
  };

  const handleStake = () => {
    if (stakeAmount && parseFloat(stakeAmount) > 0) {
      // Simular staking
      console.log('Staking:', stakeAmount, 'ETH');
      setShowStakeModal(false);
      setStakeAmount('');
    }
  };

  const handleUnstake = () => {
    if (unstakeAmount && parseFloat(unstakeAmount) > 0) {
      // Simular unstaking
      console.log('Unstaking:', unstakeAmount, 'ETH');
      setShowUnstakeModal(false);
      setUnstakeAmount('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-galicia-blue flex items-center">
              <TrendingUp className="w-8 h-8 mr-3" />
              Staking de Ethereum
            </h1>
            <p className="text-gray-600 mt-1">Gana rendimientos por mantener ETH en staking</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Precio ETH</p>
            <p className="text-2xl font-bold text-galicia-green">{formatCurrency(ethPrice)}</p>
          </div>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total en Staking</p>
              <p className="text-2xl font-bold text-galicia-blue">{formatETH(totalStaked)}</p>
              <p className="text-sm text-gray-600">{formatCurrency(totalStaked * ethPrice)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-galicia-blue" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recompensas Acumuladas</p>
              <p className="text-2xl font-bold text-galicia-green">{formatETH(totalRewards)}</p>
              <p className="text-sm text-gray-600">{formatCurrency(totalRewards * ethPrice)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-galicia-green" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">APY Actual</p>
              <p className="text-2xl font-bold text-galicia-orange">{stakingAPY}%</p>
              <p className="text-sm text-green-600">+0.2% vs mes anterior</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-galicia-orange" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ETH Disponible</p>
              <p className="text-2xl font-bold text-galicia-blue">{formatETH(availableBalance)}</p>
              <p className="text-sm text-gray-600">{formatCurrency(availableBalance * ethPrice)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Unlock className="w-6 h-6 text-galicia-blue" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Stake ETH
          </h3>
          <p className="text-gray-600 mb-4">
            Bloquea ETH para ganar recompensas de staking. El período mínimo es de 30 días.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad a stakear (ETH)
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent"
                placeholder="0.0"
                step="0.01"
                min="0"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Info className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Información</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• APY estimado: {stakingAPY}% anual</li>
                <li>• Período mínimo: 30 días</li>
                <li>• Recompensas se acreditan diariamente</li>
              </ul>
            </div>
            <button
              onClick={() => setShowStakeModal(true)}
              className="w-full btn btn-primary"
              disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
            >
              <Lock className="w-4 h-4" />
              Stake ETH
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Unstake ETH
          </h3>
          <p className="text-gray-600 mb-4">
            Retira ETH del staking. El proceso puede tomar hasta 7 días.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad a retirar (ETH)
              </label>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-galicia-blue focus:border-transparent"
                placeholder="0.0"
                step="0.01"
                min="0"
                max={totalStaked}
              />
              <p className="text-sm text-gray-500 mt-1">
                Máximo disponible: {formatETH(totalStaked)}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Info className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">Importante</span>
              </div>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Tiempo de retiro: 7 días</li>
                <li>• No ganarás recompensas durante el período de retiro</li>
                <li>• Las recompensas pendientes se acreditarán automáticamente</li>
              </ul>
            </div>
            <button
              onClick={() => setShowUnstakeModal(true)}
              className="w-full btn btn-outline"
              disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
            >
              <Unlock className="w-4 h-4" />
              Unstake ETH
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Evolución del Staking
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stakingHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'ETH']} />
              <Area 
                type="monotone" 
                dataKey="staked" 
                stackId="1"
                stroke="#003366" 
                fill="#003366"
                fillOpacity={0.3}
              />
              <Area 
                type="monotone" 
                dataKey="rewards" 
                stackId="2"
                stroke="#00a651" 
                fill="#00a651"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Recompensas Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rewardsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'ETH']} />
              <Line 
                type="monotone" 
                dataKey="rewards" 
                stroke="#00a651" 
                strokeWidth={3}
                dot={{ fill: '#00a651', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal de confirmación de stake */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Confirmar Staking
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Cantidad:</strong> {stakeAmount} ETH
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Valor:</strong> {formatCurrency(parseFloat(stakeAmount || 0) * ethPrice)}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>APY:</strong> {stakingAPY}%
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStakeModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStake}
                  className="flex-1 btn btn-primary"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de unstake */}
      {showUnstakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-galicia-blue mb-4">
              Confirmar Unstaking
            </h3>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Cantidad:</strong> {unstakeAmount} ETH
                </p>
                <p className="text-sm text-orange-800">
                  <strong>Valor:</strong> {formatCurrency(parseFloat(unstakeAmount || 0) * ethPrice)}
                </p>
                <p className="text-sm text-orange-800">
                  <strong>Tiempo de retiro:</strong> 7 días
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUnstakeModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUnstake}
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

export default Staking;
