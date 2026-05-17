# A02 — Cryptographic Failures

**CVSS Range:** Up to 9.1 (Critical)
**CWE References:** CWE-259, CWE-327, CWE-331

---

### What it is
Previously named "Sensitive Data Exposure." This risk covers failures in cryptography that lead to exposure of sensitive data — passwords, credit card numbers, health records, session tokens, and personal data. The failure is not always weak encryption; sometimes there is no encryption at all.

### Why it happens
- Developers use outdated or weak algorithms (MD5, SHA1, DES, RC4)
- Data is transmitted over HTTP instead of HTTPS
- Passwords are stored as plain text or with unsalted hashes
- Encryption keys are hardcoded in source code or committed to Git
- TLS is configured with deprecated protocol versions or weak cipher suites

### Attack types

**Password cracking (weak hashing):**
```
# MD5 hash of "password123"
5f4dcc3b5aa765d61d8327deb882cf99
# Cracked instantly with a rainbow table

# bcrypt hash of "password123"
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeA4hzjF/3nS3hEe2
# Not crackable in reasonable time
```

**Sensitive data in transit:**
- Sniff HTTP traffic with Wireshark — credentials, session cookies visible in plaintext
- Intercept mobile app traffic using Burp — if the app doesn't pin certificates, all traffic is readable

**Weak TLS configuration:**
- Server supports TLS 1.0/1.1 — vulnerable to BEAST, POODLE attacks
- Server accepts RC4 cipher — stream cipher with known biases
- Server uses self-signed or expired certificate

### How to test for it

1. Check all login and data submission forms — are they served over HTTPS?
2. Inspect HTTP headers for `Strict-Transport-Security`
3. Test TLS configuration with `testssl.sh` or SSL Labs
4. Look for passwords in source code, config files, `.env`, Git history
5. Check what hashing algorithm is used for passwords (check database if accessible)
6. Inspect cookies for `Secure` and `HttpOnly` flags
7. Check if sensitive data appears in URL parameters (logged in server logs)
8. Test for HTTP downgrade: access `http://` version of the site — does it redirect?

```bash
# Test TLS configuration
testssl.sh https://target.com

# Check what cipher suites are accepted
nmap --script ssl-enum-ciphers -p 443 target.com

# Inspect certificate
openssl s_client -connect target.com:443
```

### Tools

| Tool | How to use it |
|---|---|
| `testssl.sh` | Full TLS configuration analysis from command line |
| `SSLyze` | Python-based TLS scanner, great for automation |
| `SSL Labs` | Online graded TLS report (ssllabs.com/ssltest) |
| `Wireshark` | Capture and inspect unencrypted traffic |
| `Burp Suite` | Intercept HTTPS, inspect cookies and headers |
| `truffleHog` | Scan Git repos for committed secrets and keys |
| `Hashcat` | Crack recovered password hashes offline |

### How to fix it

- Use TLS 1.2 or TLS 1.3 everywhere — disable TLS 1.0 and 1.1
- Hash passwords with `bcrypt`, `scrypt`, or `argon2` — never MD5 or SHA1
- Never store sensitive data in plaintext — encrypt at rest using AES-256
- Mark all session cookies as `Secure`, `HttpOnly`, and `SameSite=Strict`
- Never put sensitive data in URL parameters
- Store encryption keys in a secrets manager (AWS Secrets Manager, HashiCorp Vault)

---
