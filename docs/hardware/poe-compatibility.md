---
sidebar_position: 2
---

# PoE Switch Compatibility

Power over Ethernet is central to the single-cable deployment model. Understanding PoE standards and switch requirements is critical for successful installations.

## PoE Standards Quick Reference

| Standard | Name | Max Power | Typical Device |
|----------|------|-----------|----------------|
| 802.3af | PoE | 15.4W | VoIP phones, basic APs |
| **802.3at** | **PoE+** | **30W** | **Pi 5 + HAT (required)** |
| 802.3bt Type 3 | PoE++ | 60W | PTZ cameras, high-power APs |
| 802.3bt Type 4 | PoE++ | 100W | Digital signage, thin clients |

:::danger Critical Requirement
The Pi 5 with PoE HAT requires **802.3at (PoE+)** ports. Most Pi 5 PoE HATs **will not negotiate** on 802.3af-only ports. Verify before deployment.
:::

## Pre-Deployment Verification

### Switch Port Check

Before dispatching to site, verify:

1. **PoE Standard** — Switch supports 802.3at on target port
2. **Available Power Budget** — Total PoE budget minus current consumption > 25W
3. **Port Configuration** — PoE is enabled on the intended port (not disabled by default)

### How to Check Power Budget

**Cisco IOS:**
```bash
show power inline
```

**Cisco Meraki:**
Dashboard → Switch → Port → PoE Settings

**Ubiquiti UniFi:**
Devices → Switch → Ports → PoE column

**HP/Aruba:**
```bash
show power-over-ethernet brief
```

## Common Issues

### Switch only has 802.3af

**Symptoms:** Pi doesn't power on, or powers on briefly then shuts down

**Solutions:**
1. Use a different switch with 802.3at support
2. Use a PoE injector (802.3at) between switch and Pi
3. Fall back to USB-C power supply

### PoE Budget Exhausted

**Symptoms:** Pi doesn't power on, other PoE devices may have issues

**Solutions:**
1. Move some devices to non-PoE power
2. Reduce device power allocation (if supported)
3. Upgrade to higher-capacity PoE switch

### Pi Powers On But Unstable

**Symptoms:** Random reboots, especially under CPU load

**Causes:**
- Marginal power delivery (edge of 802.3at spec)
- Long cable run (>50m)
- Poor quality PoE HAT

**Solutions:**
1. Test with USB-C PSU to isolate
2. Use shorter/higher quality cable
3. Try different PoE HAT model

## Recommended PoE Switches

Any managed switch with 802.3at support works. Common options at client sites:

| Vendor | Series | PoE Budget | Notes |
|--------|--------|------------|-------|
| Cisco Meraki | MS120/MS210 | 370W+ | Dashboard management |
| Ubiquiti UniFi | USW-Pro | 400W+ | UniFi integration |
| Cisco Catalyst | 9200L | 370W+ | Enterprise standard |
| HP/Aruba | 2930F | 370W+ | ProCurve ecosystem |

## PoE Injector Fallback

If the client switch doesn't support 802.3at, a single-port PoE injector can be used:

| Model | Standard | Price |
|-------|----------|-------|
| TP-Link TL-PoE160S | 802.3at | ~$25 |
| Ubiquiti POE-48-24W-G | 802.3at | ~$15 |

**Installation:**
```
Switch ──[Cat6]──> PoE Injector ──[PoE Cat6]──> Pi 5
                         │
                      [Power]
```

:::note
Using a PoE injector requires two cables and a power outlet, defeating some benefits of the single-cable model. Only use as a fallback.
:::
