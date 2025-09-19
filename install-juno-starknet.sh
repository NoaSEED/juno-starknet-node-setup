#!/bin/bash

# Script para instalar y configurar nodo JUNO en Starknet
# Autor: Facundo Medina
# Versión: 1.0
# Fecha: $(date +%Y-%m-%d)

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Configuración
JUNO_VERSION="v0.13.0"
JUNO_USER="juno"
JUNO_HOME="/home/$JUNO_USER/.juno"
SNAPSHOT_DIR="/home/$JUNO_USER/snapshots"
SERVICE_NAME="junod"
CHAIN_ID="uni-6"

# URLs para snapshots
SNAPSHOT_URL="https://eu2.contabostorage.com/37b215ac8ad5417c8ed656231f80e9bb:snapshot/juno/junod-pruned.tar.lz4"

# Función para verificar si el usuario es root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "Este script no debe ejecutarse como root. Por favor ejecuta como usuario normal."
    fi
}

# Función para verificar dependencias del sistema
check_dependencies() {
    log "Verificando dependencias del sistema..."
    
    # Verificar sistema operativo
    if [[ ! -f /etc/os-release ]]; then
        error "No se puede determinar el sistema operativo"
    fi
    
    source /etc/os-release
    
    # Actualizar sistema
    log "Actualizando sistema..."
    sudo apt update && sudo apt upgrade -y
    
    # Instalar dependencias necesarias
    log "Instalando dependencias..."
    sudo apt install -y \
        curl \
        wget \
        git \
        build-essential \
        pkg-config \
        libssl-dev \
        lz4 \
        jq \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
    
    # Verificar Go
    if ! command -v go &> /dev/null; then
        log "Instalando Go..."
        GO_VERSION="1.21.5"
        wget "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz"
        sudo tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz"
        echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
        echo 'export GOPATH=$HOME/go' >> ~/.bashrc
        source ~/.bashrc
        rm "go${GO_VERSION}.linux-amd64.tar.gz"
    else
        info "Go ya está instalado: $(go version)"
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log "Instalando Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        info "Docker instalado. Por favor reinicia la sesión para usar Docker sin sudo."
    else
        info "Docker ya está instalado: $(docker --version)"
    fi
}

# Función para crear usuario del sistema
create_juno_user() {
    log "Creando usuario del sistema para JUNO..."
    
    if ! id "$JUNO_USER" &>/dev/null; then
        sudo useradd -m -s /bin/bash $JUNO_USER
        sudo usermod -aG docker $JUNO_USER
        info "Usuario $JUNO_USER creado"
    else
        info "Usuario $JUNO_USER ya existe"
    fi
}

# Función para descargar e instalar JUNO
install_juno() {
    log "Instalando JUNO..."
    
    # Cambiar al usuario juno
    sudo -u $JUNO_USER bash << EOF
        cd /home/$JUNO_USER
        
        # Crear directorios necesarios
        mkdir -p $JUNO_HOME
        mkdir -p $SNAPSHOT_DIR
        
        # Clonar repositorio JUNO
        if [ ! -d "juno" ]; then
            git clone https://github.com/CosmosContracts/juno.git
        fi
        
        cd juno
        
        # Checkout versión específica
        git checkout $JUNO_VERSION
        
        # Compilar JUNO
        make install
        
        # Verificar instalación
        junod version
EOF
    
    info "JUNO instalado correctamente"
}

# Función para descargar snapshot
download_snapshot() {
    log "Descargando snapshot de JUNO..."
    
    sudo -u $JUNO_USER bash << EOF
        cd $SNAPSHOT_DIR
        
        # Verificar si ya existe un snapshot
        if [ -f "junod-pruned.tar.lz4" ]; then
            warning "Snapshot ya existe, eliminando..."
            rm -f junod-pruned.tar.lz4
        fi
        
        # Descargar snapshot
        log "Descargando snapshot desde: $SNAPSHOT_URL"
        wget -O junod-pruned.tar.lz4 "$SNAPSHOT_URL"
        
        # Verificar descarga
        if [ ! -f "junod-pruned.tar.lz4" ]; then
            error "Error al descargar snapshot"
        fi
        
        info "Snapshot descargado correctamente"
EOF
}

# Función para instalar snapshot
install_snapshot() {
    log "Instalando snapshot..."
    
    sudo -u $JUNO_USER bash << EOF
        cd $SNAPSHOT_DIR
        
        # Detener servicio si está corriendo
        sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
        
        # Hacer backup de datos existentes si existen
        if [ -d "$JUNO_HOME/data" ]; then
            warning "Haciendo backup de datos existentes..."
            mv $JUNO_HOME/data $JUNO_HOME/data.backup.$(date +%s)
        fi
        
        # Extraer snapshot
        log "Extrayendo snapshot..."
        lz4 -c -d junod-pruned.tar.lz4 | tar -x -C $JUNO_HOME/
        
        # Verificar extracción
        if [ ! -d "$JUNO_HOME/data" ]; then
            error "Error al extraer snapshot"
        fi
        
        # Limpiar archivo temporal
        rm -f junod-pruned.tar.lz4
        
        info "Snapshot instalado correctamente"
EOF
}

# Función para configurar JUNO
configure_juno() {
    log "Configurando JUNO..."
    
    sudo -u $JUNO_USER bash << EOF
        cd $JUNO_HOME
        
        # Inicializar configuración si no existe
        if [ ! -f "config/config.toml" ]; then
            junod init "juno-node" --chain-id $CHAIN_ID
        fi
        
        # Descargar genesis si no existe
        if [ ! -f "config/genesis.json" ]; then
            wget -O config/genesis.json "https://raw.githubusercontent.com/CosmosContracts/juno/main/networks/uni-6/genesis.json"
        fi
        
        # Descargar addrbook si no existe
        if [ ! -f "config/addrbook.json" ]; then
            wget -O config/addrbook.json "https://snapshots.polkachu.com/addrbook/juno/addrbook.json"
        fi
        
        # Configurar config.toml para mejor rendimiento
        cat > config/config.toml << 'CONFIG_EOF'
[consensus]
timeout_commit = "1s"
timeout_propose = "1s"
timeout_prevote = "1s"
timeout_precommit = "1s"

[p2p]
max_num_inbound_peers = 40
max_num_outbound_peers = 10
flush_throttle_timeout = "10ms"
max_packet_msg_payload_size = 1024
send_rate = 20971520
recv_rate = 20971520

[mempool]
size = 5000
max_txs_bytes = 1073741824
cache_size = 10000
keep-invalid-txs-in-cache = true
max_tx_bytes = 1024

[rpc]
max_body_bytes = 1000000
max_header_bytes = 1
max_open_connections = 40
tls_cert_file = ""
tls_key_file = ""
CONFIG_EOF

        # Configurar app.toml
        cat > config/app.toml << 'APP_CONFIG_EOF'
[api]
enable = true
swagger = false
address = "tcp://0.0.0.0:1317"

[grpc]
enable = true
address = "0.0.0.0:9090"

[grpc-web]
enable = false
address = "0.0.0.0:9091"

[state-sync]
snapshot-interval = 1000
snapshot-keep-recent = 2

[telemetry]
enabled = false
APP_CONFIG_EOF

        info "JUNO configurado correctamente"
EOF
}

# Función para crear servicio systemd
create_systemd_service() {
    log "Creando servicio systemd..."
    
    sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=Juno Node
After=network.target

[Service]
Type=simple
User=$JUNO_USER
WorkingDirectory=$JUNO_HOME
ExecStart=/home/$JUNO_USER/go/bin/junod start --home $JUNO_HOME
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

    # Recargar systemd y habilitar servicio
    sudo systemctl daemon-reload
    sudo systemctl enable $SERVICE_NAME
    
    info "Servicio systemd creado y habilitado"
}

# Función para iniciar el nodo
start_node() {
    log "Iniciando nodo JUNO..."
    
    # Iniciar servicio
    sudo systemctl start $SERVICE_NAME
    
    # Esperar un momento
    sleep 5
    
    # Verificar estado
    if sudo systemctl is-active --quiet $SERVICE_NAME; then
        log "Nodo JUNO iniciado correctamente"
        info "Estado del servicio:"
        sudo systemctl status $SERVICE_NAME --no-pager -l
        
        info "Logs del nodo:"
        sudo journalctl -u $SERVICE_NAME -f --no-pager -n 20
    else
        error "Error al iniciar el nodo JUNO"
    fi
}

# Función para verificar sincronización
check_sync() {
    log "Verificando estado de sincronización..."
    
    sleep 10
    
    sudo -u $JUNO_USER bash << EOF
        # Verificar estado del nodo
        STATUS=\$(curl -s http://localhost:26657/status | jq -r '.result.sync_info.catching_up')
        
        if [ "\$STATUS" = "false" ]; then
            info "Nodo sincronizado correctamente"
        else
            warning "Nodo aún sincronizando..."
            info "Para monitorear el progreso: sudo journalctl -u $SERVICE_NAME -f"
        fi
        
        # Mostrar información del nodo
        info "Información del nodo:"
        curl -s http://localhost:26657/status | jq -r '.result.node_info.id, .result.node_info.moniker, .result.sync_info.latest_block_height'
EOF
}

# Función para mostrar información útil
show_info() {
    log "Instalación completada!"
    
    echo -e "${GREEN}=== INFORMACIÓN DEL NODO JUNO ===${NC}"
    echo -e "Usuario: $JUNO_USER"
    echo -e "Directorio: $JUNO_HOME"
    echo -e "Chain ID: $CHAIN_ID"
    echo -e "Servicio: $SERVICE_NAME"
    echo ""
    echo -e "${BLUE}=== COMANDOS ÚTILES ===${NC}"
    echo -e "Ver estado: sudo systemctl status $SERVICE_NAME"
    echo -e "Ver logs: sudo journalctl -u $SERVICE_NAME -f"
    echo -e "Reiniciar: sudo systemctl restart $SERVICE_NAME"
    echo -e "Detener: sudo systemctl stop $SERVICE_NAME"
    echo ""
    echo -e "Verificar sincronización: curl -s http://localhost:26657/status | jq -r '.result.sync_info'"
    echo -e "Información del nodo: curl -s http://localhost:26657/status | jq -r '.result.node_info'"
    echo ""
    echo -e "${YELLOW}=== PRÓXIMOS PASOS ===${NC}"
    echo -e "1. El nodo está iniciando y sincronizando"
    echo -e "2. Monitorea los logs para verificar que todo funciona correctamente"
    echo -e "3. Una vez sincronizado, podrás usar el nodo para transacciones"
    echo -e "4. Considera configurar un firewall apropiado"
}

# Función principal
main() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    INSTALADOR DE NODO JUNO STARKNET"
    echo "=========================================="
    echo -e "${NC}"
    
    check_root
    check_dependencies
    create_juno_user
    install_juno
    download_snapshot
    install_snapshot
    configure_juno
    create_systemd_service
    start_node
    check_sync
    show_info
    
    log "Instalación completada exitosamente!"
}

# Manejo de señales
trap 'error "Script interrumpido por el usuario"' INT TERM

# Ejecutar función principal
main "$@"
