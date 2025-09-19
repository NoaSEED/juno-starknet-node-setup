#!/bin/bash

# Script de pruebas para verificar la configuración de JUNO
# Este script realiza pruebas básicas sin instalar realmente el nodo

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

# Función para verificar sintaxis del script
test_syntax() {
    log "Verificando sintaxis del script de instalación..."
    
    if bash -n install-juno-starknet.sh; then
        info "✅ Sintaxis del script de instalación correcta"
    else
        error "❌ Error de sintaxis en install-juno-starknet.sh"
        return 1
    fi
    
    if bash -n verify-juno-node.sh; then
        info "✅ Sintaxis del script de verificación correcta"
    else
        error "❌ Error de sintaxis en verify-juno-node.sh"
        return 1
    fi
    
    if bash -n juno-config.sh; then
        info "✅ Sintaxis del script de configuración correcta"
    else
        error "❌ Error de sintaxis en juno-config.sh"
        return 1
    fi
}

# Función para verificar URLs de snapshots
test_snapshot_urls() {
    log "Verificando URLs de snapshots..."
    
    local urls=(
        "https://eu2.contabostorage.com/37b215ac8ad5417c8ed656231f80e9bb:snapshot/juno/junod-pruned.tar.lz4"
        "https://github.com/CosmosContracts/juno.git"
    )
    
    for url in "${urls[@]}"; do
        info "Verificando: $url"
        if curl -s --head "$url" | head -1 | grep -q "200 OK"; then
            info "✅ URL accesible"
        else
            warning "⚠️  URL no accesible o problema de conectividad"
        fi
    done
}

# Función para verificar URLs de configuración
test_config_urls() {
    log "Verificando URLs de configuración..."
    
    local urls=(
        "https://raw.githubusercontent.com/CosmosContracts/juno/main/networks/uni-6/genesis.json"
        "https://raw.githubusercontent.com/CosmosContracts/juno/main/networks/uni-5/genesis.json"
        "https://snapshots.polkachu.com/addrbook/juno/addrbook.json"
    )
    
    for url in "${urls[@]}"; do
        info "Verificando: $url"
        if curl -s --head "$url" | head -1 | grep -q "200 OK"; then
            info "✅ URL accesible"
        else
            warning "⚠️  URL no accesible o problema de conectividad"
        fi
    done
}

# Función para verificar repositorio JUNO
test_juno_repo() {
    log "Verificando repositorio de JUNO..."
    
    local repo_url="https://github.com/CosmosContracts/juno.git"
    
    info "Verificando: $repo_url"
    if curl -s --head "$repo_url" | head -1 | grep -q "200 OK"; then
        info "✅ Repositorio accesible"
    else
        warning "⚠️  Repositorio no accesible o problema de conectividad"
    fi
}

# Función para verificar dependencias
test_dependencies() {
    log "Verificando dependencias del sistema..."
    
    local deps=("curl" "wget" "git" "jq" "lz4")
    
    for dep in "${deps[@]}"; do
        if command -v "$dep" &> /dev/null; then
            info "✅ $dep está instalado"
        else
            warning "⚠️  $dep no está instalado"
        fi
    done
    
    # Verificar Go
    if command -v go &> /dev/null; then
        local go_version=$(go version | cut -d' ' -f3)
        info "✅ Go está instalado: $go_version"
    else
        warning "⚠️  Go no está instalado"
    fi
    
    # Verificar Docker
    if command -v docker &> /dev/null; then
        local docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        info "✅ Docker está instalado: $docker_version"
    else
        warning "⚠️  Docker no está instalado"
    fi
}

# Función para verificar permisos de archivos
test_file_permissions() {
    log "Verificando permisos de archivos..."
    
    local files=(
        "install-juno-starknet.sh"
        "verify-juno-node.sh"
        "juno-config.sh"
        "test-juno-setup.sh"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            if [ -x "$file" ]; then
                info "✅ $file es ejecutable"
            else
                warning "⚠️  $file no es ejecutable"
            fi
        else
            error "❌ $file no encontrado"
        fi
    done
}

# Función para verificar configuración de red
test_network_config() {
    log "Verificando configuración de red..."
    
    # Verificar que los puertos no estén en uso
    local ports=(26657 1317 9090)
    
    for port in "${ports[@]}"; do
        if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
            warning "⚠️  Puerto $port está en uso"
        else
            info "✅ Puerto $port está disponible"
        fi
    done
}

# Función para simular configuración
simulate_config() {
    log "Simulando configuración de JUNO..."
    
    # Crear directorio temporal para simulación
    local temp_dir="/tmp/juno-test-$(date +%s)"
    mkdir -p "$temp_dir"
    
    info "Directorio de simulación: $temp_dir"
    
    # Simular estructura de directorios
    mkdir -p "$temp_dir/.juno/config"
    mkdir -p "$temp_dir/snapshots"
    
    # Crear archivos de configuración de ejemplo
    cat > "$temp_dir/.juno/config/config.toml" << 'EOF'
[consensus]
timeout_commit = "1s"
timeout_propose = "1s"

[p2p]
max_num_inbound_peers = 40
max_num_outbound_peers = 10

[mempool]
size = 5000
max_txs_bytes = 1073741824

[rpc]
max_body_bytes = 1000000
max_open_connections = 40
EOF
    
    cat > "$temp_dir/.juno/config/app.toml" << 'EOF'
[api]
enable = true
swagger = false
address = "tcp://0.0.0.0:1317"

[grpc]
enable = true
address = "0.0.0.0:9090"

[state-sync]
snapshot-interval = 1000
snapshot-keep-recent = 2
EOF
    
    info "✅ Configuración simulada creada correctamente"
    
    # Limpiar directorio temporal
    rm -rf "$temp_dir"
}

# Función para generar reporte
generate_report() {
    log "Generando reporte de pruebas..."
    
    local report_file="juno-test-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
REPORTE DE PRUEBAS - JUNO STARKNET SETUP
==========================================
Fecha: $(date)
Sistema: $(uname -a)
Usuario: $(whoami)

PRUEBAS REALIZADAS:
- Verificación de sintaxis de scripts
- Verificación de URLs de snapshots
- Verificación de URLs de configuración
- Verificación de repositorio JUNO
- Verificación de dependencias del sistema
- Verificación de permisos de archivos
- Verificación de configuración de red
- Simulación de configuración

ARCHIVOS INCLUIDOS:
- install-juno-starknet.sh (Script principal de instalación)
- verify-juno-node.sh (Script de verificación)
- juno-config.sh (Script de configuración de red)
- README-JUNO.md (Documentación)

PRÓXIMOS PASOS:
1. Ejecutar ./install-juno-starknet.sh para instalar el nodo
2. Usar ./verify-juno-node.sh para verificar el estado
3. Usar ./juno-config.sh para cambiar entre redes
4. Monitorear logs con: sudo journalctl -u junod -f

EOF
    
    info "✅ Reporte generado: $report_file"
}

# Función principal
main() {
    echo -e "${GREEN}"
    echo "=========================================="
    echo "    PRUEBAS DE CONFIGURACIÓN JUNO"
    echo "=========================================="
    echo -e "${NC}"
    
    test_syntax
    echo ""
    
    test_snapshot_urls
    echo ""
    
    test_config_urls
    echo ""
    
    test_juno_repo
    echo ""
    
    test_dependencies
    echo ""
    
    test_file_permissions
    echo ""
    
    test_network_config
    echo ""
    
    simulate_config
    echo ""
    
    generate_report
    
    log "Pruebas completadas!"
    info "Revisa el reporte generado para más detalles"
}

# Ejecutar función principal
main "$@"
