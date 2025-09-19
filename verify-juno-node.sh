#!/bin/bash

# Script de verificación para nodo JUNO
# Verifica el estado del nodo y proporciona información útil

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Función para verificar si el servicio está corriendo
check_service() {
    log "Verificando servicio systemd..."
    
    if systemctl is-active --quiet junod; then
        info "✅ Servicio junod está activo"
        systemctl status junod --no-pager -l | head -10
    else
        error "❌ Servicio junod no está activo"
        return 1
    fi
}

# Función para verificar conectividad del nodo
check_connectivity() {
    log "Verificando conectividad del nodo..."
    
    # Verificar puerto RPC
    if curl -s http://localhost:26657/status > /dev/null; then
        info "✅ Puerto RPC (26657) responde"
    else
        error "❌ Puerto RPC (26657) no responde"
        return 1
    fi
    
    # Verificar puerto API
    if curl -s http://localhost:1317/node_info > /dev/null; then
        info "✅ Puerto API (1317) responde"
    else
        warning "⚠️  Puerto API (1317) no responde"
    fi
}

# Función para verificar estado de sincronización
check_sync_status() {
    log "Verificando estado de sincronización..."
    
    local status_response=$(curl -s http://localhost:26657/status)
    
    if [ -z "$status_response" ]; then
        error "❌ No se pudo obtener respuesta del nodo"
        return 1
    fi
    
    # Verificar si está sincronizado
    local catching_up=$(echo "$status_response" | jq -r '.result.sync_info.catching_up')
    local latest_height=$(echo "$status_response" | jq -r '.result.sync_info.latest_block_height')
    local node_id=$(echo "$status_response" | jq -r '.result.node_info.id')
    local moniker=$(echo "$status_response" | jq -r '.result.node_info.moniker')
    
    echo ""
    echo -e "${BLUE}=== INFORMACIÓN DEL NODO ===${NC}"
    echo -e "Moniker: $moniker"
    echo -e "Node ID: ${node_id:0:20}..."
    echo -e "Último bloque: $latest_height"
    echo -e "Sincronizando: $catching_up"
    
    if [ "$catching_up" = "false" ]; then
        info "✅ Nodo sincronizado correctamente"
    else
        warning "⚠️  Nodo aún sincronizando..."
    fi
}

# Función para verificar peers
check_peers() {
    log "Verificando peers conectados..."
    
    local net_info=$(curl -s http://localhost:26657/net_info)
    local peer_count=$(echo "$net_info" | jq -r '.result.n_peers')
    
    echo -e "Peers conectados: $peer_count"
    
    if [ "$peer_count" -gt 0 ]; then
        info "✅ Nodo tiene peers conectados"
    else
        warning "⚠️  Nodo no tiene peers conectados"
    fi
}

# Función para verificar recursos del sistema
check_system_resources() {
    log "Verificando recursos del sistema..."
    
    # Memoria
    local mem_info=$(free -h | grep "Mem:")
    local mem_used=$(echo "$mem_info" | awk '{print $3}')
    local mem_total=$(echo "$mem_info" | awk '{print $2}')
    
    echo -e "Memoria usada: $mem_used / $mem_total"
    
    # Espacio en disco
    local disk_info=$(df -h /home/juno | tail -1)
    local disk_used=$(echo "$disk_info" | awk '{print $3}')
    local disk_total=$(echo "$disk_info" | awk '{print $2}')
    local disk_percent=$(echo "$disk_info" | awk '{print $5}')
    
    echo -e "Espacio en disco: $disk_used / $disk_total ($disk_percent)"
    
    # CPU
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo -e "Uso de CPU: ${cpu_usage}%"
}

# Función para verificar logs recientes
check_recent_logs() {
    log "Verificando logs recientes..."
    
    echo -e "${BLUE}=== LOGS RECIENTES (últimas 10 líneas) ===${NC}"
    journalctl -u junod -n 10 --no-pager
}

# Función para verificar archivos de configuración
check_config_files() {
    log "Verificando archivos de configuración..."
    
    local config_dir="/home/juno/.juno/config"
    
    if [ -f "$config_dir/config.toml" ]; then
        info "✅ config.toml existe"
    else
        error "❌ config.toml no encontrado"
    fi
    
    if [ -f "$config_dir/app.toml" ]; then
        info "✅ app.toml existe"
    else
        error "❌ app.toml no encontrado"
    fi
    
    if [ -f "$config_dir/genesis.json" ]; then
        info "✅ genesis.json existe"
    else
        error "❌ genesis.json no encontrado"
    fi
    
    if [ -f "$config_dir/addrbook.json" ]; then
        info "✅ addrbook.json existe"
    else
        warning "⚠️  addrbook.json no encontrado"
    fi
}

# Función para mostrar comandos útiles
show_helpful_commands() {
    echo ""
    echo -e "${GREEN}=== COMANDOS ÚTILES ===${NC}"
    echo -e "Ver logs en tiempo real:"
    echo -e "  ${BLUE}sudo journalctl -u junod -f${NC}"
    echo ""
    echo -e "Ver estado del servicio:"
    echo -e "  ${BLUE}sudo systemctl status junod${NC}"
    echo ""
    echo -e "Reiniciar el nodo:"
    echo -e "  ${BLUE}sudo systemctl restart junod${NC}"
    echo ""
    echo -e "Verificar sincronización:"
    echo -e "  ${BLUE}curl -s http://localhost:26657/status | jq -r '.result.sync_info'${NC}"
    echo ""
    echo -e "Ver información del nodo:"
    echo -e "  ${BLUE}curl -s http://localhost:26657/status | jq -r '.result.node_info'${NC}"
}

# Función principal
main() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    VERIFICADOR DE NODO JUNO STARKNET"
    echo "=========================================="
    echo -e "${NC}"
    
    check_service
    echo ""
    
    check_connectivity
    echo ""
    
    check_sync_status
    echo ""
    
    check_peers
    echo ""
    
    check_system_resources
    echo ""
    
    check_config_files
    echo ""
    
    check_recent_logs
    echo ""
    
    show_helpful_commands
    
    log "Verificación completada!"
}

# Verificar si jq está instalado
if ! command -v jq &> /dev/null; then
    error "jq no está instalado. Instálalo con: sudo apt install jq"
    exit 1
fi

# Ejecutar función principal
main "$@"
