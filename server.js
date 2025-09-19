const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Función para ejecutar comandos del nodo JUNO
const executeJunoCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando comando: ${error}`);
        resolve({ error: error.message });
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          resolve({ raw: stdout });
        }
      }
    });
  });
};

// API para obtener estado del nodo JUNO
app.get('/api/juno/status', async (req, res) => {
  try {
    const result = await executeJunoCommand('curl -s http://localhost:26657/status');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estado del nodo' });
  }
});

// API para obtener información de red
app.get('/api/juno/network', async (req, res) => {
  try {
    const result = await executeJunoCommand('curl -s http://localhost:26657/net_info');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener información de red' });
  }
});

// API para obtener información del sistema
app.get('/api/juno/system', async (req, res) => {
  try {
    const [uptime, memory, disk] = await Promise.all([
      executeJunoCommand('uptime -p'),
      executeJunoCommand('free -h | grep Mem'),
      executeJunoCommand('df -h / | tail -1')
    ]);

    res.json({
      uptime: uptime.raw ? uptime.raw.replace('up ', '') : 'N/A',
      memory: memory.raw || 'N/A',
      disk: disk.raw || 'N/A'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener información del sistema' });
  }
});

// API para controlar el nodo
app.post('/api/juno/control', async (req, res) => {
  const { action } = req.body;
  
  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).json({ error: 'Acción no válida' });
  }

  try {
    const result = await executeJunoCommand(`sudo systemctl ${action} junod`);
    res.json({ success: true, message: `Nodo ${action} ejecutado` });
  } catch (error) {
    res.status(500).json({ error: `Error al ${action} el nodo` });
  }
});

// Servir la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Dashboard disponible en: http://localhost:${PORT}`);
  console.log(`🔗 API JUNO disponible en: http://localhost:${PORT}/api/juno`);
});
