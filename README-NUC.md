# 🚀 Guía Completa para Instalar JUNO en el NUC

## 📋 Resumen

Esta guía te llevará paso a paso para limpiar completamente el NUC y instalar un nodo JUNO en Starknet desde cero, con snapshots para sincronización rápida.

## 🎯 Objetivos

- ✅ Limpiar completamente el NUC de instalaciones previas
- ✅ Instalar un nodo JUNO completamente funcional
- ✅ Configurar sincronización desde el último bloque
- ✅ Monitorear el funcionamiento del nodo

## 📁 Archivos Incluidos

1. **`cleanup-nuc.sh`** - Script de limpieza completa del NUC
2. **`install-complete.sh`** - Script de instalación completa automatizada
3. **`install-juno-starknet.sh`** - Script principal de instalación de JUNO
4. **`verify-juno-node.sh`** - Script de verificación del nodo
5. **`monitor-juno.sh`** - Monitor en tiempo real del nodo
6. **`juno-config.sh`** - Gestión de diferentes redes

## 🔧 Requisitos del NUC

- **Sistema Operativo:** Ubuntu 18.04+ o Debian
- **RAM:** Mínimo 4GB (recomendado 8GB+)
- **Almacenamiento:** Mínimo 100GB libres
- **Conexión:** Internet estable
- **Usuario:** Con privilegios sudo (no root)

## 🚀 Instalación Completa (Recomendado)

### Opción 1: Instalación Automática Completa

```bash
# 1. Conectar al NUC via SSH
ssh usuario@ip-del-nuc

# 2. Clonar el repositorio
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# 3. Ejecutar instalación completa (limpiar + instalar)
./install-complete.sh
```

### Opción 2: Instalación Paso a Paso

```bash
# 1. Limpiar el NUC completamente
./cleanup-nuc.sh

# 2. Instalar JUNO
./install-juno-starknet.sh

# 3. Verificar instalación
./verify-juno-node.sh
```

## 📊 Monitoreo del Nodo

### Monitor en Tiempo Real

```bash
# Monitor continuo (actualiza cada 10 segundos)
./monitor-juno.sh

# Ver información una sola vez
./monitor-juno.sh --once
```

### Comandos de Monitoreo Manual

```bash
# Estado del servicio
sudo systemctl status junod

# Logs en tiempo real
sudo journalctl -u junod -f

# Verificar sincronización
curl -s http://localhost:26657/status | jq -r '.result.sync_info'

# Información del nodo
curl -s http://localhost:26657/status | jq -r '.result.node_info'

# Número de peers
curl -s http://localhost:26657/net_info | jq -r '.result.n_peers'
```

## 🔄 Gestión del Nodo

### Comandos de Control

```bash
# Iniciar nodo
sudo systemctl start junod

# Detener nodo
sudo systemctl stop junod

# Reiniciar nodo
sudo systemctl restart junod

# Habilitar inicio automático
sudo systemctl enable junod

# Deshabilitar inicio automático
sudo systemctl disable junod
```

### Cambio de Red

```bash
# Cambiar a mainnet
./juno-config.sh switch mainnet

# Cambiar a testnet
./juno-config.sh switch testnet

# Ver configuración actual
./juno-config.sh current
```

## 🛠️ Solución de Problemas

### El Nodo No Inicia

```bash
# 1. Verificar logs
sudo journalctl -u junod -n 50

# 2. Verificar espacio en disco
df -h

# 3. Verificar memoria
free -h

# 4. Verificar puertos
netstat -tlnp | grep :26657
```

### Sincronización Lenta

```bash
# 1. Verificar peers
curl -s http://localhost:26657/net_info | jq -r '.result.n_peers'

# 2. Verificar conexión a internet
ping -c 3 8.8.8.8

# 3. Reiniciar el nodo
sudo systemctl restart junod
```

### Errores de Permisos

```bash
# Verificar propietario de archivos
ls -la /home/juno/.juno/

# Corregir permisos
sudo chown -R juno:juno /home/juno/.juno/
```

## 📈 Verificación de Estado

### Estado de Sincronización

```bash
# Verificar si está sincronizado
curl -s http://localhost:26657/status | jq -r '.result.sync_info.catching_up'

# Si devuelve "false", el nodo está sincronizado
# Si devuelve "true", el nodo aún está sincronizando
```

### Información del Nodo

```bash
# Información completa
curl -s http://localhost:26657/status | jq '.'

# Último bloque
curl -s http://localhost:26657/status | jq -r '.result.sync_info.latest_block_height'

# Chain ID
curl -s http://localhost:26657/status | jq -r '.result.node_info.network'
```

## 🔐 Configuración de Seguridad

### Firewall (Opcional)

```bash
# Instalar UFW si no está instalado
sudo apt install ufw

# Permitir SSH
sudo ufw allow ssh

# Permitir puertos de JUNO
sudo ufw allow 26657/tcp
sudo ufw allow 1317/tcp
sudo ufw allow 9090/tcp

# Habilitar firewall
sudo ufw enable
```

### Configuración de Red

```bash
# Verificar configuración de red
ip addr show

# Verificar rutas
ip route show

# Verificar DNS
cat /etc/resolv.conf
```

## 📝 Logs y Diagnósticos

### Ubicación de Logs

```bash
# Logs del sistema
sudo journalctl -u junod -f

# Logs del nodo (si está habilitado)
tail -f /home/juno/.juno/logs/junod.log

# Logs del sistema
sudo journalctl -f
```

### Información del Sistema

```bash
# Información del hardware
lscpu
free -h
df -h

# Información de red
ip addr show
netstat -tlnp

# Procesos relacionados con JUNO
ps aux | grep juno
```

## 🎯 Próximos Pasos Después de la Instalación

1. **Monitorear la sincronización** - Usa `./monitor-juno.sh` para seguir el progreso
2. **Verificar funcionamiento** - Ejecuta `./verify-juno-node.sh` para confirmar que todo funciona
3. **Configurar firewall** - Si necesitas acceso externo, configura el firewall apropiadamente
4. **Configurar respaldos** - Considera configurar respaldos automáticos de la configuración
5. **Monitoreo a largo plazo** - Configura alertas para el estado del nodo

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs:** `sudo journalctl -u junod -n 100`
2. **Ejecuta verificación:** `./verify-juno-node.sh`
3. **Verifica recursos:** `./monitor-juno.sh --once`
4. **Revisa la documentación:** `README-JUNO.md`

## 📞 Comandos de Emergencia

```bash
# Detener todo y reiniciar
sudo systemctl stop junod
sudo systemctl start junod

# Limpieza completa y reinstalación
./cleanup-nuc.sh
./install-juno-starknet.sh

# Verificar estado completo
./monitor-juno.sh --once
```

---

**🎉 ¡Tu nodo JUNO está listo para funcionar en el NUC!**

El proceso completo puede tardar entre 30-60 minutos dependiendo de la velocidad de internet y el hardware del NUC. Una vez instalado, el nodo se sincronizará automáticamente y estará listo para usar.
