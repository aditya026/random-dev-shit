# A04 — Insecure Design

**CVSS Range:** Variable (depends on flaw)
**CWE References:** CWE-209, CWE-256, CWE-501, CWE-522

---

### What it is
A new category introduced in 2021. Insecure design is different from insecure implementation — it means the security flaw is in the *architecture or design* of the application, not just a coding mistake. No amount of correct implementation can fix a fundamentally broken design.

### Why it happens
- Security is not considered during the design and planning phase
- No threat modelling is done before development starts
- Business pressure leads to shortcuts in security architecture
- Developers design flows assuming users will behave honestly

### Real-world examples

**Broken password reset flow:**
```
Insecure: Reset link = /reset?token=base64(username+timestamp)
         → Predictable, not random, can be forged

Insecure: Security questions ("What is your mother's maiden name?")
         → Publicly knowable from social media

Secure:   Cryptographically random 256-bit token, single-use, expires in 15 minutes
```

**Unlimited resource access:**
```
Insecure: No rate limit on SMS OTP requests
         → Attacker can request 1000 OTPs to an arbitrary phone number (SMS bombing)

Insecure: No limit on failed payment attempts
         → Card testing attacks — try thousands of stolen cards silently

Secure:   Rate limiting, CAPTCHA after N failures, alerts on anomalous patterns
```

**Missing segregation of privilege:**
```
Insecure: Single API key for all operations (read, write, delete, admin)
         → If key is leaked, everything is compromised

Secure:   Separate read-only and write API keys, scoped OAuth tokens
```

### How to test for it

This requires **manual analysis and creativity** — no automated scanner detects design flaws.

1. Map out every multi-step workflow (registration, checkout, password reset, MFA enrollment)
2. Try to skip steps by jumping directly to later steps
3. Try to repeat steps that should only happen once (replay payment confirmation, reuse one-time tokens)
4. Test all numeric boundaries — negative quantities, zero, extremely large values
5. Try to use the same coupon, discount, or referral link multiple times
6. Test concurrent requests (race conditions) for critical operations

```
# Race condition test with Turbo Intruder (Burp)
# Send 50 simultaneous requests to redeem a one-time coupon code
# If 2+ succeed, race condition confirmed

# Workflow bypass test
# Normal: Step 1 → Step 2 → Step 3 → Confirmation
# Attack: Go directly to Step 3 URL — does it require Step 1 and 2 to be completed?
```

### Tools

| Tool | How to use it |
|---|---|
| `Burp Suite Repeater` | Manually replay and modify workflow requests |
| `Turbo Intruder` | Send hundreds of concurrent requests to test race conditions |
| Manual analysis | Review application flows and logic for design weaknesses |
| `OWASP ASVS` | Application Security Verification Standard — design checklist |

### How to fix it

- **Threat model** before writing code — ask "how could this be abused?"
- Use **secure design patterns** (separation of privilege, least privilege, fail-safe defaults)
- Implement business logic constraints server-side (not just client-side)
- Rate-limit all sensitive operations (logins, OTPs, resets, payments)
- Make one-time tokens actually one-time — invalidate on use
- Conduct security architecture reviews before development begins

---

