---
sidebar_position: 2
---

# Prerequisites

Before deploying an Auvik collector to a client site, ensure the following requirements are met.

## Client-Side Requirements

### Network Infrastructure

- [ ] **PoE+ Switch** — At least one port supporting 802.3at (PoE+) with available power budget
- [ ] **Management VLAN** — Defined VLAN for infrastructure management traffic
- [ ] **Inter-VLAN Routing** — Pi must have Layer 3 reachability to all monitored subnets
- [ ] **DHCP or Static IP** — Reserved address for the collector

### Firewall / Security

- [ ] **Outbound HTTPS** — TCP 443 to Auvik cloud (no inbound required)
- [ ] **No SSL Inspection** — Or collector IP whitelisted from inspection
- [ ] **Tailscale Allowed** — Outbound to Tailscale coordination servers

### Device Credentials

- [ ] **SNMP Credentials** — SNMPv2c community string or SNMPv3 auth/priv credentials
- [ ] **Device SNMP Enabled** — Target switches, routers, firewalls, APs have SNMP enabled
- [ ] **Pi IP Allowed** — Collector's IP in SNMP allowed hosts list on each device

## viyu.net Requirements

### Hardware Inventory

- [ ] **Pi 5 Kit** — Pi 5 (8GB), PoE+ HAT, case, microSD card (32GB+ A2)
- [ ] **Cables & Accessories** — Cat6 patch cable (3-6ft), asset label
- [ ] **Tech Bag Supplies** — USB-C 27W backup PSU

### Software Preparation

- [ ] **Golden Image** — Current golden image microSD ready for cloning
- [ ] **Auvik Portal Access** — Credentials to create collector in client site
- [ ] **Tailscale Admin** — Access to approve new device in tailnet

### Documentation

- [ ] **Client Site Record** — Prepared in documentation platform
- [ ] **IP Assignment** — Static IP or DHCP reservation documented
- [ ] **SNMP Credentials** — Received from client and recorded securely

## Auvik Account Setup

Before the first collector deployment for a client:

1. Client exists in Auvik with a site configured
2. SNMP credentials entered in Auvik credential store
3. Alert policies configured (collector offline, device offline)
4. NOC notification channels set up (email, Slack, Teams)

## Skill Requirements

Technicians deploying collectors should be familiar with:

- SSH and basic Linux command line
- Network fundamentals (VLANs, IP addressing, SNMP)
- Auvik portal navigation
- Tailscale device management
