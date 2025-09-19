#!/bin/bash

# Script de configuración para diferentes redes JUNO
# Permite cambiar fácilmente entre redes de test y mainnet

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

# Configuraciones para diferentes redes
declare -A NETWORKS=(
    ["mainnet"]="uni-6"
    ["testnet"]="uni-5"
    ["localnet"]="local-1"
)

declare -A GENESIS_URLS=(
    ["mainnet"]="https://raw.githubusercontent.com/CosmosContracts/juno/main/networks/uni-6/genesis.json"
    ["testnet"]="https://raw.githubusercontent.com/CosmosContracts/juno/main/networks/uni-5/genesis.json"
    ["localnet"]=""
)

declare -A ADDRBOOK_URLS=(
    ["mainnet"]="https://snapshots.polkachu.com/addrbook/juno/addrbook.json"
    ["testnet"]="https://snapshots.polkachu.com/addrbook/juno/addrbook.json"
    ["localnet"]=""
)

declare -A SNAPSHOT_URLS=(
    ["mainnet"]="https://eu2.contabostorage.com/37b215ac8ad5417c8ed656231f80e9bb:snapshot/juno/junod-pruned.tar.lz4"
    ["testnet"]="https://eu2.contabostorage.com/37b215ac8ad5417c8ed656231f80e9bb:snapshot/juno/junod-pruned.tar.lz4"
    ["localnet"]=""
)

# Función para mostrar ayuda
show_help() {
    echo -e "${GREEN}Script de Configuración JUNO${NC}"
    echo ""
    echo "Uso: $0 [comando] [red]"
    echo ""
    echo "Comandos:"
    echo "  switch <red>    Cambiar a una red específica"
    echo "  list           Listar redes disponibles"
    echo "  current        Mostrar configuración actual"
    echo "  help           Mostrar esta ayuda"
    echo ""
    echo "Redes disponibles:"
    for network in "${!NETWORKS[@]}"; do
        echo "  - $network (Chain ID: ${NETWORKS[$network]})"
    done
    echo ""
    echo "Ejemplos:"
    echo "  $0 switch mainnet"
    echo "  $0 switch testnet"
    echo "  $0 current"
}

# Función para listar redes
list_networks() {
    echo -e "${BLUE}Redes disponibles:${NC}"
    echo ""
    for network in "${!NETWORKS[@]}"; do
        echo -e "  ${GREEN}$network${NC} (Chain ID: ${NETWORKS[$network]})"
    done
}

# Función para mostrar configuración actual
show_current() {
    log "Configuración actual del nodo JUNO:"
    
    local config_file="/home/juno/.juno/config/config.toml"
    
    if [ -f "$config_file" ]; then
        local chain_id=$(grep "chain-id" "$config_file" | cut -d'"' -f2)
        local moniker=$(grep "moniker" "$config_file" | cut -d'"' -f2)
        
        echo -e "Chain ID: $chain_id"
        echo -e "Moniker: $moniker"
        
        # Determinar red basada en chain ID
        for network in "${!NETWORKS[@]}"; do
            if [ "${NETWORKS[$network]}" = "$chain_id" ]; then
                echo -e "Red: $network"
                break
            fi
        done
    else
        error "Archivo de configuración no encontrado"
    fi
}

# Función para cambiar de red
switch_network() {
    local target_network="$1"
    
    if [ -z "$target_network" ]; then
        error "Debes especificar una red"
        show_help
        exit 1
    fi
    
    if [ -z "${NETWORKS[$target_network]}" ]; then
        error "Red '$target_network' no válida"
        echo ""
        list_networks
        exit 1
    fi
    
    local chain_id="${NETWORKS[$target_network]}"
    local genesis_url="${GENESIS_URLS[$target_network]}"
    local addrbook_url="${ADDRBOOK_URLS[$target_network]}"
    local snapshot_url="${SNAPSHOT_URLS[$target_network]}"
    
    log "Cambiando a red: $target_network (Chain ID: $chain_id)"
    
    # Detener el nodo
    log "Deteniendo nodo..."
    sudo systemctl stop junod
    
    # Hacer backup de configuración actual
    local backup_dir="/home/juno/.juno/config.backup.$(date +%s)"
    sudo -u juno cp -r /home/juno/.juno/config "$backup_dir"
    info "Backup creado en: $backup_dir"
    
    # Actualizar configuración
    sudo -u juno bash << EOF
        cd /home/juno/.juno/config
        
        # Actualizar chain-id en config.toml
        sed -i "s/chain-id = \".*\"/chain-id = \"$chain_id\"/" config.toml
        
        # Descargar genesis si está disponible
        if [ -n "$genesis_url" ]; then
            log "Descargando genesis para $target_network..."
            wget -O genesis.json "$genesis_url"
        fi
        
        # Descargar addrbook si está disponible
        if [ -n "$addrbook_url" ]; then
            log "Descargando addrbook para $target_network..."
            wget -O addrbook.json "$addrbook_url"
        fi
EOF
    
    # Si hay snapshot disponible, descargarlo
    if [ -n "$snapshot_url" ]; then
        log "Descargando snapshot para $target_network..."
        sudo -u juno bash << EOF
            cd /home/juno/snapshots
            
            # Eliminar snapshot anterior
            rm -f *.tar.lz4
            
            # Descargar nuevo snapshot
            wget -O "juno_${chain_id}_snapshot.tar.lz4" "$snapshot_url"
            
            # Extraer snapshot
            if [ -f "juno_${chain_id}_snapshot.tar.lz4" ]; then
                log "Extrayendo snapshot..."
                sudo systemctl stop junod 2>/dev/null || true
                
                # Hacer backup de datos existentes
                if [ -d "/home/juno/.juno/data" ]; then
                    mv /home/juno/.juno/data /home/juno/.juno/data.backup.\$(date +%s)
                fi
                
                # Extraer snapshot
                lz4 -d "juno_${chain_id}_snapshot.tar.lz4" | tar -xf - -C /home/juno/.juno/
                
                # Limpiar archivo temporal
                rm -f "juno_${chain_id}_snapshot.tar.lz4"
            fi
EOF
    fi
    
    # Iniciar el nodo
    log "Iniciando nodo con nueva configuración..."
    sudo systemctl start junod
    
    # Verificar que el nodo esté funcionando
    sleep 5
    
    if systemctl is-active --quiet junod; then
        info "✅ Nodo iniciado correctamente con red: $target_network"
        show_current
    else
        error "❌ Error al iniciar el nodo"
        info "Revisa los logs: sudo journalctl -u junod -n 50"
    fi
}

# Función principal
main() {
    local command="$1"
    local network="$2"
    
    case "$command" in
        "switch")
            switch_network "$network"
            ;;
        "list")
            list_networks
            ;;
        "current")
            show_current
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            error "Comando '$command' no reconocido"
            show_help
            exit 1
            ;;
    esac
}

# Verificar si se ejecuta como root
if [[ $EUID -eq 0 ]]; then
    error "Este script no debe ejecutarse como root"
    exit 1
fi

# Ejecutar función principal
main "$@"
