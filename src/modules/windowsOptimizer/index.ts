import {
    type HardwareProfile,
    type GpuModelSpec,
    type MoboPlatformId,
    type MoboPlatformSpec,
    GPU_DATABASE,
    RAM_DATABASE,
    MOBO_PLATFORMS
} from './hardwareData';
import {
    type CttItemBlueprint,
    CTT_ESSENTIAL_ITEMS,
    CTT_ADVANCED_ITEMS,
    CTT_PREFERENCE_ITEMS,
    CTT_FEATURE_ITEMS
} from './cttBlueprint';
import { WINDOWS_OPTIMIZER_HTML } from './template';

const STORAGE_KEY = 'everything_winopt_profile_v10';

function getCpuGuidance(profile: HardwareProfile): string {
    const moboPlatform = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[1];
    if (profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-x3d-single') {
        return `
            <div class="hw-block">
                <div class="hw-block-header">
                    <span>⚡ AMD CPU Chipset Drivers</span>
                    <a href="https://www.amd.com/en/support/download/drivers.html" target="_blank" rel="noopener" class="link-chip">AMD Official Chipset Setup ↗</a>
                </div>
                <ul class="clean-bullet-list">
                    <li>Install the bare AMD Chipset Driver package directly from AMD.com. Confirm <em>AMD 3D V-Cache Performance Optimizer Service</em> is running in <code>services.msc</code>.</li>
                    ${profile.cpu === 'amd-x3d-dual' ? '<li><strong>Dual-CCD Rule:</strong> Keep Xbox Game Bar installed so Windows parks standard cores during games.</li>' : '<li><strong>Single-CCD Note:</strong> All cores share the 3D cache directly; no core-parking service dependencies needed.</li>'}
                </ul>
            </div>
        `;
    }
    if (profile.cpu === 'intel-raptor') {
        return `
            <div class="hw-block">
                <div class="hw-block-header">
                    <span>⚡ Intel 13th/14th Gen Chipset &amp; ME</span>
                    <a href="https://www.intel.com/content/www/us/en/download-center/home.html" target="_blank" rel="noopener" class="link-chip">Intel Driver Center ↗</a>
                </div>
                <ul class="clean-bullet-list">
                    <li>Install <strong>Intel Chipset Device Software (INF)</strong> and <strong>Intel Management Engine (ME)</strong> from your motherboard support page.</li>
                    <li>Verify Intel Default Power Limits (PL1/PL2 = 253W max) are active.</li>
                </ul>
            </div>
        `;
    }
    return `
        <div class="hw-block">
            <div class="hw-block-header">
                <span>⚡ Intel Monolithic Chipset Drivers (e.g. i7-9700K)</span>
                <a href="${moboPlatform.supportUrl}" target="_blank" rel="noopener" class="link-chip">Official Motherboard Driver Portal ↗</a>
            </div>
            <ul class="clean-bullet-list">
                <li>Install <strong>Intel INF Chipset Software</strong> and <strong>Intel ME</strong> directly from your ${moboPlatform.name} support portal. Avoid third-party driver-updater utilities.</li>
            </ul>
        </div>
    `;
}

function getGpuGuidance(currentGpu: GpuModelSpec): string {
    const isPascal = currentGpu.family === 'nvidia-pascal';
    const isModernNvidia = currentGpu.family === 'nvidia-modern' || currentGpu.family === 'nvidia-turing';
    const isAmd = currentGpu.family === 'amd-rdna';

    let specificSettings: string;
    if (isPascal) {
        specificSettings = `
            <li><strong>Official Installer Setup (Pascal):</strong> Choose <em>Custom (Advanced)</em> ➔ Check <strong>"Perform a clean installation"</strong>. Install Display Driver + PhysX only. Keep HAGS <strong>OFF</strong>.</li>
        `;
    } else if (isModernNvidia) {
        specificSettings = `
            <li><strong>Official Installer Setup (Modern RTX):</strong> Choose <em>Custom (Advanced)</em> ➔ Check <strong>"Perform a clean installation"</strong>. Keep HAGS <strong>ON</strong>.</li>
        `;
    } else if (isAmd) {
        specificSettings = `
            <li><strong>AMD Adrenalin:</strong> Select <strong>"Minimal Install"</strong> to skip streaming services and analytics. Enable Smart Access Memory (SAM).</li>
        `;
    } else {
        specificSettings = `
            <li><strong>Intel Arc:</strong> Install latest WHQL package. ReBAR must be active in BIOS.</li>
        `;
    }

    return `
        <div class="hw-block" style="margin-top: 10px;">
            <div class="hw-block-header">
                <span>🎮 Tailored GPU Driver Package (${currentGpu.name})</span>
                <a href="${currentGpu.directDownloadUrl}" target="_blank" rel="noopener" class="link-chip">Official Driver Download ↗</a>
            </div>
            <div class="driver-match-box">
                <div><strong>Recommended Driver:</strong> <span style="color:var(--accent-brand); font-family:var(--font-mono); font-weight:700;">${currentGpu.recommendedDriverVersion}</span></div>
                <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${currentGpu.driverNotes}</div>
            </div>
            <ul class="clean-bullet-list" style="margin-top:6px;">
                <li><strong>Download Format:</strong> Standard installer executable (<code>.exe</code>). Save it to your local drive or USB stick while online.</li>
                ${specificSettings}
            </ul>
        </div>
    `;
}

export function initWindowsOptimizer(): void {
    const viewPanel = document.getElementById('view-tool-winopt');
    if (viewPanel) {
        viewPanel.innerHTML = WINDOWS_OPTIMIZER_HTML;
    }

    const osSelect = document.getElementById('winopt-os-select') as HTMLSelectElement | null;
    const moboSelect = document.getElementById('winopt-mobo-select') as HTMLSelectElement | null;
    const cpuSelect = document.getElementById('winopt-cpu-select') as HTMLSelectElement | null;
    const gpuSelect = document.getElementById('winopt-gpu-select') as HTMLSelectElement | null;
    const ramSelect = document.getElementById('winopt-ram-select') as HTMLSelectElement | null;

    const parseInput = document.getElementById('winopt-spec-paste-input') as HTMLInputElement | null;
    const parseBtn = document.getElementById('winopt-spec-parse-btn');
    const parseStatus = document.getElementById('winopt-spec-parse-status');

    const p1IsoTitle = document.getElementById('p1-iso-title');
    const p1IsoLink = document.getElementById('p1-iso-link') as HTMLAnchorElement | null;
    const p1IsoDesc = document.getElementById('p1-iso-desc');
    const p1RufusOptions = document.getElementById('p1-rufus-options');
    const p1OobeGuide = document.getElementById('p1-oobe-guide');

    const p2MoboToolName = document.getElementById('p2-mobo-tool-name');
    const p2MoboLink = document.getElementById('p2-mobo-link') as HTMLAnchorElement | null;
    const p2BiosSettingsList = document.getElementById('p2-bios-settings-list');

    const advisoryBanner = document.getElementById('hw-advisory-banner');
    const hwDynamicContent = document.getElementById('hw-dynamic-content');
    const hagsText = document.getElementById('hags-calibration-text');

    let profile: HardwareProfile = {
        os: 'win10',
        mobo: 'asus-intel-300-500',
        cpu: 'intel-legacy',
        gpuId: 'gtx-1070',
        ramId: 'ddr4-3200-dual'
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            profile = { ...profile, ...(JSON.parse(saved) as Partial<HardwareProfile>) };
        } catch {
            // Keep default
        }
    }

    function populateMoboSelect(): void {
        if (!moboSelect) return;
        moboSelect.innerHTML = MOBO_PLATFORMS.map(
            m => `<option value="${m.id}" ${m.id === profile.mobo ? 'selected' : ''}>${m.name}</option>`
        ).join('');
    }

    function populateGpuSelect(): void {
        if (!gpuSelect) return;
        gpuSelect.innerHTML = GPU_DATABASE.map(
            g => `<option value="${g.id}" ${g.id === profile.gpuId ? 'selected' : ''}>${g.name}</option>`
        ).join('');
    }

    function populateRamSelect(): void {
        if (!ramSelect) return;
        ramSelect.innerHTML = RAM_DATABASE.map(
            r => `<option value="${r.id}" ${r.id === profile.ramId ? 'selected' : ''}>${r.name}</option>`
        ).join('');
    }

    populateMoboSelect();
    populateGpuSelect();
    populateRamSelect();

    if (osSelect) osSelect.value = profile.os;
    if (moboSelect) moboSelect.value = profile.mobo;
    if (cpuSelect) cpuSelect.value = profile.cpu;
    if (gpuSelect) gpuSelect.value = profile.gpuId;
    if (ramSelect) ramSelect.value = profile.ramId;

    function save(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch {
            // Storage safe
        }
    }

    function parseHardwareString(raw: string): void {
        const text = raw.toLowerCase().replace(/\^/g, ' ');
        let detectedMobo = false;
        let detectedCpu = false;
        let detectedGpu = false;
        let detectedRam = false;

        // 1. FIRST PASS: IDENTIFY CPU ARCHITECTURE
        if (
            text.includes('7900x3d') ||
            text.includes('7950x3d') ||
            text.includes('9900x3d') ||
            text.includes('9950x3d')
        ) {
            profile.cpu = 'amd-x3d-dual';
            detectedCpu = true;
        } else if (
            text.includes('5700x3d') ||
            text.includes('5800x3d') ||
            text.includes('7800x3d') ||
            text.includes('9800x3d') ||
            text.includes('x3d')
        ) {
            profile.cpu = 'amd-x3d-single';
            detectedCpu = true;
        } else if (
            text.includes('ryzen') ||
            text.includes('threadripper') ||
            (text.includes('amd') && !text.includes('radeon'))
        ) {
            profile.cpu = 'amd-standard';
            detectedCpu = true;
        } else if (text.includes('13th gen') || text.includes('14th gen') || /i[579]-1[34]\d{3}/.test(text)) {
            profile.cpu = 'intel-raptor';
            detectedCpu = true;
        } else if (text.includes('12th gen') || text.includes('ultra') || /i[579]-12\d{3}/.test(text)) {
            profile.cpu = 'intel-alder';
            detectedCpu = true;
        } else if (text.includes('intel') || /i[3579]-/.test(text) || text.includes('xeon')) {
            profile.cpu = 'intel-legacy';
            detectedCpu = true;
        }

        // 2. SECOND PASS: DOUBLE-CHECK MOTHERBOARD VENDOR + CHIPSET + CPU COMPATIBILITY
        const detectedVendor =
            text.includes('asus') || text.includes('rog') || text.includes('strix') || text.includes('tuf')
                ? 'asus'
                : text.includes('msi') || text.includes('micro-star')
                  ? 'msi'
                  : text.includes('gigabyte') || text.includes('aorus')
                    ? 'gigabyte'
                    : text.includes('asrock')
                      ? 'asrock'
                      : text.includes('dell') ||
                          text.includes('alienware') ||
                          text.includes('hp') ||
                          text.includes('lenovo')
                        ? 'oem'
                        : null;

        const isCpuAmd = profile.cpu.startsWith('amd');

        let bestMoboCandidate: MoboPlatformSpec | null = null;
        let highestMatchScore = -1;

        for (const platform of MOBO_PLATFORMS) {
            let score = 0;

            // Vendor alignment check
            if (detectedVendor && platform.vendor === detectedVendor) {
                score += 5;
            }

            // CPU Platform alignment check (Intel vs AMD)
            if (platform.isAmd === isCpuAmd) {
                score += 3;
            } else {
                score -= 10; // Incompatible: do not match AMD board with Intel CPU
            }

            // Exact Chipset Keyword Search (e.g. Z390, B550, Z790, B650)
            for (const kw of platform.chipsetKeywords) {
                if (text.includes(kw)) {
                    score += 10;
                    break;
                }
            }

            // CPU generation hints
            for (const kw of platform.cpuKeywords) {
                if (text.includes(kw)) {
                    score += 2;
                    break;
                }
            }

            if (score > highestMatchScore) {
                highestMatchScore = score;
                bestMoboCandidate = platform;
            }
        }

        if (bestMoboCandidate && highestMatchScore >= 5) {
            profile.mobo = bestMoboCandidate.id;
            detectedMobo = true;
        }

        // 3. GPU DETECTION
        let bestMatch: GpuModelSpec | null = null;
        let longestLen = 0;
        for (const gpu of GPU_DATABASE) {
            for (const kw of gpu.keywords) {
                if (text.includes(kw) && kw.length > longestLen) {
                    bestMatch = gpu;
                    longestLen = kw.length;
                }
            }
        }
        if (bestMatch) {
            profile.gpuId = bestMatch.id;
            detectedGpu = true;
        }

        // 4. RAM DETECTION
        const ramMatch = /(\d+)\s*gb\s*(ddr[345])\s*@\s*(\d+)\s*mhz/i.exec(text);
        const isSingleStick = text.includes('single-channel') || text.includes('1 stick');
        const isQuadSticks = text.includes('4 sticks');

        if (ramMatch?.[2] && ramMatch[3]) {
            const gen = ramMatch[2].toUpperCase();
            const spd = parseInt(ramMatch[3], 10);
            detectedRam = true;

            if (gen === 'DDR5') {
                if (isSingleStick) profile.ramId = 'ddr5-single';
                else if (isQuadSticks) profile.ramId = 'ddr5-quad';
                else if (spd >= 6400) profile.ramId = 'ddr5-6400-dual';
                else if (spd >= 5800) profile.ramId = 'ddr5-6000-dual';
                else if (spd >= 5200) profile.ramId = 'ddr5-5600-dual';
                else profile.ramId = 'ddr5-4800-dual';
            } else if (gen === 'DDR4') {
                if (isSingleStick) profile.ramId = 'ddr4-single';
                else if (isQuadSticks) profile.ramId = 'ddr4-quad';
                else if (spd >= 3600) profile.ramId = 'ddr4-3600-dual';
                else if (spd >= 3200) profile.ramId = 'ddr4-3200-dual';
                else if (spd >= 2666) profile.ramId = 'ddr4-2666-dual';
                else profile.ramId = 'ddr4-2133-dual';
            } else if (gen === 'DDR3') {
                profile.ramId = isSingleStick ? 'ddr3-single' : 'ddr3-1600-dual';
            }
        }

        // Auto-select OS optimization based on GPU
        if (profile.gpuId.includes('1070') || profile.gpuId.includes('1080') || profile.gpuId.includes('1060')) {
            profile.os = 'win10';
        }

        // Update UI inputs
        if (osSelect) osSelect.value = profile.os;
        if (moboSelect) moboSelect.value = profile.mobo;
        if (cpuSelect) cpuSelect.value = profile.cpu;
        if (gpuSelect) gpuSelect.value = profile.gpuId;
        if (ramSelect) ramSelect.value = profile.ramId;

        save();
        renderAll();

        if (parseStatus) {
            const hits = [
                detectedMobo && 'Motherboard BIOS',
                detectedCpu && 'CPU',
                detectedGpu && 'GPU',
                detectedRam && 'RAM'
            ]
                .filter(Boolean)
                .join(', ');
            parseStatus.textContent = hits
                ? `✓ Auto-Matched: ${hits}`
                : 'Could not match hardware string. Select manually.';
            parseStatus.style.color = hits ? 'var(--accent-brand)' : 'var(--accent-rose)';
        }
    }

    parseBtn?.addEventListener('click', () => {
        if (!parseInput || !parseInput.value.trim()) return;
        parseHardwareString(parseInput.value);
    });

    function renderAdvisoryBanner(): void {
        if (!advisoryBanner) return;

        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0];
        const moboPlatform = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[1];
        const alerts: string[] = [];

        if (currentRam.channels === 'single') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 SEVERE MEMORY BOTTLENECK: SINGLE-CHANNEL DETECTED!</div>
                    Your system is operating on a single memory channel. This cuts memory bandwidth by <strong>50%</strong> and causes frame drops in competitive games.
                    <br/><strong>Fix:</strong> Install a matching dual-stick kit in <strong>Slots 2 &amp; 4 (A2 &amp; B2)</strong> to unlock full Dual-Channel throughput.
                </div>
            `);
        }

        if (currentRam.isJedecStock) {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ RAM RUNNING AT JEDEC BASE SPEED (${currentRam.speedMHz} MHz):</div>
                    Your ${currentRam.generation} RAM is currently running at factory base fallback frequencies. In Phase 2, enable <strong>${moboPlatform.memoryProfileName}</strong> in your BIOS to unlock your advertised memory speed.
                </div>
            `);
        }

        if (currentGpu.family === 'nvidia-pascal') {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ PASCAL ARCHITECTURE CALIBRATION (${currentGpu.name}):</div>
                    <div>1. <strong>Turn HAGS OFF</strong> in Windows Display settings (see Step 3 below for exact steps). Pascal lacks hardware-level scheduling ASICs; HAGS causes frame pacing micro-stutter.</div>
                    <div>2. <strong>PCIe Resizable BAR is NOT supported</strong> on GTX 10-series.</div>
                    <div>3. <strong>OS Choice:</strong> Windows 10 22H2 delivers tighter 1% low frame pacing than Windows 11 on Pascal + monolithic Intel setups.</div>
                </div>
            `);
        }

        if (profile.cpu === 'intel-raptor') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 CRITICAL INTEL 13th/14th GEN HARDWARE WARNING:</div>
                    Update your ${moboPlatform.name} motherboard to BIOS with <strong>microcode 0x12B</strong> or newer to prevent irreversible silicon degradation caused by elevated voltage requests. Enforce Intel Default Power Limits (PL1/PL2 = 253W max).
                </div>
            `);
        }

        if (profile.cpu === 'amd-x3d-dual') {
            alerts.push(`
                <div class="advisory-pill info">
                    <div style="font-weight:800; margin-bottom:2px;">⚡ DUAL-CCD RYZEN X3D DETECTED:</div>
                    <strong>DO NOT DISABLE XBOX GAME BAR:</strong> Windows uses the Xbox Game Bar KGL process in tandem with the AMD 3D V-Cache Optimizer Service to park standard cores and pin games to the V-Cache CCD. Stripping Game Bar on dual-CCD chips causes threads to bounce across the Infinity Fabric, severely hurting 1% lows.
                </div>
            `);
        }

        advisoryBanner.innerHTML = alerts.join('');
    }

    function renderPhase1(): void {
        const isWin10 = profile.os === 'win10';

        if (p1IsoTitle) {
            p1IsoTitle.textContent = isWin10
                ? 'Windows 10 Clean ISO (22H2 / Enterprise LTSC)'
                : 'Windows 11 Clean ISO (23H2 / 24H2)';
        }

        if (p1IsoLink) {
            p1IsoLink.href = isWin10
                ? 'https://www.microsoft.com/software-download/windows10ISO'
                : 'https://www.microsoft.com/software-download/windows11';
            p1IsoLink.textContent = isWin10 ? 'Download Win10 ISO ↗' : 'Download Win11 ISO ↗';
        }

        if (p1IsoDesc) {
            p1IsoDesc.innerHTML = isWin10
                ? `Windows 10 is free to evaluate directly from Microsoft. No product key is required to complete installation. For older GPUs (GTX 1070, etc.) and monolithic CPUs (i7-9700K), Windows 10 has less Desktop Window Manager (DWM) composition overhead.`
                : `Windows 11 features Intel Thread Director for P/E core balancing and DirectStorage optimizations. Download directly from Microsoft.`;
        }

        if (p1RufusOptions) {
            p1RufusOptions.innerHTML = `
                <div class="rufus-setting-row">
                    <span class="rufus-param">Device:</span>
                    <span class="rufus-val">USB drive (Minimum 8 GB — will be wiped)</span>
                </div>
                <div class="rufus-setting-row">
                    <span class="rufus-param">Partition scheme:</span>
                    <span class="rufus-val"><strong>GPT</strong> (Required for pure UEFI)</span>
                </div>
                <div class="rufus-setting-row">
                    <span class="rufus-param">Target system:</span>
                    <span class="rufus-val"><strong>UEFI (non-CSM)</strong></span>
                </div>
                <div class="rufus-setting-row">
                    <span class="rufus-param">File system:</span>
                    <span class="rufus-val"><strong>NTFS</strong></span>
                </div>
                <div class="rufus-dialog-box">
                    <div style="font-weight:700; color:var(--accent-brand); margin-bottom:4px;">
                        When you click "START", Rufus prompts the User Experience dialog. Check EXACTLY these:
                    </div>
                    <ul class="clean-bullet-list">
                        <li>${
                            !isWin10
                                ? '<strong>[x] Remove requirement for 4GB+ RAM, Secure Boot and TPM 2.0</strong>'
                                : '<strong>[x] Remove requirement for an online Microsoft account</strong>'
                        }</li>
                        <li><strong>[x] Create a local account with username</strong> (e.g. <code>User</code>)</li>
                        <li><strong>[x] Disable data collection</strong> (Skips all telemetry setup screens)</li>
                        <li><strong>[x] Disable BitLocker automatic device encryption</strong> (Prevents SSD lockouts and I/O latency)</li>
                    </ul>
                </div>
            `;
        }

        if (p1OobeGuide) {
            p1OobeGuide.innerHTML = `
                <div class="oobe-golden-rule">
                    <span style="font-weight: 800; color: var(--accent-rose);">OFFLINE SETUP PROTOCOL:</span>
                    <span><strong>DO NOT connect Ethernet or Wi-Fi during installation.</strong> Remain completely offline until Phase 5 to prevent Windows Update from silently downloading generic GPU drivers.</span>
                </div>
                <div style="margin-top: 8px; font-size: 0.76rem; color: var(--text-secondary);">
                    ${
                        isWin10
                            ? `When asked for a network, click <em>"I don't have internet"</em> ➔ <em>"Continue with limited setup"</em>. Set all privacy sliders to <strong>OFF / No</strong>.`
                            : `If Windows 11 demands Wi-Fi, press <kbd>Shift</kbd> + <kbd>F10</kbd>, type <code>OOBE\\BYPASSNRO</code>, and hit Enter. The PC reboots with an <em>"I don't have internet"</em> option unlocked.`
                    }
                </div>

                <!-- MAS ACTIVATION & EDITION SWITCHER -->
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                        <strong style="color:var(--text-primary); font-size:0.78rem;">Optional: Windows Activation &amp; Edition Switcher (MAS):</strong>
                        <a href="https://massgrave.dev/" target="_blank" rel="noopener" class="link-chip">massgrave.dev Official ↗</a>
                    </div>
                    <p style="font-size:0.73rem; color:var(--text-secondary); margin:4px 0 6px 0; line-height:1.45;">
                        Complete the offline setup first. Once you reconnect to the internet in Phase 5, run this open-source script in PowerShell if you need permanent HWID digital license activation or want to switch editions (e.g. upgrading Home to Pro/Enterprise without reinstalling):
                    </p>
                    <div class="terminal-code-window">
                        <div class="terminal-bar">
                            <div class="terminal-badge">
                                <span class="terminal-dot"></span>
                                <span class="terminal-title">PowerShell (Administrator) · Microsoft Activation Scripts</span>
                            </div>
                            <button type="button" class="btn-action-pill copy-btn-trigger" data-copy="irm https://get.activated.win | iex">Copy</button>
                        </div>
                        <pre class="terminal-code-body"><code>irm https://get.activated.win | iex</code></pre>
                    </div>
                    <div style="margin-top:4px; font-size:0.7rem; color:var(--text-muted); font-family:var(--font-mono);">
                        Press <kbd>1</kbd> for <strong>HWID (Permanent Digital License)</strong> or use the Edition Switcher menu to upgrade to Pro.
                    </div>
                </div>
            `;
        }
    }

    function renderPhase2(): void {
        const moboPlatform = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[1];
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0];

        if (p2MoboToolName) p2MoboToolName.textContent = `${moboPlatform.name} (${moboPlatform.toolName})`;
        if (p2MoboLink) {
            p2MoboLink.href = moboPlatform.supportUrl;
            p2MoboLink.textContent = `Open Official ${moboPlatform.vendor.toUpperCase()} BIOS Portal ↗`;
        }

        if (!p2BiosSettingsList) return;

        const items: string[] = [];

        // 1. RAM OVERCLOCK PROFILE (XMP / DOCP / EXPO)
        let ramPath: string;
        if (moboPlatform.vendor === 'asus') {
            ramPath = moboPlatform.isAmd
                ? moboPlatform.id === 'asus-amd-am5'
                    ? 'Ai Tweaker ➔ Ai Overclock Tuner ➔ EXPO I'
                    : 'Ai Tweaker ➔ Ai Overclock Tuner ➔ D.O.C.P.'
                : 'Ai Tweaker ➔ Ai Overclock Tuner ➔ X.M.P. I';
        } else if (moboPlatform.vendor === 'msi') {
            ramPath = moboPlatform.isAmd
                ? 'OC ➔ A-XMP / EXPO ➔ Profile 1'
                : 'OC ➔ Extreme Memory Profile (XMP) ➔ Enabled';
        } else if (moboPlatform.vendor === 'gigabyte') {
            ramPath = 'Tweaker ➔ Extreme Memory Profile (X.M.P.) / EXPO ➔ Profile 1';
        } else if (moboPlatform.vendor === 'asrock') {
            ramPath = 'OC Tweaker ➔ DRAM Configuration ➔ Load XMP / EXPO Setting ➔ Profile 1';
        } else {
            ramPath = 'Performance / Advanced ➔ Memory Options ➔ XMP';
        }

        items.push(`
            <li class="bios-setting-tree-item">
                <div class="bios-breadcrumb-tag">${ramPath}</div>
                <div><strong>Memory Frequency (${moboPlatform.memoryProfileName}):</strong> Set to <strong>Profile 1 / Enabled</strong>.</div>
                <div class="bios-subtext">Ensures ${currentRam.name} operates at rated speed instead of fallback JEDEC baseline.</div>
            </li>
        `);

        // 2. CPU POWER MANAGEMENT (SPEEDSTEP vs SPEED SHIFT vs CPPC)
        let cpuPath: string;
        let cpuDetail: string;

        if (moboPlatform.isAmd) {
            if (moboPlatform.vendor === 'asus')
                cpuPath = 'Advanced (F7) ➔ AMD CBS ➔ NBIO Common Options ➔ SMU Common Options ➔ CPPC';
            else if (moboPlatform.vendor === 'msi') cpuPath = 'OC ➔ Advanced CPU Configuration ➔ AMD CBS ➔ CPPC';
            else if (moboPlatform.vendor === 'gigabyte')
                cpuPath = 'Settings ➔ AMD CBS ➔ NBIO Common Options ➔ SMU Common Options ➔ CPPC';
            else cpuPath = 'Advanced ➔ AMD CBS ➔ CPPC';

            cpuDetail = `Set <strong>CPPC</strong> to <strong>Enabled</strong> and <strong>CPPC Preferred Cores</strong> to <strong>Enabled</strong>. (Dispatches threads in ~1ms).`;
        } else {
            // Intel Boards
            if (moboPlatform.id.includes('300-500')) {
                // 8th–11th Gen Architecture
                if (moboPlatform.vendor === 'asus')
                    cpuPath = 'Advanced (F7) ➔ CPU Configuration ➔ CPU - Power Management Control';
                else if (moboPlatform.vendor === 'msi') cpuPath = 'OC ➔ CPU Features (bottom of menu)';
                else if (moboPlatform.vendor === 'gigabyte') cpuPath = 'Tweaker ➔ Advanced CPU Settings';
                else cpuPath = 'Advanced ➔ CPU Configuration';

                cpuDetail = `Set <strong>Intel(R) SpeedStep(tm)</strong> to <strong>Enabled</strong> AND <strong>Intel(R) Speed Shift Technology</strong> to <strong>Enabled</strong>.<br/><span class="bios-subtext">On this generation of Intel motherboards, SpeedStep enables P-States while Speed Shift delegates millisecond-level autonomous hardware clock scaling.</span>`;
            } else if (moboPlatform.id.includes('modern')) {
                // 12th–15th Gen
                if (moboPlatform.vendor === 'asus')
                    cpuPath =
                        'Advanced (F7) ➔ CPU Configuration ➔ CPU - Power Management Control ➔ Intel(R) Speed Shift Technology';
                else if (moboPlatform.vendor === 'msi') cpuPath = 'OC ➔ CPU Features ➔ Intel Speed Shift Technology';
                else cpuPath = 'Tweaker ➔ Advanced CPU Settings ➔ Intel Speed Shift';

                cpuDetail = `Set <strong>Intel(R) Speed Shift Technology</strong> to <strong>Enabled</strong>.`;
            } else {
                cpuPath = 'Advanced ➔ CPU Configuration ➔ Enhanced Intel SpeedStep (EIST)';
                cpuDetail = `Set <strong>Enhanced Intel SpeedStep (EIST)</strong> to <strong>Enabled</strong>.`;
            }
        }

        items.push(`
            <li class="bios-setting-tree-item">
                <div class="bios-breadcrumb-tag">${cpuPath}</div>
                <div><strong>CPU Clock Autonomous Scheduling:</strong></div>
                <div>${cpuDetail}</div>
            </li>
        `);

        // 3. RESIZABLE BAR & ABOVE 4G DECODING
        let rebarPath: string;
        if (moboPlatform.vendor === 'asus')
            rebarPath = 'Top Bar Shortcut (F9) OR Advanced ➔ PCI Subsystem Settings ➔ Re-Size BAR Support';
        else if (moboPlatform.vendor === 'msi')
            rebarPath = 'Settings ➔ Advanced ➔ PCIe / PCI Subsystem Settings ➔ Re-Size BAR Support';
        else if (moboPlatform.vendor === 'gigabyte')
            rebarPath = 'Settings ➔ IO Ports ➔ Re-Size BAR Support & Above 4G Decoding';
        else if (moboPlatform.vendor === 'asrock')
            rebarPath = 'Advanced ➔ Chipset Configuration ➔ Above 4G Decoding & Re-Size BAR';
        else rebarPath = 'Advanced ➔ PCI Configuration ➔ Resizable BAR';

        if (currentGpu.supportsRebar && moboPlatform.supportsRebarDefault) {
            items.push(`
                <li class="bios-setting-tree-item">
                    <div class="bios-breadcrumb-tag">${rebarPath}</div>
                    <div><strong>Above 4G Decoding &amp; Re-Size BAR:</strong> Set to <strong>Enabled / Auto</strong>.</div>
                    <div class="bios-subtext">Supported by ${currentGpu.name}. Allows the CPU to address the full GPU VRAM frame buffer simultaneously.</div>
                </li>
            `);
        } else {
            items.push(`
                <li class="bios-setting-tree-item">
                    <div class="bios-breadcrumb-tag">${rebarPath}</div>
                    <div><strong>Re-Size BAR Support:</strong> Set to <strong style="color:var(--accent-rose)">Disabled</strong>.</div>
                    <div class="bios-subtext">${currentGpu.name} does not support Resizable BAR. Disabling prevents black-screen post delays on older display controllers.</div>
                </li>
            `);
        }

        // 4. PRIMARY DISPLAY / IGPU
        let igpuPath: string;
        if (moboPlatform.vendor === 'asus')
            igpuPath = 'Advanced (F7) ➔ System Agent (SA) Configuration ➔ Graphics Configuration';
        else if (moboPlatform.vendor === 'msi') igpuPath = 'Settings ➔ Advanced ➔ Integrated Graphics Configuration';
        else if (moboPlatform.vendor === 'gigabyte')
            igpuPath = 'Settings ➔ IO Ports ➔ Initial Display Output & Internal Graphics';
        else igpuPath = 'Advanced ➔ Chipset Configuration ➔ Primary Graphics Adapter';

        items.push(`
            <li class="bios-setting-tree-item">
                <div class="bios-breadcrumb-tag">${igpuPath}</div>
                <div><strong>Primary Display Output:</strong> Set to <strong>PEG / PCIe Slot 1</strong>. Set <em>Integrated Graphics (iGPU)</em> to <strong>Disabled</strong>.</div>
                <div class="bios-subtext">Desktop only: Frees up to 2 GB of system RAM reserved for motherboard video ports. (Keep enabled on laptops or if using Intel QuickSync for video encoding).</div>
            </li>
        `);

        // 5. PCIE ASPM (ACTIVE STATE POWER MANAGEMENT)
        let aspmPath: string;
        if (moboPlatform.vendor === 'asus')
            aspmPath = 'Advanced ➔ Platform Misc Configuration ➔ PCI Express Native Power Management';
        else if (moboPlatform.vendor === 'msi')
            aspmPath = 'Settings ➔ Advanced ➔ PCIe / PCI Subsystem Settings ➔ PCIe ASPM';
        else if (moboPlatform.vendor === 'gigabyte') aspmPath = 'Settings ➔ Miscellaneous ➔ PCIe ASPM Mode';
        else aspmPath = 'Advanced ➔ Chipset Configuration ➔ PCIe ASPM Support';

        items.push(`
            <li class="bios-setting-tree-item">
                <div class="bios-breadcrumb-tag">${aspmPath}</div>
                <div><strong>PCIe ASPM Support:</strong> Set to <strong>Disabled</strong>.</div>
                <div class="bios-subtext">Stops high-speed PCIe lanes from dropping into low-power sleep states, eliminating frame transition hitches.</div>
            </li>
        `);

        // 6. CSM BOOT MODE
        let csmPath: string;
        if (moboPlatform.vendor === 'asus') csmPath = 'Boot ➔ CSM (Compatibility Support Module) ➔ Launch CSM';
        else if (moboPlatform.vendor === 'msi')
            csmPath = 'Settings ➔ Advanced ➔ Windows OS Configuration ➔ BIOS UEFI/CSM Mode';
        else if (moboPlatform.vendor === 'gigabyte') csmPath = 'Boot ➔ CSM Support';
        else csmPath = 'Boot ➔ CSM';

        items.push(`
            <li class="bios-setting-tree-item">
                <div class="bios-breadcrumb-tag">${csmPath}</div>
                <div><strong>CSM (Compatibility Support Module):</strong> Set to <strong>Disabled (Pure UEFI)</strong>.</div>
                ${currentGpu.family === 'nvidia-pascal' ? '<div class="bios-subtext">⚠️ Pascal DP Note: If your GTX 1070 screen goes black during boot over DisplayPort 1.3/1.4 with CSM off, run the official <a href="https://www.nvidia.com/en-us/drivers/nv-uefi-update-x64/" target="_blank" rel="noopener" class="link-chip">NVIDIA DisplayPort UEFI Firmware Update Tool ↗</a>.</div>' : ''}
            </li>
        `);

        p2BiosSettingsList.innerHTML = items.join('');
    }

    function renderDynamicHardware(): void {
        if (!hwDynamicContent) return;
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        hwDynamicContent.innerHTML = getCpuGuidance(profile) + getGpuGuidance(currentGpu);

        if (hagsText) {
            if (currentGpu.recommendHags) {
                hagsText.innerHTML = `
                    Navigate to: <strong>Windows Settings (Win+I) ➔ System ➔ Display ➔ Graphics ➔ Change default graphics settings</strong>.<br/>
                    • <strong>Set to ON:</strong> Recommended for ${currentGpu.name} (low CPU scheduling overhead and required for DLSS 3 Frame Generation).
                `;
            } else {
                hagsText.innerHTML = `
                    Navigate to: <strong>Windows Settings (Win+I) ➔ System ➔ Display ➔ Graphics ➔ Change default graphics settings</strong>.<br/>
                    • <strong style="color:var(--accent-rose);">SET TO OFF FOR ${currentGpu.name}:</strong> Pascal cards lack hardware scheduling ASICs on the die. Enabling HAGS on GTX 10-series causes micro-stuttering and inconsistent frame pacing. Keep it <strong>OFF</strong>.
                `;
            }
        }
    }

    function renderCttBlueprint(): void {
        const essentialBox = document.getElementById('ctt-box-essential');
        const advancedBox = document.getElementById('ctt-box-advanced');
        const preferencesBox = document.getElementById('ctt-box-preferences');
        const featuresBox = document.getElementById('ctt-box-features');

        if (!essentialBox || !advancedBox || !preferencesBox || !featuresBox) return;

        function renderRow(item: CttItemBlueprint): string {
            const badge =
                item.action === 'CHECK'
                    ? '<span class="status-indicator on">✓ SET ON</span>'
                    : item.action === 'UNCHECK'
                      ? '<span class="status-indicator off">✕ LEAVE OFF</span>'
                      : '<span class="status-indicator opt">⚡ OPTIONAL</span>';

            return `
                <div class="ctt-row-card ${item.action.toLowerCase()}">
                    <div class="ctt-row-header">
                        ${badge}
                        <span class="ctt-row-label">${item.label}</span>
                    </div>
                    <div class="ctt-row-why">${item.why}</div>
                </div>
            `;
        }

        essentialBox.innerHTML = CTT_ESSENTIAL_ITEMS.map(renderRow).join('');
        advancedBox.innerHTML = CTT_ADVANCED_ITEMS.map(renderRow).join('');
        preferencesBox.innerHTML = CTT_PREFERENCE_ITEMS.map(renderRow).join('');
        featuresBox.innerHTML = CTT_FEATURE_ITEMS.map(renderRow).join('');
    }

    document.querySelectorAll('.ctt-accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            if (!targetId) return;
            const body = document.getElementById(targetId);
            const chevron = header.querySelector('.acc-chevron');

            if (!body) return;
            const isOpen = body.style.display !== 'none';

            if (isOpen) {
                body.style.display = 'none';
                if (chevron) chevron.textContent = '▸';
                header.classList.remove('open');
            } else {
                body.style.display = 'flex';
                if (chevron) chevron.textContent = '▾';
                header.classList.add('open');
            }
        });
    });

    function setupCopyButtons(): void {
        document.querySelectorAll('.copy-btn-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const textToCopy = btn.getAttribute('data-copy') ?? '';
                if (!textToCopy) return;

                void navigator.clipboard.writeText(textToCopy);
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied!';

                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1400);
            });
        });
    }

    function renderAll(): void {
        renderAdvisoryBanner();
        renderPhase1();
        renderPhase2();
        renderDynamicHardware();
        renderCttBlueprint();
    }

    osSelect?.addEventListener('change', () => {
        profile.os = osSelect.value as HardwareProfile['os'];
        save();
        renderAll();
    });

    // 1. When Motherboard changes, auto-align CPU architecture
    moboSelect?.addEventListener('change', () => {
        profile.mobo = moboSelect.value as MoboPlatformId;
        const currentMobo = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[0];

        if (currentMobo.isAmd) {
            // If switched to AMD board but CPU is currently Intel, auto-snap CPU to AMD
            if (profile.cpu.startsWith('intel')) {
                profile.cpu = currentMobo.id.includes('am5') ? 'amd-x3d-single' : 'amd-standard';
            }
        } else {
            // If switched to Intel board but CPU is currently AMD, auto-snap CPU to Intel
            if (profile.cpu.startsWith('amd')) {
                profile.cpu = currentMobo.id.includes('modern') ? 'intel-raptor' : 'intel-legacy';
            } else if (currentMobo.id.includes('modern') && profile.cpu === 'intel-legacy') {
                profile.cpu = 'intel-raptor';
            } else if (
                currentMobo.id.includes('300-500') &&
                (profile.cpu === 'intel-raptor' || profile.cpu === 'intel-alder')
            ) {
                profile.cpu = 'intel-legacy';
            }
        }

        if (cpuSelect) cpuSelect.value = profile.cpu;
        save();
        renderAll();
    });

    // 2. When CPU changes, auto-align Motherboard platform (preserving vendor preference)
    cpuSelect?.addEventListener('change', () => {
        profile.cpu = cpuSelect.value as HardwareProfile['cpu'];
        const currentMobo = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[0];
        const vendor = currentMobo.vendor === 'oem' ? 'asus' : currentMobo.vendor;

        if (profile.cpu === 'amd-x3d-dual') {
            // 7900X3D/7950X3D are strictly AM5
            profile.mobo = `${vendor}-amd-am5` as MoboPlatformId;
        } else if (profile.cpu === 'amd-x3d-single' || profile.cpu === 'amd-standard') {
            // Keep on AM4 or AM5 if already on AMD, otherwise default to AM5
            if (!currentMobo.isAmd) {
                profile.mobo = `${vendor}-amd-am5` as MoboPlatformId;
            }
        } else if (profile.cpu === 'intel-raptor' || profile.cpu === 'intel-alder') {
            // 12th/13th/14th Gen strictly require 600/700/800 series
            if (vendor === 'asrock') {
                profile.mobo = 'asrock-intel';
            } else {
                profile.mobo = `${vendor}-intel-modern` as MoboPlatformId;
            }
        } else {
            // 6th–11th Gen Monolithic Intel (intel-legacy)
            if (vendor === 'asrock') {
                profile.mobo = 'asrock-intel';
            } else {
                profile.mobo = `${vendor}-intel-300-500` as MoboPlatformId;
            }
        }

        // Verify the board exists in the database fallback
        if (!MOBO_PLATFORMS.some(m => m.id === profile.mobo)) {
            profile.mobo = 'asus-intel-modern';
        }

        if (moboSelect) moboSelect.value = profile.mobo;
        save();
        renderAll();
    });

    gpuSelect?.addEventListener('change', () => {
        profile.gpuId = gpuSelect.value;
        save();
        renderAll();
    });

    ramSelect?.addEventListener('change', () => {
        profile.ramId = ramSelect.value;
        save();
        renderAll();
    });

    renderAll();
    setupCopyButtons();
}
