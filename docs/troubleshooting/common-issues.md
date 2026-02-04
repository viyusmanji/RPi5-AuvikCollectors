---
sidebar_position: 1
---

# Common Issues

Quick reference for troubleshooting the most frequently encountered problems.

## Issue Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Pi doesn't power on | Switch port 802.3af-only, or PoE budget exhausted | Verify 802.3at support, test with USB-C PSU |
| Collector offline in Auvik | Network issue, Pi crash, SD card failure | Check Tailscale status, attempt SSH |
| No device discovery | SNMP not enabled, wrong credentials, VLAN isolation | Verify SNMP config on devices, check routing |
| High CPU/memory | Site exceeds Pi capacity | Review device/interface counts, scale to VM |
| Tailscale not connecting | Firewall blocking outbound | Verify HTTPS to tailscale.com allowed |
| SD card corruption | Write wear-out or power loss | Re-flash from golden image |

## Diagnostic Commands

### System Health

```bash
# Overall status
uptime
free -h
df -h

# Service status
systemctl status auvik-collector
systemctl status tailscaled

# Network
ip addr show
ip route show
ping 8.8.8.8
curl -I https://auvik.com
```

### Auvik Collector

```bash
# Service logs
journalctl -u auvik-collector -f

# Service control
sudo systemctl restart auvik-collector
sudo systemctl stop auvik-collector
sudo systemctl start auvik-collector
```

### Tailscale

```bash
# Status
tailscale status
tailscale netcheck

# Reconnect
sudo tailscale up --ssh
```

## Escalation Path

If standard troubleshooting doesn't resolve the issue:

1. **Check Auvik support docs** — [support.auvik.com](https://support.auvik.com)
2. **Review Tailscale status** — [status.tailscale.com](https://status.tailscale.com)
3. **Check Pi forums** — [forums.raspberrypi.com](https://forums.raspberrypi.com)
4. **Internal escalation** — Document issue and escalate to senior team

## Detailed Troubleshooting

For detailed troubleshooting of specific issues, see:

- [Pi Not Powering On](/docs/troubleshooting/pi-not-powering)
- [Collector Offline](/docs/troubleshooting/collector-offline)
- [SD Card Failure](/docs/troubleshooting/sd-card-failure)
