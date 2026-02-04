---
sidebar_position: 4
---

# SD Card Failure

Troubleshooting and recovery from microSD card failures.

## Symptoms

- Pi boot loops or hangs
- Read-only filesystem errors
- Services fail to start
- `Input/output error` messages
- Filesystem corruption warnings

## Diagnostic Steps

### 1. Check Filesystem Status

If you can SSH in:

```bash
# Check mount status
mount | grep mmcblk0

# Check for read-only
cat /proc/mounts | grep mmcblk0
# Look for "ro" instead of "rw"

# Check disk health
sudo dmesg | grep -i "mmcblk0\|error\|i/o"
```

### 2. Check for I/O Errors

```bash
# Recent kernel messages
dmesg | tail -50

# Look for:
# - "I/O error"
# - "blk_update_request"
# - "Buffer I/O error"
```

### 3. Attempt Filesystem Repair

If system is running but degraded:

```bash
# Remount read-only first
sudo mount -o remount,ro /

# Check filesystem
sudo fsck -y /dev/mmcblk0p2
```

:::warning
Filesystem repair may result in data loss. If possible, backup critical data first.
:::

## Recovery Options

### Option 1: Remote Recovery (If Pi Accessible)

If you can still SSH in:

1. **Backup any unique data** (unlikely for collector appliance)
2. **Document current config** (hostname, IP, etc.)
3. **Ship replacement SD card** to client or tech

### Option 2: On-Site SD Card Replacement

1. Dispatch tech with pre-configured SD card
2. Power off Pi
3. Swap SD cards
4. Power on and verify

### Option 3: Remote-Assisted Recovery

If client can access the Pi physically:

1. Guide client to power off Pi
2. Ship replacement SD card
3. Walk client through swap
4. Verify remotely via Tailscale

## Re-Deployment Steps

### 1. Prepare Replacement SD Card

Clone golden image to new SD card:

```bash
# Using Raspberry Pi Imager or balenaEtcher
# Select golden image
# Write to new SD card
```

### 2. Apply Per-Client Configuration

Boot the new SD and configure:

```bash
# Hostname
sudo hostnamectl set-hostname auvik-clientcode-sitecode

# Static IP
sudo nmcli con mod "Wired connection 1" \
  ipv4.method manual \
  ipv4.addresses 10.1.1.50/24 \
  ipv4.gateway 10.1.1.1 \
  ipv4.dns "10.1.1.1 8.8.8.8"

# Timezone
sudo timedatectl set-timezone America/Chicago

# Apply network
sudo nmcli con down "Wired connection 1"
sudo nmcli con up "Wired connection 1"
```

### 3. Install Auvik Collector

Get fresh install command from Auvik portal:

```bash
curl -sSL https://install.auvik.com | sudo bash -s -- --token YOUR_SITE_TOKEN
```

### 4. Re-authenticate Tailscale

```bash
sudo tailscale up --ssh
```

Follow auth URL and approve in Tailscale admin.

### 5. Verify Recovery

- [ ] Auvik collector online in portal
- [ ] Tailscale connected
- [ ] Device discovery working
- [ ] Remote access functional

## Prevention

### Use Quality SD Cards

- **A2-rated cards** — Required for good random I/O
- **Reputable brands** — Samsung EVO, SanDisk Extreme
- **Avoid counterfeits** — Buy from authorized retailers

### Enable Read-Only Root (Advanced)

For high-reliability requirements, consider read-only root filesystem with RAM overlay. This prevents most write wear.

### Scheduled Replacement

Even quality SD cards have limited write cycles:

| Environment | Replacement Interval |
|-------------|---------------------|
| Standard | 3 years |
| High-write (heavy logging) | 2 years |
| Extreme (very high I/O) | 1 year |

### Consider NVMe Upgrade

For sites with repeated SD failures:

1. Add NVMe HAT + SSD
2. Boot from NVMe instead of SD
3. Much higher endurance and performance

See [Optional Upgrades](/docs/hardware/optional-upgrades)

## SD Card Health Monitoring

### Periodic Health Check

Add to maintenance schedule:

```bash
# Check for filesystem errors (non-destructive)
sudo e2fsck -n /dev/mmcblk0p2

# Check mount count and last check
sudo tune2fs -l /dev/mmcblk0p2 | grep -E "Mount count|Last checked"
```

### Early Warning Signs

Watch for:
- Slow boot times
- Intermittent service failures
- Increasing error messages in dmesg
- Files becoming corrupted

## Data Recovery

If critical data exists on the failed card:

1. **Do not write to the card** — Prevents further damage
2. **Use recovery tools** — TestDisk, PhotoRec
3. **Send to recovery service** — For critical data (expensive)

For collector appliances, there's rarely unique data. Re-deploying from golden image is usually faster.
