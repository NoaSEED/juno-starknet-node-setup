#!/bin/bash

# Script para instalar dependencias faltantes en el NUC

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

echo "🔧 Instalando dependencias faltantes..."

# Actualizar sistema
info "Actualizando sistema..."
sudo apt update

# Instalar Go
info "Instalando Go..."
if command -v go &> /dev/null; then
    GO_VERSION=$(go version | grep -oE 'go[0-9]+\.[0-9]+' | sed 's/go//')
    if (( $(echo "$GO_VERSION >= 1.19" | bc -l) )); then
        info "Go ya está instalado con versión compatible: $(go version)"
    else
        warning "Go versión $GO_VERSION es muy antigua, instalando versión más reciente..."
        sudo apt remove -y golang-go
        install_go_latest
    fi
else
    install_go_latest
fi

install_go_latest() {
    info "Instalando Go 1.21..."
    wget -q https://go.dev/dl/go1.21.6.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    export PATH=$PATH:/usr/local/go/bin
    rm go1.21.6.linux-amd64.tar.gz
    success "Go 1.21 instalado correctamente"
}

# Instalar npm
info "Instalando npm..."
if command -v npm &> /dev/null; then
    info "npm ya está instalado: $(npm --version)"
else
    sudo apt install -y npm
    success "npm instalado correctamente"
fi

# Instalar Node.js (versión más reciente)
info "Instalando Node.js..."
if command -v node &> /dev/null; then
    info "Node.js ya está instalado: $(node --version)"
else
    # Instalar Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    success "Node.js instalado correctamente"
fi

# Instalar dependencias adicionales
info "Instalando dependencias adicionales..."
sudo apt install -y curl wget git jq lz4 build-essential bc

# Verificar instalaciones
echo ""
echo "📋 Verificando instalaciones:"
echo "Go: $(go version)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git: $(git --version)"
echo "Docker: $(docker --version)"

success "Todas las dependencias instaladas correctamente!"
echo ""
echo "🚀 Ahora puedes ejecutar:"
echo "   ./install-juno-starknet.sh"
echo ""
