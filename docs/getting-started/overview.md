---
sidebar_position: 1
---

# Overview

This guide documents the standard deployment model for Auvik network collectors using Raspberry Pi 5 hardware at viyu.net managed client sites.

## Why Raspberry Pi 5?

The Pi 5 offers an optimal balance of capability, cost, and form factor for dedicated network monitoring:

| Factor | Pi 5 Advantage |
|--------|----------------|
| **Cost** | $175-210 total vs $300-500 for Intel NUC |
| **Power** | 5-12W via PoE — no separate outlet needed |
| **Size** | Credit card form factor, mounts anywhere |
| **Performance** | 4-core 2.4GHz ARM, 8GB RAM — exceeds Auvik requirements |
| **Reliability** | No moving parts, hardware watchdog for auto-recovery |

## Deployment Model

Each client site receives a dedicated Pi 5 collector:

```
┌─────────────────────────────────────────────────────┐
│                    Client Site                       │
│                                                      │
│  ┌──────────────┐         ┌──────────────────────┐  │
│  │  PoE Switch  │◄────────│   Pi 5 + Auvik       │  │
│  │  (802.3at)   │  Cat6   │   Collector          │  │
│  └──────┬───────┘         └──────────────────────┘  │
│         │                          │                 │
│    ┌────┴────┐                     │ SNMP/WMI       │
│    │ Network │◄────────────────────┘                 │
│    │ Devices │                                       │
│    └─────────┘                                       │
└─────────────────────────────────────────────────────┘
                         │
                         │ HTTPS (443)
                         ▼
              ┌──────────────────────┐
              │   Auvik Cloud        │
              │   + Tailscale        │
              └──────────────────────┘
```

## What the Collector Does

The Auvik collector running on the Pi:

1. **Discovers** network devices via SNMP, WMI, and active scanning
2. **Maps** network topology automatically
3. **Monitors** device health, interface statistics, and performance
4. **Alerts** on outages, threshold violations, and changes
5. **Reports** to the Auvik cloud dashboard in real-time

## Deployment Lifecycle

```
Office Prep → Field Install → 24-48hr Verification → Ongoing Monitoring
```

1. **Office Preparation** — Clone golden image, apply client config, verify Auvik online
2. **Field Installation** — Connect to PoE switch, confirm power and connectivity
3. **Post-Deployment** — Verify discovery, configure alerts, document
4. **Ongoing** — Remote management via Tailscale, automatic updates

## Capacity Guidelines

A single Pi 5 (8GB) collector supports:

| Metric | Recommended Max |
|--------|-----------------|
| Devices | 200 |
| Interfaces | 9,000 |
| Sites | 1 (dedicated per site) |

For sites exceeding these thresholds, consider an x86 VM-based collector.
