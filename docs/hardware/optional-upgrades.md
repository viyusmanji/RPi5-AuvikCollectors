---
sidebar_position: 3
---

# Optional Upgrades

For sites with specific requirements, consider these optional hardware additions.

## NVMe Storage

### When to Consider

- **Repeat SD Card Failures** — Site has had multiple microSD failures
- **High Write Workloads** — Extensive logging or local data retention
- **Extended Lifecycle** — Planning 5+ year deployment

### Options

#### Combo PoE + NVMe HAT

Some HATs combine PoE delivery and M.2 NVMe storage:

| Model | NVMe Size | PoE | Price |
|-------|-----------|-----|-------|
| GeeekPi P33 | 2242/2230 | 802.3at | ~$45 |

:::tip
2230 or 2242 M-key NVMe drives are required for Pi HAT form factors. Standard 2280 drives won't fit.
:::

#### Separate NVMe HAT + PoE HAT

For maximum flexibility, use a dedicated NVMe HAT stacked with PoE:
- More drive options
- Better thermal separation
- Higher total stack height (case compatibility matters)

### Recommended NVMe Drives

| Model | Size | Form Factor | Price |
|-------|------|-------------|-------|
| Samsung PM991a | 128GB | 2230 | ~$20 |
| Western Digital SN740 | 256GB | 2230 | ~$35 |
| Sabrent Rocket | 256GB | 2242 | ~$40 |

### Cost Impact

| Configuration | Additional Cost |
|---------------|-----------------|
| Combo HAT + 128GB NVMe | ~$65 over base |
| Separate HAT + 256GB NVMe | ~$80 over base |

## Backup Power Supply

### Why Include

- **PoE Troubleshooting** — Isolate whether issues are PoE or Pi related
- **Emergency Recovery** — Power Pi without network connection
- **Initial Setup** — Configure before site has PoE available

### Recommended PSU

**Official Raspberry Pi 27W USB-C Power Supply** — $12

- 5.1V @ 5A output (meets Pi 5 peak draw)
- Country-specific plug versions available
- Keep one per tech bag, not per deployment

## Active Cooling

### When to Consider

Most PoE HATs include passive heatsinks sufficient for typical Auvik workloads. Consider active cooling for:

- **High Ambient Temperature** — Sites >30°C (86°F)
- **Enclosed Mounting** — Limited airflow around device
- **Large Monitoring Scope** — Near capacity limits

### Options

1. **PoE HAT with Fan** — Waveshare PoE HAT (F) includes integrated fan
2. **Active Cooler Add-on** — Pi 5 Active Cooler ($5) if case permits
3. **Case with Fan** — Argon ONE V3, FLIRC Pi 5 case

## Real-Time Clock (RTC)

### When to Consider

The Pi 5 has an RTC socket but no battery by default. Add a battery for:

- **Sites with Unreliable NTP** — Air-gapped or restricted networks
- **Accurate Timestamps on Boot** — Before NTP sync completes

### Installation

1. Purchase CR2032-compatible RTC battery holder
2. Connect to Pi 5 RTC header (J5)
3. System automatically uses RTC on boot

## Mounting Hardware

### Rack Mount Options

| Option | Use Case |
|--------|----------|
| Velcro strips | Quick attachment to rack rail |
| VESA mount bracket | Attach to monitor arm or wall mount |
| DIN rail clip | Industrial/telecom rack mounting |
| 3D printed bracket | Custom enclosure integration |

### Recommended Placements

1. **Top of rack** — Easy access, good airflow
2. **Beside patch panel** — Short cable run to switch
3. **Network closet shelf** — Centralized, out of way

:::warning Avoid
- Inside enclosed cabinets without ventilation
- Directly on top of heat-generating equipment
- Areas with excessive dust or humidity
:::
