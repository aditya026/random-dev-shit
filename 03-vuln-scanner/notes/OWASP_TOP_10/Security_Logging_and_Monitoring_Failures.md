# A09 — Security Logging and Monitoring Failures

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-117, CWE-223, CWE-532, CWE-778

---

### What it is
Security logging and monitoring failures mean that when an attack occurs, there is either no record of it, the records aren't monitored, or the alerting is too slow to be useful. This doesn't allow an attacker to get in — but it ensures they can stay in for months without detection.

The industry average time to detect a breach is **207 days**. Logging failures are why.

### Why it happens
- Logging is treated as an afterthought, not a security requirement
- Logs are stored on the same server being attacked (easily wiped)
- No one is actively monitoring the logs (they're only checked after an incident)
- Logs contain insufficient detail to reconstruct what happened
- Logging of security events is not standardised across the application

### What should be logged (but often isn't)

```
Authentication events:
✓ Every failed login (user, IP, timestamp)
✓ Every successful login (user, IP, timestamp, session ID)
✓ Account lockout events
✓ Password change and reset requests
✓ MFA failures and bypasses

Access control events:
✓ Access denied errors (403 responses)
✓ Attempts to access admin functionality by non-admin users
✓ Unusual data access volumes (user downloading 10,000 records)

Input validation failures:
✓ SQLi and XSS payloads detected in input
✓ Schema validation failures on API input

Application errors:
✓ Unhandled exceptions (without exposing stack traces to users)
✓ Invalid API requests
```

### How to test for it

```
1. Perform an obvious attack (wrong password 10 times, SQLi attempt)
2. Ask: Was this logged? Was anyone alerted?

3. Check log storage location — are logs on the web server?
   (If the server is compromised, the attacker can wipe them)

4. Check if log entries include sufficient detail:
   - Timestamp (UTC)
   - User identifier
   - Source IP address
   - Action performed
   - Outcome (success/fail)

5. Attempt log injection:
   # If user input reaches log files without sanitisation:
   username = admin\nINFO 2024-01-01 User 'admin' logged in successfully
   # Attacker injects fake log entries to cover their tracks

6. Check if logs are transmitted to a centralised system (SIEM)
   or stored only locally on the application server
```

### Tools

| Tool | How to use it |
|---|---|
| `Burp Suite` | Generate security events (attack traffic) to test logging |
| `Wazuh` | Free open-source SIEM — collect and alert on logs |
| `ELK Stack` | Elasticsearch, Logstash, Kibana — log aggregation and dashboards |
| `Splunk` | Enterprise SIEM with powerful querying |
| `Graylog` | Centralised log management |
| `OWASP AppSensor` | Application-level intrusion detection |

### How to fix it

- Log all security-relevant events with: who, what, when, from where, result
- Store logs centrally and off the application server (so attackers can't wipe them)
- Implement real-time alerting on high-severity events (10 failed logins, SQLi patterns)
- Protect log integrity — use append-only storage, sign log entries
- Sanitise user input before logging to prevent log injection
- Define and enforce a log retention policy (minimum 90 days, often 1 year for compliance)
- Conduct regular log review exercises — don't wait for an incident

---
