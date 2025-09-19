#!/bin/bash

# Script para configurar repositorio GitHub para JUNO Starknet
# Este script inicializa Git y configura el repositorio remoto

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

# Función para mostrar ayuda
show_help() {
    echo -e "${GREEN}Script de Configuración GitHub para JUNO Starknet${NC}"
    echo ""
    echo "Uso: $0 [comando] [opciones]"
    echo ""
    echo "Comandos:"
    echo "  init <repo-url>    Inicializar repositorio con URL de GitHub"
    echo "  push              Hacer push de cambios"
    echo "  status            Mostrar estado del repositorio"
    echo "  help              Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 init https://github.com/tu-usuario/juno-starknet.git"
    echo "  $0 push"
    echo "  $0 status"
}

# Función para inicializar repositorio
init_repo() {
    local repo_url="$1"
    
    if [ -z "$repo_url" ]; then
        error "Debes proporcionar la URL del repositorio GitHub"
        echo ""
        echo "Ejemplo: $0 init https://github.com/tu-usuario/juno-starknet.git"
        exit 1
    fi
    
    log "Inicializando repositorio Git..."
    
    # Inicializar Git si no existe
    if [ ! -d ".git" ]; then
        git init
        info "Repositorio Git inicializado"
    else
        info "Repositorio Git ya existe"
    fi
    
    # Configurar usuario Git si no está configurado
    if [ -z "$(git config user.name)" ]; then
        warning "Usuario Git no configurado"
        read -p "Ingresa tu nombre de usuario Git: " git_user
        git config user.name "$git_user"
    fi
    
    if [ -z "$(git config user.email)" ]; then
        warning "Email Git no configurado"
        read -p "Ingresa tu email Git: " git_email
        git config user.email "$git_email"
    fi
    
    # Agregar archivos al repositorio
    log "Agregando archivos al repositorio..."
    git add install-juno-starknet.sh
    git add verify-juno-node.sh
    git add juno-config.sh
    git add test-juno-setup.sh
    git add README-JUNO.md
    git add LICENSE
    git add .gitignore
    
    # Hacer commit inicial
    git commit -m "Initial commit: JUNO Starknet node setup scripts

- install-juno-starknet.sh: Script principal de instalación
- verify-juno-node.sh: Script de verificación del nodo
- juno-config.sh: Script de configuración de red
- test-juno-setup.sh: Script de pruebas
- README-JUNO.md: Documentación completa
- LICENSE: Licencia MIT
- .gitignore: Archivos a ignorar"

    # Configurar repositorio remoto
    log "Configurando repositorio remoto..."
    git remote add origin "$repo_url"
    
    # Configurar rama principal
    git branch -M main
    
    info "✅ Repositorio configurado correctamente"
    info "URL del repositorio: $repo_url"
    info "Rama principal: main"
    
    warning "Para hacer push por primera vez, ejecuta: $0 push"
}

# Función para hacer push
push_changes() {
    log "Haciendo push de cambios..."
    
    # Verificar si hay cambios pendientes
    if [ -n "$(git status --porcelain)" ]; then
        log "Agregando cambios pendientes..."
        git add .
        git commit -m "Update: $(date +'%Y-%m-%d %H:%M:%S')

- Actualizaciones y mejoras en scripts
- Correcciones de URLs y configuración
- Mejoras en documentación"
    fi
    
    # Hacer push
    git push -u origin main
    
    info "✅ Cambios subidos correctamente a GitHub"
}

# Función para mostrar estado
show_status() {
    log "Estado del repositorio:"
    echo ""
    
    # Información del repositorio
    if [ -d ".git" ]; then
        echo -e "${BLUE}=== INFORMACIÓN DEL REPOSITORIO ===${NC}"
        echo -e "Directorio Git: $(pwd)/.git"
        echo -e "Rama actual: $(git branch --show-current)"
        echo -e "Último commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
        
        # Repositorio remoto
        local remote_url=$(git remote get-url origin 2>/dev/null || echo "No configurado")
        echo -e "Repositorio remoto: $remote_url"
        
        echo ""
        echo -e "${BLUE}=== ESTADO DE ARCHIVOS ===${NC}"
        git status --short
        
        echo ""
        echo -e "${BLUE}=== ARCHIVOS INCLUIDOS ===${NC}"
        echo -e "✅ install-juno-starknet.sh - Script principal"
        echo -e "✅ verify-juno-node.sh - Script de verificación"
        echo -e "✅ juno-config.sh - Script de configuración"
        echo -e "✅ test-juno-setup.sh - Script de pruebas"
        echo -e "✅ README-JUNO.md - Documentación"
        echo -e "✅ LICENSE - Licencia MIT"
        echo -e "✅ .gitignore - Archivos ignorados"
        
    else
        error "No hay repositorio Git inicializado"
        info "Ejecuta: $0 init <repo-url> para inicializar"
    fi
}

# Función para verificar archivos
check_files() {
    log "Verificando archivos del proyecto..."
    
    local files=(
        "install-juno-starknet.sh"
        "verify-juno-node.sh"
        "juno-config.sh"
        "test-juno-setup.sh"
        "README-JUNO.md"
        "LICENSE"
        ".gitignore"
    )
    
    local missing_files=()
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            info "✅ $file"
        else
            error "❌ $file - FALTANTE"
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        error "Faltan archivos importantes:"
        for file in "${missing_files[@]}"; do
            echo -e "  - $file"
        done
        exit 1
    fi
    
    info "✅ Todos los archivos están presentes"
}

# Función principal
main() {
    local command="$1"
    local repo_url="$2"
    
    case "$command" in
        "init")
            check_files
            init_repo "$repo_url"
            ;;
        "push")
            push_changes
            ;;
        "status")
            show_status
            ;;
        "check")
            check_files
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

# Verificar si Git está instalado
if ! command -v git &> /dev/null; then
    error "Git no está instalado. Instálalo con:"
    echo "  Ubuntu/Debian: sudo apt install git"
    echo "  macOS: brew install git"
    exit 1
fi

# Ejecutar función principal
main "$@"
