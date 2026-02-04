---
sidebar_position: 5
---

# Complex Network Scenarios

Enterprise and security-conscious networks require specialized collector placement, routing, and credential management. This guide covers advanced deployment scenarios.

## Scenario 1: Multi-VLAN Segmented Networks

### Challenge

Client has strict VLAN segmentation with limited inter-VLAN routing:
- Management VLAN (infrastructure only)
- Server VLAN (Windows/Linux servers)
- IoT/OT VLAN (network devices, cameras, sensors)
- Guest/DMZ VLAN (isolated from internal)

### Solution: Strategic Collector Placement

Place the collector on the **management VLAN** with selective firewall rules:

```
┌──────────────────────────────────────────────────────────┐
│                   Core Firewall/Router                    │
│                                                           │
│  VLAN 10 - Management (10.10.10.0/24)                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  [Pi Collector]     [Switches]     [Firewall Mgmt] │  │
│  │    10.10.10.50      10.10.10.x     10.10.10.1      │  │
│  └────────────────────────────────────────────────────┘  │
│                         ▲                                 │
│                         │ Firewall Rules                  │
│         ┌───────────────┼───────────────┐                 │
│         │               │               │                 │
│  ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐         │
│  │ VLAN 20     │ │ VLAN 30     │ │ VLAN 40     │         │
│  │ Servers     │ │ IoT/OT      │ │ Guest/DMZ   │         │
│  │ 10.10.20./24│ │ 10.10.30./24│ │ 10.10.40./24│         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Required Firewall Rules

Create explicit rules allowing collector access to each segment:

**From Management VLAN (10.10.10.50) to Server VLAN:**

| Source | Destination | Protocol | Port | Purpose |
|--------|-------------|----------|------|---------|
| 10.10.10.50 | 10.10.20.0/24 | UDP | 161 | SNMP |
| 10.10.10.50 | 10.10.20.0/24 | TCP | 135, 445 | WMI (Windows) |
| 10.10.10.50 | 10.10.20.0/24 | TCP | 22 | SSH (Linux) |
| 10.10.10.50 | 10.10.20.0/24 | ICMP | — | Ping monitoring |

**From Management VLAN to IoT/OT VLAN:**

| Source | Destination | Protocol | Port | Purpose |
|--------|-------------|----------|------|---------|
| 10.10.10.50 | 10.10.30.0/24 | UDP | 161 | SNMP (sensors, cameras) |
| 10.10.10.50 | 10.10.30.0/24 | ICMP | — | Ping monitoring |

:::tip Security Recommendation
**Do not** monitor the Guest/DMZ VLAN from the collector. Guest networks should remain isolated. Monitor DMZ infrastructure devices (firewall, edge router) via their management interfaces on the management VLAN instead.
:::

### Testing Segmented Access

From the Pi collector:

```bash
# Test SNMP to each VLAN
snmpwalk -v2c -c viyu-readonly 10.10.20.5 sysDescr  # Server VLAN
snmpwalk -v2c -c viyu-readonly 10.10.30.10 sysDescr # IoT VLAN

# Verify routing and latency
traceroute 10.10.20.5
ping -c 4 10.10.30.10

# Check if WMI ports are reachable (Windows)
nc -zv 10.10.20.5 135
nc -zv 10.10.20.5 445
```

### Common Issues

**Issue:** Collector discovers devices on management VLAN only

**Cause:** Firewall blocking SNMP/ICMP to other VLANs

**Resolution:**
1. Verify firewall rules are in place and active
2. Check rule order — deny rules may precede allow rules
3. Test with `tcpdump` on collector to see if packets are being sent:
   ```bash
   sudo tcpdump -i eth0 host 10.10.20.5 and port 161
   ```
4. Check device logs on firewall for blocked traffic

---

## Scenario 2: Router-on-a-Stick (Single-NIC Inter-VLAN Routing)

### Challenge

Small sites use a single router/firewall with one physical interface handling multiple VLANs via subinterfaces (802.1Q trunking).

### Architecture Example

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │  pfSense/Router │
              │   (em0 trunk)   │
              └────────┬────────┘
                       │ 802.1Q Trunk
                       │ (VLANs 10, 20, 30)
                       ▼
              ┌────────────────┐
              │  Managed Switch │
              │                │
         ┌────┼────┬────┬──────┼─────┐
         │    │    │    │      │     │
       VLAN  VLAN VLAN VLAN   VLAN  VLAN
        10    10   20   20     30    30
         │    │    │    │      │     │
     [Collector] [Switch] [Server] [AP]
```

### Configuration Requirements

**On the Managed Switch:**

Ensure the uplink to the router is configured as a **trunk port** carrying all VLANs:

#### Cisco IOS

```
interface GigabitEthernet0/1
 description Trunk to Router
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

#### Ubiquiti UniFi

In UniFi Controller:
- Select the uplink port
- Set as "Trunk"
- Add allowed VLANs: 10, 20, 30

**On the Router (pfSense Example):**

Create VLAN interfaces and assign IPs:

1. **Interfaces → Assignments → VLANs**
   - VLAN 10 on em0 → Management (10.10.10.1/24)
   - VLAN 20 on em0 → Servers (10.10.20.1/24)
   - VLAN 30 on em0 → IoT (10.10.30.1/24)

2. **Firewall → Rules**
   - Allow SNMP from Management_VLAN to other VLANs
   - Allow ICMP from Management_VLAN to other VLANs

### Collector Placement

Place the collector on **VLAN 10 (Management)**, connected to an access port on the switch.

**Switch port config (Cisco IOS):**
```
interface GigabitEthernet0/5
 description Pi Collector
 switchport mode access
 switchport access vlan 10
```

**Switch port config (UniFi):**
- Port Profile: Management
- VLAN: 10
- Native VLAN only

### Verification

From the collector, verify inter-VLAN routing:

```bash
# Ping the router gateway on each VLAN
ping 10.10.10.1  # Management gateway
ping 10.10.20.1  # Server gateway
ping 10.10.30.1  # IoT gateway

# Verify routing table
ip route show

# Expected default route via management gateway
# default via 10.10.10.1 dev eth0
```

---

## Scenario 3: DMZ Collector Deployment

### Challenge

Client requires monitoring of DMZ-hosted services (web servers, email gateways) but security policy prohibits DMZ-to-internal traffic.

### Solution: Dual Collector Setup

Deploy **two collectors**:

1. **Internal Collector** (Management VLAN) — Monitors internal infrastructure
2. **DMZ Collector** (DMZ VLAN) — Monitors DMZ devices only

```
                        Internet
                           │
                           ▼
                   ┌───────────────┐
                   │   Firewall    │
                   └───┬───────┬───┘
                       │       │
            ┌──────────┘       └──────────┐
            │                             │
      ┌─────▼──────┐              ┌───────▼─────┐
      │    DMZ     │              │   Internal  │
      │  VLAN 99   │              │  VLANs      │
      │            │              │             │
      │ [Collector]│              │ [Collector] │
      │ [Web Srv]  │              │ [Switches]  │
      │ [Mail Gw]  │              │ [Servers]   │
      └────────────┘              └─────────────┘
```

### DMZ Collector Configuration

**Firewall Rules:**

| Source | Destination | Protocol | Port | Purpose |
|--------|-------------|----------|------|---------|
| DMZ Collector | DMZ devices | UDP | 161 | SNMP |
| DMZ Collector | DMZ devices | ICMP | — | Ping |
| DMZ Collector | Auvik Cloud | TCP | 443 | Data upload |
| DMZ Collector | Internal | ANY | ANY | **DENY** |

**Auvik Multi-Site Setup:**

1. In Auvik, create **two sites** for this client:
   - Site 1: `ClientName-Internal`
   - Site 2: `ClientName-DMZ`
2. Add internal collector to Site 1
3. Add DMZ collector to Site 2
4. Configure separate credentials if needed

:::tip Alternative: Firewall Exception
If dual collectors are not feasible, create a **limited exception** allowing the internal collector to reach the DMZ:
- Allow only SNMP (UDP 161) and ICMP
- Use a dedicated service account with read-only SNMP
- Log all connections for audit purposes
:::

---

## Scenario 4: SNMPv3 Strict Security Networks

### Challenge

Client security policy mandates encrypted monitoring traffic (no SNMPv2c).

### Solution: SNMPv3 with authPriv

See the [SNMP Configuration](./snmp-configuration.md#snmpv3-configuration) guide for detailed setup. Key points for complex deployments:

### Multi-Vendor SNMPv3 Deployment

When dealing with mixed vendor environments, configure SNMPv3 consistently:

**Standard Configuration Template:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| Security Level | authPriv | Mandatory for compliance |
| Auth Protocol | SHA (or SHA-256 if supported) | Avoid MD5 |
| Privacy Protocol | AES-128 (or AES-256) | Avoid DES |
| Username | `viyumonitor` | Consistent across devices |

### Per-Vendor Configuration

#### Cisco IOS/IOS-XE

```
snmp-server group VIYUGROUP v3 priv
snmp-server user viyumonitor VIYUGROUP v3 auth sha AuthPass123! priv aes 128 PrivPass456!
snmp-server host 10.10.10.50 version 3 priv viyumonitor
```

#### Cisco Meraki

Dashboard → Network-wide → General → Reporting:
- SNMP version: V3
- Auth: SHA
- Encryption: AES-128
- User: `viyumonitor`

#### Juniper JunOS

```
set snmp v3 usm local-engine user viyumonitor authentication-sha authentication-password AuthPass123!
set snmp v3 usm local-engine user viyumonitor privacy-aes128 privacy-password PrivPass456!
set snmp v3 vacm security-to-group security-model usm security-name viyumonitor group VIYUGROUP
set snmp v3 vacm access group VIYUGROUP default-context-prefix security-model usm security-level privacy read-view ALL
```

#### FortiGate

```
config system snmp user
    edit "viyumonitor"
        set security-level auth-priv
        set auth-proto sha
        set auth-pwd AuthPass123!
        set priv-proto aes
        set priv-pwd PrivPass456!
    next
end
```

### Testing SNMPv3

From the collector:

```bash
# Test with full credentials
snmpwalk -v3 -l authPriv -u viyumonitor \
  -a SHA -A AuthPass123! \
  -x AES -X PrivPass456! \
  10.10.10.1 sysDescr

# Expected output
SNMPv2-MIB::sysDescr.0 = STRING: Cisco IOS Software...
```

### Troubleshooting SNMPv3

| Error Message | Cause | Resolution |
|---------------|-------|------------|
| Timeout (no response) | Wrong username or device doesn't support v3 | Verify user exists on device, check v3 support |
| Authentication failure | Wrong auth password or protocol mismatch | Verify auth password and protocol (SHA vs MD5) |
| Decryption error | Wrong privacy password or protocol | Verify privacy password and protocol (AES vs DES) |
| Unknown user name | User not configured on device | Create SNMPv3 user on device |

---

## Scenario 5: Multi-Site WAN with MPLS or VPN

### Challenge

Client has multiple locations connected via MPLS or site-to-site VPN. Decide whether to deploy one collector per site or centralize.

### Decision Matrix

| Factor | Centralized (Single Collector) | Distributed (Per-Site Collectors) |
|--------|-------------------------------|----------------------------------|
| **WAN Bandwidth** | Requires stable, low-latency WAN | Minimal WAN usage (only Auvik cloud sync) |
| **Device Count** | Works if total devices <500 | Scales better for large multi-site |
| **WAN Reliability** | If WAN fails, remote sites lose monitoring | Each site independent |
| **Management** | Simpler (one collector) | More complex (multiple collectors) |
| **Cost** | Lower (one Pi) | Higher (Pi per site) |

### Recommended Approach

**Small sites (<50 devices/site), reliable WAN:**
- Deploy **one collector at headquarters**
- Configure routing to allow collector access to all sites

**Large sites (>50 devices/site), or unreliable WAN:**
- Deploy **one collector per site**
- Configure as separate Auvik sites or use multi-collector setup

### Configuration: Centralized Collector

**Headquarters Firewall/Router:**

Ensure routing and firewall rules allow HQ collector to reach remote sites:

```
Site A: 10.10.0.0/16 (HQ)
Site B: 10.20.0.0/16 (Remote 1)
Site C: 10.30.0.0/16 (Remote 2)

Collector: 10.10.10.50 (HQ Management VLAN)
```

**Firewall Rules (from HQ to Remote Sites):**

| Source | Destination | Protocol | Port |
|--------|-------------|----------|------|
| 10.10.10.50 | 10.20.0.0/16 | UDP | 161 |
| 10.10.10.50 | 10.20.0.0/16 | ICMP | — |
| 10.10.10.50 | 10.30.0.0/16 | UDP | 161 |
| 10.10.10.50 | 10.30.0.0/16 | ICMP | — |

**Test Reachability:**

```bash
# From HQ collector, ping remote site gateways
ping 10.20.0.1  # Site B gateway
ping 10.30.0.1  # Site C gateway

# Test SNMP to remote site devices
snmpwalk -v2c -c viyu-readonly 10.20.1.1 sysDescr
```

### Configuration: Distributed Collectors

1. Deploy a Pi at each site
2. Place each on the local management VLAN
3. In Auvik, create separate sites:
   - `ClientName-HQ`
   - `ClientName-SiteB`
   - `ClientName-SiteC`
4. Add each collector to its respective Auvik site

---

## Quick Reference: Complex Scenario Checklist

Before deployment, verify:

- [ ] **Network diagram** — Document VLANs, subnets, routing
- [ ] **Firewall rules** — Allow SNMP (161/UDP), ICMP, WMI if needed
- [ ] **Collector placement** — Management VLAN preferred
- [ ] **Credentials** — SNMPv2c or SNMPv3 configured on all devices
- [ ] **Routing** — Test ping/traceroute to all monitored subnets
- [ ] **SNMP testing** — Verify snmpwalk from collector to each subnet
- [ ] **Auvik configuration** — Credentials added, discovery run
- [ ] **Documentation** — Record firewall rules, credentials, site details

---

## Additional Resources

- [VLAN Placement Guide](./vlan-placement.md) — Basics of collector placement
- [SNMP Configuration](./snmp-configuration.md) — Detailed SNMP setup
- [Firewall Rules](./firewall-rules.md) — Required firewall configuration
