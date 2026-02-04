---
sidebar_position: 2
---

import Checklist from '@site/src/components/Checklist';

# On-Site Installation

Field installation checklist and procedures.

## On-Site Checklist

<Checklist
  id="on-site-installation"
  title="Field Installation Checklist"
  items={[
    { id: 'poe-verify', label: 'Verify client switch port supports 802.3at PoE+ with available power budget' },
    { id: 'connect', label: 'Connect Pi to designated switch port via Cat6 patch cable' },
    { id: 'power-on', label: 'Confirm Pi powers on via PoE — activity LEDs, no separate PSU' },
    { id: 'connectivity', label: 'Verify connectivity — ping gateway, ping 8.8.8.8, curl https://auvik.com' },
    { id: 'auvik-online', label: 'Confirm Auvik collector shows online in portal' },
    { id: 'discovery', label: 'Verify device discovery populating — switches, APs, firewalls appearing' },
    { id: 'tailscale', label: 'Confirm Tailscale/ZeroTier tunnel is active from management network' },
    { id: 'mount', label: 'Mount/secure Pi in rack, shelf, or bracket' },
    { id: 'docs', label: 'Update client documentation with deployment details' },
    { id: 'photo', label: 'Photograph installed Pi for records' },
  ]}
/>

## Step-by-Step Installation

### 1. Identify and Verify Switch Port

Before connecting:

1. Identify the designated switch port
2. Verify PoE+ support:
   - Check switch model supports 802.3at
   - Confirm port has PoE enabled
   - Check available power budget

```bash
# Cisco IOS
show power inline

# Meraki Dashboard
Switch → Port status
```

:::danger Critical
If the switch only supports 802.3af, the Pi will not power reliably. Either use a PoE injector or USB-C power supply.
:::

### 2. Connect the Pi

1. Connect one end of Cat6 patch cable to Pi's Ethernet port
2. Connect other end to designated PoE+ switch port
3. Observe Pi power on:
   - Green LED on Pi board indicates power
   - Red LED indicates activity
   - PoE HAT LEDs may indicate PoE negotiation

### 3. Verify Pi Boots Successfully

Wait 30-60 seconds for boot, then verify from Tailscale or on-site:

```bash
# Via Tailscale (from your laptop)
ssh viyuadmin@hostname.tailnet-name.ts.net

# Or via local network (if accessible)
ssh viyuadmin@10.1.1.50
```

### 4. Test Connectivity

From the Pi:

```bash
# Local network
ping 10.1.1.1        # Gateway

# Internet
ping 8.8.8.8         # Google DNS

# Auvik cloud
curl -I https://auvik.com
```

All should succeed. If not, troubleshoot network configuration.

### 5. Verify Auvik Status

1. Open Auvik portal on laptop/phone
2. Navigate to Client → Site → Collectors
3. Confirm collector shows **Online** (green status)

If offline:
- Check service: `systemctl status auvik-collector`
- Review logs: `journalctl -u auvik-collector -f`
- Verify outbound HTTPS not blocked

### 6. Confirm Device Discovery

In Auvik:

1. Go to **Network** → **Inventory**
2. Verify devices are being discovered:
   - Switches
   - Routers/Firewalls
   - Access Points
   - Other SNMP-enabled devices

Discovery may take 5-15 minutes to fully populate.

:::tip
If some devices aren't discovered, verify SNMP is enabled on them and the collector's IP is in their allowed hosts list.
:::

### 7. Verify Remote Access

From the viyu.net management network:

```bash
# Test Tailscale connectivity
tailscale ping hostname

# SSH via Tailscale
ssh viyuadmin@hostname
```

Confirm you can reach the Pi from outside the client network.

### 8. Physical Mounting

Secure the Pi in a permanent location:

| Option | Use Case |
|--------|----------|
| Velcro on rack rail | Quick, adjustable |
| Shelf in network closet | Simple, stable |
| VESA mount bracket | Wall or rack post |
| DIN rail clip | Industrial/telecom racks |
| Zip ties to rack | Last resort |

**Best practices:**
- Keep away from heat sources
- Ensure adequate ventilation
- Make patch cable run tidy
- Leave access for future maintenance

### 9. Update Documentation

Update the client record:

| Field | Value |
|-------|-------|
| Install Date | Today's date |
| Switch Port | e.g., SW01-Gi1/0/24 |
| Rack Location | e.g., Rack A, top of cabinet |
| Technician | Your name |
| Notes | Any site-specific observations |

### 10. Take Deployment Photo

Photograph:
- Pi installed in final location
- Asset label visible
- Cable path to switch
- Overall rack/closet view

Upload to client documentation.

## Quick Reference Card

```
┌─────────────────────────────────────────────┐
│         AUVIK COLLECTOR INSTALL             │
├─────────────────────────────────────────────┤
│ 1. Verify switch port is PoE+ (802.3at)     │
│ 2. Connect patch cable to Pi and switch     │
│ 3. Wait for boot (30-60 sec)                │
│ 4. Verify in Auvik portal → Online          │
│ 5. Check device discovery starting          │
│ 6. Test Tailscale from remote               │
│ 7. Mount and secure Pi                      │
│ 8. Photo and document                       │
└─────────────────────────────────────────────┘
```

## Troubleshooting On-Site

### Pi doesn't power on

1. Verify switch port is PoE+ (not just 802.3af)
2. Check switch PoE power budget
3. Try different switch port
4. Test with USB-C power supply to isolate

### Pi powers on but no network

1. Check cable is good (try different cable)
2. Verify switch port is up (check switch LEDs/config)
3. Check VLAN assignment on port
4. Verify IP configuration on Pi

### Collector shows offline in Auvik

1. Verify Pi has internet access (`ping 8.8.8.8`)
2. Check for firewall blocking (`curl https://auvik.com`)
3. Check service status (`systemctl status auvik-collector`)
4. Look for SSL inspection issues

### No device discovery

1. Verify SNMP enabled on network devices
2. Check collector IP in SNMP allowed hosts
3. Confirm inter-VLAN routing allows SNMP (UDP 161)
4. Verify credentials in Auvik match device config
