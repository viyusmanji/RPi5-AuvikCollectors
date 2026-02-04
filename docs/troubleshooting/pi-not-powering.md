---
sidebar_position: 2
---

# Pi Not Powering On

Troubleshooting when the Raspberry Pi doesn't power up.

## Symptoms

- No LEDs lit on the Pi board
- No LEDs on PoE HAT
- No network activity on switch port

## Diagnostic Steps

### 1. Verify Switch Port PoE Capability

**Check switch model supports 802.3at (PoE+)**

The Pi 5 with PoE HAT requires 802.3at. Most Pi 5 PoE HATs will NOT negotiate on 802.3af-only ports.

| Standard | Max Power | Pi 5 Compatible |
|----------|-----------|-----------------|
| 802.3af | 15.4W | **No** |
| 802.3at | 30W | **Yes** |
| 802.3bt | 60-100W | Yes |

**Verify on switch:**

```bash
# Cisco IOS
show power inline

# Example output:
# Interface  Power   Device     Class Max
# Gi1/0/24   30.0    Pd-Class4  4     30.0
```

### 2. Check PoE Power Budget

Even with 802.3at ports, the switch has a total power budget.

```bash
# Cisco IOS
show power inline
# Look for "Available" and "Used" watts
```

If budget exhausted:
- Disconnect other PoE devices temporarily
- Move Pi to a different switch with available budget
- Use USB-C power supply

### 3. Verify Port is PoE Enabled

Some switches have PoE disabled by default or per-port.

**Cisco IOS:**
```bash
interface GigabitEthernet1/0/24
  power inline auto
```

**Meraki Dashboard:**
Switch → Port → PoE enabled

### 4. Test with USB-C Power Supply

To isolate PoE vs. Pi/HAT issues:

1. Disconnect Ethernet
2. Connect official Raspberry Pi 27W USB-C power supply
3. Observe if Pi boots

**If Pi boots with USB-C:** Problem is PoE-related
**If Pi doesn't boot:** Problem is Pi or SD card

### 5. Check PoE HAT Seating

1. Power off (disconnect all power)
2. Remove case (if applicable)
3. Reseat PoE HAT on GPIO header
4. Ensure all pins are properly engaged
5. Reassemble and test

### 6. Inspect for Physical Damage

Look for:
- Bent GPIO pins
- Burn marks on HAT or Pi
- Loose components
- Damaged Ethernet port

### 7. Try Different Hardware

Methodically swap components:

| Test | Component Swapped | Isolates |
|------|-------------------|----------|
| 1 | Different Ethernet cable | Cable fault |
| 2 | Different switch port | Port issue |
| 3 | Different PoE HAT | HAT failure |
| 4 | Different Pi | Pi board failure |
| 5 | Different SD card | SD corruption |

## Resolution Matrix

| Diagnosis | Resolution |
|-----------|------------|
| Switch is 802.3af only | Use PoE injector or USB-C PSU |
| PoE budget exhausted | Free up budget or use USB-C PSU |
| Port PoE disabled | Enable PoE on switch port |
| PoE HAT fault | Replace PoE HAT |
| Pi board failure | Replace Pi |
| Cable issue | Replace Ethernet cable |

## Fallback: USB-C Power

If PoE cannot be resolved immediately, use USB-C power:

1. Connect official Raspberry Pi 27W USB-C PSU
2. Connect Ethernet normally (data only, no PoE)
3. Document that site is not using PoE
4. Schedule follow-up to resolve PoE

:::warning
USB-C fallback requires a power outlet near the network equipment. This defeats the single-cable deployment model.
:::

## Prevention

- Always verify 802.3at support before dispatch
- Keep USB-C PSU in tech bag as fallback
- Document switch PoE capabilities in client records
