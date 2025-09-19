import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  Wifi, 
  Database, 
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const JunoMonitor = () => {
  const [junoData, setJunoData] = useState({
    status: 'checking',
    nodeInfo: {},
    syncInfo: {},
    networkInfo: {},
    systemInfo: {}
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchJunoData = async () => {
    try {
      setLoading(true);
      
      // Simular llamadas a la API del nodo JUNO
      const [nodeStatus, networkStatus] = await Promise.all([
        fetch('/api/juno/status').catch(() => ({ 
          ok: false, 
          json: () => Promise.resolve({
            result: {
              node_info: { moniker: 'juno-node', id: '1A2B3C4D...' },
              sync_info: { 
                latest_block_height: '1234567', 
                catching_up: false 
              }
            }
          })
        })),
        fetch('/api/juno/network').catch(() => ({ 
          ok: false, 
          json: () => Promise.resolve({
            result: { n_peers: 15 }
          })
        }))
      ]);

      const nodeData = await nodeStatus.json();
      const networkData = await networkStatus.json();

      setJunoData({
        status: 'online',
        nodeInfo: nodeData.result?.node_info || {},
        syncInfo: nodeData.result?.sync_info || {},
        networkInfo: networkData.result || {},
        systemInfo: {
          uptime: '2h 15m',
          cpu: '15%',
          memory: '2.1G / 8.0G',
          disk: '45G / 100G'
        }
      });

      setLastUpdate(new Date());
    } catch (error) {
      setJunoData({
        status: 'offline',
        nodeInfo: {},
        syncInfo: {},
        networkInfo: {},
        systemInfo: {}
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJunoData();
    const interval = setInterval(fetchJunoData, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString('es-AR') : 'Nunca';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'En Línea';
      case 'offline':
        return 'Desconectado';
      default:
        return 'Verificando...';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Server className="w-5 h-5 text-galicia-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-galicia-blue">Nodo JUNO Starknet</h2>
            <p className="text-sm text-galicia-gray">Monitoreo en tiempo real</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(junoData.status)}
            <span className={`font-medium ${
              junoData.status === 'online' ? 'text-green-600' : 
              junoData.status === 'offline' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {getStatusText(junoData.status)}
            </span>
          </div>
          <button
            onClick={fetchJunoData}
            disabled={loading}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Cards de estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estado del nodo */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-galicia-gray">Estado del Nodo</p>
              <p className="text-lg font-bold text-galicia-blue">
                {junoData.nodeInfo.moniker || 'N/A'}
              </p>
              <p className="text-sm text-galicia-gray">
                ID: {junoData.nodeInfo.id ? `${junoData.nodeInfo.id.substring(0, 20)}...` : 'N/A'}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-galicia-blue" />
            </div>
          </div>
        </div>

        {/* Sincronización */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-galicia-gray">Sincronización</p>
              <p className="text-lg font-bold text-galicia-blue">
                {junoData.syncInfo.latest_block_height || 'N/A'}
              </p>
              <p className={`text-sm flex items-center mt-1 ${
                junoData.syncInfo.catching_up === false ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {junoData.syncInfo.catching_up === false ? '✅ Sincronizado' : '🔄 Sincronizando'}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-galicia-green" />
            </div>
          </div>
        </div>

        {/* Red */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-galicia-gray">Conexiones</p>
              <p className="text-lg font-bold text-galicia-orange">
                {junoData.networkInfo.n_peers || 'N/A'}
              </p>
              <p className="text-sm text-galicia-gray">Peers activos</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Wifi className="w-5 h-5 text-galicia-orange" />
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-galicia-gray">Sistema</p>
              <p className="text-lg font-bold text-galicia-blue">
                {junoData.systemInfo.cpu || 'N/A'}
              </p>
              <p className="text-sm text-galicia-gray">CPU / RAM</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Server className="w-5 h-5 text-galicia-blue" />
            </div>
          </div>
        </div>
      </div>

      {/* Información detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del nodo */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Información del Nodo
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-galicia-gray">Moniker:</span>
              <span className="font-medium">{junoData.nodeInfo.moniker || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-galicia-gray">Node ID:</span>
              <span className="font-medium text-xs">
                {junoData.nodeInfo.id || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-galicia-gray">Último bloque:</span>
              <span className="font-medium">{junoData.syncInfo.latest_block_height || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-galicia-gray">Estado:</span>
              <span className={`font-medium ${
                junoData.syncInfo.catching_up === false ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {junoData.syncInfo.catching_up === false ? 'Sincronizado' : 'Sincronizando'}
              </span>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-galicia-blue mb-4">
            Información del Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-galicia-gray">Uptime:</span>
              <span className="font-medium">{junoData.systemInfo.uptime || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-galicia-gray">CPU:</span>
              <span className="font-medium">{junoData.systemInfo.cpu || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-galicia-gray">Memoria:</span>
              <span className="font-medium">{junoData.systemInfo.memory || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-galicia-gray">Disco:</span>
              <span className="font-medium">{junoData.systemInfo.disk || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Última actualización */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-galicia-gray" />
            <span className="text-sm text-galicia-gray">Última actualización:</span>
          </div>
          <span className="text-sm font-medium text-galicia-blue">
            {formatTime(lastUpdate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JunoMonitor;
