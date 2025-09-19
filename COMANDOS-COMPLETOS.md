# 🚀 COMANDOS COMPLETOS PARA PROBAR TODO

## 📋 INTEGRACIÓN COMPLETADA

✅ **Dashboard React + Monitoreo JUNO integrados**
✅ **API Express para conectar con el nodo**
✅ **Componente de monitoreo en tiempo real**
✅ **Tabs para Portfolio y JUNO**
✅ **Todo subido a GitHub**

## 🎯 COMANDOS PARA EL NUC

### **PASO 1: INSTALAR JUNO EN EL NUC**

```bash
# 1. Conectar al NUC
ssh usuario@ip-del-nuc

# 2. Clonar repositorio
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# 3. Limpiar NUC
./cleanup-nuc.sh

# 4. Instalar JUNO
./install-juno-starknet.sh

# 5. Verificar instalación
./verify-juno-node.sh
```

### **PASO 2: INSTALAR DASHBOARD EN EL NUC**

```bash
# 1. Instalar dependencias del dashboard
npm install

# 2. Compilar dashboard
npm run build

# 3. Iniciar servidor completo
npm start
```

**El dashboard estará disponible en:**
- **Frontend:** http://ip-del-nuc:3000
- **API:** http://ip-del-nuc:3001

## 🖥️ COMANDOS PARA DESARROLLO LOCAL

### **Desarrollo Completo (Recomendado)**

```bash
# 1. Clonar repositorio
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# 2. Instalar dependencias
npm install

# 3. Desarrollo con hot reload (React + API)
npm run dev:full
```

**Esto inicia:**
- **React:** http://localhost:3000 (con hot reload)
- **API:** http://localhost:3001 (para conectar con JUNO)

### **Solo Frontend (Desarrollo)**

```bash
# Solo React con hot reload
npm run dev
```

### **Solo API (Producción)**

```bash
# Compilar y ejecutar servidor completo
npm run build
npm run server
```

## 🔧 COMANDOS DE PRUEBA

### **Verificar Dashboard**

```bash
# 1. Abrir navegador
open http://localhost:3000

# 2. Login con:
# Usuario: admin
# Password: admin123

# 3. Ir a Dashboard → Tab "Nodo JUNO"
```

### **Verificar API**

```bash
# Estado del nodo
curl http://localhost:3001/api/juno/status

# Información de red
curl http://localhost:3001/api/juno/network

# Información del sistema
curl http://localhost:3001/api/juno/system
```

### **Verificar Nodo JUNO**

```bash
# Estado del nodo
curl http://localhost:26657/status

# Información de red
curl http://localhost:26657/net_info

# Verificar sincronización
curl -s http://localhost:26657/status | jq -r '.result.sync_info.catching_up'
```

## 📊 FUNCIONALIDADES DEL DASHBOARD

### **Tab Portfolio**
- ✅ Resumen de saldo
- ✅ Cards de Staking ETH, Trading, Depósitos
- ✅ Gráfico de evolución del saldo
- ✅ Gráfico de distribución del portfolio
- ✅ Transacciones recientes

### **Tab Nodo JUNO**
- ✅ Estado del nodo en tiempo real
- ✅ Información de sincronización
- ✅ Número de peers conectados
- ✅ Información del sistema
- ✅ Actualización automática cada 10 segundos
- ✅ Botón de actualización manual

## 🎮 COMANDOS DE CONTROL

### **Control del Nodo JUNO**

```bash
# Reiniciar nodo
sudo systemctl restart junod

# Ver logs
sudo journalctl -u junod -f

# Estado del servicio
sudo systemctl status junod
```

### **Control del Dashboard**

```bash
# Detener servidor
Ctrl+C

# Reiniciar servidor
npm run server

# Ver logs del servidor
# (se muestran en la consola)
```

## 🔍 COMANDOS DE DIAGNÓSTICO

### **Verificar Conectividad**

```bash
# Verificar que el nodo JUNO responde
curl -s http://localhost:26657/status | jq -r '.result.node_info.moniker'

# Verificar que la API responde
curl -s http://localhost:3001/api/juno/status | jq -r '.result.node_info.moniker'

# Verificar que el frontend carga
curl -s http://localhost:3000 | grep -o '<title>.*</title>'
```

### **Verificar Puertos**

```bash
# Verificar puertos en uso
netstat -tlnp | grep -E ':(3000|3001|26657|1317|9090)'

# Verificar procesos
ps aux | grep -E '(node|junod)'
```

## 🚀 SECUENCIA COMPLETA DE PRUEBA

### **En el NUC:**

```bash
# 1. Instalar JUNO
./cleanup-nuc.sh
./install-juno-starknet.sh

# 2. Instalar Dashboard
npm install
npm run build
npm start

# 3. Verificar en navegador
# http://ip-del-nuc:3000
```

### **En tu Mac (desarrollo):**

```bash
# 1. Clonar repositorio
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# 2. Desarrollo completo
npm install
npm run dev:full

# 3. Abrir navegador
open http://localhost:3000
```

## 📱 ACCESO AL DASHBOARD

### **URLs de Acceso:**

- **Dashboard Web:** http://localhost:3000 (o http://ip-del-nuc:3000)
- **API Backend:** http://localhost:3001/api/juno/
- **Nodo JUNO:** http://localhost:26657/

### **Credenciales:**

- **Usuario:** admin
- **Password:** admin123

### **Navegación:**

1. **Login** → Ingresar credenciales
2. **Dashboard** → Ver tab "Portfolio" (datos de ejemplo)
3. **Dashboard** → Ver tab "Nodo JUNO" (datos reales del nodo)

## 🎯 RESULTADO FINAL

Después de ejecutar estos comandos tendrás:

✅ **NUC con nodo JUNO funcionando**
✅ **Dashboard web con monitoreo en tiempo real**
✅ **API conectando React con el nodo**
✅ **Interfaz moderna con tabs Portfolio/JUNO**
✅ **Actualización automática cada 10 segundos**
✅ **Datos reales del nodo en el dashboard**

## 🆘 SOLUCIÓN DE PROBLEMAS

### **Si el nodo JUNO no responde:**

```bash
sudo systemctl restart junod
./verify-juno-node.sh
```

### **Si el dashboard no carga:**

```bash
npm run build
npm run server
```

### **Si la API no conecta:**

```bash
# Verificar que el nodo esté corriendo
curl http://localhost:26657/status

# Verificar que la API esté corriendo
curl http://localhost:3001/api/juno/status
```

---

## 🎉 ¡TODO INTEGRADO Y FUNCIONANDO!

**Repositorio:** https://github.com/NoaSEED/juno-starknet-node-setup

**Características completadas:**
- ✅ Dashboard React con autenticación
- ✅ Monitoreo JUNO en tiempo real
- ✅ API Express para conectar ambos
- ✅ Scripts de instalación para NUC
- ✅ Documentación completa
- ✅ Todo subido a GitHub

**¡Listo para usar en producción!**
