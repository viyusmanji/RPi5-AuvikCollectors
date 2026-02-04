---
sidebar_position: 2
---

import PrintButton from '@site/src/components/PrintButton';

# Quick Reference Card

Pocket-sized reference for field deployments.

<PrintButton label="Print Quick Reference" />

---

## Pre-Deployment Essentials

```
□ Golden image cloned to SD
□ Hostname: auvik-{client}-{site}
□ Static IP configured
□ Auvik installed & online
□ Tailscale connected
□ Asset label applied
```

## On-Site Install

```
□ Verify 802.3at PoE+ on port
□ Connect to switch port
□ Confirm Pi powers on
□ Verify Auvik online
□ Check discovery starting
□ Mount & document
```

## Key Commands

### Connectivity Tests
```bash
ping 10.1.1.1        # Gateway
ping 8.8.8.8         # Internet
curl -I https://auvik.com
```

### Service Status
```bash
systemctl status auvik-collector
systemctl status tailscaled
```

### Service Control
```bash
sudo systemctl restart auvik-collector
sudo systemctl restart tailscaled
```

### View Logs
```bash
journalctl -u auvik-collector -f
journalctl -u tailscaled -f
```

### System Info
```bash
hostname
ip addr show eth0
free -h
df -h
uptime
```

### Tailscale
```bash
tailscale status
tailscale netcheck
sudo tailscale up --ssh
```

### Network Config (nmcli)
```bash
# View current
nmcli con show

# Set static IP
sudo nmcli con mod "Wired connection 1" \
  ipv4.method manual \
  ipv4.addresses 10.1.1.50/24 \
  ipv4.gateway 10.1.1.1 \
  ipv4.dns "10.1.1.1 8.8.8.8"

# Apply changes
sudo nmcli con down "Wired connection 1"
sudo nmcli con up "Wired connection 1"
```

## Troubleshooting Matrix

| Symptom | Check | Fix |
|---------|-------|-----|
| No power | Port PoE standard | Use 802.3at port or USB-C |
| No network | Cable, port config | Try different cable/port |
| Auvik offline | Service, firewall | Restart service, check HTTPS |
| No discovery | SNMP on devices | Enable SNMP, add allowed host |
| Tailscale down | Service status | `sudo tailscale up --ssh` |

## Important URLs

| Resource | URL |
|----------|-----|
| Auvik Portal | `https://TENANT.my.auvik.com` |
| Tailscale Admin | `https://login.tailscale.com/admin` |
| Auvik Support | `https://support.auvik.com` |
| This Guide | `https://viyu-net.github.io/viyu_AuvikCollectors` |

## Contact Info

```
NOC: [Your NOC contact]
Escalation: [Escalation path]
Emergency: [Emergency contact]
```

## Hardware Specs

| Spec | Pi 5 (8GB) |
|------|------------|
| CPU | 4-core 2.4GHz |
| RAM | 8 GB |
| Storage | 32GB+ SD |
| Power | 802.3at PoE+ |
| Network | Gigabit Ethernet |

## Capacity Limits

| Metric | Max |
|--------|-----|
| Devices | ~200 |
| Interfaces | ~9,000 |

## Standard Credentials

| System | Username | Notes |
|--------|----------|-------|
| Pi SSH | `viyuadmin` | Key auth only |
| Auvik | Per portal | Check password manager |
| Tailscale | org account | SSO login |

---

*viyu.net Auvik Collector Deployment Guide*
