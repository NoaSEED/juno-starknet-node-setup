# 🚀 GUÍA PASO A PASO PARA EL NUC

## 📋 COMANDOS SEPARADOS - LIMPIAR PRIMERO, LUEGO INSTALAR

### **PASO 1: CONECTAR AL NUC**

```bash
# Conectar via SSH (reemplaza con la IP de tu NUC)
ssh usuario@ip-del-nuc

# Verificar que estás conectado
whoami
pwd
```

### **PASO 2: CLONAR REPOSITORIO**

```bash
# Clonar el repositorio
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# Verificar archivos
ls -la *.sh
```

### **PASO 3: LIMPIAR COMPLETAMENTE EL NUC**

```bash
# Ejecutar limpieza completa
./cleanup-nuc.sh
```

**Este comando elimina:**
- ✅ Todos los servicios de JUNO
- ✅ Usuario juno y directorios
- ✅ Binarios de JUNO
- ✅ Contenedores Docker
- ✅ Archivos temporales
- ✅ Verifica puertos y espacio

### **PASO 4: INSTALAR JUNO DESDE CERO**

```bash
# Instalar JUNO completamente
./install-juno-starknet.sh
```

**Este comando instala:**
- ✅ Todas las dependencias del sistema
- ✅ Go y Docker
- ✅ Compila JUNO desde código fuente
- ✅ Descarga e instala snapshots
- ✅ Configura el nodo optimizado
- ✅ Crea servicio systemd
- ✅ Inicia el nodo

### **PASO 5: VERIFICAR INSTALACIÓN**

```bash
# Verificar que todo funciona
./verify-juno-node.sh
```

### **PASO 6: ACTIVAR DASHBOARD DE MONITOREO**

```bash
# Dashboard en tiempo real
./monitor-juno.sh
```

**El dashboard muestra:**
- ✅ Información del sistema (CPU, RAM, disco)
- ✅ Estado del nodo JUNO
- ✅ Sincronización en tiempo real
- ✅ Logs recientes
- ✅ Información de red
- ✅ Comandos útiles

## 🎯 SECUENCIA COMPLETA

```bash
# 1. Conectar
ssh usuario@ip-del-nuc

# 2. Clonar
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# 3. LIMPIAR
./cleanup-nuc.sh

# 4. INSTALAR
./install-juno-starknet.sh

# 5. VERIFICAR
./verify-juno-node.sh

# 6. DASHBOARD
./monitor-juno.sh
```

## 📊 COMANDOS DE MONITOREO

### Dashboard en Tiempo Real

```bash
# Dashboard completo (actualiza cada 10 segundos)
./monitor-juno.sh

# Ver información una sola vez
./monitor-juno.sh --once

# Para salir del dashboard: Ctrl+C
```

### Comandos Manuales

```bash
# Estado del servicio
sudo systemctl status junod

# Logs en tiempo real
sudo journalctl -u junod -f

# Verificar sincronización
curl -s http://localhost:26657/status | jq -r '.result.sync_info.catching_up'

# Información del nodo
curl -s http://localhost:26657/status | jq -r '.result.node_info'
```

## 🔄 COMANDOS DE CONTROL

```bash
# Reiniciar nodo
sudo systemctl restart junod

# Detener nodo
sudo systemctl stop junod

# Iniciar nodo
sudo systemctl start junod
```

## ⏱️ TIEMPOS ESTIMADOS

- **Limpieza:** 2-5 minutos
- **Instalación:** 30-45 minutos
- **Sincronización:** 30-60 minutos
- **Total:** 1-2 horas

## 🎯 DASHBOARD EN ACCIÓN

Cuando ejecutes `./monitor-juno.sh`, verás:

```
==========================================
    MONITOR JUNO STARKNET - TIEMPO REAL
==========================================
Actualizado: 2025-09-19 10:45:30

=== INFORMACIÓN DEL SISTEMA ===
Uptime: up 2 hours, 15 minutes
Carga del sistema: 0.45, 0.52, 0.48
Memoria: 2.1G / 8.0G (26%)
CPU: 15%
Disco: 45G / 100G (45%)

=== INFORMACIÓN DEL NODO JUNO ===
Estado del servicio: ✅ ACTIVO
Moniker: juno-node
Node ID: 1A2B3C4D5E6F7G8H9I0J...
Último bloque: 1,234,567
Sincronización: 🔄 SINCRONIZANDO
Peers conectados: 15

=== LOGS RECIENTES ===
[INFO] Block height: 1234567
[INFO] Peer count: 15
[INFO] Syncing...

=== INFORMACIÓN DE RED ===
Puerto 26657: ✅ ABIERTO
Puerto 1317: ✅ ABIERTO
Puerto 9090: ✅ ABIERTO
Conexiones activas: 15

=== COMANDOS ÚTILES ===
Ctrl+C para salir del monitor
sudo systemctl restart junod - Reiniciar nodo
sudo journalctl -u junod -f - Ver logs en tiempo real
```

## 🆘 SI ALGO SALE MAL

```bash
# Si la instalación falla, reiniciar
sudo systemctl stop junod
./cleanup-nuc.sh
./install-juno-starknet.sh

# Si el nodo no responde
sudo systemctl restart junod
./monitor-juno.sh

# Ver logs de error
sudo journalctl -u junod -n 50
```

## 🎉 RESULTADO FINAL

Después de seguir estos pasos tendrás:

- ✅ NUC completamente limpio
- ✅ JUNO instalado desde cero
- ✅ Nodo sincronizado con la red
- ✅ Dashboard de monitoreo funcionando
- ✅ Servicio systemd configurado
- ✅ Scripts de gestión incluidos

**¡El NUC estará listo para producción!**
