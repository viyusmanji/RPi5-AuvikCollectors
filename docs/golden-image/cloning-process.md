---
sidebar_position: 3
---

# Cloning Process

How to clone the golden image to new microSD cards for deployment.

## Tools Required

| Tool | Platform | Purpose |
|------|----------|---------|
| [Raspberry Pi Imager](https://www.raspberrypi.com/software/) | All | Official tool, supports custom images |
| [balenaEtcher](https://www.balena.io/etcher/) | All | Simple, reliable flashing |
| `dd` | macOS/Linux | Command-line imaging |

## Using Raspberry Pi Imager (Recommended)

### 1. Open Imager

Download from [raspberrypi.com/software](https://www.raspberrypi.com/software/) and install.

### 2. Select Custom Image

- Click **Choose OS**
- Scroll to bottom → **Use custom**
- Select your golden image file (`auvik-golden-v1.0.img`)

### 3. Select Target SD Card

- Insert target microSD card (32GB+ A2)
- Click **Choose Storage**
- Select the microSD card

:::danger Warning
Double-check you've selected the correct drive. Writing will erase all data.
:::

### 4. Write Image

- Click **Write**
- Wait for write and verification to complete
- Eject when done

## Using balenaEtcher

### 1. Download Etcher

Get from [balena.io/etcher](https://www.balena.io/etcher/)

### 2. Flash

1. Click **Flash from file** → select golden image
2. Click **Select target** → choose microSD card
3. Click **Flash!**
4. Wait for completion

## Using dd (Command Line)

### macOS

```bash
# Identify SD card
diskutil list

# Unmount (replace disk4 with your disk)
diskutil unmountDisk /dev/disk4

# Write image (use rdisk for faster write)
sudo dd if=~/auvik-golden-v1.0.img of=/dev/rdisk4 bs=1m status=progress

# Eject
diskutil eject /dev/disk4
```

### Linux

```bash
# Identify SD card
lsblk

# Unmount all partitions
sudo umount /dev/sdb*

# Write image
sudo dd if=~/auvik-golden-v1.0.img of=/dev/sdb bs=4M status=progress

# Sync and eject
sync
sudo eject /dev/sdb
```

## Post-Clone Steps

After cloning, the microSD is ready for customization:

### 1. Boot the Pi

Insert the cloned microSD into the Pi and power on.

### 2. SSH In

```bash
ssh viyuadmin@auvik-TEMPLATE
# Or use Tailscale if connected
ssh viyuadmin@auvik-TEMPLATE.tailnet-name.ts.net
```

### 3. Run Customization

Follow the [Per-Client Customization](/docs/golden-image/per-client-customization) steps.

### 4. Install Auvik

Run the site-specific Auvik install command.

### 5. Verify & Package

1. Verify collector online in Auvik
2. Verify Tailscale connected
3. Shutdown Pi: `sudo shutdown -h now`
4. Package for field deployment

## Batch Cloning

For multiple deployments, prepare cards in batch:

### Workflow

1. Clone golden image to 5-10 cards at once (using multiple card readers or sequentially)
2. Label cards with temporary IDs (A, B, C...)
3. Boot each Pi and customize in sequence
4. Track which card goes to which client

### Parallel Cloning Tools

For large batches, consider:

- **ApplePi-Baker** (macOS) — GUI tool for multiple cards
- **Paragon Hard Disk Manager** (Windows) — Professional imaging
- **Clonezilla** (Linux) — Free, supports batch operations

## Image Compression

Compress golden images for faster transfer:

```bash
# Compress with gzip
gzip -k auvik-golden-v1.0.img
# Creates auvik-golden-v1.0.img.gz

# Compress with xz (better compression, slower)
xz -k auvik-golden-v1.0.img
# Creates auvik-golden-v1.0.img.xz
```

balenaEtcher and Raspberry Pi Imager can flash compressed images directly.

## Troubleshooting

### Clone fails or is corrupt

1. Try a different microSD card
2. Verify golden image integrity (check MD5/SHA256)
3. Try different USB card reader
4. Use balenaEtcher's verification feature

### Pi won't boot from cloned card

1. Re-clone the card
2. Try different card reader
3. Check card is properly seated in Pi
4. Verify card is A2 rated and genuine (counterfeit cards common)

### SSH host key warning after clone

Expected behavior — each clone initially has the same keys until first boot regenerates them. If persistent:

```bash
# On your workstation, remove old key
ssh-keygen -R auvik-TEMPLATE
```

### Clone is slow

- Use USB 3.0 card reader
- Use `rdisk` instead of `disk` on macOS
- Increase block size in dd (`bs=4M` or higher)
- Use compressed images with tools that support decompression
