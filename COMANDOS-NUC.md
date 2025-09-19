# 🚀 COMANDOS PARA INSTALAR JUNO EN EL NUC

## 📋 Comandos Paso a Paso

### 1. **Conectar al NUC**

```bash
# Conectar via SSH (reemplaza con la IP de tu NUC)
ssh usuario@192.168.1.100

# O si usas un nombre de host
ssh usuario@nuc.local
```

### 2. **Clonar el Repositorio**

```bash
# Clonar el repositorio completo
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# Verificar que todos los archivos estén presentes
ls -la *.sh *.md
```

### 3. **Instalación Completa (Recomendado)**

```bash
# Ejecutar instalación completa (limpiar + instalar)
./install-complete.sh
```

**Este comando hace todo automáticamente:**
- ✅ Limpia el NUC completamente
- ✅ Actualiza el sistema
- ✅ Instala todas las dependencias
- ✅ Instala Go y Docker
- ✅ Instala JUNO con snapshots
- ✅ Configura el servicio systemd
- ✅ Inicia el nodo

### 4. **Monitorear la Instalación**

```bash
# Monitor en tiempo real (actualiza cada 10 segundos)
./monitor-juno.sh

# Para salir del monitor: Ctrl+C
```

### 5. **Verificar que Todo Funciona**

```bash
# Verificar estado del nodo
./verify-juno-node.sh

# Ver estado del servicio
sudo systemctl status junod

# Ver logs en tiempo real
sudo journalctl -u junod -f
```

## 🔄 Comandos Alternativos (Si Prefieres Paso a Paso)

### Opción A: Solo Limpiar

```bash
# Limpiar completamente el NUC
./cleanup-nuc.sh

# Luego instalar manualmente
./install-juno-starknet.sh
```

### Opción B: Solo Instalar (Sin Limpiar)

```bash
# Instalar sin limpiar (si ya limpiaste manualmente)
./install-complete.sh --install-only
```

### Opción C: Solo Limpiar

```bash
# Solo limpiar sin instalar
./install-complete.sh --cleanup-only
```

## 📊 Comandos de Monitoreo

### Monitor en Tiempo Real

```bash
# Monitor continuo
./monitor-juno.sh

# Ver información una sola vez
./monitor-juno.sh --once
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

# Número de peers
curl -s http://localhost:26657/net_info | jq -r '.result.n_peers'
```

## 🛠️ Comandos de Control del Nodo

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

## 🔧 Comandos de Configuración

```bash
# Cambiar a mainnet
./juno-config.sh switch mainnet

# Cambiar a testnet
./juno-config.sh switch testnet

# Ver configuración actual
./juno-config.sh current

# Listar redes disponibles
./juno-config.sh list
```

## 🆘 Comandos de Emergencia

```bash
# Si algo sale mal, reiniciar todo
sudo systemctl stop junod
sudo systemctl start junod

# Si necesitas limpiar y reinstalar
./cleanup-nuc.sh
./install-juno-starknet.sh

# Verificar estado completo
./monitor-juno.sh --once
```

## 📝 Comandos de Diagnóstico

```bash
# Ver logs recientes
sudo journalctl -u junod -n 50

# Verificar espacio en disco
df -h

# Verificar memoria
free -h

# Verificar puertos
netstat -tlnp | grep :26657

# Verificar procesos
ps aux | grep juno
```

## 🎯 Secuencia Completa Recomendada

```bash
# 1. Conectar al NUC
ssh usuario@ip-del-nuc

# 2. Clonar repositorio
git clone https://github.com/NoaSEED/juno-starknet-node-setup.git
cd juno-starknet-node-setup

# 3. Instalación completa
./install-complete.sh

# 4. Monitorear (en otra terminal)
./monitor-juno.sh

# 5. Verificar funcionamiento
./verify-juno-node.sh
```

## ⏱️ Tiempos Estimados

- **Limpieza:** 2-5 minutos
- **Instalación de dependencias:** 10-15 minutos
- **Compilación de JUNO:** 15-30 minutos
- **Descarga de snapshot:** 5-15 minutos (depende de internet)
- **Sincronización inicial:** 30-60 minutos

**Total estimado: 1-2 horas**

## 🔍 Verificaciones Importantes

### Durante la Instalación

```bash
# Verificar que el proceso sigue corriendo
ps aux | grep install

# Ver logs de instalación
sudo journalctl -f
```

### Después de la Instalación

```bash
# Verificar que el nodo está sincronizado
curl -s http://localhost:26657/status | jq -r '.result.sync_info.catching_up'

# Si devuelve "false", está sincronizado
# Si devuelve "true", aún está sincronizando
```

## 📞 Comandos de Soporte

```bash
# Ver ayuda de cualquier script
./install-complete.sh --help
./monitor-juno.sh --help
./juno-config.sh help

# Ver estado completo del sistema
./monitor-juno.sh --once

# Verificar instalación
./verify-juno-node.sh
```

---

## 🎉 ¡Listo para Usar!

Una vez que ejecutes `./install-complete.sh`, el NUC estará completamente configurado con:

- ✅ Nodo JUNO funcionando
- ✅ Sincronización desde el último bloque
- ✅ Servicio systemd configurado
- ✅ Monitoreo en tiempo real
- ✅ Scripts de gestión incluidos

**El nodo estará listo para usar en producción!**
