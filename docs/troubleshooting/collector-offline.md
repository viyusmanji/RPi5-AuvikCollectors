---
sidebar_position: 3
---

# Collector Offline

Troubleshooting when the Auvik collector shows offline in the portal.

## Symptoms

- Auvik portal shows collector status as **Offline** (red)
- No recent data from the site
- May have received offline alert

## Diagnostic Flow

```
Collector Offline
       │
       ▼
Can you reach Pi via Tailscale?
       │
  ┌────┴────┐
 Yes       No
  │         │
  │         ▼
  │    Is Tailscale device
  │    showing online?
  │         │
  │    ┌────┴────┐
  │   Yes       No
  │    │         │
  │    │         ▼
  │    │    Pi likely powered off
  │    │    or network down
  │    │    → Contact client
  │    │
  │    ▼
  │   Try SSH via client VPN
  │   or dispatch tech
  │
  ▼
Check Auvik service
on the Pi
```

## Diagnostic Steps

### 1. Check Tailscale Status

From your workstation:

```bash
tailscale status
```

Look for the collector's hostname:
- **Online** — Pi is reachable, issue is Auvik-specific
- **Offline** — Pi or network issue

### 2. Attempt SSH via Tailscale

If Tailscale shows the device:

```bash
ssh viyuadmin@hostname.tailnet-name.ts.net
```

**If SSH succeeds:** Pi is running, check Auvik service
**If SSH fails:** Pi may be up but Tailscale unhealthy

### 3. Check Auvik Service

Once connected via SSH:

```bash
# Check service status
systemctl status auvik-collector

# View recent logs
journalctl -u auvik-collector --since "1 hour ago"
```

**Common log messages:**

| Message | Meaning | Action |
|---------|---------|--------|
| "Connection refused" | Can't reach Auvik cloud | Check firewall/internet |
| "Certificate error" | SSL inspection breaking TLS | Bypass SSL inspection |
| "Authentication failed" | Token issue | Reinstall collector |

### 4. Test Internet Connectivity

```bash
# Basic connectivity
ping 8.8.8.8

# DNS resolution
nslookup auvik.com

# HTTPS to Auvik
curl -I https://auvik.com

# Verbose TLS test
curl -v https://auvik.com 2>&1 | head -40
```

### 5. Restart Auvik Service

Often resolves temporary issues:

```bash
sudo systemctl restart auvik-collector

# Wait 2-3 minutes, check status
systemctl status auvik-collector
```

### 6. Check System Resources

```bash
# Memory
free -h

# Disk space
df -h

# CPU load
uptime
top -bn1 | head -20
```

**Resource issues:**
- High memory: Site may exceed Pi capacity
- Full disk: Clear logs or expand storage
- High CPU: Check for runaway processes

## Common Causes and Resolutions

### Network Outage at Client Site

**Diagnosis:** Tailscale offline, can't reach Pi any way
**Resolution:** Contact client to verify network/power status

### Firewall Change Blocked Auvik

**Diagnosis:** Pi reachable, but Auvik service errors show connection issues
**Resolution:**
1. Verify HTTPS (443) outbound to `*.auvik.com`
2. Check for new SSL inspection
3. Have client whitelist collector IP

### Auvik Service Crashed

**Diagnosis:** Service shows "failed" status
**Resolution:**
```bash
sudo systemctl restart auvik-collector
```

If recurring, check logs for root cause.

### SD Card Failure

**Diagnosis:** Read-only filesystem errors, service won't start properly
**Resolution:** Replace SD card, re-flash from golden image
See [SD Card Failure](/docs/troubleshooting/sd-card-failure)

### Pi Hardware Failure

**Diagnosis:** No response via any method, client confirms power present
**Resolution:** Dispatch tech with replacement Pi

## If Pi is Unreachable

When you can't reach the Pi remotely:

1. **Contact client** — Verify power and network at site
2. **Request local check** — Have someone verify Pi LEDs and cable
3. **Check client network** — Any known outages?
4. **Dispatch tech** — If cannot be resolved remotely

## Recovery Checklist

After resolving the issue:

- [ ] Collector shows online in Auvik
- [ ] Device discovery resuming
- [ ] Tailscale connected
- [ ] Document root cause and resolution
- [ ] Consider preventive measures (if recurring)
