# OWASP Web Application Penetration Testing Methodology
### Open Web Application Security Project — Testing Guide v4.2

---

## What is OWASP?

OWASP (Open Web Application Security Project)  works to improve the security of software worldwide. 

This document covers the **OWASP Web Application Penetration Testing Methodology** — a structured, phase-by-phase approach to professionally testing a web application for security vulnerabilities.


---

## The Penetration Testing Lifecycle

A web application pentest is not random — it follows a strict lifecycle. Every phase feeds into the next. Skipping phases leads to missed vulnerabilities and an unreliable report.

```
[ Phase 1 ]  →  [ Phase 2 ]  →  [ Phase 3 ]  →  [ Phase 4 ]
  Recon          Mapping         Testing          Reporting

Passive recon   Spider / crawl   Exploit vulns    Document all
Active recon    Dir brute force  Manual verify    findings with
OSINT           Tech fingerprint Automation       evidence & fixes
```

---

## Phase 1 — Reconnaissance (Information Gathering)

### What it is
Reconnaissance is the foundation of every engagement. Before sending a single test request, you collect as much publicly available information as possible about the target. The goal is to understand the technology stack, infrastructure, attack surface, and any exposed sensitive data — all without touching the application.

This phase is split into two parts:

**Passive Reconnaissance** — collecting data without directly interacting with the target:
- WHOIS lookup — find domain owner, registrar, registration date, contact emails
- DNS enumeration — A, AAAA, MX, NS, TXT, CNAME records reveal hosting providers and mail services
- Google Dorking — use advanced search operators to find exposed files, login panels, and sensitive directories
- GitHub/GitLab searching — developers often accidentally commit API keys, credentials, or internal URLs
- Wayback Machine (archive.org) — view old versions of the site that may contain removed but cached endpoints
- SSL/TLS certificate inspection — certificates often list internal subdomains via Subject Alternative Names (SANs)
- Job postings — "We use React, Node.js, PostgreSQL, and AWS" is a technology fingerprint
- LinkedIn / social engineering recon — identify developers, admins, and tech stack from employee profiles

**Active Reconnaissance** — directly probing the target:
- Port scanning — identify open ports and services on the web server
- Service version detection — determine exact software versions (web server, CMS, frameworks)
- Banner grabbing — services often advertise their name and version on connection
- Technology fingerprinting — identify frontend frameworks, CMS, analytics, CDN, WAF

### Key tools

| Tool | Purpose |
|---|---|
| `theHarvester` | Collect emails, subdomains, IPs from public sources |
| `Amass` | Subdomain enumeration and DNS mapping |
| `Shodan` | Search engine for internet-connected devices and services |
| `Recon-ng` | Full-featured OSINT reconnaissance framework |
| `Maltego` | Visual relationship mapping of targets |
| `WhatWeb` | Technology fingerprinting |
| `Wappalyzer` | Browser extension for instant tech stack identification |
| `crt.sh` | Certificate transparency log search for subdomains |
| `Google Dorks` | `site:`, `filetype:`, `inurl:`, `intitle:` operators |
| `Wayback Machine` | Historical site snapshots |

### What you're building
By the end of this phase you should have: a full subdomain list, the server's technology stack, open ports and services, any exposed sensitive files or directories found via Google, and a list of email addresses / usernames associated with the target.

---

## Phase 2 — Application Mapping & Discovery

### What it is
Now you interact directly with the web application to map every piece of its attack surface. You are not exploiting anything yet — you are building a complete picture of every page, endpoint, parameter, form, and functionality the application has.

### What you do

**Spidering / crawling:**
- Run an automated spider to follow every link and discover every page
- Map all forms, their fields, and their submission methods (GET vs POST)
- Identify all input vectors — URL parameters, headers, cookies, JSON/XML bodies

**Directory and file bruteforcing:**
- Brute-force paths that aren't linked anywhere — `/admin`, `/backup`, `/config`, `.env`, `phpinfo.php`
- Use wordlists (SecLists) targeting the specific technology stack found in Phase 1
- Look for backup files: `index.php.bak`, `config.old`, `database.sql.gz`

**robots.txt and sitemap.xml:**
- `robots.txt` often lists directories the admin didn't want indexed — which is exactly what you want to look at
- `sitemap.xml` gives a full map of intended public URLs

**API discovery:**
- Find API endpoints: `/api/v1/`, `/api/v2/`, `/graphql`, `/swagger`, `/openapi.json`
- Check for exposed API documentation (`/swagger-ui`, `/api-docs`)
- Test both documented and undocumented endpoints

**Authentication surface:**
- Identify all login pages, registration forms, password reset flows, OAuth endpoints, and SSO providers
- Note which endpoints require authentication and which don't

**Technology-specific checks:**
- If WordPress: check `/wp-admin`, `/wp-json/wp/v2/users`, `xmlrpc.php`
- If Django/Laravel/Rails: check for debug pages, admin panels, default routes
- If GraphQL: check for introspection being enabled (`__schema` query)

### Key tools

| Tool | Purpose |
|---|---|
| `Burp Suite` | Intercept proxy, spider, scanner — the primary web pentesting platform |
| `OWASP ZAP` | Free alternative to Burp — spider, active scan, API testing |
| `Gobuster` / `Feroxbuster` | Fast directory and file brute-forcing |
| `ffuf` | Flexible fuzzer for directories, parameters, virtual hosts |
| `Nikto` | Quick web server misconfiguration and version scanner |
| `Arjun` | HTTP parameter discovery tool |
| `SecLists` | The gold-standard wordlist collection for all brute-forcing |
| `hakrawler` | Fast web crawler optimised for bug bounty recon |

---

## Phase 3 — Authentication & Session Testing

### What it is
Authentication is the gateway to every protected function in a web application. Session management is how the application remembers who you are after you log in. Flaws here lead directly to account takeover.

### What you test

**Login mechanism:**
- Username enumeration — do error messages differ between "user doesn't exist" and "wrong password"?
- Rate limiting — is there a lockout after N failed attempts, or can you brute-force infinitely?
- Default credentials — `admin/admin`, `admin/password`, `test/test`
- Password policy — does the application allow weak passwords like `123456`?

**Password reset flow:**
- Is the reset token long, random, and single-use?
- Does the reset link expire quickly?
- Host header injection in reset emails — can you steal reset tokens by manipulating the Host header?
- Security question bypass — are questions predictable or publicly known?

**Multi-factor authentication (MFA):**
- Can you skip the MFA step by directly accessing a post-login URL?
- Are OTP codes rate-limited or can they be brute-forced?
- Is there a backup code mechanism and how is it protected?

**Session management:**
- Are session tokens long (128+ bits), random, and unpredictable?
- Are tokens invalidated server-side after logout?
- Is the session cookie marked `HttpOnly`, `Secure`, and `SameSite`?
- Session fixation — can an attacker set a known session ID before login?
- Concurrent session handling — can the same account be logged in from multiple places?

**OAuth / SSO testing:**
- Redirect URI validation — can the `redirect_uri` parameter be modified to an attacker-controlled domain?
- State parameter — is it present and validated? (prevents CSRF in OAuth flow)
- Implicit flow misuse — is the access token exposed in the URL fragment?

### Key tools

| Tool | Purpose |
|---|---|
| `Burp Suite Intruder` | Brute-force login forms, fuzz parameters |
| `Hydra` | Network login brute-forcer (HTTP forms, Basic Auth) |
| `jwt_tool` | Decode, tamper, and attack JSON Web Tokens |
| `oauth2-toolkit (Burp extension)` | Test OAuth flows |
| `Burp Session Tracer` | Analyse session token randomness |

---

## Phase 4 — Authorisation & Access Control Testing

### What it is
Even after a user is authenticated (proven who they are), the application must correctly enforce what they are *allowed to do*. Broken access control is the #1 vulnerability class in the OWASP Top 10.

### What you test

**Horizontal privilege escalation (IDOR):**
- Can User A access User B's data by changing an ID in the URL?
- `GET /api/orders/1234` — change `1234` to `1235` — whose order do you see?
- Test GUIDs, numeric IDs, usernames, and email addresses as object references

**Vertical privilege escalation:**
- Can a regular user access admin functionality?
- Force-browse to `/admin`, `/dashboard/settings`, `/api/admin/users`
- Change a parameter like `role=user` to `role=admin` in a request body

**Function-level access control:**
- Are HTTP methods properly restricted? Can you `DELETE /api/users/123` as a regular user?
- Does the application only hide admin buttons in the UI, or does it actually enforce access on the server?
- Can you access restricted API endpoints that are not linked in the UI?

**Insecure Direct Object References:**
- File downloads: `?file=report_user123.pdf` — change to another user's filename
- Profile pictures: `/uploads/user_456/photo.jpg` — is directory listing enabled?
- Database record access via predictable IDs in any parameter

### Key tools

| Tool | Purpose |
|---|---|
| `Burp Suite` (manual) | Intercept and modify requests to test access control |
| `Autorize (Burp extension)` | Automatically test endpoints with lower-privileged session |
| `ffuf` | Fuzz object IDs at scale |
| `Burp Repeater` | Replay individual requests with modified parameters |

---

## Phase 5 — Input Validation Testing

### What it is
Every place the application accepts user input is a potential injection point. This phase tests whether the application correctly validates, sanitises, and escapes all input before using it in databases, HTML output, system commands, or other interpreters.

### What you test

**SQL Injection:**
- Test every input field, URL parameter, cookie, and header for SQLi
- Error-based, blind boolean-based, time-based blind, and out-of-band SQLi
- Classic test: append `'` or `"` and observe the error response
- Check for second-order SQLi (data stored then used in a later query)

**Cross-Site Scripting (XSS):**
- **Reflected XSS** — payload is in the request and reflected in the response
- **Stored XSS** — payload is saved (comments, profiles) and executed when viewed by others
- **DOM-based XSS** — payload is processed by client-side JavaScript without hitting the server
- Test in: search fields, comment boxes, profile fields, URL parameters, HTTP headers, JSON values

**XML / XXE Injection:**
- If the application parses XML, send an XML External Entity (XXE) payload
- Test for file read: `<!ENTITY xxe SYSTEM "file:///etc/passwd">`
- Test for SSRF via XXE: `<!ENTITY xxe SYSTEM "http://internal-server/">`

**Command Injection:**
- Test any input that might be passed to a system command: filenames, IP addresses, hostnames
- Payloads: `; id`, `| whoami`, `` `id` ``, `$(id)`

**SSTI (Server-Side Template Injection):**
- Test template syntax in input fields: `{{7*7}}`, `${7*7}`, `<%= 7*7 %>`
- If the application returns `49`, template injection is confirmed
- Can lead to Remote Code Execution

**Path Traversal / LFI:**
- Test file parameters: `?page=about` → `?page=../../../../etc/passwd`
- Look for file inclusion in: `include`, `require`, `page`, `file`, `path`, `doc` parameters

**LDAP / NoSQL / XPath Injection:**
- For LDAP: `*)(uid=*))(|(uid=*`
- For MongoDB: `{"username": {"$gt": ""}, "password": {"$gt": ""}}`
- For XPath: `' or '1'='1`

### Key tools

| Tool | Purpose |
|---|---|
| `sqlmap` | Automated SQL injection detection and exploitation |
| `Burp Suite Scanner` | Active scanning for XSS, SQLi, XXE, and more |
| `XSStrike` | Advanced XSS detection and exploitation |
| `ffuf` | Fuzz any parameter with injection payloads |
| `commix` | Automated command injection testing |
| `tplmap` | Server-Side Template Injection detection |
| `PayloadsAllTheThings` | GitHub repo — massive injection payload library |

---

## Phase 6 — Business Logic Testing

### What it is
Business logic vulnerabilities are flaws in the *design* of application workflows that allow users to misuse legitimate functionality in unintended ways. No automated scanner finds these — they require a human tester who understands what the application is supposed to do.

### What you test

**Workflow bypass:**
- Can you skip steps in a multi-step process? (e.g. go directly from Step 1 to Step 3 in checkout)
- Can you complete a purchase without payment by replaying a payment confirmation?
- Can you apply a discount coupon multiple times?

**Negative values and boundary conditions:**
- Enter negative quantities: `-1` item in a cart — does your balance increase?
- Enter extremely large numbers: does integer overflow occur?
- Enter zero: `price=0`, `quantity=0`

**Race conditions:**
- Make the same API request concurrently (10+ threads at the same time)
- Classic example: two simultaneous withdrawal requests on a balance of £100 — does the application pay out £200?
- Coupon codes, loyalty points, referral bonuses — all prime targets

**Price/value tampering:**
- Intercept a checkout request and modify the price field
- Change the currency or unit
- Manipulate hidden form fields that affect pricing

**Account / privilege boundary:**
- Can a free-tier user access paid features?
- Can you purchase an item and then modify the order after payment?
- Can you access another tenant's data in a multi-tenant SaaS application?

### Key tools

| Tool | Purpose |
|---|---|
| `Burp Suite Repeater` | Manually replay and modify requests |
| `Burp Suite Intruder` | Fuzz numeric and logic parameters |
| `Turbo Intruder (Burp extension)` | High-speed concurrent requests for race condition testing |
| Manual analysis | Understanding the application's intended behaviour |

---

## Phase 7 — Error Handling & Information Disclosure Testing

### What it is
Applications that reveal too much information in error messages, HTTP headers, or responses give attackers a map of their internals — technology stack, file paths, usernames, SQL queries, and more.

### What you test

**Error messages:**
- Trigger errors deliberately: invalid inputs, SQL syntax, malformed JSON, very long strings
- Do error pages show stack traces, file paths, or database queries?
- Is the framework/version revealed in error pages?

**HTTP headers:**
- `Server: Apache/2.4.41 (Ubuntu)` — reveals exact version, check for CVEs
- `X-Powered-By: PHP/7.4.3` — reveals backend language and version
- `X-AspNet-Version` — reveals ASP.NET version

**Source code and comments:**
- View page source — are there commented-out credentials, internal URLs, or debug notes?
- Check JavaScript files — are API keys, internal endpoints, or logic exposed?
- `.git` folder exposed — `/.git/config`, `/.git/HEAD` — entire source code can be recovered

**Sensitive file exposure:**
- `.env` files, `config.php`, `database.yml`, `wp-config.php`
- Backup files: `.bak`, `.old`, `.orig`, `.swp`
- Log files: `/logs/`, `/var/log/`, `error.log`, `access.log`

**Directory listing:**
- If a directory has no `index.html`, does the server list its contents?
- Check all directories discovered in Phase 2

### Key tools

| Tool | Purpose |
|---|---|
| `Burp Suite` | Intercept all responses and inspect headers |
| `Nikto` | Scan for common information disclosure issues |
| `git-dumper` | Recover source code from exposed `.git` directories |
| `truffleHog` / `gitleaks` | Scan for secrets in Git history |
| `curl -I` | Quick HTTP header inspection |

---

## Phase 8 — Transport Security Testing

### What it is
Transport security testing ensures that all data between the browser and the server is encrypted properly and that the implementation of TLS is not weak or misconfigured.

### What you test

**TLS configuration:**
- Is HTTPS enforced across the entire application?
- Is HTTP automatically redirected to HTTPS?
- Are weak protocols supported? (TLS 1.0, TLS 1.1, SSLv3 — all broken)
- Are weak cipher suites enabled? (RC4, DES, 3DES, EXPORT ciphers)
- Is the certificate valid, trusted, and not expired?
- Does the certificate expire soon? (less than 30 days)

**HSTS (HTTP Strict Transport Security):**
- Is the `Strict-Transport-Security` header present?
- Is `max-age` set to at least 1 year (31536000)?
- Is `includeSubDomains` set?
- Is the site on the HSTS preload list?

**Mixed content:**
- Does an HTTPS page load any resources (images, scripts, fonts) over HTTP?
- Mixed content allows a network attacker to modify those HTTP resources

**Cookie security:**
- Are session cookies marked with the `Secure` flag? (prevents transmission over HTTP)
- Are cookies marked `HttpOnly`? (prevents JavaScript access)
- Is `SameSite=Strict` or `SameSite=Lax` set? (prevents CSRF)

### Key tools

| Tool | Purpose |
|---|---|
| `SSLyze` | Deep TLS configuration analysis |
| `testssl.sh` | Comprehensive command-line TLS tester |
| `SSL Labs (ssllabs.com)` | Online A–F graded TLS report |
| `Burp Suite` | Inspect certificate and cookie flags |
| `curl` | Manual header and certificate inspection |

---

## Phase 9 — Client-Side Testing

### What it is
Modern web applications do significant work in the browser using JavaScript. Client-side testing examines the security of code running in the user's browser and the trust boundaries between client and server.

### What you test

**JavaScript analysis:**
- Review all JS files for hardcoded API keys, tokens, secrets, or internal URLs
- Identify client-side input validation that is not also enforced server-side
- Look for `eval()`, `innerHTML`, `document.write()` — common sources of DOM XSS
- Check for postMessage handlers that don't validate the origin

**CORS (Cross-Origin Resource Sharing):**
- Is `Access-Control-Allow-Origin: *` set on authenticated endpoints?
- Can an attacker's origin be reflected in `Access-Control-Allow-Origin`?
- Is `Access-Control-Allow-Credentials: true` combined with a wildcard or reflected origin?
- If so: any website can make authenticated API calls on behalf of a logged-in user

**Clickjacking:**
- Is the `X-Frame-Options` header missing?
- Can the page be embedded in an `<iframe>` on an attacker's site?
- Is `Content-Security-Policy: frame-ancestors` configured?

**CSP (Content Security Policy):**
- Is a CSP header present?
- Does it use `unsafe-inline` or `unsafe-eval`? (defeats the purpose)
- Are there wildcards (`*`) in script-src or style-src?
- Can the CSP be bypassed using trusted third-party domains?

**localStorage / sessionStorage:**
- Are sensitive tokens (JWT, session IDs) stored in localStorage? (XSS can steal them)
- Sensitive data should be in `HttpOnly` cookies, not accessible to JavaScript

**Subresource Integrity (SRI):**
- Do script tags loading from CDNs include `integrity` attributes?
- Without SRI, a compromised CDN can serve malicious JavaScript to your users

### Key tools

| Tool | Purpose |
|---|---|
| `Burp Suite` | Intercept, analyse all traffic including CORS headers |
| `Browser DevTools` | Inspect JS, localStorage, cookies, network requests |
| `retire.js` | Detect vulnerable JavaScript libraries |
| `CSP Evaluator (Google)` | Analyse CSP header strength |
| `Clickjacker (tool)` | Test for clickjacking |
| `LinkFinder` | Extract endpoints from JavaScript files |
| `JSParser` | Parse JS files for hidden API endpoints |

---

## Phase 10 — Final Report Writing

### What it is
The report is the most important deliverable of the entire engagement. A technical finding no one can read or act on is worthless. A professional report is written for two audiences simultaneously: executives (who need to understand risk) and developers (who need to understand how to fix it).

### Professional report structure

```
┌─────────────────────────────────────────┐
│  1. EXECUTIVE SUMMARY                   │
│     • Overall risk rating               │
│     • Business impact in plain language │
│     • Top 3 findings summary            │
│     • Recommended immediate actions     │
├─────────────────────────────────────────┤
│  2. SCOPE & METHODOLOGY                 │
│     • What was tested (URLs, features)  │
│     • What was NOT tested               │
│     • Testing type: black/grey/white    │
│     • Testing period and environment    │
│     • Tools used                        │
├─────────────────────────────────────────┤
│  3. FINDINGS (one section per vuln)     │
│     • Title                             │
│     • Severity: Critical/High/Med/Low   │
│     • CVSS Score (0–10)                 │
│     • CWE / CVE reference               │
│     • Description — what is it?         │
│     • Steps to reproduce (numbered)     │
│     • Evidence (screenshots, requests)  │
│     • Impact — what can an attacker do? │
│     • Recommendation — how to fix it    │
│     • OWASP Top 10 reference            │
├─────────────────────────────────────────┤
│  4. RISK MATRIX                         │
│     Likelihood × Impact grid            │
│     All findings plotted visually       │
├─────────────────────────────────────────┤
│  5. REMEDIATION ROADMAP                 │
│     Critical → fix within 24–48 hours  │
│     High     → fix within 1 week       │
│     Medium   → fix within 1 month      │
│     Low      → fix in next sprint      │
├─────────────────────────────────────────┤
│  6. APPENDICES                          │
│     • Raw Burp Suite logs               │
│     • Full tool output                  │
│     • Glossary of terms                 │
└─────────────────────────────────────────┘
```

### CVSS Severity Scale

| CVSS Score | Severity | Typical SLA to Fix |
|---|---|---|
| 9.0 – 10.0 | Critical | 24–48 hours |
| 7.0 – 8.9 | High | 1 week |
| 4.0 – 6.9 | Medium | 1 month |
| 0.1 – 3.9 | Low | Next sprint |
| 0.0 | Informational | At discretion |

### Writing tips
- Write finding descriptions as if the reader has never heard of the vulnerability
- Every finding must have reproduction steps clear enough that a developer can replicate it themselves
- Screenshots and raw HTTP request/response pairs are mandatory evidence
- Never report a vulnerability without a fix recommendation
- Proof-of-concept exploits should demonstrate impact, not cause actual damage

---

## Web Application Pentesting Toolkit Summary

| Category | Tool | Free? |
|---|---|---|
| Proxy / Core platform | Burp Suite Community | Yes |
| Proxy / Core platform | Burp Suite Pro | No (£399/yr) |
| Proxy / Core platform | OWASP ZAP | Yes |
| Recon | theHarvester, Amass, Shodan | Yes |
| Directory brute force | Gobuster, Feroxbuster, ffuf | Yes |
| SQLi | sqlmap | Yes |
| XSS | XSStrike, DalFox | Yes |
| TLS testing | SSLyze, testssl.sh | Yes |
| Wordlists | SecLists | Yes |
| All-in-one lab | DVWA, HackTheBox, TryHackMe | Free / Paid |

---

## Practice Labs (Legal Targets)

| Platform | What you learn |
|---|---|
| **DVWA** (Damn Vulnerable Web App) | All OWASP Top 10 vulnerabilities in a local lab |
| **WebGoat** (OWASP) | Guided interactive web vulnerability lessons |
| **HackTheBox** | Real-world style machines and web challenges |
| **TryHackMe** | Beginner-friendly guided web pentesting rooms |
| **PortSwigger Web Academy** | Free, world-class labs for every web vulnerability |
| **PicoCTF** | CTF challenges including web exploitation |
| **VulnHub** | Downloadable vulnerable VMs for offline practice |

