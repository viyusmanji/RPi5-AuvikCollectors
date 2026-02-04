---
sidebar_position: 1
---

# IP Addressing

Each Auvik collector requires a consistent IP address for reliable operation and documentation.

## Addressing Options

| Method | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Static IP** | Predictable, no DHCP dependency | Manual configuration | **Preferred** |
| DHCP Reservation | Centralized management | Requires DHCP server access | Acceptable |
| Dynamic DHCP | Simple | IP may change, breaks documentation | Not recommended |

## Static IP Configuration

### Using nmcli (Recommended)

On Raspberry Pi OS Bookworm:

```bash
# List connections
nmcli con show

# Configure static IP (replace values)
sudo nmcli con mod "Wired connection 1" \
  ipv4.method manual \
  ipv4.addresses 10.1.1.50/24 \
  ipv4.gateway 10.1.1.1 \
  ipv4.dns "10.1.1.1 8.8.8.8"

# Apply changes
sudo nmcli con down "Wired connection 1"
sudo nmcli con up "Wired connection 1"

# Verify
ip addr show eth0
```

### Using dhcpcd.conf (Legacy)

For older Raspberry Pi OS versions:

```bash
sudo nano /etc/dhcpcd.conf
```

Add at the end:
```
interface eth0
static ip_address=10.1.1.50/24
static routers=10.1.1.1
static domain_name_servers=10.1.1.1 8.8.8.8
```

Apply:
```bash
sudo systemctl restart dhcpcd
```

## DHCP Reservation Setup

If using DHCP reservations, configure on the DHCP server (typically the firewall or router):

### Required Information

| Field | Example Value |
|-------|---------------|
| MAC Address | `d8:3a:dd:xx:xx:xx` |
| Hostname | `auvik-acme-hq` |
| IP Address | `10.1.1.50` |
| Description | `Auvik Collector - Pi 5` |

### Get Pi MAC Address

```bash
ip link show eth0 | grep ether
```

## IP Address Documentation

Record the following for every deployment:

| Field | Value | Where to Document |
|-------|-------|-------------------|
| IP Address | `10.1.1.50` | Client documentation, Auvik site notes |
| Subnet Mask | `/24` or `255.255.255.0` | Client documentation |
| Gateway | `10.1.1.1` | Client documentation |
| DNS Servers | `10.1.1.1, 8.8.8.8` | Client documentation |
| VLAN | `100 (Management)` | Client documentation |
| MAC Address | `d8:3a:dd:xx:xx:xx` | Asset tracking |

## IP Addressing Best Practices

### Reserved Range

Establish a standard range for Auvik collectors across all clients:

| Example Scheme | IP Range |
|----------------|----------|
| Fixed last octet | `.50` in each management subnet |
| Dedicated range | `.50-.59` for monitoring appliances |

### Avoid Conflicts

- [ ] Verify IP not already in use: `ping 10.1.1.50`
- [ ] Check DHCP scope excludes your static IPs
- [ ] Document reservation before configuring

### DNS Entry (Optional)

Consider creating a DNS A record:
```
auvik-collector.client.local → 10.1.1.50
```

This simplifies SSH access and documentation.

## Troubleshooting

### IP Address Conflict

**Symptoms:** Intermittent connectivity, duplicate IP warnings

**Resolution:**
1. Identify conflicting device via ARP: `arp -a | grep 10.1.1.50`
2. Release IP on conflicting device
3. Clear ARP cache on gateway

### No Gateway Connectivity

**Symptoms:** Can ping local devices, cannot reach internet

**Check:**
```bash
ip route show
ping 10.1.1.1  # Gateway
```

**Resolution:** Verify gateway is correct, check VLAN routing.

### DHCP Lease Not Renewing

**Symptoms:** IP changes unexpectedly

**Resolution:** Convert to static IP or create DHCP reservation.
