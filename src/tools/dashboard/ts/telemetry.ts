// =============================================================================
// VERIFIED WORKSTATION HUD ENGINE (CLEAN STRINGS + LINKED AMBER FARBLE STATE)
// =============================================================================

interface HighEntropyValues {
    platform?: string;
    platformVersion?: string;
    architecture?: string;
    bitness?: string;
}

interface UserAgentData {
    platform: string;
    brands: Array<{ brand: string; version: string }>;
    getHighEntropyValues(hints: string[]): Promise<HighEntropyValues>;
}

interface ChromePerformanceMemory {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
}

interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

interface NavigatorExtended extends Navigator {
    userAgentData?: UserAgentData;
    deviceMemory?: number;
    getBattery?: () => Promise<BatteryManager>;
    brave?: {
        isBrave(): Promise<boolean>;
    };
}

export function initSystemIntel(): void {
    const nav = navigator as NavigatorExtended;

    // Elements
    const ipText = document.getElementById('sys-ip');
    const ispText = document.getElementById('sys-isp');
    const pingText = document.getElementById('sys-ping-val');
    const pingDot = document.getElementById('sys-ping-dot');
    const shieldTag = document.getElementById('sys-shield-tag');
    const physicalResText = document.getElementById('sys-physical-res');
    const viewportText = document.getElementById('sys-viewport');
    const refreshText = document.getElementById('sys-hz');
    const multiMonText = document.getElementById('sys-monitors');
    const cpuText = document.getElementById('sys-cpu');
    const cpuBenchText = document.getElementById('sys-cpu-bench');
    const tlsDnsText = document.getElementById('sys-tls-dns');
    const ipv6Text = document.getElementById('sys-ipv6');
    const powerProfileText = document.getElementById('sys-power-profile');
    const memText = document.getElementById('sys-memory');
    const audioText = document.getElementById('sys-audio');
    const gpuText = document.getElementById('sys-gpu');
    const osText = document.getElementById('sys-os');
    const hudContainer = document.querySelector('.telemetry-vertical-hud');

    // -------------------------------------------------------------------------
    // 1. SCOPED CLIPBOARD COPY
    // -------------------------------------------------------------------------
    function showCopyPopup(target: HTMLElement): void {
        document.querySelectorAll('.inline-copy-badge').forEach(el => {
            el.remove();
        });

        const rect = target.getBoundingClientRect();
        const badge = document.createElement('div');
        badge.className = 'inline-copy-badge';
        badge.textContent = `✓ Copied!`;
        document.body.appendChild(badge);

        const badgeRect = badge.getBoundingClientRect();
        badge.style.top = `${Math.max(8, rect.top - badgeRect.height - 6)}px`;
        badge.style.left = `${Math.max(8, rect.left + (rect.width - badgeRect.width) / 2)}px`;

        setTimeout(() => {
            badge.classList.add('fade-out');
            setTimeout(() => {
                badge.remove();
            }, 200);
        }, 1200);
    }

    document.querySelectorAll('.telemetry-block .copyable').forEach(el => {
        el.addEventListener('click', () => {
            const rawText = el.textContent?.trim() || '';
            const cleanText = rawText.split('·')[0]?.trim() || rawText;
            if (cleanText && !cleanText.startsWith('---') && !cleanText.startsWith('Resolving')) {
                void navigator.clipboard.writeText(cleanText);
                showCopyPopup(el as HTMLElement);
            }
        });
    });

    // -------------------------------------------------------------------------
    // 2. DNS & TLS HANDSHAKE WATERFALL
    // -------------------------------------------------------------------------
    const inspectDnsTls = (): void => {
        if (!tlsDnsText) return;
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            const entry = navEntries[0] as PerformanceNavigationTiming;
            const dnsTime = Math.max(0, Math.round(entry.domainLookupEnd - entry.domainLookupStart));
            const tcpTlsTime = Math.max(0, Math.round(entry.connectEnd - entry.connectStart));
            const protocol = entry.nextHopProtocol ? entry.nextHopProtocol.toUpperCase() : 'HTTP/2';
            tlsDnsText.textContent = `DNS: ${dnsTime}ms · TLS: ${tcpTlsTime}ms (${protocol})`;
        } else {
            tlsDnsText.textContent = 'Edge Cached (0ms)';
        }
    };
    setTimeout(inspectDnsTls, 200);

    // -------------------------------------------------------------------------
    // 3. IPV6 DUAL-STACK PROBE
    // -------------------------------------------------------------------------
    const probeIPv6 = async (): Promise<void> => {
        if (!ipv6Text) return;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 2500);
            const res = await fetch('https://api64.ipify.org?format=json', { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = (await res.json()) as { ip: string };
                if (data.ip && data.ip.includes(':')) {
                    ipv6Text.textContent = 'Dual-Stack (IPv6 Active)';
                    ipv6Text.className = 'hud-v text-accessible-green';
                } else {
                    ipv6Text.textContent = 'IPv4-Only Gateway';
                }
            }
        } catch {
            ipv6Text.textContent = 'IPv4-Only (Probing Blocked)';
        }
    };
    void probeIPv6();

    // -------------------------------------------------------------------------
    // 4. POWER PROFILE (HONEST HARDWARE API CHECK)
    // -------------------------------------------------------------------------
    const inspectPowerProfile = (): void => {
        if (!powerProfileText) return;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof nav.getBattery === 'function') {
            nav.getBattery()
                .then(bat => {
                    const pct = Math.round(bat.level * 100);
                    const state = bat.charging ? 'AC Connected' : 'Battery';
                    powerProfileText.textContent = `${pct}% (${state})${isReducedMotion ? ' · Eco' : ''}`;
                })
                .catch(() => {
                    powerProfileText.textContent = isReducedMotion ? 'Reduced Motion (Eco)' : 'Standard (AC Mains)';
                });
        } else {
            powerProfileText.textContent = isReducedMotion ? 'Eco Mode (Reduced Motion)' : 'AC Mains / Protected';
        }
    };
    inspectPowerProfile();

    // -------------------------------------------------------------------------
    // 5. BRAVE SHIELDS DETECTION & LINKED FARBLE ENGINE
    // -------------------------------------------------------------------------
    let isBraveShielded = false;

    // Detect Brave via official API or WebGL renderer override
    const detectBrave = async (): Promise<boolean> => {
        if (typeof nav.brave?.isBrave === 'function') {
            try {
                return await nav.brave.isBrave();
            } catch {
                return false;
            }
        }
        return false;
    };

    const applyShieldFarbleState = (): void => {
        if (!shieldTag) return;
        shieldTag.textContent = 'Brave Shield Active';
        shieldTag.classList.add('active-shield');

        // Target all hardware metrics that Brave anti-fingerprinting farbles
        const farbleTargets = [physicalResText, cpuText, gpuText, audioText, multiMonText, refreshText];
        farbleTargets.forEach(el => el?.classList.add('is-farbled'));

        // Linked hover pulse: hovering over the badge highlights the farbled metrics
        shieldTag.addEventListener('mouseenter', () => hudContainer?.classList.add('pulse-farbled'));
        shieldTag.addEventListener('mouseleave', () => hudContainer?.classList.remove('pulse-farbled'));
        shieldTag.addEventListener('focus', () => hudContainer?.classList.add('pulse-farbled'));
        shieldTag.addEventListener('blur', () => hudContainer?.classList.remove('pulse-farbled'));
    };

    if (gpuText) {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl && gl instanceof WebGLRenderingContext) {
                const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                if (dbg) {
                    const unmasked = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string;
                    if (unmasked.toLowerCase().includes('brave')) {
                        isBraveShielded = true;
                        gpuText.textContent = 'Brave Shield (Masked)';
                    } else {
                        const clean = unmasked
                            .replace(/^ANGLE\s*\(/i, '')
                            .replace(/\s*Direct3D.*$/i, '')
                            .replace(/vs_\d+_\d+.*$/i, '')
                            .replace(/,\s*/g, ' · ')
                            .replace(/\)$/, '')
                            .trim();
                        gpuText.textContent = clean || unmasked;
                    }
                } else {
                    gpuText.textContent = 'Hardware Accelerated';
                }
            }
        } catch {
            gpuText.textContent = 'Hardware Accelerated';
        }
    }

    void detectBrave().then(braveActive => {
        if (braveActive || isBraveShielded) {
            isBraveShielded = true;
            applyShieldFarbleState();
        } else if (shieldTag) {
            shieldTag.textContent = 'Hardware Direct';
            shieldTag.classList.remove('active-shield');
        }
    });

    // -------------------------------------------------------------------------
    // 6. DISPLAY & MULTI-MONITOR (CLEAN VALUES)
    // -------------------------------------------------------------------------
    const inspectDisplay = (): void => {
        const dpr = window.devicePixelRatio || 1;
        const physW = Math.round(window.screen.width * dpr);
        const physH = Math.round(window.screen.height * dpr);
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;
        const scalingPct = Math.round(dpr * 100);

        // Value remains clean without raw text pollution
        if (physicalResText) physicalResText.textContent = `${physW} × ${physH} (${scalingPct}% Scale)`;
        if (viewportText) viewportText.textContent = `${viewW} × ${viewH} CSS px`;

        if (multiMonText) {
            if ('isExtended' in window.screen) {
                const isMulti = (window.screen as unknown as { isExtended: boolean }).isExtended;
                multiMonText.textContent = isMulti ? 'Dual/Extended Setup' : 'Single Monitor';
            } else {
                multiMonText.textContent = isBraveShielded ? 'Single / Shield Masked' : 'Single Display / Sandboxed';
            }
        }
    };
    inspectDisplay();
    window.addEventListener('resize', inspectDisplay);

    // -------------------------------------------------------------------------
    // 7. REFRESH RATE TEST (60-FRAME BUFFER)
    // -------------------------------------------------------------------------
    const measureRefreshRate = (): void => {
        let frames = 0;
        let lastTime = performance.now();
        const deltas: number[] = [];

        const step = (now: number): void => {
            const dt = now - lastTime;
            lastTime = now;
            if (frames > 4) deltas.push(dt);
            frames++;

            if (frames < 60) {
                requestAnimationFrame(step);
            } else {
                const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
                const measuredHz = 1000 / avgDelta;
                const standardHz = [60, 75, 90, 120, 144, 165, 240, 360, 500];
                const closest = standardHz.reduce((prev, curr) =>
                    Math.abs(curr - measuredHz) < Math.abs(prev - measuredHz) ? curr : prev
                );
                const finalHz = Math.abs(closest - measuredHz) < 5 ? closest : Math.round(measuredHz);

                if (refreshText) refreshText.textContent = `${finalHz} Hz (${measuredHz.toFixed(1)} FPS)`;
            }
        };
        requestAnimationFrame(step);
    };
    measureRefreshRate();
    window.addEventListener('focus', measureRefreshRate);

    // -------------------------------------------------------------------------
    // 8. CPU CONCURRENCY + BENCHMARK
    // -------------------------------------------------------------------------
    if (cpuText) {
        const cores = nav.hardwareConcurrency;
        cpuText.textContent = cores ? `${cores} Logical Cores` : 'Multi-Threaded';
    }

    if (cpuBenchText) {
        const runBench = (): void => {
            const t0 = performance.now();
            let ops = 0;
            let sink = 0;
            while (performance.now() - t0 < 25) {
                sink += Math.sin(ops) * Math.cos(ops);
                ops += 1000;
            }
            if (sink === 0) ops++;
            const duration = (performance.now() - t0) / 1000;
            const mops = Math.round(ops / duration / 1_000_000);
            cpuBenchText.textContent = `${mops.toLocaleString()} Mops/s Index`;
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(runBench, { timeout: 3000 });
        } else {
            setTimeout(runBench, 1500);
        }
    }

    // -------------------------------------------------------------------------
    // 9. LIVE PING (Cloudflare Edge Trace)
    // -------------------------------------------------------------------------
    const pingPulse = async (): Promise<void> => {
        if (!navigator.onLine) {
            if (pingText) pingText.textContent = 'Offline';
            if (pingDot) pingDot.className = 'live-ping-dot offline';
            return;
        }

        const t0 = performance.now();
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 2500);
            await fetch(`https://cloudflare.com/cdn-cgi/trace?_t=${Date.now()}`, {
                method: 'GET',
                cache: 'no-store',
                signal: controller.signal
            });
            clearTimeout(timeout);

            const rtt = Math.max(1, Math.round(performance.now() - t0));
            if (pingText) pingText.textContent = `${rtt} ms`;
            if (pingDot) {
                pingDot.className =
                    rtt < 45 ? 'live-ping-dot good' : rtt < 120 ? 'live-ping-dot warn' : 'live-ping-dot high';
            }
        } catch {
            if (pingText) pingText.textContent = 'Timeout';
            if (pingDot) pingDot.className = 'live-ping-dot offline';
        }
    };
    void pingPulse();
    setInterval(() => {
        if (document.visibilityState === 'visible') void pingPulse();
    }, 30000);

    // -------------------------------------------------------------------------
    // 10. IP & ISP
    // -------------------------------------------------------------------------
    const fetchNetworkInfo = async (): Promise<void> => {
        try {
            const res = await fetch('https://ipwho.is/');
            if (!res.ok) throw new Error();
            const data = (await res.json()) as {
                success: boolean;
                ip: string;
                connection?: { isp?: string; org?: string; asn?: number };
                city?: string;
                country_code?: string;
            };

            if (data.success) {
                if (ipText) ipText.textContent = data.ip;
                if (ispText) {
                    const org = data.connection?.isp || data.connection?.org || 'Unknown ISP';
                    const asn = data.connection?.asn ? `AS${data.connection.asn}` : '';
                    const location = data.city || data.country_code || '';
                    ispText.textContent = `${org} ${asn ? `(${asn})` : ''} · ${location}`;
                }
            } else {
                throw new Error();
            }
        } catch {
            if (ipText) ipText.textContent = 'Protected Gateway';
            if (ispText) ispText.textContent = 'Shielded by Client';
        }
    };
    void fetchNetworkInfo();

    // -------------------------------------------------------------------------
    // 11. AUDIO SUBSYSTEM (SAFE PROBE)
    // -------------------------------------------------------------------------
    if (audioText) {
        try {
            interface AudioWindow {
                AudioContext?: typeof AudioContext;
                webkitAudioContext?: typeof AudioContext;
            }
            const winAudio = window as unknown as AudioWindow;
            const AudioContextClass = winAudio.AudioContext ?? winAudio.webkitAudioContext;

            if (AudioContextClass) {
                const tempCtx = new AudioContextClass();
                const khz = (tempCtx.sampleRate / 1000).toFixed(1);
                const channels = tempCtx.destination.maxChannelCount;
                audioText.textContent = `${khz} kHz · Stereo ${channels}.0`;
                void tempCtx.close();
            } else {
                audioText.textContent = 'Audio API Blocked';
            }
        } catch {
            audioText.textContent = 'Sandboxed Audio';
        }
    }

    // -------------------------------------------------------------------------
    // 12. HEAP MEMORY & OS DETECTION
    // -------------------------------------------------------------------------
    const updateMemory = (): void => {
        if (!memText) return;
        const perf = window.performance as unknown as { memory?: ChromePerformanceMemory };
        if (perf.memory) {
            const usedMB = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024));
            const limitGB = (perf.memory.jsHeapSizeLimit / (1024 * 1024 * 1024)).toFixed(1);
            memText.textContent = `${usedMB} MB / ${limitGB} GB Limit`;
        } else {
            const devMem = nav.deviceMemory;
            memText.textContent = devMem ? `~${devMem} GB RAM (Estimated)` : 'Standard Heap Buffer';
        }
    };
    updateMemory();
    setInterval(updateMemory, 10000);

    const detectRealOS = async (): Promise<void> => {
        if (!osText) return;
        if (nav.userAgentData && typeof nav.userAgentData.getHighEntropyValues === 'function') {
            try {
                const entropy = await nav.userAgentData.getHighEntropyValues(['platform', 'platformVersion']);
                const platform = entropy.platform || nav.userAgentData.platform;
                if (platform === 'Windows') {
                    const major = parseInt((entropy.platformVersion || '').split('.')[0], 10);
                    osText.textContent = major >= 13 ? 'Windows 11' : 'Windows 10';
                    return;
                }
                osText.textContent = platform;
                return;
            } catch {
                // Fallback below
            }
        }

        const ua = navigator.userAgent;
        if (/Windows/i.test(ua)) osText.textContent = 'Windows';
        else if (/Mac OS/i.test(ua)) osText.textContent = 'macOS';
        else if (/Android/i.test(ua)) osText.textContent = 'Android';
        else if (/Linux/i.test(ua)) osText.textContent = 'Linux';
        else if (/iPhone|iPad/i.test(ua)) osText.textContent = 'iOS';
        else osText.textContent = 'Workstation';
    };
    void detectRealOS();
}
