---
sidebar_position: 4
---

# SNMP Configuration

SNMP (Simple Network Management Protocol) is the primary method Auvik uses to discover and monitor network devices.

## SNMP Versions

| Version | Security | Use Case | Recommendation |
|---------|----------|----------|----------------|
| SNMPv1 | None (clear text) | Legacy devices | Avoid |
| SNMPv2c | Community string only | Most deployments | **Common** |
| **SNMPv3** | Auth + Encryption | Security-conscious | **Preferred** |

:::tip Security Best Practice
Use SNMPv3 with authentication and encryption whenever devices support it. SNMPv2c community strings are transmitted in plain text.
:::

## SNMPv2c Configuration

### On Managed Devices

Configure each switch, router, firewall, and access point:

1. **Community String** — Set a non-default read-only community
2. **Allowed Hosts** — Restrict SNMP access to collector IP only
3. **Contact/Location** — Optional but helpful for documentation

#### Cisco IOS Example

```
snmp-server community viyu-readonly RO 10
snmp-server host 10.1.1.50 traps viyu-readonly
access-list 10 permit 10.1.1.50
```

#### Cisco Meraki

Dashboard → Network-wide → General → SNMP:
- SNMP Access: Enabled
- Community string: `viyu-readonly`
- Add collector IP to allowed hosts

#### Ubiquiti UniFi

Settings → System → Administration → SNMP:
- Enable SNMP
- Community: `viyu-readonly`

#### FortiGate

```
config system snmp sysinfo
    set status enable
    set contact-info "viyu.net NOC"
end
config system snmp community
    edit 1
        set name "viyu-readonly"
        config hosts
            edit 1
                set ip 10.1.1.50 255.255.255.255
            next
        end
    next
end
```

### In Auvik

1. Navigate to the client site in Auvik
2. Go to **Manage → Credentials**
3. Add SNMP credential:
   - Type: SNMPv2c
   - Community: `viyu-readonly` (match device config)
4. Auvik automatically applies credentials during discovery

## SNMPv3 Configuration

SNMPv3 provides authentication (verifies sender) and privacy (encrypts data).

### Security Levels

| Level | Authentication | Encryption | Use |
|-------|----------------|------------|-----|
| noAuthNoPriv | No | No | Not recommended |
| authNoPriv | Yes | No | Basic security |
| **authPriv** | Yes | Yes | **Recommended** |

### On Managed Devices

#### Cisco IOS Example

```
snmp-server group VIYUGROUP v3 priv
snmp-server user VIYUUSER VIYUGROUP v3 auth sha AUTHPASSWORD priv aes 128 PRIVPASSWORD
snmp-server host 10.1.1.50 version 3 priv VIYUUSER
```

#### FortiGate Example

```
config system snmp user
    edit "viyuuser"
        set security-level auth-priv
        set auth-proto sha
        set auth-pwd AUTHPASSWORD
        set priv-proto aes
        set priv-pwd PRIVPASSWORD
    next
end
```

### In Auvik

1. Navigate to **Manage → Credentials**
2. Add SNMP credential:
   - Type: SNMPv3
   - Username: `VIYUUSER`
   - Security Level: authPriv
   - Auth Protocol: SHA
   - Auth Password: `AUTHPASSWORD`
   - Privacy Protocol: AES
   - Privacy Password: `PRIVPASSWORD`

## Credential Hierarchy in Auvik

Auvik uses a credential hierarchy:

1. **Device-specific** — Credentials assigned to a specific device
2. **Site-level** — Credentials available to all devices in a site
3. **Client-level** — Credentials available across all sites for a client

For most deployments, site-level credentials work well. Add device-specific credentials for devices with unique community strings.

## Testing SNMP

### From the Collector

Install SNMP tools:
```bash
sudo apt install snmp snmp-mibs-downloader -y
```

Test SNMPv2c:
```bash
snmpwalk -v2c -c viyu-readonly 10.1.1.1 sysDescr
```

Test SNMPv3:
```bash
snmpwalk -v3 -l authPriv -u VIYUUSER -a SHA -A AUTHPASSWORD -x AES -X PRIVPASSWORD 10.1.1.1 sysDescr
```

### Expected Output

```
SNMPv2-MIB::sysDescr.0 = STRING: Cisco IOS Software, C3560E Software...
```

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| Timeout | Device unreachable, SNMP disabled, or blocked | Check routing, enable SNMP, verify ACL |
| No Such Name | OID not supported | Try different OID, check device capabilities |
| Authentication Failure | Wrong community/credentials | Verify credential matches device config |

## SNMP Requirements by Device Type

| Device Type | Required OIDs | Notes |
|-------------|---------------|-------|
| Switches | IF-MIB, BRIDGE-MIB | Interface stats, MAC tables |
| Routers | IP-MIB, OSPF-MIB | Routing tables, OSPF neighbors |
| Firewalls | Vendor MIBs | Often require vendor-specific OIDs |
| Access Points | IEEE802dot11-MIB | Wireless clients, signal strength |
| UPS | UPS-MIB | Battery status, load |

## Troubleshooting

### Devices discovered but limited data

1. Verify read-only (RO) community has access to all OIDs
2. Check if device firmware supports required MIBs
3. Some devices require SNMPv3 for full access

### SNMP works manually but not in Auvik

1. Verify credential entered correctly in Auvik (no trailing spaces)
2. Check credential is assigned to correct scope (site/client)
3. Re-run discovery: Auvik → Site → Network → Discover

### Device shows "Authentication Required"

1. SNMP credentials not configured or incorrect
2. SNMPv3 auth/priv mismatch
3. Add or correct credentials in Auvik credential store
