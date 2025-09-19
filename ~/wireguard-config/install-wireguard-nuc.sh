#!/bin/bash

# Script para instalar y configurar WireGuard en el NUC (Ubuntu ARM)

echo "=== Instalando WireGuard en el NUC ==="

# Actualizar sistema
echo "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar WireGuard
echo "Instalando WireGuard..."
sudo apt install wireguard -y

# Habilitar forwarding de IP
echo "Habilitando IP forwarding..."
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Configurar firewall
echo "Configurando firewall..."
sudo ufw allow 51820/udp
sudo ufw allow ssh
sudo ufw --force enable

# Crear directorio de configuración
echo "Creando directorio de configuración..."
sudo mkdir -p /etc/wireguard

# Copiar configuración del servidor
echo "Copiando configuración del servidor..."
sudo tee /etc/wireguard/wg0.conf > /dev/null << 'EOF'
[Interface]
# Clave privada del servidor (NUC)
PrivateKey = mGjURamvsVE3THXs8c2i9iqC4jcc0aCiVfqhs2A2MUw=

# IP y puerto del servidor WireGuard
Address = 10.0.0.1/24
ListenPort = 51820

# Habilitar forwarding de IP (importante para routing)
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Clave pública del cliente (Mac)
PublicKey = OyL0O+nQ2YHx7pX9DmW5TfVYV23laBWUFH02HIZfHWs=

# IP permitida para el cliente
AllowedIPs = 10.0.0.2/32
EOF

# Establecer permisos correctos
sudo chmod 600 /etc/wireguard/wg0.conf

# Habilitar WireGuard para que inicie automáticamente
echo "Habilitando WireGuard para inicio automático..."
sudo systemctl enable wg-quick@wg0

# Iniciar WireGuard
echo "Iniciando WireGuard..."
sudo systemctl start wg-quick@wg0

# Verificar estado
echo "Verificando estado de WireGuard..."
sudo systemctl status wg-quick@wg0

echo "=== WireGuard instalado y configurado correctamente ==="
echo "El servidor WireGuard está corriendo en el puerto 51820"
echo "Ahora puedes conectarte desde tu Mac usando la configuración del cliente"

