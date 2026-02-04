---
sidebar_position: 2
---

# Auvik Collector Installation

Auvik supports two officially documented methods for ARM64 / Raspberry Pi deployments. For dedicated single-purpose Pis (our standard model), use the **Bash Script Install**.

## Installation Methods

| Method | Use Case | Recommendation |
|--------|----------|----------------|
| **Bash Script** | Dedicated Pi as collector appliance | **Recommended** |
| Docker Container | Pi running additional workloads | Alternative |

:::info
The bash script method takes over the entire machine — no other workloads should run. This is the intended model for a dedicated Pi collector appliance.
:::

## Bash Script Installation

### Prerequisites

Before running the install script:

- [ ] Pi is running Raspberry Pi OS Lite (64-bit) or Ubuntu 22.04/24.04
- [ ] Pi has network connectivity (`ping 8.8.8.8`)
- [ ] Pi can reach Auvik cloud (`curl -I https://auvik.com`)
- [ ] You have access to the Auvik portal for the target client

### Step-by-Step Installation

<ol className="steps-list">
<li>

**Prepare the Pi**

Flash Raspberry Pi OS Lite (64-bit) to the microSD card using Raspberry Pi Imager. Pre-configure hostname, SSH key, and locale via the imager's advanced settings (Ctrl+Shift+X).

</li>
<li>

**Boot and Connect**

Insert the microSD, connect Ethernet to a PoE+ switch port, and allow the device to boot. Confirm power via PoE (no USB-C cable needed).

</li>
<li>

**Verify Connectivity**

SSH into the Pi and verify network access:

```bash
ssh viyuadmin@{ip-address}
ping 8.8.8.8
curl -I https://auvik.com
```

</li>
<li>

**Generate Install Command**

Log into **Auvik** → navigate to the target client/site → click **Add Collector** → select **Bash Script**.

Copy the generated install command — it contains a site-specific token.

</li>
<li>

**Run Installation**

Paste and run the install command on the Pi:

```bash
curl -sSL https://install.auvik.com | sudo bash -s -- --token YOUR_SITE_TOKEN
```

The script will:
- Validate system requirements
- Download and install the collector agent
- Configure the agent with your site token
- Enable automatic startup
- Reboot the device

</li>
<li>

**Verify in Portal**

After reboot (2-3 minutes), the collector should appear **online** in the Auvik dashboard. Initial device discovery begins immediately.

</li>
<li>

**Confirm Discovery**

Verify device discovery is populating — switches, APs, firewalls should begin appearing on the network map within 5-10 minutes.

</li>
</ol>

## Docker Installation (Alternative)

Use Docker only if the Pi will run additional workloads alongside Auvik.

### Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in for group membership
```

### Run Collector Container

```bash
docker run -d \
  --name auvik-collector \
  --restart=always \
  --network=host \
  --privileged \
  -e AUVIK_TOKEN=YOUR_SITE_TOKEN \
  auvik/collector:latest
```

:::note
The ARM64 Docker image is automatically selected — no emulation needed on Pi 5.
:::

### Verify Container

```bash
docker ps
docker logs auvik-collector
```

## Post-Installation Verification

After installation, verify:

| Check | Command / Action |
|-------|------------------|
| Service running | `systemctl status auvik-collector` (bash) or `docker ps` (Docker) |
| Portal status | Auvik → Client → Site → Collectors → Status = Online |
| Device discovery | Auvik → Client → Site → Network → Devices appearing |
| Remote access | Tailscale device accessible from management network |

## Troubleshooting Installation

### Script fails with "unsupported architecture"

Ensure you're running 64-bit OS:
```bash
uname -m
# Should output: aarch64
```

### Script fails with network errors

Check connectivity:
```bash
ping 8.8.8.8                    # Internet
nslookup install.auvik.com      # DNS
curl -v https://auvik.com       # HTTPS
```

### Collector installed but shows offline

1. Wait 5-10 minutes for initial check-in
2. Check service status: `systemctl status auvik-collector`
3. Check logs: `journalctl -u auvik-collector -f`
4. Verify outbound HTTPS (443) not blocked by firewall

## External Documentation

- [ARM64 (Raspberry Pi) FAQ](https://support.auvik.com/hc/en-us/articles/28775790530964)
- [Bash Script Installation Guide](https://support.auvik.com/hc/en-us/articles/204822246)
- [Docker FAQ](https://support.auvik.com/hc/en-us/articles/18616185672852)
- [ARM64 Collector Demo (Video)](https://www.auvik.com/franklyit/webinars/demo-on-demand-arm64-collector/)
