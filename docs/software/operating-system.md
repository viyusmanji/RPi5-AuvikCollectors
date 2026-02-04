---
sidebar_position: 1
---

# Operating System Setup

All deployments use **Raspberry Pi OS Lite (64-bit)** based on Debian 12 Bookworm — the minimum supported OS per Auvik documentation.

## Supported Operating Systems

| OS | Version | Architecture | Status |
|----|---------|--------------|--------|
| **Raspberry Pi OS Lite** | Bookworm (64-bit) | ARM64 | **Recommended** |
| Ubuntu Server | 24.04 LTS | ARM64 | Supported |
| Ubuntu Server | 22.04 LTS | ARM64 | Supported |

:::warning Unsupported
- Raspberry Pi OS (32-bit) — Auvik collector requires 64-bit
- Ubuntu 20.04 — Support ended July 28, 2025
- Desktop variants — Unnecessary overhead for headless collector
:::

## Standard Configuration

| Parameter | Standard Value |
|-----------|----------------|
| OS | Raspberry Pi OS Lite (64-bit) — Bookworm |
| Hostname | `auvik-{clientcode}-{sitecode}` (e.g., `auvik-acme-hq`) |
| Admin User | `viyuadmin` — password stored in documentation platform |
| SSH | Enabled — key-based auth only, password auth disabled |
| Timezone | Client site local (e.g., `America/Chicago`) |
| Auto-Updates | `unattended-upgrades` enabled for security patches |
| Firewall | `ufw` — allow SSH inbound from mgmt, allow all outbound HTTPS (443) |

## Initial Setup with Raspberry Pi Imager

Use [Raspberry Pi Imager](https://www.raspberrypi.com/software/) for initial OS installation:

1. Download and install Raspberry Pi Imager
2. Insert microSD card into your workstation
3. Open Imager → Choose OS → Raspberry Pi OS (other) → **Raspberry Pi OS Lite (64-bit)**
4. Select your microSD card as the target
5. Click the **gear icon** (⚙️) or press **Ctrl+Shift+X** to open advanced options

### Advanced Options Configuration

Configure these settings before writing:

| Setting | Value |
|---------|-------|
| Set hostname | `auvik-TEMPLATE` (or client-specific) |
| Enable SSH | ✓ Use password authentication (for initial setup) |
| Set username | `viyuadmin` |
| Set password | Generate secure password, store in docs |
| Configure wifi | Leave unconfigured (Ethernet only) |
| Set locale | `en_US.UTF-8` |
| Set timezone | Client local timezone |

6. Click **Save**, then **Write**
7. Wait for write and verification to complete

## Post-Boot Configuration

After first boot, SSH into the Pi and complete setup:

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Configure SSH Key Authentication

```bash
# Create .ssh directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add authorized keys (paste your public key)
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Disable Password Authentication

```bash
sudo nano /etc/ssh/sshd_config
```

Set these values:
```
PasswordAuthentication no
PubkeyAuthentication yes
```

Restart SSH:
```bash
sudo systemctl restart ssh
```

### 4. Configure Firewall

```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
```

### 5. Enable Automatic Updates

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 6. Enable Hardware Watchdog

Edit `/boot/firmware/config.txt`:
```bash
sudo nano /boot/firmware/config.txt
```

Add at the end:
```
dtparam=watchdog=on
```

Configure watchdog service:
```bash
sudo apt install watchdog -y
sudo nano /etc/watchdog.conf
```

Uncomment/set:
```
watchdog-device = /dev/watchdog
max-load-1 = 24
```

Enable service:
```bash
sudo systemctl enable watchdog
sudo systemctl start watchdog
```

### 7. Set Hostname (if not done in Imager)

```bash
sudo hostnamectl set-hostname auvik-clientcode-sitecode
```

Update `/etc/hosts`:
```bash
sudo nano /etc/hosts
```

Add:
```
127.0.1.1    auvik-clientcode-sitecode
```

Reboot to apply:
```bash
sudo reboot
```
