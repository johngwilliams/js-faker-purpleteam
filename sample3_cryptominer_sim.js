/**
 * PURPLE TEAM TEST ARTIFACT - SAMPLE 3
 * Name: Cryptominer / Resource Hijacker Simulation
 * Purpose: Tests detection of JS that exhibits mining-like behavior: 
 *          WebWorker spawning, high CPU math operations, WebSocket to "pool",
 *          and WebAssembly loading patterns.
 * Risk: NONE - Performs trivial math. No real mining. No real pool connection.
 * MITRE: T1496 (Resource Hijacking)
 * 
 * Expected detections:
 *   - Browser: High CPU usage warning / mining detection (some browsers have this)
 *   - Proxy/SWG: Known cryptominer JS pattern / WebSocket to suspicious endpoint
 *   - EDR: Browser process sustained high CPU / suspicious WebWorker
 *   - Network: WebSocket connection attempt to mining pool-like endpoint
 */

(function() {
    'use strict';

    var MINER_CONFIG = {
        pool_url: 'ws://127.0.0.1:65535/stratum',  // Fake pool - localhost
        wallet: '0xDEADBEEF00000000PURPLE_TEAM_TEST_NOT_REAL',
        worker_id: 'pt-test-' + Math.random().toString(36).substr(2, 6),
        threads: 2,
        throttle: 95  // Real miners set this to control CPU usage
    };

    // --- Simulated pool connection via WebSocket ---
    function connectToPool() {
        try {
            console.log('[PURPLE TEAM] Attempting WebSocket to fake mining pool: ' + MINER_CONFIG.pool_url);
            var ws = new WebSocket(MINER_CONFIG.pool_url);

            ws.onopen = function() {
                // Mimics stratum protocol login
                ws.send(JSON.stringify({
                    id: 1,
                    method: 'mining.subscribe',
                    params: ['purple-team-miner/1.0']
                }));
                ws.send(JSON.stringify({
                    id: 2,
                    method: 'mining.authorize',
                    params: [MINER_CONFIG.wallet, MINER_CONFIG.worker_id]
                }));
            };

            ws.onerror = function() {
                console.log('[PURPLE TEAM] Pool connection failed (expected - pointing to localhost).');
            };

            ws.onclose = function() {
                console.log('[PURPLE TEAM] Pool WebSocket closed.');
            };
        } catch(e) {
            console.log('[PURPLE TEAM] WebSocket not available or blocked. Good.');
        }
    }

    // --- Simulated hashing work (trivial math, not real mining) ---
    function fakeMiningWork(iterations) {
        var nonce = 0;
        var hash_count = 0;
        var start = Date.now();

        for (var i = 0; i < iterations; i++) {
            // Simple operations that LOOK like hashing to behavioral analysis
            nonce = ((nonce * 1103515245 + 12345) & 0x7fffffff) >>> 0;
            nonce = nonce ^ (nonce << 13);
            nonce = nonce ^ (nonce >> 17);
            nonce = nonce ^ (nonce << 5);
            hash_count++;
        }

        var elapsed = Date.now() - start;
        return {
            hashes: hash_count,
            elapsed_ms: elapsed,
            hashrate: Math.round(hash_count / (elapsed / 1000)),
            final_nonce: nonce
        };
    }

    // --- Simulated WebWorker spawning (inline via Blob URL) ---
    function spawnWorkerThread(thread_id) {
        if (typeof Worker === 'undefined' || typeof Blob === 'undefined') {
            console.log('[PURPLE TEAM] WebWorkers not available. Skipping thread ' + thread_id);
            return;
        }

        var workerCode = [
            'self.onmessage = function(e) {',
            '  var count = 0;',
            '  var nonce = e.data.start_nonce;',
            '  for (var i = 0; i < e.data.iterations; i++) {',
            '    nonce = ((nonce * 1103515245 + 12345) & 0x7fffffff) >>> 0;',
            '    count++;',
            '  }',
            '  self.postMessage({',
            '    thread: e.data.thread_id,',
            '    hashes: count,',
            '    type: "PURPLE_TEAM_MINING_SIM"',
            '  });',
            '};'
        ].join('\n');

        try {
            var blob = new Blob([workerCode], { type: 'application/javascript' });
            var worker = new Worker(URL.createObjectURL(blob));

            worker.onmessage = function(e) {
                console.log('[PURPLE TEAM] Worker thread ' + e.data.thread + ' completed: ' + e.data.hashes + ' fake hashes');
                worker.terminate();
            };

            // Very small iteration count - not actually resource-intensive
            worker.postMessage({
                thread_id: thread_id,
                start_nonce: Math.floor(Math.random() * 1000000),
                iterations: 1000  // Trivially small
            });

            console.log('[PURPLE TEAM] Spawned WebWorker thread ' + thread_id);
        } catch(e) {
            console.log('[PURPLE TEAM] WebWorker creation blocked. Detection working.');
        }
    }

    // --- Simulated WASM loading pattern (just the fetch, no real WASM) ---
    function simulateWasmLoad() {
        if (typeof fetch !== 'undefined') {
            console.log('[PURPLE TEAM] Simulating WASM module fetch (will fail - no real file)');
            fetch('http://127.0.0.1:65535/cryptonight.wasm')
                .then(function() {
                    console.log('[PURPLE TEAM] WASM fetch succeeded (unexpected).');
                })
                .catch(function() {
                    console.log('[PURPLE TEAM] WASM fetch failed (expected).');
                });
        }
    }

    // --- Execute simulation ---
    console.log('[PURPLE TEAM] Sample 3: Cryptominer simulation starting');
    console.log('[PURPLE TEAM] Config: ' + JSON.stringify(MINER_CONFIG));

    // Attempt pool connection
    if (typeof WebSocket !== 'undefined') {
        connectToPool();
    }

    // Run trivial "mining" on main thread
    var result = fakeMiningWork(5000); // Very small workload
    console.log('[PURPLE TEAM] Main thread mining sim: ' + JSON.stringify(result));

    // Spawn worker threads
    for (var t = 0; t < MINER_CONFIG.threads; t++) {
        spawnWorkerThread(t);
    }

    // Simulate WASM load
    simulateWasmLoad();

    console.log('[PURPLE TEAM] Sample 3 complete. No real mining occurred.');
    console.log('[PURPLE TEAM] All pool/WASM connections point to localhost and will fail.');

})();
