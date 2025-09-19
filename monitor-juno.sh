#!/bin/bash

# Script de monitoreo en tiempo real para el nodo JUNO
# Muestra información del sistema y del nodo en tiempo real

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Función para limpiar pantalla
clear_screen() {
    clear
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    MONITOR JUNO STARKNET - TIEMPO REAL"
    echo "=========================================="
    echo -e "${NC}"
    echo -e "Actualizado: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
}

# Función para obtener información del sistema
get_system_info() {
    echo -e "${BLUE}=== INFORMACIÓN DEL SISTEMA ===${NC}"
    
    # Uptime
    local uptime=$(uptime -p | sed 's/up //')
    echo -e "Uptime: ${GREEN}$uptime${NC}"
    
    # Carga del sistema
    local load=$(uptime | awk -F'load average:' '{print $2}')
    echo -e "Carga del sistema:$load"
    
    # Memoria
    local mem_info=$(free -h | grep "Mem:")
    local mem_used=$(echo "$mem_info" | awk '{print $3}')
    local mem_total=$(echo "$mem_info" | awk '{print $2}')
    local mem_percent=$(echo "$mem_info" | awk '{print ($3/$2)*100}' | cut -d'.' -f1)
    echo -e "Memoria: ${YELLOW}$mem_used${NC} / ${GREEN}$mem_total${NC} (${mem_percent}%)"
    
    # CPU
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo -e "CPU: ${YELLOW}${cpu_usage}%${NC}"
    
    # Espacio en disco
    local disk_info=$(df -h / | tail -1)
    local disk_used=$(echo "$disk_info" | awk '{print $3}')
    local disk_total=$(echo "$disk_info" | awk '{print $2}')
    local disk_percent=$(echo "$disk_info" | awk '{print $5}')
    echo -e "Disco: ${YELLOW}$disk_used${NC} / ${GREEN}$disk_total${NC} ($disk_percent)"
    
    echo ""
}

# Función para obtener información del nodo
get_node_info() {
    echo -e "${BLUE}=== INFORMACIÓN DEL NODO JUNO ===${NC}"
    
    # Verificar si el servicio está activo
    if systemctl is-active --quiet junod 2>/dev/null; then
        echo -e "Estado del servicio: ${GREEN}✅ ACTIVO${NC}"
        
        # Información del nodo
        local node_status=$(curl -s http://localhost:26657/status 2>/dev/null)
        
        if [ -n "$node_status" ]; then
            local moniker=$(echo "$node_status" | jq -r '.result.node_info.moniker' 2>/dev/null)
            local node_id=$(echo "$node_status" | jq -r '.result.node_info.id' 2>/dev/null)
            local latest_height=$(echo "$node_status" | jq -r '.result.sync_info.latest_block_height' 2>/dev/null)
            local catching_up=$(echo "$node_status" | jq -r '.result.sync_info.catching_up' 2>/dev/null)
            local peer_count=$(curl -s http://localhost:26657/net_info 2>/dev/null | jq -r '.result.n_peers' 2>/dev/null)
            
            echo -e "Moniker: ${GREEN}$moniker${NC}"
            echo -e "Node ID: ${CYAN}${node_id:0:20}...${NC}"
            echo -e "Último bloque: ${GREEN}$latest_height${NC}"
            
            if [ "$catching_up" = "false" ]; then
                echo -e "Sincronización: ${GREEN}✅ SINCRONIZADO${NC}"
            else
                echo -e "Sincronización: ${YELLOW}🔄 SINCRONIZANDO${NC}"
            fi
            
            echo -e "Peers conectados: ${GREEN}$peer_count${NC}"
        else
            echo -e "Estado del nodo: ${RED}❌ NO RESPONDE${NC}"
        fi
    else
        echo -e "Estado del servicio: ${RED}❌ INACTIVO${NC}"
    fi
    
    echo ""
}

# Función para obtener logs recientes
get_recent_logs() {
    echo -e "${BLUE}=== LOGS RECIENTES (últimas 5 líneas) ===${NC}"
    
    if systemctl is-active --quiet junod 2>/dev/null; then
        sudo journalctl -u junod -n 5 --no-pager | tail -5 | while read line; do
            echo -e "${CYAN}$line${NC}"
        done
    else
        echo -e "${RED}Servicio no activo${NC}"
    fi
    
    echo ""
}

# Función para obtener información de red
get_network_info() {
    echo -e "${BLUE}=== INFORMACIÓN DE RED ===${NC}"
    
    # Puertos
    local ports=(26657 1317 9090)
    
    for port in "${ports[@]}"; do
        if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
            echo -e "Puerto $port: ${GREEN}✅ ABIERTO${NC}"
        else
            echo -e "Puerto $port: ${RED}❌ CERRADO${NC}"
        fi
    done
    
    # Conexiones activas
    local connections=$(netstat -an | grep :26657 | wc -l)
    echo -e "Conexiones activas: ${GREEN}$connections${NC}"
    
    echo ""
}

# Función para mostrar comandos útiles
show_useful_commands() {
    echo -e "${BLUE}=== COMANDOS ÚTILES ===${NC}"
    echo -e "${YELLOW}Ctrl+C${NC} para salir del monitor"
    echo -e "${YELLOW}sudo systemctl restart junod${NC} - Reiniciar nodo"
    echo -e "${YELLOW}sudo journalctl -u junod -f${NC} - Ver logs en tiempo real"
    echo -e "${YELLOW}sudo systemctl status junod${NC} - Estado del servicio"
    echo -e "${YELLOW}curl -s http://localhost:26657/status | jq${NC} - Info completa del nodo"
    echo ""
}

# Función principal de monitoreo
monitor_loop() {
    while true; do
        clear_screen
        get_system_info
        get_node_info
        get_recent_logs
        get_network_info
        show_useful_commands
        
        echo -e "${CYAN}Actualizando en 10 segundos... (Ctrl+C para salir)${NC}"
        sleep 10
    done
}

# Función para mostrar ayuda
show_help() {
    echo -e "${GREEN}Monitor JUNO Starknet${NC}"
    echo ""
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  --once        Mostrar información una sola vez"
    echo "  --help        Mostrar esta ayuda"
    echo ""
    echo "Sin opciones: Monitor en tiempo real (actualiza cada 10 segundos)"
    echo ""
    echo "Comandos de teclado:"
    echo "  Ctrl+C        Salir del monitor"
}

# Función para mostrar información una sola vez
show_once() {
    clear_screen
    get_system_info
    get_node_info
    get_recent_logs
    get_network_info
    show_useful_commands
}

# Función principal
main() {
    case "${1:-}" in
        --help|-h)
            show_help
            exit 0
            ;;
        --once)
            show_once
            exit 0
            ;;
        "")
            monitor_loop
            ;;
        *)
            echo -e "${RED}Opción desconocida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Verificar si jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq no está instalado${NC}"
    echo -e "Instálalo con: sudo apt install jq"
    exit 1
fi

# Ejecutar función principal
main "$@"
