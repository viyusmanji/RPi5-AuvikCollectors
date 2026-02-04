---
sidebar_position: 2
---

# SSH Jump Host

An alternative to Tailscale for sites where mesh VPN isn't viable.

:::note Prefer Tailscale
Tailscale is the recommended remote access method. Only use SSH jump host if Tailscale cannot be deployed due to client policy restrictions or network constraints.
:::

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Technician     │         │  Jump Host      │         │  Pi Collector   │
│  Workstation    │◄───────►│  (viyu.net)     │◄───────►│  (Client Site)  │
│                 │   SSH   │                 │  Tunnel │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    │ Reverse SSH Tunnel
                                    │ (Initiated by Pi)
```

## Concept

The Pi initiates an outbound SSH connection to a viyu.net jump host, creating a reverse tunnel. Technicians connect to the jump host and use the tunnel to reach the Pi.

**Advantages:**
- No inbound ports at client site
- Works through restrictive firewalls
- Simple SSH-based security

**Disadvantages:**
- Requires maintaining jump host infrastructure
- Single point of failure
- More complex than Tailscale

## Prerequisites

- viyu.net jump host with:
  - Public IP or DNS name
  - SSH server running
  - User account for each collector
- SSH key pair for the Pi

## Pi Configuration

### 1. Generate SSH Key (if not exists)

```bash
ssh-keygen -t ed25519 -C "auvik-acme-hq" -f ~/.ssh/id_ed25519 -N ""
```

### 2. Copy Public Key to Jump Host

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub jumpuser@jump.viyu.net
```

### 3. Create Reverse Tunnel Service

Create `/etc/systemd/system/reverse-ssh-tunnel.service`:

```ini
[Unit]
Description=Reverse SSH Tunnel to viyu.net Jump Host
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/ssh -N -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -R 22050:localhost:22 jumpuser@jump.viyu.net
Restart=always
RestartSec=10
User=viyuadmin

[Install]
WantedBy=multi-user.target
```

### 4. Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable reverse-ssh-tunnel
sudo systemctl start reverse-ssh-tunnel
```

### 5. Verify Tunnel

On the jump host:
```bash
ss -tlnp | grep 22050
```

Should show the tunnel listening.

## Port Assignment

Assign unique ports per collector to avoid conflicts:

| Collector | Jump Host Port | Client |
|-----------|----------------|--------|
| auvik-acme-hq | 22050 | Acme Corp |
| auvik-globex-main | 22051 | Globex Inc |
| auvik-initech-office | 22052 | Initech |

Document port assignments in your internal systems.

## Connecting to Collectors

From a technician workstation:

```bash
# Direct connection via jump host
ssh -J jumpuser@jump.viyu.net -p 22050 viyuadmin@localhost
```

Or configure `~/.ssh/config`:

```
Host auvik-acme-hq
    HostName localhost
    Port 22050
    User viyuadmin
    ProxyJump jumpuser@jump.viyu.net

Host auvik-globex-main
    HostName localhost
    Port 22051
    User viyuadmin
    ProxyJump jumpuser@jump.viyu.net
```

Then simply:
```bash
ssh auvik-acme-hq
```

## Using autossh (More Robust)

For more reliable tunnel maintenance:

```bash
sudo apt install autossh -y
```

Update the service file to use autossh:

```ini
[Service]
ExecStart=/usr/bin/autossh -M 0 -N -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -R 22050:localhost:22 jumpuser@jump.viyu.net
```

autossh monitors the connection and restarts it if it dies.

## Jump Host Security

### On the Jump Host

1. **Dedicated User** — Create a restricted user for tunnel connections
2. **Disable Shell** — Use `ForceCommand internal-sftp` or `/bin/false` for tunnel-only users
3. **Firewall Rules** — Only allow SSH (22) inbound, restrict tunnel ports
4. **Fail2ban** — Protect against brute force

### Example restricted user (on jump host):

```bash
sudo useradd -m -s /bin/false tunneluser
```

In `/etc/ssh/sshd_config`:
```
Match User tunneluser
    AllowTcpForwarding remote
    X11Forwarding no
    AllowAgentForwarding no
    PermitTTY no
    GatewayPorts no
```

## Troubleshooting

### Tunnel not establishing

1. Check service status: `systemctl status reverse-ssh-tunnel`
2. View logs: `journalctl -u reverse-ssh-tunnel -f`
3. Test manual SSH: `ssh -v jumpuser@jump.viyu.net`

### Tunnel disconnects frequently

1. Reduce `ServerAliveInterval` value
2. Check network stability at client site
3. Consider using `autossh`

### Port already in use on jump host

Another collector may have the same port. Check assignments and reassign.

### Cannot connect through tunnel

1. Verify tunnel is listening on jump host: `ss -tlnp | grep PORT`
2. Check Pi's SSH is running: `systemctl status ssh`
3. Verify firewall allows localhost connections on jump host
