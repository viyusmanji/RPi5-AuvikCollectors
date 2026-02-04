---
sidebar_position: 3
---

# Auvik Offline Alerts

Configure Auvik to notify you when a collector goes offline, providing a backup monitoring layer.

## Why Configure Offline Alerts?

Even with Tailscale remote access, you need to know when collectors are unreachable:

| Scenario | Tailscale | Auvik Alert |
|----------|-----------|-------------|
| Pi powered off | Shows offline | **Alerts immediately** |
| Network outage | Shows offline | **Alerts immediately** |
| Auvik service issue | Still connected | Alerts on collector status |
| Pi crash | Shows offline | **Alerts immediately** |

Auvik alerts provide an independent monitoring channel.

## Configuring Collector Offline Alerts

### 1. Navigate to Alert Settings

1. Log into Auvik
2. Go to **Admin → Alerts → Alert Rules**
3. Find or create rule for **Collector Offline**

### 2. Configure Alert Rule

| Setting | Recommended Value |
|---------|-------------------|
| Alert Type | Collector Offline |
| Severity | Critical |
| Trigger After | 5 minutes offline |
| Auto-close | When collector comes online |

### 3. Set Notification Channels

Configure where alerts are sent:

| Channel | Use Case |
|---------|----------|
| Email | NOC team distribution list |
| Slack | #alerts channel |
| Microsoft Teams | Operations channel |
| PagerDuty | On-call rotation |
| Webhook | Custom integrations |

### 4. Test the Alert

1. SSH into a test collector
2. Stop the Auvik service: `sudo systemctl stop auvik-collector`
3. Wait for alert to trigger (~5 minutes)
4. Verify notification received
5. Restart service: `sudo systemctl start auvik-collector`
6. Confirm alert auto-closes

## Alert Notification Setup

### Email

1. **Admin → Alert → Notifications → Email**
2. Add NOC distribution list
3. Assign to Collector Offline rule

### Slack Integration

1. **Admin → Integrations → Slack**
2. Authorize Auvik to post to workspace
3. Select channel for alerts
4. Assign to Collector Offline rule

### Microsoft Teams

1. **Admin → Integrations → Microsoft Teams**
2. Create incoming webhook in Teams channel
3. Add webhook URL to Auvik
4. Assign to Collector Offline rule

### PagerDuty

1. **Admin → Integrations → PagerDuty**
2. Connect PagerDuty account
3. Map Collector Offline to PagerDuty service
4. Configure escalation policy in PagerDuty

## Alert Best Practices

### Avoid Alert Fatigue

- Don't set trigger too sensitive (brief network blips)
- 5-minute threshold balances speed vs. noise
- Use severity levels appropriately

### Include Context in Alerts

Auvik alerts include:
- Collector name
- Client/site
- Duration offline
- Last known IP

Ensure naming conventions make identification easy.

### Create Runbook Reference

When an alert fires, technicians should have a clear response path:

1. Check Tailscale for connectivity
2. If Tailscale shows offline → likely power/network issue
3. If Tailscale connected but Auvik offline → check Auvik service
4. If both offline → contact client about site issues

## Device Offline Alerts

In addition to collector offline alerts, configure alerts for critical network devices:

### Recommended Device Alerts

| Device Type | Severity | Purpose |
|-------------|----------|---------|
| Core Switch | Critical | Network backbone |
| Firewall | Critical | Internet connectivity |
| Primary Router | Critical | Routing infrastructure |
| Access Points | Warning | Wireless coverage |
| Non-critical switches | Info | Awareness |

### Configuring Device Alerts

1. **Admin → Alerts → Alert Rules**
2. Create rule: **Device Offline**
3. Filter by device type or specific devices
4. Set severity and notification channel

## Monitoring Dashboard

Create an Auvik dashboard showing collector health:

1. **Dashboards → Create Dashboard**
2. Add widget: **Collector Status**
3. Shows all collectors with current state
4. Pin to default view for NOC

## Troubleshooting Repeated Alerts

### Collector flapping (online/offline repeatedly)

**Possible Causes:**
- Unstable network at client site
- PoE power issues (marginal power delivery)
- Pi hardware problem

**Resolution:**
1. Check network stability
2. Verify PoE switch port status
3. Try different switch port
4. Test with USB-C power supply

### Alerts not firing

1. Verify alert rule is enabled
2. Check notification channel is configured
3. Confirm email not going to spam
4. Test with manual service stop

### Alerts going to wrong team

1. Review alert rule assignments
2. Check notification channel mappings
3. Update escalation procedures
