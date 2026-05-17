# A01 — Broken Access Control

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-200, CWE-284, CWE-285, CWE-639

---

### What it is
Access control enforces that users can only perform actions and access data that they are permitted to. Broken access control means the application fails to enforce these restrictions — either horizontally (accessing another user's data) or vertically (accessing higher-privilege functionality).


### Why it happens
- Developers assume the UI hides the functionality, so they don't enforce it on the server
- Access control logic is checked at the front end (JavaScript) but not the back end (API)
- Object references (IDs) are predictable and not tied to the authenticated user's session
- HTTP methods (PUT, DELETE, PATCH) are not restricted per user role

### Attack types

**IDOR — Insecure Direct Object Reference (Horizontal Privilege Escalation):**
A user can access another user's resources by modifying an identifier in the request.

```
# Logged in as User A (ID: 100)
GET /api/invoices/100       → Returns User A's invoice (correct)
GET /api/invoices/101       → Returns User B's invoice (IDOR vulnerability)

# File download IDOR
GET /download?file=report_user100.pdf
GET /download?file=report_user101.pdf   → Another user's report
```

**Vertical Privilege Escalation:**
A low-privileged user accesses admin functionality.

```
# Regular user force-browsing admin endpoints
GET /admin/users            → Should be blocked, but isn't
POST /api/admin/delete-user → Should require admin role

# Role parameter tampering
POST /api/settings
{"role": "user"}   → normal
{"role": "admin"}  → escalated privilege
```

**Method-based access control bypass:**
```
# DELETE is not restricted even when GET is
GET  /api/users/123         → 403 Forbidden (correct)
DELETE /api/users/123       → 200 OK (broken access control)
```

### How to test for it

1. Log in as a low-privileged user and note your account IDs, object references
2. Try accessing another user's objects by incrementing/decrementing IDs
3. Try force-browsing admin URLs found during recon (`/admin`, `/dashboard/users`)
4. Change HTTP methods on restricted endpoints
5. Modify role/permission parameters in request bodies
6. Use Burp Suite to capture requests as Admin, replay them with a normal user's session cookie

### Tools

| Tool | How to use it |
|---|---|
| `Burp Suite` | Capture requests as admin, replay with low-priv session |
| `Autorize (Burp extension)` | Automatically re-tests every request with a lower session token |
| `ffuf` | Fuzz numeric IDs in object references at speed |
| `Burp Repeater` | Manually modify and replay individual requests |
| `OWASP Testing Guide A01` | Checklist of all access control test cases |

### How to fix it

- Enforce access control on the **server side** for every request — never rely on the UI
- Deny all access by default; grant explicitly
- Tie every object reference to the authenticated user's session (e.g. `WHERE user_id = session.user_id`)
- Log all access control failures and alert on high volume
- Implement automated tests that verify access control boundaries per role

---
