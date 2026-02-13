# JS Faker Purple Team Test Kit
## Drive-by Download & Malicious JS Simulation

### Overview
This kit contains **5 benign JavaScript samples** and a **landing page** that simulate
common malicious JS threats delivered via browser-based drive-by downloads. Everything is
inert — no real malware, no real C2, no real credential capture.

**All network endpoints point to `127.0.0.1:65535` (localhost, unreachable port).**

---

### Files

| File | Simulates | MITRE ATT&CK |
|------|-----------|---------------|
| `sample1_obfuscated_dropper.js` | Obfuscated JS dropper with eval(), base64, env fingerprinting | T1027, T1059.007 |
| `sample2_credential_harvester.js` | Keylogger + form interceptor + clipboard monitor | T1056.001, T1056.004 |
| `sample3_cryptominer_sim.js` | Browser-based cryptominer with WebWorkers + stratum pool | T1496 |
| `sample4_exploit_kit_landing.js` | Exploit kit profiling, plugin enum, VM detection, iframe injection | T1189, T1203 |
| `sample5_c2_beacon.js` | C2 implant with beaconing, jitter, DoH, image exfil | T1071.001, T1132, T1573 |
| `landing_page.html` | Social engineering lure (fake browser update page) | T1189, T1204.002 |

---

### Deployment

#### Quick Test (Internal)
1. Host all files on any HTTP server your team controls:
   ```bash
   cd js-faker-tests/
   python3 -m http.server 8080
   # Or use nginx, Apache, Caddy, etc.
   ```
2. Access `http://your-server:8080/landing_page.html` from a corporate browser
3. Attempt to download each sample

#### External Hosting (Realistic)
For realistic testing, host on an external server (VPS, cloud instance, etc.):

1. Upload all files to an external web server
2. Optionally register a suspicious-looking domain (e.g., `js-update-security.com`)
3. Configure HTTPS (some controls only inspect HTTP)
4. Send the URL to test users via email/Slack for phishing awareness testing
5. Monitor your security stack for detections

#### Aggressive Testing (Optional)
Uncomment the auto-download script block in `landing_page.html` (lines 150-159)
to simulate automatic drive-by downloads without user interaction.

---

### What to Validate

#### Browser Controls
- [ ] SmartScreen / Safe Browsing blocks the landing page
- [ ] SmartScreen / Safe Browsing blocks .js file downloads
- [ ] Browser warns about downloaded .js files
- [ ] Pop-up/redirect blocking works (if auto-download is enabled)

#### Proxy / Secure Web Gateway (SWG)
- [ ] URL categorization flags the landing page as malicious/suspicious
- [ ] Content inspection detects suspicious JS patterns (eval, base64, obfuscation)
- [ ] SSL inspection catches HTTPS-hosted variants
- [ ] File type policy blocks .js downloads from uncategorized sites

#### EDR / Endpoint Protection
- [ ] Downloaded .js files flagged as suspicious
- [ ] Execution of .js files via wscript/cscript/node is blocked or alerted
- [ ] Behavioral detection catches keylogger/beacon patterns if files are opened in browser

#### Network Detection (NDR/IDS)
- [ ] Periodic beaconing pattern detected (Sample 5)
- [ ] WebSocket to mining pool pattern detected (Sample 3)
- [ ] DNS-over-HTTPS exfil attempt detected (Sample 5)
- [ ] Suspicious POST with encoded payloads detected

#### SIEM Correlation
- [ ] Alert: External JS download from uncategorized domain
- [ ] Alert: User visited page with known EK patterns
- [ ] Alert: Multiple suspicious downloads in short timeframe
- [ ] Correlation: Phishing email → landing page visit → JS download chain

#### User Awareness
- [ ] Users report the fake update page via phishing report button
- [ ] Users do not download/execute the files
- [ ] Users escalate to IT/Security

---

### Customization Tips

1. **Make it harder to detect**: Remove the `[PURPLE TEAM]` console.log lines
   and the bottom banner from the landing page for more realistic testing.
   Keep records of which artifacts are deployed for deconfliction.

2. **Add EICAR-like markers**: Some security tools have test signatures.
   Prepend `X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*`
   as a comment in the JS files to trigger AV specifically.

3. **Chain with email phishing**: Send the landing page URL via a test phishing
   email to validate the full kill chain (email → click → redirect → download).

4. **Test execution controls**: On Windows, rename .js files and try executing
   via `wscript.exe` or `cscript.exe` to test script execution policies.

5. **Vary hosting**: Test from IP-only URLs, newly registered domains, 
   URL shorteners, and cloud storage (S3, Azure Blob) to test different 
   categorization engines.

---

### Safety Notes

- All files are **completely benign** — no destructive or real malicious functionality
- All C2/exfil/pool URLs point to **127.0.0.1:65535** (localhost, dead port)
- All captured data is **redacted or fake** (no real keystrokes, credentials, etc.)
- Beacon loops **auto-terminate** after a small number of iterations
- No **persistence mechanisms** are installed
- No **real downloads or redirects** occur (URLs are constructed but not followed)

**Always coordinate with your SOC/Blue Team before deployment to avoid
unnecessary incident response. Use a shared exercise ID (e.g., PT-JSFAKER-2026)
for deconfliction.**

---

### Related MITRE ATT&CK Techniques

| ID | Technique | Covered By |
|----|-----------|------------|
| T1189 | Drive-by Compromise | Landing page, Sample 4 |
| T1204.002 | User Execution: Malicious File | All samples (download) |
| T1027 | Obfuscated Files or Information | Sample 1 |
| T1059.007 | Command and Scripting: JavaScript | All samples |
| T1056.001 | Input Capture: Keylogging | Sample 2 |
| T1056.004 | Input Capture: Web Portal Capture | Sample 2 |
| T1496 | Resource Hijacking | Sample 3 |
| T1203 | Exploitation for Client Execution | Sample 4 |
| T1071.001 | Application Layer Protocol: Web | Sample 5 |
| T1132 | Data Encoding | Sample 5 |
| T1573 | Encrypted Channel | Sample 5 (DoH) |
| T1082 | System Information Discovery | Samples 1, 4, 5 |
| T1497 | Virtualization/Sandbox Evasion | Sample 4 |
