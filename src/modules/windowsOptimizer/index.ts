import { type HardwareProfile, type GpuModelSpec, GPU_DATABASE, RAM_DATABASE, MOBO_DATA } from './hardwareData';
import {
    type CttItemBlueprint,
    CTT_ESSENTIAL_ITEMS,
    CTT_ADVANCED_ITEMS,
    CTT_PREFERENCE_ITEMS,
    CTT_FEATURE_ITEMS
} from './cttBlueprint';
import { WINDOWS_OPTIMIZER_HTML } from './template';

const STORAGE_KEY = 'everything_winopt_profile_v8';

function getCpuGuidance(profile: HardwareProfile): string {
    const moboInfo = MOBO_DATA[profile.mobo];
    if (profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-x3d-single') {
        return `
            <div class="hw-block">
                <div class="hw-block-header" style="color:var(--accent-amber)">
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
                <div class="hw-block-header" style="color:var(--accent-rose)">
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
            <div class="hw-block-header" style="color:var(--accent-sky)">
                <span>⚡ Intel Monolithic Chipset Drivers (e.g. i7-9700K)</span>
                <a href="${moboInfo.supportUrl}" target="_blank" rel="noopener" class="link-chip">Motherboard Driver Portal ↗</a>
            </div>
            <ul class="clean-bullet-list">
                <li>Install <strong>Intel INF Chipset Software</strong> and <strong>Intel ME</strong> directly from your ${moboInfo.name} motherboard portal. Avoid third-party driver-updater utilities.</li>
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
            <li><strong>NVCleanstall Settings (Pascal):</strong> Select bare <em>"Display Driver + PhysX"</em> only. Check <em>"Disable Installer Telemetry"</em> and <em>"Perform Clean Install"</em>. Keep HAGS <strong>OFF</strong>.</li>
        `;
    } else if (isModernNvidia) {
        specificSettings = `
            <li><strong>NVCleanstall Settings (Modern RTX):</strong> Install bare Display Driver + PhysX + HD Audio (if using HDMI/DP sound). Check <em>"Disable Installer Telemetry"</em>. Keep HAGS <strong>ON</strong>.</li>
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
            <div class="hw-block-header" style="color:var(--accent-mint)">
                <span>🎮 Tailored GPU Driver Package (${currentGpu.name})</span>
                <a href="${currentGpu.directDownloadUrl}" target="_blank" rel="noopener" class="link-chip">Official Driver .EXE ↗</a>
            </div>
            <div class="driver-match-box">
                <div><strong>Target Driver Build:</strong> <span style="color:var(--accent-mint); font-family:var(--font-mono);">${currentGpu.recommendedDriverVersion}</span></div>
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

    let profile: HardwareProfile = {
        os: 'win10',
        mobo: 'asus',
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

        if (text.includes('asus') || text.includes('rog') || text.includes('strix')) {
            profile.mobo = 'asus';
            detectedMobo = true;
        } else if (text.includes('msi') || text.includes('micro-star')) {
            profile.mobo = 'msi';
            detectedMobo = true;
        } else if (text.includes('gigabyte') || text.includes('aorus')) {
            profile.mobo = 'gigabyte';
            detectedMobo = true;
        } else if (text.includes('asrock')) {
            profile.mobo = 'asrock';
            detectedMobo = true;
        } else if (
            text.includes('dell') ||
            text.includes('alienware') ||
            text.includes('lenovo') ||
            text.includes('hp')
        ) {
            profile.mobo = 'oem';
            detectedMobo = true;
        }

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

        if (profile.gpuId.includes('1070') || profile.gpuId.includes('1080') || profile.gpuId.includes('1060')) {
            profile.os = 'win10';
        }

        if (osSelect) osSelect.value = profile.os;
        if (moboSelect) moboSelect.value = profile.mobo;
        if (cpuSelect) cpuSelect.value = profile.cpu;
        populateGpuSelect();
        populateRamSelect();
        if (gpuSelect) gpuSelect.value = profile.gpuId;
        if (ramSelect) ramSelect.value = profile.ramId;

        save();
        renderAll();

        if (parseStatus) {
            const hits = [detectedMobo && 'Mobo', detectedCpu && 'CPU', detectedGpu && 'GPU', detectedRam && 'RAM']
                .filter(Boolean)
                .join(', ');
            parseStatus.textContent = hits
                ? `✓ Configured: ${hits}`
                : 'Could not match hardware string. Select manually.';
            parseStatus.style.color = hits ? 'var(--accent-mint)' : 'var(--accent-amber)';
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
                    Your ${currentRam.generation} RAM is currently running at factory base fallback frequencies. In Phase 2, enable <strong>${MOBO_DATA[profile.mobo].memoryProfileName}</strong> in your BIOS to unlock your advertised memory speed.
                </div>
            `);
        }

        if (currentGpu.family === 'nvidia-pascal') {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ PASCAL ARCHITECTURE CALIBRATION (${currentGpu.name}):</div>
                    <div>1. <strong>Turn HAGS OFF</strong> in Windows Display settings. Pascal lacks hardware-level scheduling ASICs; HAGS causes frame pacing micro-stutter.</div>
                    <div>2. <strong>PCIe Resizable BAR is NOT supported</strong> on GTX 10-series.</div>
                    <div>3. <strong>OS Choice:</strong> Windows 10 22H2 delivers tighter 1% low frame pacing than Windows 11 on Pascal + monolithic Intel setups.</div>
                </div>
            `);
        }

        if (profile.cpu === 'intel-raptor') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 CRITICAL INTEL 13th/14th GEN HARDWARE WARNING:</div>
                    Applies to both Windows 10 &amp; 11: Update your ${MOBO_DATA[profile.mobo].name} motherboard to BIOS with <strong>microcode 0x12B</strong> or newer to prevent irreversible silicon degradation caused by elevated voltage requests. Enforce Intel Default Power Limits (PL1/PL2 = 253W max).
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
                    <div style="font-weight:700; color:var(--accent-mint); margin-bottom:4px;">
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
                    <span><strong>DO NOT connect Ethernet or Wi-Fi during installation.</strong> Remain completely offline until Phase 4 to prevent Windows Update from silently downloading generic GPU drivers.</span>
                </div>
                <div style="margin-top: 8px; font-size: 0.76rem; color: var(--text-secondary);">
                    ${
                        isWin10
                            ? `When asked for a network, click <em>"I don't have internet"</em> ➔ <em>"Continue with limited setup"</em>. Set all privacy sliders to <strong>OFF / No</strong>.`
                            : `If Windows 11 demands Wi-Fi, press <kbd>Shift</kbd> + <kbd>F10</kbd>, type <code>OOBE\\BYPASSNRO</code>, and hit Enter. The PC reboots with an <em>"I don't have internet"</em> option unlocked.`
                    }
                </div>
            `;
        }
    }

    function renderPhase2(): void {
        const moboInfo = MOBO_DATA[profile.mobo];
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0];

        if (p2MoboToolName) p2MoboToolName.textContent = `${moboInfo.name} (${moboInfo.toolName})`;
        if (p2MoboLink) {
            p2MoboLink.href = moboInfo.supportUrl;
            p2MoboLink.textContent = `Open ${moboInfo.name} BIOS Portal ↗`;
        }

        if (p2BiosSettingsList) {
            const items: string[] = [];

            items.push(`
                <li>
                    <strong>Memory Profile (${moboInfo.memoryProfileName}):</strong> Set to <strong>Profile 1</strong>.
                    <br/><span style="color:var(--text-secondary)">Ensures your ${currentRam.name} operates at its advertised frequency rather than factory JEDEC fallback.</span>
                </li>
            `);

            if (currentRam.generation === 'DDR4') {
                items.push(
                    `<li><strong>Memory Gear Mode:</strong> Ensure <strong>Gear 1</strong> is selected (1:1 memory controller clock for lowest latency on DDR4).</li>`
                );
            } else if (
                currentRam.generation === 'DDR5' &&
                (profile.cpu === 'amd-x3d-single' || profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-standard')
            ) {
                items.push(
                    `<li><strong>UCLK / FCLK Ratio (AMD AM5):</strong> Set <strong>UCLK=MEMCLK</strong> (1:1 ratio, optimal at 6000MHz with FCLK set to 2000MHz).</li>`
                );
            }

            items.push(`
                <li>
                    <strong>Primary Display / iGPU:</strong> Set Primary Display to <strong>PEG / PCIe</strong>. Set <em>Integrated Graphics (iGPU Multi-Monitor)</em> to <strong>Disabled</strong>.
                    <br/><span style="color:var(--text-secondary)">*Desktop only with monitor plugged directly into dedicated GPU. Frees 1–2 GB RAM. Keep enabled on laptops or if using Intel QuickSync for video encoding.</span>
                </li>
            `);

            if (currentGpu.supportsRebar) {
                items.push(
                    `<li><strong>Above 4G Decoding &amp; Re-Size BAR:</strong> Set to <strong>Enabled / Auto</strong> (Supported by ${currentGpu.name}).</li>`
                );
            } else {
                items.push(
                    `<li><strong>Re-Size BAR Support:</strong> <strong>Disabled / Not Applicable</strong> (${currentGpu.name} does not support ReBAR).</li>`
                );
            }

            items.push(
                `<li><strong>Intel Speed Shift (HWP) / AMD CPPC:</strong> Set to <strong>Enabled</strong> (Switches CPU clock states in ~1ms via on-die hardware instead of 30ms via OS ACPI).</li>`
            );
            items.push(
                `<li><strong>PCIe ASPM (Active State Power Management):</strong> Set to <strong>Disabled</strong> (Stops PCIe slots from dropping into low-power link states, eliminating frame transition latency).</li>`
            );

            if (currentGpu.family === 'nvidia-pascal') {
                items.push(`
                    <li>
                        <strong>CSM (Compatibility Support Module):</strong> Set to <strong>Disabled</strong> (Pure UEFI). 
                        <br/><span style="color:var(--accent-amber)">⚠️ Pascal DisplayPort Note: If experiencing black screens on boot with CSM disabled over DP 1.3/1.4 on your GTX 1070, run the official <a href="https://www.nvidia.com/en-us/drivers/nv-uefi-update-x64/" target="_blank" rel="noopener" class="link-chip">NVIDIA DisplayPort UEFI Firmware Update Tool ↗</a>.</span>
                    </li>
                `);
            } else {
                items.push(`<li><strong>CSM:</strong> Set to <strong>Disabled</strong> (Pure UEFI Boot Mode).</li>`);
            }

            items.push(
                `<li><strong>Global C-States:</strong> Set to <strong>Auto / Enabled</strong> (Crucial: Do not disable C-States, as active cores need idle cores to sleep to hit maximum boost frequencies).</li>`
            );
            items.push(
                `<li><strong>Fast Boot (in BIOS):</strong> Set to <strong>Disabled</strong> (Ensures complete hardware cold-boot initialization and RAM training).</li>`
            );

            p2BiosSettingsList.innerHTML = items.join('');
        }
    }

    function renderDynamicHardware(): void {
        if (!hwDynamicContent) return;
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        hwDynamicContent.innerHTML = getCpuGuidance(profile) + getGpuGuidance(currentGpu);
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

    moboSelect?.addEventListener('change', () => {
        profile.mobo = moboSelect.value as HardwareProfile['mobo'];
        save();
        renderAll();
    });

    cpuSelect?.addEventListener('change', () => {
        profile.cpu = cpuSelect.value as HardwareProfile['cpu'];
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
