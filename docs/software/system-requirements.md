---
sidebar_position: 3
---

# System Requirements

The Raspberry Pi 5 meets or exceeds all Auvik collector system requirements.

## Auvik Minimum Requirements

Per [Auvik documentation](https://support.auvik.com/hc/en-us/articles/200741514):

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores @ 2 GHz | 4+ cores |
| RAM | 4 GB | 8 GB |
| Storage | 12 GB free | 20+ GB |
| OS | 64-bit Linux | See supported list |

## Pi 5 Specifications

| Resource | Pi 5 (8GB) | vs. Auvik Min |
|----------|------------|---------------|
| CPU | 4 cores @ 2.4 GHz | **Exceeds** |
| RAM | 8 GB | **Exceeds** |
| Storage | 32 GB microSD | **Exceeds** |
| Architecture | ARM64 (aarch64) | Supported |

:::tip
The 8GB Pi 5 provides substantial headroom for typical deployments. The 4GB model meets minimum requirements but may constrain larger sites.
:::

## Capacity Guidelines

A single Pi 5 collector supports:

| Metric | Pi 5 4GB | Pi 5 8GB | Action if Exceeded |
|--------|----------|----------|-------------------|
| Devices | ~100 | ~200 | Migrate to x86 VM |
| Interfaces | ~4,000 | ~9,000 | Migrate to x86 VM |
| Polling frequency | Standard | Standard | N/A |

### Signs of Capacity Limits

Monitor for these indicators in Auvik:

- **Increased polling latency** — Gaps in graphs, delayed updates
- **High memory usage** — >85% sustained
- **CPU pressure** — Consistent >80% utilization
- **Discovery slowdowns** — New devices take longer to appear

### Scaling Options

When a site exceeds Pi capacity:

1. **Deploy additional Pi** — Split monitoring across subnets (not recommended)
2. **Migrate to x86 VM** — Deploy collector on client's virtualization platform
3. **Use cloud-hosted collector** — If client has Azure/AWS presence with site connectivity

## Network Bandwidth

The Auvik collector is not bandwidth-intensive for most deployments:

| Traffic Type | Typical Usage |
|--------------|---------------|
| SNMP polling | 1-5 Mbps |
| Cloud sync | 100-500 Kbps sustained |
| Peak (discovery) | 10-20 Mbps |

## Disk I/O

Auvik collector disk operations are light, but microSD quality matters:

| Operation | Frequency |
|-----------|-----------|
| Log writes | Continuous, buffered |
| Cache updates | Periodic |
| Config saves | On change |

Use **A2-rated** microSD cards for best random I/O performance.

## Verification Commands

Check system resources on a running collector:

### Memory Usage
```bash
free -h
```

### CPU Load
```bash
uptime
htop  # if installed
```

### Disk Space
```bash
df -h
```

### Collector Process
```bash
systemctl status auvik-collector
ps aux | grep auvik
```

### Architecture Verification
```bash
uname -m
# Expected: aarch64

cat /etc/os-release
# Verify 64-bit OS
```
