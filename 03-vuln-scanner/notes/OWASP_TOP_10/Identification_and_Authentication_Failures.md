# A07 — Identification and Authentication Failures

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-297, CWE-287, CWE-384

---

### What it is
Previously called "Broken Authentication." This category covers all weaknesses in how the application verifies who a user is (authentication) and maintains that identity across requests (session management). Failures here lead directly to account takeover.

### Why it happens
- No rate limiting on login attempts
- Session tokens are predictable or not invalidated on logout
- Multi-factor authentication is absent or easily bypassed
- Password policies are too weak
- Insecure password reset mechanisms

### Attack types

**Credential brute force:**
```bash
# Brute-force HTTP login form with Hydra
hydra -L users.txt -P rockyou.txt target.com http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"

# Burp Suite Intruder — configure payload positions on password field
# Use Sniper mode with password wordlist
```

**Credential stuffing:**
```
# Using leaked username:password pairs from other breaches
# Sources: HaveIBeenPwned, Dehashed, breach databases

# Tool: Sentry MBA, OpenBullet, Burp Intruder
# Test 100,000 leaked credentials against target's login
# Success rate: often 0.1–2% (1,000 accounts if 100k tried)
```

**Session token analysis:**
```
# Collect 100 session tokens after 100 logins
# Analyse for patterns, entropy, and predictability
# Tool: Burp Sequencer — statistical token analysis

# Session fixation test:
# 1. Get a session token before login
# 2. Log in
# 3. Check if session token changes — if same token is used, vulnerable to fixation
```

**JWT (JSON Web Token) attacks:**
```
# Decode JWT (base64-encoded, 3 parts separated by .)
echo "eyJhbGciOiJIUzI1NiJ9" | base64 -d
→ {"alg":"HS256"}

# Algorithm confusion attack — change alg to "none"
{"alg": "none"} → Server accepts unsigned token

# Weak secret brute force
hashcat -a 0 -m 16500 eyJ...jwt.txt rockyou.txt

# jwt_tool attacks:
jwt_tool <token> -X a    # Algorithm confusion
jwt_tool <token> -C -d rockyou.txt  # Secret brute force
```

**MFA bypass:**
```
# Direct endpoint access bypass:
# 1. Log in, stop at MFA step
# 2. Try directly accessing /dashboard in a new tab
# 3. If accessible, MFA is not enforced server-side

# OTP brute force (if no rate limit):
# 6-digit OTP = 1,000,000 combinations
# At 100 req/s = ~3 hours (with no lockout)
```

### How to test for it

1. Test login form for rate limiting — send 100+ wrong passwords, check for lockout
2. Check if session token changes after login (session fixation)
3. Log out and try using the old session token — is it still valid?
4. Decode and analyse JWT tokens with `jwt_tool`
5. Test MFA step bypass by accessing post-login URLs before completing MFA
6. Check cookie attributes: `Secure`, `HttpOnly`, `SameSite`
7. Test password reset token predictability and expiry

### Tools

| Tool | How to use it |
|---|---|
| `Hydra` | Login form brute-forcing |
| `Burp Suite Intruder` | Custom brute-force and credential stuffing |
| `Burp Sequencer` | Statistical session token randomness analysis |
| `jwt_tool` | Decode, tamper, and attack JWT tokens |
| `ffuf` | Fast credential fuzzing |
| `HaveIBeenPwned API` | Check if credentials appear in breaches |
| `Turbo Intruder` | High-speed concurrent requests for race conditions |

### How to fix it

- Enforce MFA for all accounts, especially admin
- Implement rate limiting and account lockout (e.g. 10 failed attempts = 15-minute lockout)
- Invalidate session tokens server-side on logout
- Generate new session tokens after authentication (prevent fixation)
- Use long, random session tokens (minimum 128 bits)
- Check passwords at registration against the HaveIBeenPwned database
- Sign JWTs with strong algorithms (RS256, ES256) — never allow `alg: none`

---
