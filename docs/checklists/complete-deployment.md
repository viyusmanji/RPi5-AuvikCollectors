---
sidebar_position: 1
---

import Checklist from '@site/src/components/Checklist';
import PrintButton from '@site/src/components/PrintButton';

# Complete Deployment Checklist

All checklists in one place for full deployment workflow.

<PrintButton label="Print All Checklists" />

---

## Pre-Deployment (Office)

<Checklist
  id="complete-pre-deployment"
  title="Office Preparation"
  items={[
    { id: 'hw-kit', label: 'Hardware kit assembled (Pi 5, PoE HAT, case, microSD, patch cable)' },
    { id: 'golden-image', label: 'Golden image cloned to microSD card' },
    { id: 'hostname', label: 'Hostname configured (auvik-{clientcode}-{sitecode})' },
    { id: 'static-ip', label: 'Static IP configured per client documentation' },
    { id: 'timezone', label: 'Timezone set to client location' },
    { id: 'auvik-install', label: 'Auvik collector installed and verified online in portal' },
    { id: 'tailscale', label: 'Tailscale connected and accessible from management network' },
    { id: 'snmp-creds', label: 'Client SNMP credentials obtained and entered in Auvik' },
    { id: 'asset-label', label: 'Asset label printed and applied to device' },
    { id: 'backup-psu', label: 'USB-C backup power supply in tech bag' },
    { id: 'docs-updated', label: 'Client documentation updated with deployment details' },
  ]}
/>

---

## On-Site Installation

<Checklist
  id="complete-on-site"
  title="Field Installation"
  items={[
    { id: 'poe-verify', label: 'Verified switch port supports 802.3at PoE+ with available power budget' },
    { id: 'cable-connect', label: 'Connected Pi to switch port via Cat6 patch cable' },
    { id: 'power-confirm', label: 'Confirmed Pi powers on via PoE — LEDs active, no USB-C needed' },
    { id: 'ping-gateway', label: 'Verified ping to gateway successful' },
    { id: 'ping-internet', label: 'Verified ping to 8.8.8.8 successful' },
    { id: 'curl-auvik', label: 'Verified curl to https://auvik.com successful' },
    { id: 'auvik-online', label: 'Confirmed Auvik collector shows online in portal' },
    { id: 'discovery', label: 'Verified device discovery populating (switches, APs, firewalls)' },
    { id: 'tailscale-remote', label: 'Confirmed Tailscale accessible from remote location' },
    { id: 'mount', label: 'Pi mounted/secured in rack, shelf, or bracket' },
    { id: 'cable-mgmt', label: 'Cable run tidy and secure' },
    { id: 'docs-final', label: 'Client documentation updated with final install details' },
    { id: 'photo', label: 'Deployment photo taken for records' },
  ]}
/>

---

## Post-Deployment (24-48 Hours)

<Checklist
  id="complete-post-deployment"
  title="Verification (24-48 hrs later)"
  items={[
    { id: 'collector-still-online', label: 'Auvik collector still online and reporting' },
    { id: 'topology-complete', label: 'Network topology map fully populated' },
    { id: 'alerts-configured', label: 'Auvik offline alert configured for this collector' },
    { id: 'remote-verified', label: 'Remote access verified from outside client network' },
    { id: 'discovery-complete', label: 'Device discovery substantially complete' },
    { id: 'credential-issues', label: 'Any SNMP credential issues identified and resolved' },
    { id: 'client-notified', label: 'Client notified of successful deployment' },
  ]}
/>

---

## Hardware Inventory

<Checklist
  id="hardware-inventory"
  title="Deployment Kit Contents"
  items={[
    { id: 'pi5', label: 'Raspberry Pi 5 (8GB or 4GB)' },
    { id: 'poe-hat', label: 'PoE+ HAT (Pi 5 compatible)' },
    { id: 'case', label: 'Case with PoE HAT clearance' },
    { id: 'microsd', label: 'microSD card (32GB+ A2 rated)' },
    { id: 'eth-cable', label: 'Cat6 Ethernet patch cable (3-6 ft)' },
    { id: 'asset-label-item', label: 'Printed asset label' },
    { id: 'usbc-psu', label: 'USB-C 27W PSU (in tech bag, for backup)' },
  ]}
/>

---

## Troubleshooting Quick Checks

<Checklist
  id="troubleshooting-quick"
  title="If Something Goes Wrong"
  items={[
    { id: 'check-leds', label: 'Check Pi LEDs — power (green) and activity (red)' },
    { id: 'check-poe', label: 'Verify switch port is 802.3at PoE+ (not just 802.3af)' },
    { id: 'try-usbc', label: 'Test with USB-C power to isolate PoE issues' },
    { id: 'check-cable', label: 'Try different Ethernet cable' },
    { id: 'check-port', label: 'Try different switch port' },
    { id: 'check-tailscale', label: 'Check Tailscale status from management workstation' },
    { id: 'check-auvik-svc', label: 'SSH in and check: systemctl status auvik-collector' },
    { id: 'check-logs', label: 'Review logs: journalctl -u auvik-collector -f' },
    { id: 'restart-auvik', label: 'Try restart: sudo systemctl restart auvik-collector' },
  ]}
/>

---

## Documentation Checklist

<Checklist
  id="documentation-complete"
  title="Documentation Requirements"
  items={[
    { id: 'doc-hostname', label: 'Hostname recorded' },
    { id: 'doc-ip', label: 'IP address and subnet recorded' },
    { id: 'doc-gateway', label: 'Gateway recorded' },
    { id: 'doc-vlan', label: 'VLAN assignment recorded' },
    { id: 'doc-mac', label: 'MAC address recorded' },
    { id: 'doc-tailscale-ip', label: 'Tailscale IP recorded' },
    { id: 'doc-switch-port', label: 'Switch port documented' },
    { id: 'doc-location', label: 'Physical location documented' },
    { id: 'doc-snmp', label: 'SNMP credentials reference documented' },
    { id: 'doc-date', label: 'Deployment date recorded' },
    { id: 'doc-tech', label: 'Technician name recorded' },
  ]}
/>

---

## Print Instructions

Click "Print All Checklists" at the top of this page to generate a printer-friendly version:

- All checkboxes will appear empty for manual checking
- Navigation elements will be hidden
- Page breaks will separate major sections
- Consider printing double-sided to save paper

:::tip Field Use
Print this page and keep in your tech bag for field deployments. Use a clipboard for on-site checking.
:::
