---
sidebar_position: 2
---

# VLAN Placement

Proper VLAN placement ensures the Auvik collector can discover and monitor all network infrastructure.

## Recommended Placement

Place the Pi on the **management VLAN** — the same VLAN used for switch management interfaces, firewall management, and other infrastructure devices.

### Why Management VLAN?

| Benefit | Explanation |
|---------|-------------|
| Direct L2 access | Can discover devices via ARP, LLDP, CDP |
| SNMP reachability | Same subnet as managed device interfaces |
| Security alignment | Infrastructure-only VLAN, no user traffic |
| Simplified ACLs | One source IP to permit in firewall rules |

## Architecture Example

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Network                            │
│                                                              │
│  VLAN 100 (Management - 10.1.1.0/24)                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │  [Pi 5 Collector]  [Core Switch Mgmt]  [Firewall]  │    │
│  │     10.1.1.50         10.1.1.1          10.1.1.254 │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│              │                                               │
│              │ Inter-VLAN Routing                           │
│              ▼                                               │
│  ┌────────────────────┐  ┌────────────────────┐             │
│  │ VLAN 200 - Servers │  │ VLAN 300 - Users   │             │
│  │    10.1.2.0/24     │  │    10.1.3.0/24     │             │
│  └────────────────────┘  └────────────────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Inter-VLAN Routing Requirements

The collector needs Layer 3 reachability to all monitored subnets:

| Source | Destination | Protocol | Purpose |
|--------|-------------|----------|---------|
| Collector | Infrastructure devices | SNMP (161/UDP) | Polling |
| Collector | Windows servers | WMI (135/TCP, dynamic) | Windows discovery |
| Collector | All subnets | ICMP | Ping monitoring |

### Verify Routing

From the Pi, test reachability to devices on other VLANs:

```bash
# Ping a device on VLAN 200
ping 10.1.2.10

# Trace route to verify path
traceroute 10.1.2.10

# Test SNMP reachability
snmpwalk -v2c -c public 10.1.2.10 sysDescr
```

## Firewall / ACL Configuration

If the client uses strict segmentation, configure rules to allow collector traffic:

### Required Rules (Outbound from Collector)

| Protocol | Port | Destination | Purpose |
|----------|------|-------------|---------|
| UDP | 161 | All managed devices | SNMP polling |
| TCP | 135 | Windows servers | WMI/RPC |
| TCP | 443 | Internet | Auvik cloud sync |
| ICMP | — | All monitored subnets | Ping |

### Sample ACL (Cisco IOS)

```
ip access-list extended AUVIK-COLLECTOR-OUT
 permit udp host 10.1.1.50 any eq 161
 permit tcp host 10.1.1.50 any eq 135
 permit tcp host 10.1.1.50 any eq 443
 permit icmp host 10.1.1.50 any
```

### Sample Firewall Rule (pfSense/OPNsense)

| Source | Destination | Port | Protocol | Action |
|--------|-------------|------|----------|--------|
| 10.1.1.50 | Management_Net | 161 | UDP | Allow |
| 10.1.1.50 | Server_Net | 161, 135 | UDP, TCP | Allow |
| 10.1.1.50 | Any | 443 | TCP | Allow |
| 10.1.1.50 | Any | * | ICMP | Allow |

## Alternatives to Management VLAN

If the management VLAN isn't accessible or suitable:

### Option 1: Dedicated Monitoring VLAN

Create a new VLAN specifically for monitoring appliances with routing to all segments.

### Option 2: Server VLAN

Place on server VLAN if it has appropriate routing and SNMP access.

### Option 3: Multiple Collectors (Not Recommended)

Deploy separate collectors per VLAN segment. Increases complexity and cost.

## Common Issues

### Collector discovers local VLAN only

**Cause:** No inter-VLAN routing configured

**Resolution:**
1. Verify core switch/firewall has routing between VLANs
2. Check ACLs don't block collector traffic
3. Test ping from Pi to devices on other VLANs

### Partial device discovery

**Cause:** SNMP allowed hosts list on devices

**Resolution:**
1. Add collector IP to SNMP allowed hosts on each managed device
2. Verify community string matches across devices

### WMI discovery fails

**Cause:** Windows firewall blocking RPC, or VLAN routing for dynamic ports

**Resolution:**
1. Configure Windows firewall to allow WMI from collector IP
2. Ensure firewall permits dynamic RPC ports (or use fixed port range)
