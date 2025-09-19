#!/bin/bash

# Script completo de instalación para JUNO en el NUC
# Este script realiza la instalación completa paso a paso

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

# Función para mostrar ayuda
show_help() {
    echo -e "${GREEN}Script de Instalación Completa JUNO${NC}"
    echo ""
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  --cleanup-only    Solo limpiar el sistema"
    echo "  --install-only    Solo instalar (sin limpiar)"
    echo "  --full            Limpiar e instalar (por defecto)"
    echo "  --help            Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                # Instalación completa (limpiar + instalar)"
    echo "  $0 --cleanup-only # Solo limpiar"
    echo "  $0 --install-only # Solo instalar"
}

# Función para verificar prerrequisitos
check_prerequisites() {
    log "Verificando prerrequisitos..."
    
    # Verificar sistema operativo
    if [[ ! -f /etc/os-release ]]; then
        error "Sistema operativo no soportado"
    fi
    
    source /etc/os-release
    
    if [[ "$ID" != "ubuntu" ]] && [[ "$ID" != "debian" ]]; then
        warning "Sistema operativo: $ID (se recomienda Ubuntu/Debian)"
    else
        info "✅ Sistema operativo compatible: $ID"
    fi
    
    # Verificar conexión a internet
    if ! ping -c 1 8.8.8.8 &> /dev/null; then
        error "No hay conexión a internet"
    else
        info "✅ Conexión a internet verificada"
    fi
    
    # Verificar espacio en disco
    local available_bytes=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_bytes" -lt 52428800 ]; then
        error "Espacio en disco insuficiente. Se requieren al menos 50GB libres"
    else
        info "✅ Espacio en disco suficiente"
    fi
    
    # Verificar memoria RAM
    local total_mem=$(free -m | awk 'NR==2{print $2}')
    if [ "$total_mem" -lt 4096 ]; then
        warning "Memoria RAM baja: ${total_mem}MB (se recomienda al menos 4GB)"
    else
        info "✅ Memoria RAM suficiente: ${total_mem}MB"
    fi
}

# Función para actualizar sistema
update_system() {
    log "Actualizando sistema..."
    
    sudo apt update
    sudo apt upgrade -y
    
    info "✅ Sistema actualizado"
}

# Función para instalar dependencias
install_dependencies() {
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
        lsb-release \
        htop \
        tmux \
        net-tools
    
    info "✅ Dependencias instaladas"
}

# Función para instalar Go
install_go() {
    log "Instalando Go..."
    
    if command -v go &> /dev/null; then
        local go_version=$(go version | cut -d' ' -f3)
        info "Go ya está instalado: $go_version"
        return
    fi
    
    GO_VERSION="1.21.5"
    wget "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz"
    sudo tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz"
    
    # Configurar variables de entorno
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    echo 'export GOPATH=$HOME/go' >> ~/.bashrc
    echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc
    
    # Aplicar variables en la sesión actual
    export PATH=$PATH:/usr/local/go/bin
    export GOPATH=$HOME/go
    export PATH=$PATH:$GOPATH/bin
    
    rm "go${GO_VERSION}.linux-amd64.tar.gz"
    
    info "✅ Go instalado correctamente"
}

# Función para instalar Docker
install_docker() {
    log "Instalando Docker..."
    
    if command -v docker &> /dev/null; then
        local docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        info "Docker ya está instalado: $docker_version"
        return
    fi
    
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    
    info "✅ Docker instalado correctamente"
    warning "⚠️  Reinicia la sesión para usar Docker sin sudo"
}

# Función para ejecutar limpieza
run_cleanup() {
    log "Ejecutando limpieza del sistema..."
    
    if [ -f "./cleanup-nuc.sh" ]; then
        ./cleanup-nuc.sh
    else
        warning "Script de limpieza no encontrado, saltando..."
    fi
}

# Función para ejecutar instalación
run_installation() {
    log "Ejecutando instalación de JUNO..."
    
    if [ -f "./install-juno-starknet.sh" ]; then
        ./install-juno-starknet.sh
    else
        error "Script de instalación no encontrado"
    fi
}

# Función para verificar instalación
verify_installation() {
    log "Verificando instalación..."
    
    if [ -f "./verify-juno-node.sh" ]; then
        ./verify-juno-node.sh
    else
        warning "Script de verificación no encontrado"
    fi
}

# Función para mostrar información final
show_final_info() {
    echo ""
    echo -e "${GREEN}=== INSTALACIÓN COMPLETADA ===${NC}"
    echo ""
    echo -e "${BLUE}=== COMANDOS ÚTILES ===${NC}"
    echo -e "Ver estado del nodo:"
    echo -e "  ${YELLOW}sudo systemctl status junod${NC}"
    echo ""
    echo -e "Ver logs en tiempo real:"
    echo -e "  ${YELLOW}sudo journalctl -u junod -f${NC}"
    echo ""
    echo -e "Verificar sincronización:"
    echo -e "  ${YELLOW}curl -s http://localhost:26657/status | jq -r '.result.sync_info'${NC}"
    echo ""
    echo -e "Información del nodo:"
    echo -e "  ${YELLOW}curl -s http://localhost:26657/status | jq -r '.result.node_info'${NC}"
    echo ""
    echo -e "Reiniciar nodo:"
    echo -e "  ${YELLOW}sudo systemctl restart junod${NC}"
    echo ""
    echo -e "${BLUE}=== PRÓXIMOS PASOS ===${NC}"
    echo -e "1. El nodo está iniciando y sincronizando"
    echo -e "2. Monitorea los logs para verificar el progreso"
    echo -e "3. Una vez sincronizado, el nodo estará listo para usar"
    echo -e "4. Considera configurar un firewall apropiado"
    echo ""
    echo -e "${YELLOW}=== NOTAS IMPORTANTES ===${NC}"
    echo -e "- La sincronización inicial puede tardar varias horas"
    echo -e "- El nodo necesita al menos 4GB de RAM para funcionar correctamente"
    echo -e "- Asegúrate de que el puerto 26657 esté abierto si necesitas acceso externo"
}

# Función principal
main() {
    local cleanup_only=false
    local install_only=false
    
    # Procesar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --cleanup-only)
                cleanup_only=true
                shift
                ;;
            --install-only)
                install_only=true
                shift
                ;;
            --full)
                cleanup_only=false
                install_only=false
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                error "Opción desconocida: $1"
                ;;
        esac
    done
    
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    INSTALACIÓN COMPLETA JUNO STARKNET"
    echo "=========================================="
    echo -e "${NC}"
    
    check_prerequisites
    
    if [ "$cleanup_only" = true ]; then
        run_cleanup
        log "Solo limpieza completada"
        exit 0
    fi
    
    if [ "$install_only" = false ]; then
        run_cleanup
    fi
    
    update_system
    install_dependencies
    install_go
    install_docker
    
    run_installation
    verify_installation
    show_final_info
    
    log "Instalación completa finalizada!"
}

# Verificar si se ejecuta como root
if [[ $EUID -eq 0 ]]; then
    error "Este script no debe ejecutarse como root"
fi

# Ejecutar función principal
main "$@"
