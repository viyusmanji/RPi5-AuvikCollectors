---
sidebar_position: 3
---

# Glossary

Terms and acronyms used throughout this documentation.

## A

**A2 Rating**
: Application Performance Class 2. microSD card speed class optimized for random read/write operations. Required for reliable OS performance.

**ARM64 / aarch64**
: 64-bit ARM processor architecture used by Raspberry Pi 5. Also called AArch64.

**Auvik**
: Cloud-based network monitoring and management platform. Uses on-premises collectors to discover and monitor network infrastructure.

## B

**Bookworm**
: Codename for Debian 12, the base of current Raspberry Pi OS releases.

## C

**Collector**
: Auvik software agent deployed on-premises that discovers and monitors network devices, reporting to the Auvik cloud.

**Community String**
: Password-like credential used in SNMPv2c for authentication. Transmitted in plain text.

## D

**DHCP Reservation**
: Configuration on a DHCP server that always assigns the same IP address to a specific MAC address.

## F

**Firmware**
: Low-level software stored on device hardware. On Pi, includes bootloader and GPU firmware.

## G

**Golden Image**
: Pre-configured base system image used as a template for deploying multiple similar systems.

**GPIO**
: General Purpose Input/Output. The 40-pin header on Raspberry Pi used for hardware attachments like PoE HATs.

## H

**HAT**
: Hardware Attached on Top. Standard form factor for Raspberry Pi add-on boards that connect via the GPIO header.

## I

**Inter-VLAN Routing**
: Layer 3 routing between different VLANs, typically performed by a Layer 3 switch or router.

## L

**LAN**
: Local Area Network. The internal network at a client site.

## M

**MAC Address**
: Media Access Control address. Unique hardware identifier for network interfaces.

**Management VLAN**
: Dedicated VLAN for infrastructure management traffic, typically used for switch management interfaces, SNMP, and monitoring.

**MIB**
: Management Information Base. Defines the structure and types of information available via SNMP for a device.

## N

**NAT**
: Network Address Translation. Allows multiple devices to share a single public IP address.

**NAT Traversal**
: Techniques for establishing connections between devices behind NAT. Used by Tailscale.

**NVMe**
: Non-Volatile Memory Express. High-speed storage interface. Pi 5 supports NVMe via HAT or official M.2 HAT.

## O

**OID**
: Object Identifier. Unique identifier for a variable in SNMP MIBs.

## P

**Pi 5**
: Raspberry Pi 5. Current generation single-board computer with quad-core ARM Cortex-A76 CPU.

**PoE**
: Power over Ethernet. Technology for delivering power over network cables.

**PoE+**
: 802.3at standard. Provides up to 30W of power. Required for Pi 5 with PoE HAT.

**PoE++**
: 802.3bt standard. Provides up to 60-100W of power.

## R

**RBAC**
: Role-Based Access Control. Security model where access is granted based on user roles.

## S

**SNMP**
: Simple Network Management Protocol. Standard protocol for monitoring and managing network devices.

**SNMPv2c**
: SNMP version 2c. Adds community-based security (community strings).

**SNMPv3**
: SNMP version 3. Adds authentication and encryption for secure monitoring.

**SSH**
: Secure Shell. Encrypted protocol for remote command-line access.

**Static IP**
: Fixed IP address configured directly on a device, not assigned by DHCP.

## T

**Tailnet**
: Tailscale network. The virtual private network created by Tailscale connecting all devices.

**Tailscale**
: Mesh VPN service based on WireGuard. Provides secure remote access without port forwarding.

**Tailscale SSH**
: Tailscale's built-in SSH feature that allows SSH access over the Tailscale network without managing SSH keys.

## U

**UFW**
: Uncomplicated Firewall. User-friendly interface for managing iptables on Linux.

**Unattended Upgrades**
: Debian/Ubuntu feature that automatically installs security updates.

## V

**VLAN**
: Virtual Local Area Network. Logical network segmentation within a physical network.

## W

**Watchdog**
: Hardware or software mechanism that automatically reboots a system if it becomes unresponsive.

**WireGuard**
: Modern VPN protocol known for simplicity and performance. Used by Tailscale.

**WMI**
: Windows Management Instrumentation. Microsoft's implementation of management standards. Used by Auvik for Windows device discovery.

## Numbers

**802.3af**
: Original PoE standard. Up to 15.4W. Not sufficient for Pi 5.

**802.3at**
: PoE+ standard. Up to 30W. Required for Pi 5 with PoE HAT.

**802.3bt**
: PoE++ standard. Up to 60-100W. Compatible with Pi 5 (provides more than needed).
