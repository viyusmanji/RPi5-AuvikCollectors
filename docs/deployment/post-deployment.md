---
sidebar_position: 3
---

import Checklist from '@site/src/components/Checklist';

# Post-Deployment Verification

Complete these checks 24-48 hours after installation.

## Post-Deployment Checklist

<Checklist
  id="post-deployment-24hr"
  title="24-48 Hour Verification"
  items={[
    { id: 'collector-online', label: 'Auvik collector still online and reporting' },
    { id: 'topology', label: 'Network topology map populating correctly' },
    { id: 'offline-alert', label: 'Auvik offline alert configured for this collector' },
    { id: 'remote-access', label: 'Remote access confirmed working from outside client network' },
    { id: 'discovery-complete', label: 'Device discovery substantially complete' },
    { id: 'snmp-issues', label: 'Any SNMP credential issues resolved' },
    { id: 'client-notified', label: 'Client notified of successful deployment' },
  ]}
/>

## Verification Steps

### 1. Confirm Collector Health

24-48 hours after deployment, verify:

**In Auvik Portal:**
- Collector status: **Online** (green)
- Last check-in: Within past few minutes
- No alerts or warnings on collector

**Via Remote Access:**
```bash
# SSH via Tailscale
ssh viyuadmin@hostname

# Check uptime
uptime

# Check Auvik service
systemctl status auvik-collector

# Check system resources
free -h
df -h
```

### 2. Review Network Topology

In Auvik → Network → Map:

- [ ] Core switches discovered
- [ ] Routers/firewalls discovered
- [ ] Access points discovered
- [ ] Connections between devices mapped
- [ ] Device icons correct (not generic)

If devices are missing or incorrectly identified:
1. Verify SNMP access to device
2. Check device supports required MIBs
3. Add device-specific credentials if needed

### 3. Configure Offline Alerts

Ensure alerts are configured for this collector:

1. **Admin → Alerts → Alert Rules**
2. Find **Collector Offline** rule
3. Verify it applies to this collector
4. Confirm notification channels are set

Test by temporarily stopping the collector:
```bash
sudo systemctl stop auvik-collector
# Wait 5 minutes for alert
sudo systemctl start auvik-collector
```

### 4. Verify Remote Access

From your office (not on client network):

```bash
# Test Tailscale
tailscale status
ping hostname.tailnet-name.ts.net

# SSH access
ssh viyuadmin@hostname

# Run some commands to verify full functionality
uptime
tailscale status
systemctl status auvik-collector
```

### 5. Review Discovery Results

In Auvik, check:

| Category | Expected | Action if Missing |
|----------|----------|-------------------|
| Switches | All managed switches | Check SNMP config |
| Routers | Core routers | Verify credentials |
| Firewalls | Perimeter firewalls | May need vendor-specific credentials |
| Access Points | All APs | Check controller vs standalone |
| Servers | Windows servers (if WMI configured) | Verify WMI access |
| Printers | Network printers | Usually auto-discovered |

### 6. Resolve Credential Issues

If devices show "Authentication Required":

1. Check Auvik credentials match device config
2. Verify collector IP in device's SNMP allowed hosts
3. For SNMPv3, verify auth/priv settings match exactly
4. Add device-specific credentials if needed

### 7. Document Final Status

Update documentation with:

| Field | Value |
|-------|-------|
| Deployment Status | Complete |
| Verification Date | Date of 24-48hr check |
| Devices Discovered | Count |
| Issues Resolved | List any issues fixed |
| Pending Items | Any follow-up needed |

### 8. Client Communication

Send deployment confirmation to client:

```
Subject: Auvik Network Monitoring - Deployment Complete

Hi [Client Contact],

The Auvik network monitoring collector has been successfully deployed
at [Site Name].

Key details:
- Collector location: [Rack/closet location]
- Devices discovered: [Count] network devices
- Status: Monitoring active

The system is now continuously monitoring your network infrastructure
and will alert us to any issues.

No action is required from your team. Please let us know if you have
any questions.

Best regards,
[Your name]
viyu.net
```

## Common Post-Deployment Issues

### Collector goes offline overnight

**Possible causes:**
- PoE power issues (switch reboot, power saving)
- Network maintenance window affected connectivity
- Pi hardware issue

**Resolution:**
1. Check Tailscale for when it disconnected
2. Review switch logs for port flaps
3. If recurring, investigate PoE stability

### Discovery stopped progressing

**Possible causes:**
- SNMP credential issues
- Network segmentation blocking access
- Collector at capacity

**Resolution:**
1. Check for "Authentication Required" devices
2. Verify inter-VLAN routing
3. Review collector resource usage

### Intermittent monitoring gaps

**Possible causes:**
- Network congestion
- SNMP timeouts
- SD card I/O issues

**Resolution:**
1. Check for packet loss: `ping -c 100 gateway`
2. Review collector logs for errors
3. Monitor SD card health

## Maintenance Schedule

After successful deployment, schedule:

| Task | Frequency |
|------|-----------|
| Verify collector online | Weekly (automated via alerts) |
| Review device inventory | Monthly |
| Check Pi health (SSH in) | Quarterly |
| Update documentation | As changes occur |
| Full health check | Annually |
