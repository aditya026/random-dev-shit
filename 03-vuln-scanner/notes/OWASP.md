# OWASP Complete Guide
### Open Web Application Security Project - Methodology & Top 10

---

## What is OWASP?

OWASP (Open Web Application Security Project)  works to improve the security of software. It produces freely available articles, methodologies, tools, and technologies that help developers, security professionals, and organisations build and test secure applications.

This guide covers two core areas:
1. **The OWASP Testing Methodology** — how to professionally conduct a penetration test
2. **The OWASP Top 10** — the most critical web application security risks

---

# Part 1 — OWASP Testing Methodology

A professional penetration test follows a structured lifecycle. Skipping phases leads to missed vulnerabilities and unreliable results. The phases below are in order — each one builds on the previous.

---

## Phase 1 — Network Footprinting (Reconnaissance)

**What it is:**
Reconnaissance (recon) is the first and most important phase. The tester collects as much information as possible about the target *without directly touching it*. This is called **passive reconnaissance**.

**What you do:**
- Look up WHOIS records to find domain registration details (owner, email, registrar)
- Query DNS records (A, MX, NS, TXT records) to map the infrastructure
- Search Google, LinkedIn, GitHub, and job postings for technology stack clues
- Use tools like `theHarvester` to collect emails and subdomains
- Check the Wayback Machine (archive.org) for old versions of the site
- Analyse SSL certificates for hostnames and organisation details

**Goal:** Build a map of the target's digital footprint — domains, subdomains, IP ranges, technologies, and key personnel — before sending a single packet.

**Key tools:** `theHarvester`, `Maltego`, `Shodan`, `Recon-ng`, `OSINT Framework`

---

## Phase 2 — Discovery 

**What it is:**
Now the tester begins **active reconnaissance** — directly interacting with the target's systems to discover what is running and how it is configured.

**What you do:**
- **Port scanning** — find which TCP/UDP ports are open on the target
- **Service detection** — identify what software is running on each port (web server, SSH, FTP, etc.)
- **OS fingerprinting** — determine the operating system from network packet patterns
- **Banner grabbing** — read the version strings that services advertise on connection
- **Web crawling** — map all pages, forms, endpoints, and links on a web application
- Check `robots.txt` and `sitemap.xml` for hidden paths
- Directory bruteforcing to find unlisted pages and admin panels

**Goal:** Produce a complete inventory of every attack surface on the target.

**Key tools:** `Nmap`, `Masscan`, `Nikto`, `Gobuster`, `Burp Suite Spider`

---

## Phase 3 — Enumeration

**What it is:**
Enumeration goes deeper than discovery. Once you know a service exists, you enumerate it to extract detailed information — users, shares, policies, and configurations.

**What you do:**
- **NetBIOS/SMB enumeration** — list Windows shares, printers, and domain users
- **SNMP enumeration** — query network devices for configuration data (often publicly readable)
- **LDAP enumeration** — query Active Directory for users, groups, and policies
- **NFS enumeration** — find exported file system shares that might be accessible
- **SMTP enumeration** — verify valid email addresses using VRFY/EXPN commands
- **Web enumeration** — identify CMS type, plugins, admin panels, backup files, and API endpoints
- **DNS zone transfer** — attempt to get the full DNS records list from a nameserver

**Goal:** Gather usernames, group memberships, network shares, running services, and any configuration data that narrows the attack path.

**Key tools:** `enum4linux`, `snmpwalk`, `ldapsearch`, `DNSrecon`, `WFuzz`

---

## Phase 4 — Password Cracking

**What it is:**
Password cracking attacks attempt to recover plaintext credentials from captured hashes or by guessing credentials directly against a live service.

**Types of attacks:**
| Attack Type | Description |
|---|---|
| **Dictionary attack** | Try every word in a wordlist (e.g. `rockyou.txt`) |
| **Brute force** | Try every possible character combination |
| **Rule-based** | Apply transformation rules to wordlist entries (e.g. add `!` at end) |
| **Rainbow table** | Use pre-computed hash→password lookup tables |
| **Credential stuffing** | Use leaked username/password pairs from other breaches |
| **Spraying** | Try one common password across many accounts (avoids lockouts) |

**What you target:**
- Login forms (HTTP Basic Auth, web forms, APIs)
- SSH and RDP services
- Password hash files extracted from `/etc/shadow` or Windows SAM
- Database authentication

**Key tools:** `Hashcat`, `John the Ripper`, `Hydra`, `Medusa`, `CrackStation`

> **Ethical note:** Only crack hashes and credentials on systems you own or have written permission to test.

---

## Phase 5 — Vulnerability Assessment

**What it is:**
Vulnerability assessment systematically identifies known security weaknesses in the target's software, configuration, and architecture. This is different from exploitation — you are cataloguing vulnerabilities, not necessarily proving they are exploitable.

**What you do:**
- Run automated scanners to match service versions against CVE databases
- Manually verify scanner results to remove false positives
- Check for missing patches and outdated software versions
- Review application logic for design-level flaws
- Test for common web vulnerabilities (SQLi, XSS, CSRF, SSRF, etc.)
- Assess network segmentation and firewall rules
- Check for default credentials on routers, IoT devices, and admin panels

**Scoring:** Vulnerabilities are scored using **CVSS** (Common Vulnerability Scoring System) — a 0–10 scale where 10 is most critical.

**Key tools:** `OpenVAS`, `Nessus`, `Nikto`, `Metasploit (auxiliary modules)`, `Burp Suite Pro`

---

## Phase 6 — AS/400 Auditing

**What it is:**
IBM AS/400 (now called IBM i) is a server platform commonly used in banking, insurance, and manufacturing. Many legacy enterprise systems still run on it. Auditing AS/400 requires specialised knowledge because it has its own operating system (OS/400), its own user management, and its own application layer.

**What you check:**
- Default user profiles (QSECOFR, QPGMR) with unchanged passwords
- User authority levels — whether users have `*ALLOBJ` (all-object) authority
- Password policies — minimum length, complexity, expiry
- System values such as `QSECURITY` (security level — should be 40 or 50)
- Audit journal configuration — is activity being logged?
- Network services exposed — FTP, Telnet, DRDA (database access)
- Exit programs — whether file transfers are monitored and controlled

**Why it matters:** AS/400 systems often hold core financial and ERP data. A misconfigured AS/400 can expose an organisation's entire operational database.

---

## Phase 7 — Bluetooth Specific Testing

**What it is:**
Bluetooth testing assesses the security of Bluetooth-enabled devices — phones, laptops, IoT sensors, medical devices, and industrial equipment.

**Common attacks tested:**
| Attack | Description |
|---|---|
| **Bluejacking** | Sending unsolicited messages to a discoverable device |
| **Bluesnarfing** | Unauthorised access to contacts, calendars, and files via OBEX |
| **Bluebugging** | Taking control of a device's commands (calls, SMS) via AT commands |
| **BIAS attack** | Bypassing authentication in Bluetooth Classic (CVE-2020-10135) |
| **KNOB attack** | Downgrading encryption key length to 1 byte for brute force |
| **BlueBorne** | Remote code execution without pairing (patched, but unpatched devices exist) |

**What you check:**
- Is the device set to discoverable mode unnecessarily?
- Are default PINs (0000, 1234) still in use?
- Is Bluetooth Low Energy (BLE) advertising sensitive data in beacons?
- Are pairing security modes correctly configured?

**Key tools:** `hcitool`, `btlejack`, `gatttool`, `Wireshark (with BT adapter)`, `BlueMaho`

---

## Phase 8 — Cisco Specific Testing

**What it is:**
Cisco produces a large portion of the world's network infrastructure — routers, switches, firewalls, and VPN appliances. Misconfigured Cisco devices are high-value targets because they control network traffic flow.

**What you check:**
- **Default credentials** — `cisco`/`cisco`, `admin`/`admin` on IOS devices
- **SNMP community strings** — `public` and `private` are default and should be changed
- **Telnet vs SSH** — Telnet sends credentials in plaintext; SSH must be enforced
- **CDP (Cisco Discovery Protocol)** — leaks device type, IOS version, and IP addresses to adjacent hosts
- **NTP authentication** — unauthenticated NTP can be exploited for log tampering
- **Spanning Tree vulnerabilities** — rogue switches can intercept traffic
- **ACL misconfigurations** — Access Control Lists that are too permissive
- **Cisco Smart Install** — a protocol that has been widely exploited for remote code execution (should be disabled)
- **IOS version** — check against Cisco's security advisories for known CVEs

**Key tools:** `Metasploit (Cisco modules)`, `Nmap (Cisco scripts)`, `cisco-auditing-tool`, `Hydra`

---

## Phase 9 — Citrix Specific Testing

**What it is:**
Citrix provides remote desktop and application delivery solutions (Citrix ADC/NetScaler, XenApp, XenDesktop). They are widely used in healthcare, finance, and enterprise environments for remote access.

**What you check:**
- **CVE-2019-19781 (Citrix ADC / NetScaler)** — one of the most critical Citrix vulnerabilities ever discovered; allows unauthenticated remote code execution. Check if patched.
- **Authentication bypass** — weak session token generation or token fixation
- **Citrix Gateway enumeration** — identify valid usernames through error message differences
- **Virtual desktop breakout** — can a user escape the restricted desktop to reach the underlying OS?
- **Published application restrictions** — can restricted apps be used to open a command shell?
- **Unpatched Citrix Workspace app** — client-side vulnerabilities
- **SmartCard authentication bypass**
- **Logging and auditing** — are user session actions being recorded?

**Why it matters:** Citrix is often the front door to an organisation's internal network for remote workers. A Citrix vulnerability can grant an attacker full network access.

---

## Phase 10 — Network Backbone Testing

**What it is:**
The network backbone is the core infrastructure connecting all parts of an organisation — routers, switches, firewalls, load balancers, and WAN links. Compromise here means visibility into all traffic.

**What you check:**
- **Routing protocol security** — BGP, OSPF, and RIP can be poisoned if authentication is missing
- **VLAN hopping** — can an attacker on VLAN 10 reach traffic on VLAN 20?
- **ARP spoofing** — sending fake ARP replies to perform man-in-the-middle attacks
- **DNS poisoning** — injecting false DNS records to redirect traffic
- **Network segmentation** — are production, dev, and admin zones properly isolated?
- **Firewall rule review** — are there overly permissive `ANY ANY ALLOW` rules?
- **Traffic encryption** — is internal east-west traffic encrypted, or only perimeter traffic?
- **DDoS resilience** — rate limiting, scrubbing, and upstream provider protection

**Key tools:** `Wireshark`, `Scapy`, `Yersinia` (VLAN/STP attacks), `arpspoof`, `dsniff`

---

## Phase 11 — Server Specific Tests

**What it is:**
Each server type has its own configuration requirements and known vulnerability classes. This phase tests the hardening of individual servers.

**What you check:**
- **Web servers (Apache, Nginx, IIS)** — directory listing, server tokens, HTTP methods (PUT, DELETE, TRACE), virtual host misconfiguration
- **Database servers (MySQL, MSSQL, PostgreSQL)** — default credentials, remote access enabled, excessive user privileges, unencrypted connections
- **FTP servers** — anonymous login, cleartext credentials, directory traversal
- **SSH servers** — root login allowed, password authentication vs key-only, outdated OpenSSH versions
- **Mail servers (SMTP, IMAP)** — open relay, VRFY/EXPN enabled, SPF/DKIM/DMARC missing
- **Windows servers** — SMB signing disabled, NTLM relay vulnerabilities, unpatched Print Spooler (PrintNightmare)
- **Linux servers** — SUID/SGID binaries, cron job permissions, world-writable directories, kernel version

---

## Phase 12 — VoIP Security Testing

**What it is:**
VoIP (Voice over IP) systems (Asterisk, Cisco CallManager, Microsoft Teams Direct Routing) carry voice calls over IP networks. They introduce a unique attack surface.

**Common vulnerabilities:**
| Attack | Description |
|---|---|
| **SIP enumeration** | Discover valid SIP extensions/accounts |
| **SIP brute force** | Crack SIP account passwords to make calls at the target's expense |
| **Vishing** | Use VoIP to make spoofed calls for social engineering |
| **Call interception** | MITM on unencrypted SIP/RTP traffic to record calls |
| **Toll fraud** | Compromising a PBX to make international calls billed to the victim |
| **DoS via SIP INVITE flood** | Overwhelm the PBX with fake call requests |

**What you check:**
- Is SIP traffic encrypted with TLS (SIPS)?
- Is voice traffic encrypted with SRTP?
- Are SIP accounts using strong passwords?
- Is the VoIP VLAN properly segmented from the data network?

**Key tools:** `SIPVicious` (`svmap`, `svwar`, `svcrack`), `Wireshark`, `Metasploit (SIP modules)`

---

## Phase 13 — Wireless Penetration Testing

**What it is:**
Wireless testing assesses the security of Wi-Fi networks — both from outside the building (wardriving) and from within.

**What you test:**
| Area | What to Check |
|---|---|
| **Encryption** | WPA3 preferred; WEP is broken; WPA2 with weak PSK is crackable |
| **PMKID attack** | Capture handshake without a client connected; crack offline |
| **Evil twin** | Set up a rogue AP with the same SSID to capture credentials |
| **KARMA attack** | Respond to any probe request — client auto-connects to rogue AP |
| **WPS vulnerabilities** | WPS PIN can be brute-forced in under 24 hours |
| **Rogue AP detection** | Is the organisation monitoring for unauthorised access points? |
| **Guest network isolation** | Can a guest VLAN user reach the corporate network? |
| **802.1X (Enterprise)** | Is RADIUS properly configured? Is server cert validated? |

**Key tools:** `aircrack-ng suite`, `Hashcat`, `Kismet`, `Wifite`, `hostapd-wpe` (evil twin), `hcxdumptool`

---

## Phase 14 — Physical Security Testing

**What it is:**
The most overlooked phase. Physical security testing assesses whether an attacker who walks into a building can compromise systems, steal data, or plant malicious hardware — bypassing all network security entirely.

**What you test:**
- **Tailgating / piggybacking** — following an employee through a secure door without badging in
- **Badge cloning** — can access card RFID signals be captured and replicated?
- **Unlocked workstations** — screen lock policy enforcement
- **USB drop attacks** — would employees plug in a found USB drive?
- **Dumpster diving** — are documents and hardware properly shredded and disposed of?
- **Shoulder surfing** — can passwords or sensitive screens be viewed from nearby?
- **Lock picking and bypass** — are physical locks adequate?
- **Camera blind spots** — are there areas without CCTV coverage?
- **Rogue hardware** — can a LAN Turtle or Raspberry Pi be plugged into an unused network port?

> A real-world pen test often finds that the hardest firewall to bypass is a single locked door — until someone holds it open.

---

## Phase 15 — Final Report

**What it is:**
The final report is the deliverable that justifies the entire engagement. It must be clear enough for executives and detailed enough for engineers.

**Professional report structure:**

```
1. Executive Summary
   - Business risk overview in plain language
   - Overall risk rating (Critical / High / Medium / Low)
   - Key findings summary (3–5 bullet points)
   - Recommendations overview

2. Methodology
   - Scope of testing (what was and was not tested)
   - Timeframe
   - Testing approach (black-box / grey-box / white-box)
   - Tools used

3. Findings (one section per vulnerability)
   - Title
   - Severity (CVSS score)
   - Description — what the vulnerability is
   - Evidence — screenshots, request/response logs, payloads
   - Impact — what an attacker could do
   - Recommendation — how to fix it
   - References — CVE, CWE, OWASP link

4. Risk Matrix
   - All findings plotted by Likelihood × Impact

5. Remediation Roadmap
   - Prioritised fix list with estimated effort

6. Appendices
   - Raw scan output
   - Full tool command logs
   - Glossary
```

---
---

# Part 2 — OWASP Top 10

The OWASP Top 10 is the most widely recognised standard for web application security risks. It is updated roughly every 3–4 years based on real-world vulnerability data.

> Current version: **OWASP Top 10 — 2021**

---

## A01 — Broken Access Control

**What it is:**
The application fails to enforce what authenticated users are allowed to do. A logged-in user can access another user's data, perform admin actions, or reach URLs they should not.

**Real example:** Changing `user_id=123` to `user_id=124` in a URL and seeing someone else's account details. This is called an **IDOR** (Insecure Direct Object Reference).

**How to fix:** Enforce access control on the server, not the client. Check permissions on every request. Deny by default.

---

## A02 — Cryptographic Failures

**What it is:**
Previously called "Sensitive Data Exposure." Sensitive data (passwords, credit cards, health records) is either transmitted in plaintext, encrypted with weak algorithms, or stored without proper hashing.

**Real examples:**
- Storing passwords in plain text or with MD5 (easily cracked)
- Using HTTP instead of HTTPS for login forms
- Using ECB mode encryption (patterns are preserved in ciphertext)

**How to fix:** Use TLS 1.2+ everywhere. Hash passwords with `bcrypt` or `argon2`. Never use MD5/SHA1 for passwords. Encrypt sensitive data at rest.

---

## A03 — Injection

**What it is:**
User-supplied data is sent to an interpreter (SQL, OS shell, LDAP, XML) as part of a command, allowing attackers to alter the command's logic.

**Real examples:**
- **SQL injection:** `' OR '1'='1` bypasses a login query
- **Command injection:** Passing `; rm -rf /` to a shell command
- **LDAP injection:** Manipulating directory queries to bypass authentication

**How to fix:** Use parameterised queries / prepared statements. Never concatenate user input into queries. Validate and sanitise all inputs. Use an ORM.

---

## A04 — Insecure Design

**What it is:**
A new category in 2021. Security flaws exist in the *design* of the application — not just the implementation. No amount of secure coding can fix a fundamentally insecure design.

**Real examples:**
- A password reset flow that uses security questions that are easily guessable
- A financial app that allows unlimited failed transaction attempts
- An API that exposes all user data in one endpoint because it was faster to build

**How to fix:** Threat model during design. Use secure design patterns. Apply the principle of least privilege from day one. Conduct architecture reviews before writing code.

---

## A05 — Security Misconfiguration

**What it is:**
The most commonly found issue. Default configurations, unnecessary features, error messages with stack traces, missing patches, and open cloud storage buckets.

**Real examples:**
- S3 bucket left publicly readable, exposing millions of user records
- Default admin credentials (admin/admin) not changed on a new installation
- Detailed error messages showing database structure to users
- Directory listing enabled on a web server

**How to fix:** Harden all configurations. Remove unused features and default accounts. Automate configuration checks in CI/CD pipelines. Use the principle of minimal surface area.

---

## A06 — Vulnerable and Outdated Components

**What it is:**
Using libraries, frameworks, or software components with known vulnerabilities. This includes both direct dependencies and transitive dependencies (libraries your libraries use).

**Real examples:**
- The Equifax breach (2017) was caused by an unpatched Apache Struts vulnerability
- Running an outdated WordPress plugin with a known SQLi vulnerability
- Using Log4j 2.x before 2.17.1 (Log4Shell — CVE-2021-44228)

**How to fix:** Keep an inventory of all components and their versions. Subscribe to vulnerability feeds. Automate dependency scanning with tools like `Dependabot`, `Snyk`, or `OWASP Dependency-Check`.

---

## A07 — Identification and Authentication Failures

**What it is:**
Previously called "Broken Authentication." Weaknesses in how the application proves who a user is and maintains their session. Includes weak passwords, credential stuffing, missing MFA, and poor session management.

**Real examples:**
- No rate limiting on login — allows unlimited brute force attempts
- Session tokens that don't expire after logout
- Allowing passwords like `password123`
- Credential stuffing (using leaked email/password pairs from other breaches)

**How to fix:** Enforce MFA. Implement account lockout and rate limiting. Use secure, randomly generated session IDs. Invalidate sessions on logout. Check passwords against known-breached lists (Have I Been Pwned API).

---

## A08 — Software and Data Integrity Failures

**What it is:**
A new category in 2021. Code and infrastructure updates are applied without verifying their integrity. Also covers insecure deserialization — when serialised objects from untrusted sources are processed without validation.

**Real examples:**
- A CI/CD pipeline that pulls dependencies from a public package registry without verifying checksums (**supply chain attack**)
- The SolarWinds attack — malicious code was inserted into a software update
- Java deserialization attacks where crafted objects trigger remote code execution

**How to fix:** Verify digital signatures on software updates. Use trusted, private package repositories. Implement pipeline integrity checks. Avoid deserialising untrusted data.

---

## A09 — Security Logging and Monitoring Failures

**What it is:**
The application does not log security events, or logs them but nobody monitors them. This means attackers can operate inside a network for months before detection. (The industry average time to detect a breach is **207 days**.)

**What's typically missing:**
- Login failures not logged
- No alerting on repeated failed attempts
- Logs stored locally and deleted when attackers wipe them
- No log integrity protection (logs can be tampered with)
- No SIEM or central logging

**How to fix:** Log all authentication events, access control failures, and input validation errors. Store logs centrally and off the application server. Set up real-time alerting. Implement a SIEM (e.g. Splunk, Elastic SIEM, Wazuh).

---

## A10 — Server-Side Request Forgery (SSRF)

**What it is:**
The newest addition to the Top 10. The application fetches a remote resource (a URL) based on user-supplied input, without validating it. An attacker can force the server to make requests to internal systems that are otherwise unreachable from the internet.

**Real examples:**
- The Capital One breach (2019) involved SSRF on AWS — an attacker queried the EC2 metadata endpoint (`http://169.254.169.254`) to steal AWS credentials
- An image download feature that can be pointed at `http://localhost/admin`
- A PDF generator that fetches internal intranet pages

**How to fix:** Validate and sanitise all user-supplied URLs. Use an allowlist of permitted domains. Block requests to private IP ranges (`10.x.x.x`, `172.16.x.x`, `192.168.x.x`, `169.254.x.x`). Disable HTTP redirects when fetching external resources.

---

# Quick Reference Card

| # | Name | Key Risk | Fix in One Line |
|---|---|---|---|
| A01 | Broken Access Control | Unauthorised data access | Deny by default; check every request server-side |
| A02 | Cryptographic Failures | Data exposed in transit or at rest | TLS everywhere; bcrypt/argon2 for passwords |
| A03 | Injection | Arbitrary commands executed | Parameterised queries; never concatenate input |
| A04 | Insecure Design | Flawed architecture | Threat model at design time |
| A05 | Security Misconfiguration | Defaults left in place | Harden everything; disable what you don't use |
| A06 | Vulnerable Components | Known CVEs in dependencies | Scan and update dependencies continuously |
| A07 | Auth Failures | Accounts taken over | MFA + rate limiting + strong session management |
| A08 | Integrity Failures | Tampered updates / supply chain | Verify signatures; secure your CI/CD pipeline |
| A09 | Logging Failures | Breaches go undetected | Log everything; monitor in real time |
| A10 | SSRF | Internal systems reached | Allowlist URLs; block private IP ranges |

---

*Sources: OWASP Foundation (owasp.org) — OWASP Testing Guide v4.2, OWASP Top 10 2021*
*This document is for educational purposes.*