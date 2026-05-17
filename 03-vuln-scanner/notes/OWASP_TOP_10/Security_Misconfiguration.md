# A05 — Security Misconfiguration

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-16, CWE-611

---

### What it is
Security misconfiguration is the most commonly found vulnerability. It happens when security settings are not properly defined, implemented, or maintained. This includes default credentials, unnecessary features, verbose error messages, missing security headers, and open cloud storage.

### Why it happens
- Developers focus on functionality, not security hardening
- Default configurations are left unchanged
- Cloud resources are deployed without access controls
- Security headers are never added
- Debugging features are left enabled in production

### Attack types

**Default credentials:**
```
Common defaults to always test:
admin / admin
admin / password
admin / 123456
root / root
guest / guest
test / test
administrator / administrator

# Default credentials databases
https://www.defaultpassword.com
```

**Exposed debug and admin interfaces:**
```
/phpmyadmin          → Database management (often public)
/wp-admin            → WordPress admin
/.git/               → Entire source code exposed
/actuator            → Spring Boot metrics and sensitive data
/console             → Drupal/Rails/Django debug console
/server-status       → Apache server status page
phpinfo.php          → Full PHP configuration dump
/swagger-ui          → Exposed API documentation with live testing
```

**Exposed cloud storage:**
```
# AWS S3 bucket misconfiguration
https://bucket-name.s3.amazonaws.com/
# If publicly readable: lists all files in the bucket

# Testing with AWS CLI
aws s3 ls s3://bucket-name --no-sign-request
aws s3 cp s3://bucket-name/sensitive.pdf . --no-sign-request
```

**Missing security headers:**
```
# Critical headers that should be present on every response:
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### How to test for it

```bash
# Check HTTP security headers
curl -I https://target.com

# Test for common admin paths
gobuster dir -u https://target.com -w /usr/share/seclists/Discovery/Web-Content/common.txt

# Test for .git exposure
curl https://target.com/.git/HEAD

# Test for phpinfo
curl https://target.com/phpinfo.php

# Nmap for default credentials on web services
nmap --script http-default-accounts -p 80,443,8080 target.com

# Check for S3 misconfiguration
aws s3 ls s3://target-company-backup --no-sign-request
```

### Tools

| Tool | How to use it |
|---|---|
| `Nikto` | Comprehensive misconfiguration and default file scanner |
| `Gobuster` / `ffuf` | Find hidden admin panels and exposed files |
| `SecurityHeaders.com` | Online check for all security headers |
| `Burp Suite` | Inspect all response headers |
| `git-dumper` | Recover source code from exposed `.git` |
| `S3Scanner` | Scan for misconfigured S3 buckets |
| `Nuclei` | Template-based scanner with thousands of misconfiguration checks |

### How to fix it

- Maintain a **hardened baseline configuration** for every component
- Remove all default credentials and accounts immediately after setup
- Disable directory listing on all web servers
- Enable all security headers using a library or middleware
- Implement a WAF (Web Application Firewall)
- Use Infrastructure as Code (IaC) with security checks baked in
- Run automated misconfiguration scans as part of CI/CD

---

