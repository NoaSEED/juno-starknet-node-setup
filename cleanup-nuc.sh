#!/bin/bash

# Script para limpiar completamente el NUC antes de instalar JUNO
# Este script elimina instalaciones previas y prepara el sistema

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
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Función para limpiar servicios
cleanup_services() {
    log "Limpiando servicios..."
    
    # Detener y deshabilitar servicios de JUNO si existen
    if systemctl is-active --quiet junod 2>/dev/null; then
        warning "Deteniendo servicio junod..."
        sudo systemctl stop junod
        sudo systemctl disable junod
    fi
    
    # Eliminar archivo de servicio
    if [ -f "/etc/systemd/system/junod.service" ]; then
        warning "Eliminando archivo de servicio junod..."
        sudo rm -f /etc/systemd/system/junod.service
        sudo systemctl daemon-reload
    fi
    
    info "Servicios limpiados"
}

# Función para limpiar usuario y directorios
cleanup_user_directories() {
    log "Limpiando usuario y directorios..."
    
    # Eliminar usuario juno si existe
    if id "juno" &>/dev/null; then
        warning "Eliminando usuario juno..."
        sudo pkill -u juno 2>/dev/null || true
        sudo userdel -r juno 2>/dev/null || true
    fi
    
    # Eliminar directorios relacionados con JUNO
    sudo rm -rf /home/juno 2>/dev/null || true
    sudo rm -rf /opt/juno 2>/dev/null || true
    sudo rm -rf /var/lib/juno 2>/dev/null || true
    
    info "Usuario y directorios limpiados"
}

# Función para limpiar binarios
cleanup_binaries() {
    log "Limpiando binarios..."
    
    # Eliminar binarios de JUNO
    sudo rm -f /usr/local/bin/junod 2>/dev/null || true
    sudo rm -f /usr/local/bin/junod 2>/dev/null || true
    sudo rm -f ~/go/bin/junod 2>/dev/null || true
    sudo rm -f ~/go/bin/junod 2>/dev/null || true
    
    # Eliminar directorios de compilación
    sudo rm -rf ~/juno 2>/dev/null || true
    sudo rm -rf /tmp/juno* 2>/dev/null || true
    
    info "Binarios limpiados"
}

# Función para limpiar Docker
cleanup_docker() {
    log "Limpiando contenedores Docker..."
    
    # Detener y eliminar contenedores relacionados con JUNO
    if command -v docker &> /dev/null; then
        docker ps -a | grep -i juno | awk '{print $1}' | xargs -r docker rm -f 2>/dev/null || true
        docker images | grep -i juno | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
        
        # Limpiar volúmenes no utilizados
        docker volume prune -f 2>/dev/null || true
    fi
    
    info "Docker limpiado"
}

# Función para limpiar archivos temporales
cleanup_temp_files() {
    log "Limpiando archivos temporales..."
    
    # Eliminar archivos de snapshot
    sudo rm -rf ~/snapshots 2>/dev/null || true
    sudo rm -rf /tmp/snapshots 2>/dev/null || true
    sudo rm -f /tmp/*juno* 2>/dev/null || true
    sudo rm -f /tmp/*.tar.lz4 2>/dev/null || true
    
    # Limpiar logs antiguos
    sudo journalctl --vacuum-time=1d 2>/dev/null || true
    
    info "Archivos temporales limpiados"
}

# Función para limpiar puertos
cleanup_ports() {
    log "Verificando puertos..."
    
    # Verificar si los puertos están en uso
    local ports=(26657 1317 9090)
    
    for port in "${ports[@]}"; do
        if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
            warning "Puerto $port está en uso"
            info "Procesos usando puerto $port:"
            netstat -tlnp 2>/dev/null | grep ":$port " || true
        else
            info "✅ Puerto $port está disponible"
        fi
    done
}

# Función para verificar espacio en disco
check_disk_space() {
    log "Verificando espacio en disco..."
    
    local available_space=$(df -h / | awk 'NR==2 {print $4}')
    local available_bytes=$(df / | awk 'NR==2 {print $4}')
    
    info "Espacio disponible: $available_space"
    
    # Verificar que hay al menos 50GB disponibles
    if [ "$available_bytes" -lt 52428800 ]; then
        warning "⚠️  Espacio en disco bajo. Se recomienda al menos 50GB libres"
        info "Espacio actual: $available_space"
    else
        info "✅ Espacio en disco suficiente"
    fi
}

# Función para mostrar resumen
show_cleanup_summary() {
    echo ""
    echo -e "${GREEN}=== RESUMEN DE LIMPIEZA ===${NC}"
    echo -e "✅ Servicios de JUNO eliminados"
    echo -e "✅ Usuario juno eliminado"
    echo -e "✅ Directorios limpiados"
    echo -e "✅ Binarios eliminados"
    echo -e "✅ Docker limpiado"
    echo -e "✅ Archivos temporales eliminados"
    echo -e "✅ Puertos verificados"
    echo -e "✅ Espacio en disco verificado"
    echo ""
    echo -e "${BLUE}=== PRÓXIMOS PASOS ===${NC}"
    echo -e "1. El sistema está limpio y listo para la instalación"
    echo -e "2. Ejecuta: ./install-juno-starknet.sh"
    echo -e "3. Monitorea la instalación con: ./verify-juno-node.sh"
    echo ""
    echo -e "${YELLOW}=== NOTAS IMPORTANTES ===${NC}"
    echo -e "- Se recomienda reiniciar el sistema después de la limpieza"
    echo -e "- Asegúrate de tener conexión a internet estable"
    echo -e "- El proceso de instalación puede tardar 30-60 minutos"
}

# Función principal
main() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    LIMPIEZA COMPLETA DEL NUC"
    echo "=========================================="
    echo -e "${NC}"
    
    warning "⚠️  Este script eliminará TODAS las instalaciones previas de JUNO"
    warning "⚠️  Se eliminarán datos, configuraciones y servicios"
    echo ""
    
    read -p "¿Estás seguro de que quieres continuar? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Operación cancelada"
        exit 0
    fi
    
    cleanup_services
    cleanup_user_directories
    cleanup_binaries
    cleanup_docker
    cleanup_temp_files
    cleanup_ports
    check_disk_space
    show_cleanup_summary
    
    log "Limpieza completada exitosamente!"
}

# Verificar si se ejecuta como root
if [[ $EUID -eq 0 ]]; then
    error "Este script no debe ejecutarse como root"
fi

# Ejecutar función principal
main "$@"
