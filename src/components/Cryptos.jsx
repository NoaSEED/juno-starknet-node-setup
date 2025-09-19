import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Cryptos = () => {
  const cryptos = [
    {
      id: 'btc',
      name: 'BTC',
      fullName: 'Bitcoin',
      price: '$ 8.139.697,64',
      icon: '₿',
      color: '#ff6600'
    },
    {
      id: 'eth',
      name: 'ETH',
      fullName: 'Ether',
      price: '$ 592.555,60',
      icon: 'Ξ',
      color: '#8b5cf6'
    },
    {
      id: 'usdc',
      name: 'USDC',
      fullName: 'USD Coin',
      price: '$ 211,33',
      icon: 'U',
      color: '#0066cc'
    },
    {
      id: 'xrp',
      name: 'XRP',
      fullName: 'Ripple',
      price: '$ 128,30',
      icon: 'X',
      color: '#000000'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center mb-6">
        <a href="/investments" className="text-galicia-orange text-sm hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          volver
        </a>
      </div>

      {/* Título de sección */}
      <div className="mb-2">
        <h2 className="text-sm text-galicia-gray font-medium">Criptos</h2>
      </div>

      {/* Título principal */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-galicia-blue">
          Elegí qué cripto querés comprar
        </h1>
      </div>

      {/* Grid de criptomonedas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="crypto-card">
            <div 
              className="crypto-icon"
              style={{ backgroundColor: crypto.color }}
            >
              {crypto.icon}
            </div>
            <div className="crypto-name">{crypto.name}</div>
            <div className="crypto-full-name">{crypto.fullName}</div>
            <div className="crypto-price">{crypto.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cryptos;
