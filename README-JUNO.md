# Script de Instalación JUNO para Starknet

Este script automatiza la instalación y configuración completa de un nodo JUNO en la red Starknet, incluyendo la descarga e instalación de snapshots para una sincronización rápida.

## Características

- ✅ Instalación automática de dependencias
- ✅ Descarga e instalación de snapshots
- ✅ Configuración optimizada para rendimiento
- ✅ Servicio systemd para inicio automático
- ✅ Monitoreo y verificación de estado
- ✅ Sin referencias a Pathfinder
- ✅ Sincronización desde el último bloque

## Requisitos del Sistema

- Ubuntu 18.04+ o distribución basada en Debian
- Mínimo 4GB RAM
- Mínimo 100GB espacio en disco
- Conexión a internet estable
- Usuario con privilegios sudo (no root)

## Instalación

1. **Clonar o descargar el script:**
   ```bash
   wget https://raw.githubusercontent.com/tu-usuario/tu-repo/main/install-juno-starknet.sh
   chmod +x install-juno-starknet.sh
   ```

2. **Ejecutar el script:**
   ```bash
   ./install-juno-starknet.sh
   ```

## ¿Qué hace el script?

### 1. Verificación de Dependencias
- Actualiza el sistema
- Instala dependencias necesarias (curl, wget, git, build-essential, etc.)
- Instala Go (si no está presente)
- Instala Docker (si no está presente)

### 2. Configuración del Usuario
- Crea usuario del sistema `juno`
- Configura permisos apropiados
- Agrega usuario al grupo docker

### 3. Instalación de JUNO
- Clona el repositorio oficial de JUNO
- Compila desde el código fuente
- Instala binarios en el sistema

### 4. Descarga de Snapshot
- Descarga el snapshot más reciente
- Verifica integridad del archivo
- Extrae datos en el directorio apropiado

### 5. Configuración del Nodo
- Inicializa configuración del nodo
- Descarga genesis y addrbook
- Optimiza configuraciones para rendimiento

### 6. Servicio Systemd
- Crea servicio para inicio automático
- Configura reinicio automático en caso de fallo
- Habilita el servicio

### 7. Inicio y Verificación
- Inicia el nodo
- Verifica estado de sincronización
- Muestra información útil

## Comandos Útiles

### Gestión del Servicio
```bash
# Ver estado del nodo
sudo systemctl status junod

# Ver logs en tiempo real
sudo journalctl -u junod -f

# Reiniciar el nodo
sudo systemctl restart junod

# Detener el nodo
sudo systemctl stop junod

# Iniciar el nodo
sudo systemctl start junod
```

### Verificación del Nodo
```bash
# Estado de sincronización
curl -s http://localhost:26657/status | jq -r '.result.sync_info'

# Información del nodo
curl -s http://localhost:26657/status | jq -r '.result.node_info'

# Último bloque
curl -s http://localhost:26657/status | jq -r '.result.sync_info.latest_block_height'

# Verificar si está sincronizado
curl -s http://localhost:26657/status | jq -r '.result.sync_info.catching_up'
```

## Estructura de Archivos

```
/home/juno/
├── .juno/                    # Directorio principal del nodo
│   ├── config/              # Archivos de configuración
│   ├── data/                # Datos del blockchain
│   └── wasm/                # Contratos WASM
└── snapshots/               # Directorio de snapshots
```

## Configuración de Red

El script está configurado para la red principal de JUNO:
- **Chain ID:** uni-6
- **Puerto RPC:** 26657
- **Puerto API:** 1317
- **Puerto gRPC:** 9090

## Monitoreo

### Logs del Sistema
```bash
# Ver logs recientes
sudo journalctl -u junod -n 100

# Seguir logs en tiempo real
sudo journalctl -u junod -f

# Logs con timestamps
sudo journalctl -u junod -f --since "1 hour ago"
```

### Métricas de Red
```bash
# Número de peers conectados
curl -s http://localhost:26657/net_info | jq -r '.result.n_peers'

# Información de peers
curl -s http://localhost:26657/net_info | jq -r '.result.peers[].node_info.id'
```

## Solución de Problemas

### El nodo no inicia
1. Verificar logs: `sudo journalctl -u junod -n 50`
2. Verificar espacio en disco: `df -h`
3. Verificar memoria: `free -h`
4. Verificar puertos: `netstat -tlnp | grep :26657`

### Sincronización lenta
1. Verificar conexión a internet
2. Verificar número de peers: `curl -s http://localhost:26657/net_info | jq -r '.result.n_peers'`
3. Reiniciar el nodo: `sudo systemctl restart junod`

### Errores de permisos
1. Verificar propietario: `ls -la /home/juno/.juno/`
2. Corregir permisos: `sudo chown -R juno:juno /home/juno/.juno/`

## Actualización del Nodo

Para actualizar a una nueva versión:

1. Detener el nodo:
   ```bash
   sudo systemctl stop junod
   ```

2. Actualizar el código:
   ```bash
   sudo -u juno bash -c "cd /home/juno/juno && git pull && make install"
   ```

3. Reiniciar el nodo:
   ```bash
   sudo systemctl start junod
   ```

## Seguridad

- El nodo corre como usuario no-root (`juno`)
- Los puertos están configurados para acceso local por defecto
- Se recomienda configurar firewall apropiado
- Los logs no contienen información sensible

## Contribuciones

Para contribuir al script:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## Licencia

Este script está bajo licencia MIT. Ver archivo LICENSE para más detalles.

## Soporte

Para soporte y preguntas:
- Crear un issue en GitHub
- Contactar al desarrollador: [tu-email@ejemplo.com]

---

**Nota:** Este script está optimizado para la red principal de JUNO. Para redes de test, modifica la variable `CHAIN_ID` y las URLs correspondientes.
