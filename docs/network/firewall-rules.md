---
sidebar_position: 3
---

# Firewall Rules

The Auvik collector requires minimal firewall configuration — primarily outbound HTTPS access to the Auvik cloud.

## Outbound Requirements

### Essential (Required)

| Direction | Protocol | Port | Destination | Purpose |
|-----------|----------|------|-------------|---------|
| Outbound | TCP | 443 | `*.auvik.com` | Cloud sync, updates |
| Outbound | TCP | 443 | `*.tailscale.com` | Remote access (if using Tailscale) |

### Discovery Traffic (Internal)

| Direction | Protocol | Port | Destination | Purpose |
|-----------|----------|------|-------------|---------|
| Outbound | UDP | 161 | Managed devices | SNMP polling |
| Outbound | TCP | 135 | Windows servers | WMI discovery |
| Outbound | ICMP | — | All subnets | Ping monitoring |
| Outbound | UDP | 137-138 | Windows devices | NetBIOS (optional) |
| Outbound | TCP | 139, 445 | Windows devices | SMB (optional) |

## Inbound Requirements

:::tip No Inbound Required
The Auvik collector does not require any inbound connections from the internet. All cloud communication is outbound-initiated.
:::

For management access, allow:

| Direction | Protocol | Port | Source | Purpose |
|-----------|----------|------|--------|---------|
| Inbound | TCP | 22 | Management network | SSH access |

If using Tailscale, no additional inbound rules are needed — Tailscale handles NAT traversal.

## SSL/TLS Inspection

Many enterprise firewalls perform SSL inspection (MITM) on HTTPS traffic. This can break the Auvik collector.

### Signs of SSL Inspection Issues

- Collector shows offline despite working internet
- Certificate errors in collector logs
- `curl https://auvik.com` shows unexpected certificate issuer

### Resolution Options

1. **Bypass SSL Inspection** — Add collector IP to SSL inspection bypass list
2. **Whitelist Domains** — Exclude `*.auvik.com` from inspection

### Verify Certificate Chain

```bash
# Check Auvik certificate
openssl s_client -connect auvik.com:443 -servername auvik.com </dev/null 2>/dev/null | openssl x509 -noout -issuer

# Expected issuer: DigiCert or similar public CA
# If you see your firewall vendor's CA, SSL inspection is active
```

## Web Proxy Configuration

If the client network requires a web proxy for internet access:

### Configure Proxy on Pi

```bash
# Set environment variables
export http_proxy="http://proxy.client.local:8080"
export https_proxy="http://proxy.client.local:8080"
export no_proxy="localhost,127.0.0.1,10.0.0.0/8"

# Make persistent
echo 'export http_proxy="http://proxy.client.local:8080"' | sudo tee -a /etc/environment
echo 'export https_proxy="http://proxy.client.local:8080"' | sudo tee -a /etc/environment
```

### Configure Auvik Collector Proxy

After installation, the collector may need proxy configuration. See [Auvik proxy documentation](https://support.auvik.com/hc/en-us/articles/209118046) for collector-specific settings.

## Testing Connectivity

### Internet Access

```bash
# Basic connectivity
ping 8.8.8.8

# DNS resolution
nslookup auvik.com

# HTTPS to Auvik
curl -I https://auvik.com

# Verbose test (shows TLS details)
curl -v https://auvik.com 2>&1 | head -30
```

### SNMP to Managed Devices

```bash
# Install snmp tools
sudo apt install snmp -y

# Test SNMP (replace with actual device IP and community)
snmpwalk -v2c -c public 10.1.1.1 sysDescr
```

### Tailscale (if configured)

```bash
# Check Tailscale status
tailscale status

# Verify connectivity to coordination server
tailscale netcheck
```

## Common Firewall Vendors

### Palo Alto

```
Application: ssl, web-browsing
Destination: *.auvik.com
Action: allow
SSL Decryption: exclude
```

### Fortinet FortiGate

```
Destination: auvik.com, *.auvik.com
Service: HTTPS
Action: Accept
SSL Inspection: bypass
```

### Meraki MX

- Ensure HTTPS (443) outbound is not blocked
- If content filtering enabled, whitelist `auvik.com`

### SonicWall

```
Address Object: auvik.com (FQDN)
Service: HTTPS
Action: Allow
DPI-SSL: Exclude
```

## Troubleshooting

### Collector offline, internet works

1. Check SSL inspection bypass
2. Verify `*.auvik.com` not blocked by content filter
3. Test: `curl -v https://api.auvik.com`

### Intermittent connectivity

1. Check firewall session timeouts (increase if < 1 hour)
2. Verify no bandwidth throttling on collector IP
3. Check for rate limiting on proxy

### Tailscale not connecting

1. Verify outbound 443 to `*.tailscale.com`
2. Check UDP 3478 (STUN) if NAT traversal failing
3. Run `tailscale netcheck` for diagnostics
