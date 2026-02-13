/**
 * PURPLE TEAM TEST ARTIFACT - SAMPLE 1
 * Name: Obfuscated Dropper Simulation
 * Purpose: Tests detection of obfuscated JS with eval(), base64 decode, 
 *          and suspicious string construction patterns.
 * Risk: NONE - All payloads are benign strings. No real execution occurs.
 * MITRE: T1027 (Obfuscated Files), T1059.007 (JavaScript)
 * 
 * Expected detections:
 *   - Browser: Download block / SmartScreen / Safe Browsing warning
 *   - Proxy/SWG: Malicious JS content inspection alert
 *   - EDR: Suspicious script content / eval usage
 *   - SIEM: Anomalous file download from external source
 */

// --- Stage 1: Obfuscated string construction (common in real droppers) ---
var _0x4a2f = ['\x68\x74\x74\x70', '\x3a\x2f\x2f', '\x65\x78\x61\x6d\x70\x6c\x65'];
var _0x3b1c = _0x4a2f[0] + _0x4a2f[1] + _0x4a2f[2]; // Resolves to "http://example"

// --- Stage 2: Base64-encoded "payload" (decodes to "PURPLE_TEAM_TEST_BENIGN_PAYLOAD") ---
var _encoded = 'UFVSUE9ORVRFQU1fVEVTVF9CRU5JR05fUEFZTE9BRA==';
var _decoded = (typeof atob !== 'undefined') ? atob(_encoded) : Buffer.from(_encoded, 'base64').toString();

// --- Stage 3: eval() usage with benign content (triggers heuristic detections) ---
var _stage3_payload = 'var test_result = "DETECTION_TEST_PASSED";';
eval(_stage3_payload);

// --- Stage 4: Simulated environment fingerprinting (all values discarded) ---
var _recon = {};
try {
    _recon.platform = (typeof navigator !== 'undefined') ? navigator.platform : 'node';
    _recon.language = (typeof navigator !== 'undefined') ? navigator.language : 'en';
    _recon.cores    = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 0;
    _recon.screen   = (typeof screen !== 'undefined') ? screen.width + 'x' + screen.height : 'N/A';
    _recon.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
} catch(e) {}

// --- Stage 5: Simulated XMLHttpRequest beacon (points to localhost, will fail safely) ---
try {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:65535/beacon', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        type: 'PURPLE_TEAM_TEST',
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        note: 'This is a benign detection test. No real data is exfiltrated.'
    }));
} catch(e) {}

// --- Stage 6: Dynamic function construction (another common obfuscation pattern) ---
var _func = new Function('return "PURPLE_TEAM_DYNAMIC_EXEC_TEST"');
var _result = _func();

// --- Stage 7: Simulated document.write injection (browser context only, benign) ---
if (typeof document !== 'undefined') {
    // Intentionally suspicious pattern: creating a script element dynamically
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.text = 'console.log("PURPLE_TEAM_TEST: Dynamic script injection detection test");';
    // NOT actually appended to DOM - just tests if content inspection catches the pattern
}

console.log('[PURPLE TEAM] Sample 1 complete. All operations benign.');
console.log('[PURPLE TEAM] Decoded payload: ' + _decoded);
console.log('[PURPLE TEAM] Dynamic exec result: ' + _result);
