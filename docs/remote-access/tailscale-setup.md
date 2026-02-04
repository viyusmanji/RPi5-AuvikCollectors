---
sidebar_position: 1
---

# Tailscale Setup

Tailscale provides secure, zero-config remote access to deployed collectors via a mesh VPN.

## Why Tailscale?

| Feature | Benefit |
|---------|---------|
| Zero-config NAT traversal | Works through any firewall/NAT |
| SSH over Tailscale | Direct shell access without port forwarding |
| Central management | View all collectors in Tailscale admin |
| No inbound ports | No firewall rules to configure at client |
| End-to-end encryption | WireGuard-based security |

## Installation

### Prerequisites

- Pi has internet access
- You have access to the viyu.net Tailscale admin console

### Install Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

### Authenticate

```bash
sudo tailscale up --ssh
```

This will output an authentication URL. Open it in a browser and log in with the viyu.net Tailscale account.

### Verify Connection

```bash
tailscale status
```

Expected output shows the device connected to the tailnet:
```
100.x.x.x    auvik-acme-hq    linux   -
```

## Configuration Options

### Enable Tailscale SSH

The `--ssh` flag enables Tailscale's built-in SSH server, allowing access via:

```bash
# From any device on the tailnet
ssh viyuadmin@auvik-acme-hq
```

No need to open port 22 or configure SSH forwarding.

### Set Tags for Organization

In Tailscale admin, tag collectors for easy management:

```
tag:auvik-collector
tag:client-acme
```

### Disable Key Expiry (Recommended)

By default, Tailscale keys expire after 180 days. For persistent collectors:

1. Go to Tailscale admin → Machines
2. Find the collector
3. Click the menu (⋮) → Disable key expiry

Or via CLI:
```bash
# On a machine with admin access
tailscale set --key-expiry=false
```

## Auto-Start on Boot

The Tailscale service is enabled by default after installation. Verify:

```bash
sudo systemctl status tailscaled
sudo systemctl enable tailscaled
```

## Testing Remote Access

### From Management Machine

```bash
# Ping via Tailscale
ping auvik-acme-hq

# Or by Tailscale IP
ping 100.x.x.x

# SSH directly
ssh viyuadmin@auvik-acme-hq
```

### Check Connectivity Details

```bash
tailscale netcheck
```

This shows:
- NAT type
- Latency to DERP relays
- Direct connectivity status

## Tailscale Admin Console

Monitor all collectors at [login.tailscale.com/admin/machines](https://login.tailscale.com/admin/machines):

| Column | Meaning |
|--------|---------|
| Machine | Hostname |
| User | viyu.net account |
| IP | Tailscale IP (100.x.x.x) |
| Status | Connected/disconnected |
| Last seen | Last connectivity check |

### Useful Admin Actions

- **Expire key** — Force re-authentication
- **Disable** — Temporarily block access
- **Remove** — Delete from tailnet
- **Edit ACLs** — Restrict access (if using ACLs)

## Access Control Lists (ACLs)

For environments requiring stricter access:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:viyu-admin"],
      "dst": ["tag:auvik-collector:22"]
    }
  ],
  "tagOwners": {
    "tag:auvik-collector": ["autogroup:admin"],
    "tag:viyu-admin": ["autogroup:admin"]
  }
}
```

## Troubleshooting

### Device not appearing in admin

1. Verify Tailscale is running: `systemctl status tailscaled`
2. Check for errors: `journalctl -u tailscaled -f`
3. Re-authenticate: `sudo tailscale up --ssh`

### Cannot connect to device

1. Verify device shows "Connected" in admin
2. Check firewall on Pi isn't blocking Tailscale: `sudo ufw status`
3. Run `tailscale ping auvik-acme-hq` from management machine
4. Check `tailscale netcheck` for connectivity issues

### Tailscale not starting on boot

```bash
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
```

### Key expired

Re-authenticate:
```bash
sudo tailscale up --ssh
```

Then disable expiry in admin console to prevent recurrence.
