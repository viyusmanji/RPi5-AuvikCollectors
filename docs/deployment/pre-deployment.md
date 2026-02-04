---
sidebar_position: 1
---

import Checklist from '@site/src/components/Checklist';

# Pre-Deployment (Office)

Complete these tasks in the office before dispatching to the client site.

## Preparation Checklist

<Checklist
  id="pre-deployment-office"
  title="Office Preparation Checklist"
  items={[
    { id: 'hw-kit', label: 'Hardware kit assembled (Pi 5, PoE HAT, case, microSD, patch cable, label)' },
    { id: 'golden-image', label: 'Golden image cloned to microSD' },
    { id: 'customization', label: 'Per-client customization completed (hostname, IP, timezone)' },
    { id: 'auvik-installed', label: 'Auvik collector installed and verified online in portal' },
    { id: 'tailscale', label: 'Tailscale remote access verified from viyu.net network' },
    { id: 'snmp', label: 'Client SNMP credentials obtained and entered in Auvik' },
    { id: 'asset-label', label: 'Asset label printed and applied' },
    { id: 'backup-psu', label: 'USB-C backup power supply in tech bag' },
    { id: 'docs', label: 'Client documentation updated with deployment details' },
  ]}
/>

## Detailed Steps

### 1. Assemble Hardware Kit

Gather all components:

| Component | Qty | Verified |
|-----------|-----|----------|
| Raspberry Pi 5 (8GB) | 1 | |
| PoE+ HAT (Pi 5 compatible) | 1 | |
| Case with HAT clearance | 1 | |
| microSD card (32GB+ A2) | 1 | |
| Cat6 patch cable (3-6 ft) | 1 | |
| Asset label (printed) | 1 | |

Assemble the Pi with PoE HAT and case before proceeding.

### 2. Clone Golden Image

Using Raspberry Pi Imager or balenaEtcher:

1. Insert fresh microSD card
2. Select golden image file
3. Write and verify
4. Insert into Pi

### 3. Apply Per-Client Configuration

Boot the Pi (use USB-C power temporarily if needed) and SSH in:

```bash
ssh viyuadmin@auvik-TEMPLATE
```

Run customization:

```bash
# Set hostname
sudo hostnamectl set-hostname auvik-clientcode-sitecode

# Configure static IP
sudo nmcli con mod "Wired connection 1" \
  ipv4.method manual \
  ipv4.addresses 10.1.1.50/24 \
  ipv4.gateway 10.1.1.1 \
  ipv4.dns "10.1.1.1 8.8.8.8"

# Set timezone
sudo timedatectl set-timezone America/Chicago

# Apply network changes
sudo nmcli con down "Wired connection 1"
sudo nmcli con up "Wired connection 1"
```

### 4. Install Auvik Collector

1. Log into Auvik → Client → Site
2. Click **Add Collector** → **Bash Script**
3. Copy and run the install command:

```bash
curl -sSL https://install.auvik.com | sudo bash -s -- --token YOUR_SITE_TOKEN
```

4. Wait for reboot (~2-3 minutes)
5. Verify collector shows **Online** in Auvik portal

### 5. Verify Tailscale

Check Tailscale is connected:

```bash
tailscale status
```

From your management machine, verify connectivity:

```bash
# Ping via Tailscale
ping hostname.tailnet-name.ts.net

# SSH via Tailscale
ssh viyuadmin@hostname
```

### 6. Enter SNMP Credentials

If not already done:

1. Auvik → Client → Site → **Manage → Credentials**
2. Add SNMP credential (v2c or v3)
3. Document community string/credentials securely

### 7. Print and Apply Asset Label

Create label with:
- `viyu.net - Auvik Collector`
- Hostname
- IP Address
- Client Name
- Site
- Deploy Date

Apply to visible location on case.

### 8. Final Verification

Before packaging:

- [ ] Auvik portal shows collector online
- [ ] Device discovery starting (will complete on-site)
- [ ] Tailscale connected and accessible
- [ ] Hostname, IP, timezone correct
- [ ] Asset label applied
- [ ] USB-C backup PSU in bag

### 9. Package for Transport

1. Shut down Pi: `sudo shutdown -h now`
2. Disconnect from test network
3. Package securely for transport
4. Include patch cable in bag

## Documentation Updates

Update client record with:

| Field | Example |
|-------|---------|
| Hostname | `auvik-acme-hq` |
| IP Address | `10.1.1.50/24` |
| Gateway | `10.1.1.1` |
| MAC Address | `d8:3a:dd:xx:xx:xx` |
| Tailscale IP | `100.x.x.x` |
| Auvik Site | `acme-hq` |
| SNMP Credentials | Reference to credential store |

## Troubleshooting Pre-Deployment

### Auvik collector won't come online

1. Check internet connectivity: `ping 8.8.8.8`
2. Check DNS: `nslookup auvik.com`
3. Verify HTTPS access: `curl -I https://auvik.com`
4. Check service: `systemctl status auvik-collector`
5. Review logs: `journalctl -u auvik-collector -f`

### Tailscale not connecting

1. Check service: `systemctl status tailscaled`
2. Re-authenticate: `sudo tailscale up --ssh`
3. Verify firewall allows Tailscale: `sudo ufw status`

### Can't SSH to Pi

1. Verify Pi has power (LEDs lit)
2. Check network cable connected
3. Verify IP address is correct
4. Try Tailscale if configured
