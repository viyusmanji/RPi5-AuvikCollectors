---
sidebar_position: 1
---

# Hardware Bill of Materials

The following components make up the standard deployment kit per client site. All pricing reflects current MSRP as of February 2026.

:::warning Pricing Notice — DRAM Shortage
Raspberry Pi raised prices effective February 2, 2026 due to ongoing memory cost pressures driven by AI infrastructure demand. The Pi 5 8GB is now **$125** (up from $80 pre-shortage). Monitor [raspberrypi.com/news](https://www.raspberrypi.com/news/) for future adjustments. Prices are expected to normalize once the DRAM shortage resolves.
:::

## Core Components

| Component | Specification | Est. Cost | Notes |
|-----------|---------------|-----------|-------|
| **Raspberry Pi 5** | 8GB RAM | **$125** | 8GB recommended for collector headroom. 4GB ($85) viable for small sites (&lt;100 devices). |
| PoE+ HAT (3rd party) | 802.3af/at, Pi 5 compatible | $25–$45 | GeeekPi P30, Waveshare PoE HAT (F), or 52Pi. **No official RPi Foundation Pi 5 PoE HAT exists yet.** |
| microSD Card | 32GB+, A2 rated | $10–$15 | Samsung EVO Select or SanDisk Extreme. A2 rating critical for random I/O. |
| Case | Enclosed, vented, PoE HAT clearance | $10–$20 | Must accommodate PoE HAT stack height. Verify compatibility with specific HAT model. |
| Ethernet Patch Cable | Cat6, 3–6 ft | $3–$5 | Short run to PoE switch port. |
| Asset Label | Printed adhesive | ~$1 | Hostname, client, IP, Auvik site name. |

**Estimated per-site cost: $175–$210** (8GB config with third-party PoE+ HAT)

## Recommended Vendors

### PoE+ HATs

| Model | Price | Features |
|-------|-------|----------|
| [GeeekPi P30](https://www.amazon.com/dp/B0CKRLC4Q5) | ~$25 | Basic, reliable, good thermal design |
| [Waveshare PoE HAT (F)](https://www.waveshare.com/poe-hat-f.htm) | ~$30 | Built-in fan, 5V/4A output |
| [52Pi PoE+ HAT](https://52pi.com/products/52pi-poe-hat-for-raspberry-pi-5) | ~$35 | Quiet cooling, LED indicators |

### microSD Cards

| Model | Capacity | Speed | Price |
|-------|----------|-------|-------|
| Samsung EVO Select | 64GB | A2/V30 | ~$12 |
| SanDisk Extreme | 64GB | A2/V30 | ~$15 |

:::tip A2 Rating Required
The A2 (Application Performance Class 2) rating ensures fast random read/write performance critical for OS operations. Avoid cards without A2 rating.
:::

### Cases

Look for cases that:
- Accommodate the PoE HAT stack height (~20mm additional)
- Have adequate ventilation (vents or fan cutout)
- Allow access to microSD slot without full disassembly
- Include mounting options (VESA, DIN rail, or screw holes)

## Total Cost Comparison

| Configuration | Hardware Cost | Use Case |
|---------------|---------------|----------|
| Pi 5 8GB + PoE+ | $175–$210 | Standard deployment (recommended) |
| Pi 5 4GB + PoE+ | $125–$165 | Budget/small sites (&lt;100 devices) |
| Pi 5 8GB + NVMe | $250–$300 | High-reliability sites |

## Purchasing Checklist

- [ ] Raspberry Pi 5 (8GB) — [Approved retailers](https://www.raspberrypi.com/products/raspberry-pi-5/)
- [ ] PoE+ HAT — Verify Pi 5 compatibility before ordering
- [ ] microSD card — 32GB+ A2 rated
- [ ] Case — Verify PoE HAT clearance
- [ ] Cat6 patch cable — 3-6 ft
- [ ] Asset labels — Thermal or laser printer compatible
