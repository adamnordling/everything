// =============================================================================
// WINDOWS OPTIMIZATION & HARDWARE-AWARE PLAYBOOK ENGINE
// =============================================================================

export interface HardwareProfile {
    os: 'win10' | 'win11';
    mobo: 'asus' | 'msi' | 'gigabyte' | 'asrock' | 'oem';
    cpu: 'amd-x3d-dual' | 'amd-x3d-single' | 'amd-standard' | 'intel-raptor' | 'intel-alder' | 'intel-legacy';
    gpuId: string;
    ramId: string;
}

interface GpuModelSpec {
    id: string;
    name: string;
    keywords: string[];
    family: 'nvidia-pascal' | 'nvidia-turing' | 'nvidia-modern' | 'amd-rdna' | 'intel-arc';
    supportsRebar: boolean;
    recommendHags: boolean;
    preferredOs: 'win10' | 'win11' | 'both';
}

interface RamModelSpec {
    id: string;
    name: string;
    generation: 'DDR3' | 'DDR4' | 'DDR5';
    speedMHz: number;
    channels: 'single' | 'dual' | 'quad';
    isJedecStock: boolean;
}

const GPU_DATABASE: GpuModelSpec[] = [
    // NVIDIA Pascal (GTX 10-series)
    { id: 'gtx-1080-ti', name: 'NVIDIA GeForce GTX 1080 Ti', keywords: ['1080 ti', '1080ti'], family: 'nvidia-pascal', supportsRebar: false, recommendHags: false, preferredOs: 'win10' },
    { id: 'gtx-1080', name: 'NVIDIA GeForce GTX 1080', keywords: ['gtx 1080', '1080'], family: 'nvidia-pascal', supportsRebar: false, recommendHags: false, preferredOs: 'win10' },
    { id: 'gtx-1070-ti', name: 'NVIDIA GeForce GTX 1070 Ti', keywords: ['1070 ti', '1070ti'], family: 'nvidia-pascal', supportsRebar: false, recommendHags: false, preferredOs: 'win10' },
    { id: 'gtx-1070', name: 'NVIDIA GeForce GTX 1070', keywords: ['gtx 1070', '1070'], family: 'nvidia-pascal', supportsRebar: false, recommendHags: false, preferredOs: 'win10' },
    { id: 'gtx-1060', name: 'NVIDIA GeForce GTX 1060', keywords: ['gtx 1060', '1060'], family: 'nvidia-pascal', supportsRebar: false, recommendHags: false, preferredOs: 'win10' },

    // NVIDIA Turing (GTX 16 / RTX 20-series)
    { id: 'rtx-2080-ti', name: 'NVIDIA GeForce RTX 2080 Ti', keywords: ['2080 ti', '2080ti'], family: 'nvidia-turing', supportsRebar: false, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-2080', name: 'NVIDIA GeForce RTX 2080 / Super', keywords: ['2080'], family: 'nvidia-turing', supportsRebar: false, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-2070', name: 'NVIDIA GeForce RTX 2070 / Super', keywords: ['2070'], family: 'nvidia-turing', supportsRebar: false, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-2060', name: 'NVIDIA GeForce RTX 2060 / Super', keywords: ['2060'], family: 'nvidia-turing', supportsRebar: false, recommendHags: true, preferredOs: 'both' },
    { id: 'gtx-1660', name: 'NVIDIA GeForce GTX 1660 / Super / Ti', keywords: ['1660'], family: 'nvidia-turing', supportsRebar: false, recommendHags: true, preferredOs: 'both' },

    // NVIDIA Ampere / Ada / Blackwell (RTX 30 / 40 / 50-series)
    { id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060 / 3060 Ti', keywords: ['3060'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-3070', name: 'NVIDIA GeForce RTX 3070 / 3070 Ti', keywords: ['3070'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-3080', name: 'NVIDIA GeForce RTX 3080 / 3080 Ti', keywords: ['3080'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-3090', name: 'NVIDIA GeForce RTX 3090 / 3090 Ti', keywords: ['3090'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060 / 4060 Ti', keywords: ['4060'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070 / Super / Ti', keywords: ['4070'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080 / Super', keywords: ['4080'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090', keywords: ['4090'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'rtx-5080', name: 'NVIDIA GeForce RTX 5080 / 5090', keywords: ['5080', '5090'], family: 'nvidia-modern', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },

    // AMD Radeon (RDNA 2 / 3 / 4)
    { id: 'rx-6600', name: 'AMD Radeon RX 6600 / XT', keywords: ['6600'], family: 'amd-rdna', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rx-6700-xt', name: 'AMD Radeon RX 6700 XT / 6750 XT', keywords: ['6700', '6750'], family: 'amd-rdna', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rx-6800-xt', name: 'AMD Radeon RX 6800 / 6800 XT', keywords: ['6800'], family: 'amd-rdna', supportsRebar: true, recommendHags: true, preferredOs: 'both' },
    { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT / 7900 GRE', keywords: ['7800', '7900 gre'], family: 'amd-rdna', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XT / XTX', keywords: ['7900 xt', '7900 xtx', '7900xt'], family: 'amd-rdna', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },

    // Intel Arc
    { id: 'arc-a580', name: 'Intel Arc A580 / A750', keywords: ['a580', 'a750'], family: 'intel-arc', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'arc-a770', name: 'Intel Arc A770 (16GB)', keywords: ['a770'], family: 'intel-arc', supportsRebar: true, recommendHags: true, preferredOs: 'win11' },
    { id: 'arc-b580', name: 'Intel Arc B580 / Battlemage', keywords: ['b580', 'battlemage'], family: 'intel-arc', supportsRebar: true, recommendHags: true, preferredOs: 'win11' }
];

const RAM_DATABASE: RamModelSpec[] = [
    // DDR5 High Performance & Sweet Spot
    { id: 'ddr5-6000-dual', name: 'DDR5 32GB+ (2 Sticks) @ 6000 MHz (AM5 / Intel Sweet Spot)', generation: 'DDR5', speedMHz: 6000, channels: 'dual', isJedecStock: false },
    { id: 'ddr5-6400-dual', name: 'DDR5 32GB+ (2 Sticks) @ 6400–7200 MHz (Intel High-Speed XMP)', generation: 'DDR5', speedMHz: 6400, channels: 'dual', isJedecStock: false },
    { id: 'ddr5-5600-dual', name: 'DDR5 16GB/32GB (2 Sticks) @ 5200–5600 MHz (Standard XMP)', generation: 'DDR5', speedMHz: 5600, channels: 'dual', isJedecStock: false },
    { id: 'ddr5-4800-dual', name: 'DDR5 16GB/32GB (2 Sticks) @ 4800 MHz (JEDEC Stock — XMP/EXPO OFF!)', generation: 'DDR5', speedMHz: 4800, channels: 'dual', isJedecStock: true },
    { id: 'ddr5-quad', name: 'DDR5 4 Sticks (4x16GB/32GB — Heavy Memory Controller Strain)', generation: 'DDR5', speedMHz: 4800, channels: 'quad', isJedecStock: false },
    { id: 'ddr5-single', name: 'DDR5 Single Stick (1x16GB/32GB — Single-Channel Bottleneck)', generation: 'DDR5', speedMHz: 4800, channels: 'single', isJedecStock: false },

    // DDR4 Mainstream & Overclocked
    { id: 'ddr4-3600-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 3600 MHz (Peak AM4 / Intel Gear 1)', generation: 'DDR4', speedMHz: 3600, channels: 'dual', isJedecStock: false },
    { id: 'ddr4-3200-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 3200 MHz (Standard High-Speed XMP)', generation: 'DDR4', speedMHz: 3200, channels: 'dual', isJedecStock: false },
    { id: 'ddr4-2666-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 2666–2933 MHz', generation: 'DDR4', speedMHz: 2666, channels: 'dual', isJedecStock: false },
    { id: 'ddr4-2133-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 2133–2400 MHz (JEDEC Stock — XMP OFF!)', generation: 'DDR4', speedMHz: 2133, channels: 'dual', isJedecStock: true },
    { id: 'ddr4-quad', name: 'DDR4 4 Sticks (4x8GB/16GB — Dual-Channel Dual-Rank)', generation: 'DDR4', speedMHz: 3200, channels: 'quad', isJedecStock: false },
    { id: 'ddr4-single', name: 'DDR4 Single Stick (1x8GB/16GB — Severe 50% Bandwidth Penalty)', generation: 'DDR4', speedMHz: 2666, channels: 'single', isJedecStock: false },

    // DDR3 Legacy
    { id: 'ddr3-1600-dual', name: 'DDR3 8GB/16GB (2 Sticks) @ 1600–1866 MHz (Legacy Platform)', generation: 'DDR3', speedMHz: 1600, channels: 'dual', isJedecStock: false },
    { id: 'ddr3-single', name: 'DDR3 Single Stick (Legacy Single-Channel)', generation: 'DDR3', speedMHz: 1600, channels: 'single', isJedecStock: false }
];

const MOBO_DATA: Record<HardwareProfile['mobo'], { name: string; toolName: string; supportUrl: string; memoryProfileName: string }> = {
    asus: { name: 'ASUS / ROG', toolName: 'EZ Flash 3', supportUrl: 'https://www.asus.com/support/download-center/', memoryProfileName: 'XMP (Intel) or D.O.C.P. / EXPO (AMD)' },
    msi: { name: 'MSI (Micro-Star)', toolName: 'M-Flash', supportUrl: 'https://www.msi.com/support/download/', memoryProfileName: 'XMP / A-XMP / EXPO' },
    gigabyte: { name: 'Gigabyte / AORUS', toolName: 'Q-Flash', supportUrl: 'https://www.gigabyte.com/Support/Motherboard', memoryProfileName: 'XMP / EXPO' },
    asrock: { name: 'ASRock', toolName: 'Instant Flash', supportUrl: 'https://www.asrock.com/support/index.asp', memoryProfileName: 'XMP / EXPO' },
    oem: { name: 'OEM / Dell / HP / Lenovo / Other', toolName: 'BIOS Flash / Firmware Update', supportUrl: 'https://www.google.com/search?q=motherboard+bios+update+download', memoryProfileName: 'XMP / Custom Profile' }
};

const STORAGE_KEY = 'everything_winopt_profile_v4';

export function initWindowsOptimizer(): void {
    const osSelect = document.getElementById('winopt-os-select') as HTMLSelectElement | null;
    const moboSelect = document.getElementById('winopt-mobo-select') as HTMLSelectElement | null;
    const cpuSelect = document.getElementById('winopt-cpu-select') as HTMLSelectElement | null;
    const gpuSelect = document.getElementById('winopt-gpu-select') as HTMLSelectElement | null;
    const ramSelect = document.getElementById('winopt-ram-select') as HTMLSelectElement | null;

    const parseInput = document.getElementById('winopt-spec-paste-input') as HTMLInputElement | null;
    const parseBtn = document.getElementById('winopt-spec-parse-btn');
    const parseStatus = document.getElementById('winopt-spec-parse-status');

    // Dynamic Phase Elements
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
            // Safe guard
        }
    }

    // Populate GPU dropdown directly
    function populateGpuSelect(): void {
        if (!gpuSelect) return;
        gpuSelect.innerHTML = GPU_DATABASE.map(
            g => `<option value="${g.id}" ${g.id === profile.gpuId ? 'selected' : ''}>${g.name}</option>`
        ).join('');
    }

    // Populate RAM dropdown directly
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

    // -------------------------------------------------------------------------
    // 1. ADVANCED SPEC AUTO-PARSER (5-DIMENSION MATCHER)
    // -------------------------------------------------------------------------
    function parseHardwareString(raw: string): void {
        const text = raw.toLowerCase().replace(/\^/g, ' ');
        let detectedMobo = false;
        let detectedCpu = false;
        let detectedGpu = false;
        let detectedRam = false;

        // 1. Motherboard
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
        } else if (text.includes('dell') || text.includes('alienware') || text.includes('lenovo') || text.includes('hp')) {
            profile.mobo = 'oem';
            detectedMobo = true;
        }

        // 2. CPU
        if (text.includes('7900x3d') || text.includes('7950x3d') || text.includes('9900x3d') || text.includes('9950x3d')) {
            profile.cpu = 'amd-x3d-dual';
            detectedCpu = true;
        } else if (text.includes('5700x3d') || text.includes('5800x3d') || text.includes('7800x3d') || text.includes('9800x3d') || text.includes('x3d')) {
            profile.cpu = 'amd-x3d-single';
            detectedCpu = true;
        } else if (text.includes('ryzen') || text.includes('threadripper') || (text.includes('amd') && !text.includes('radeon'))) {
            profile.cpu = 'amd-standard';
            detectedCpu = true;
        } else if (text.includes('13th gen') || text.includes('14th gen') || /i[579]-1[34]\d{3}/.test(text)) {
            profile.cpu = 'intel-raptor';
            detectedCpu = true;
        } else if (text.includes('12th gen') || text.includes('ultra') || /i[579]-12\d{3}/.test(text)) {
            profile.cpu = 'intel-alder';
            detectedCpu = true;
        } else if (text.includes('intel') || /i[3579]-/.test(text) || text.includes('xeon')) {
            profile.cpu = 'intel-legacy'; // e.g. i7-9700K
            detectedCpu = true;
        }

        // 3. GPU (Longest keyword match)
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

        // 4. RAM Telemetry Parser
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
        } else if (text.includes('ddr4')) {
            profile.ramId = isSingleStick ? 'ddr4-single' : 'ddr4-3200-dual';
            detectedRam = true;
        } else if (text.includes('ddr5')) {
            profile.ramId = isSingleStick ? 'ddr5-single' : 'ddr5-6000-dual';
            detectedRam = true;
        }

        // Automatic OS Alignment for Legacy GPUs
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
            const hits = [detectedMobo && 'Mobo', detectedCpu && 'CPU', detectedGpu && 'GPU', detectedRam && 'RAM'].filter(Boolean).join(', ');
            parseStatus.textContent = hits ? `✓ Configured: ${hits}` : 'Could not match hardware string. Select manually.';
            parseStatus.style.color = hits ? 'var(--accent-mint)' : 'var(--accent-amber)';
        }
    }

    parseBtn?.addEventListener('click', () => {
        if (!parseInput || !parseInput.value.trim()) return;
        parseHardwareString(parseInput.value);
    });

    // -------------------------------------------------------------------------
    // 2. HARDWARE ADVISORY ENGINE (CROSS-VALIDATING ALL 5 CHOICES)
    // -------------------------------------------------------------------------
    function renderAdvisoryBanner(): void {
        if (!advisoryBanner) return;

        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) || GPU_DATABASE[0]!;
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) || RAM_DATABASE[0]!;
        const alerts: string[] = [];

        // 1. Single Channel RAM Alert
        if (currentRam.channels === 'single') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 SEVERE MEMORY BOTTLENECK: SINGLE-CHANNEL DETECTED!</div>
                    Your system is operating on a single 64-bit channel. This cuts memory bandwidth by <strong>50%</strong> and causes severe frame-time spikes and micro-stuttering in modern games.
                    <br/><strong>Fix:</strong> Install a matching dual-stick kit in <strong>Slots 2 & 4 (A2 & B2)</strong> to unlock full Dual-Channel throughput.
                </div>
            `);
        }

        // 2. JEDEC Fallback Alert
        if (currentRam.isJedecStock) {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ RAM RUNNING AT JEDEC BASE SPEED (${currentRam.speedMHz} MHz):</div>
                    Your ${currentRam.generation} RAM is currently running at factory base fallback frequencies. In Phase 2, enable <strong>${MOBO_DATA[profile.mobo].memoryProfileName}</strong> in your BIOS to unlock your advertised memory speed.
                </div>
            `);
        }

        // 3. DDR5 4-Stick Warning
        if (currentRam.id === 'ddr5-quad') {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ 4-STICK DDR5 CONFIGURATION DETECTED:</div>
                    Running 4 sticks of DDR5 severely strains the processor's memory controller. Systems often fail memory training at 6000MHz+ and downclock to 3600–4400MHz. For optimal gaming latency and high-speed stability, <strong>2 sticks in Slots 2 & 4</strong> are strictly recommended for DDR5.
                </div>
            `);
        }

        // 4. Pascal GPU Alert
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

        // 5. Intel 13th / 14th Gen Microcode Degradation
        if (profile.cpu === 'intel-raptor') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 CRITICAL INTEL 13th/14th GEN HARDWARE WARNING:</div>
                    Applies to both Windows 10 & 11: Update your ${MOBO_DATA[profile.mobo].name} motherboard to BIOS with <strong>microcode 0x12B</strong> or newer to prevent irreversible silicon degradation caused by elevated voltage requests. Enforce Intel Default Power Limits (PL1/PL2 = 253W max).
                </div>
            `);
        }

        // 6. AMD Dual-CCD X3D
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

    // -------------------------------------------------------------------------
    // 3. RENDER PHASE 1 (OS & RUFUS & OOBE PROTOCOL)
    // -------------------------------------------------------------------------
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
                ? `Windows 10 is free to evaluate indefinitely directly from Microsoft. No product key is required to complete installation. Unactivated Windows runs indefinitely without performance throttling or gaming caps. For older GPUs (GTX 1070, etc.) and monolithic CPUs (i7-9700K), Windows 10 has less Desktop Window Manager (DWM) composition overhead.`
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

    // -------------------------------------------------------------------------
    // 4. DYNAMIC PHASE 2 (COMPREHENSIVE BIOS SETTINGS ENGINE)
    // -------------------------------------------------------------------------
    function renderPhase2(): void {
        const moboInfo = MOBO_DATA[profile.mobo];
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) || GPU_DATABASE[0]!;
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) || RAM_DATABASE[0]!;

        if (p2MoboToolName) p2MoboToolName.textContent = `${moboInfo.name} (${moboInfo.toolName})`;
        if (p2MoboLink) {
            p2MoboLink.href = moboInfo.supportUrl;
            p2MoboLink.textContent = `Open ${moboInfo.name} BIOS Portal ↗`;
        }

        if (p2BiosSettingsList) {
            const items: string[] = [];

            // 1. Memory Profile Calibration
            items.push(`
                <li>
                    <strong>Memory Profile (${moboInfo.memoryProfileName}):</strong> Set to <strong>Profile 1</strong>.
                    <br/><span style="color:var(--text-secondary)">Ensures your ${currentRam.name} operates at its advertised frequency rather than factory JEDEC fallback.</span>
                </li>
            `);

            // 2. Memory Gear Mode
            if (currentRam.generation === 'DDR4') {
                items.push(`<li><strong>Memory Gear Mode:</strong> Ensure <strong>Gear 1</strong> is selected (1:1 memory controller clock for lowest latency on DDR4).</li>`);
            } else if (currentRam.generation === 'DDR5' && (profile.cpu === 'amd-x3d-single' || profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-standard')) {
                items.push(`<li><strong>UCLK / FCLK Ratio (AMD AM5):</strong> Set <strong>UCLK=MEMCLK</strong> (1:1 ratio, optimal at 6000MHz with FCLK set to 2000MHz).</li>`);
            }

            // 3. Primary Display / iGPU
            items.push(`<li><strong>Primary Display / iGPU:</strong> Set Primary Display to <strong>PEG / PCIe</strong>. Set <em>Integrated Graphics (iGPU Multi-Monitor)</em> to <strong>Disabled</strong> to prevent Windows from reserving 1–2GB of system RAM for an unused display adapter.</li>`);

            // 4. ReBAR rule based on GPU
            if (currentGpu.supportsRebar) {
                items.push(`<li><strong>Above 4G Decoding & Re-Size BAR:</strong> Set to <strong>Enabled / Auto</strong> (Supported by ${currentGpu.name}).</li>`);
            } else {
                items.push(`<li><strong>Re-Size BAR Support:</strong> <strong>Disabled / Not Applicable</strong> (${currentGpu.name} does not support ReBAR).</li>`);
            }

            // 5. Speed Shift / CPPC
            items.push(`<li><strong>Intel Speed Shift (HWP) / AMD CPPC:</strong> Set to <strong>Enabled</strong> (Switches CPU clock states in ~1ms via on-die hardware instead of 30ms via OS ACPI).</li>`);

            // 6. PCIe ASPM
            items.push(`<li><strong>PCIe ASPM (Active State Power Management):</strong> Set to <strong>Disabled</strong> (Stops PCIe slots from dropping into low-power link states, eliminating frame transition latency).</li>`);

            // 7. CSM & DisplayPort warning for Pascal
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

            // 8. Global C-States
            items.push(`<li><strong>Global C-States:</strong> Set to <strong>Auto / Enabled</strong> (Crucial: Do not disable C-States, as active cores need idle cores to sleep to hit maximum boost frequencies).</li>`);

            // 9. Fast Boot
            items.push(`<li><strong>Fast Boot (in BIOS):</strong> Set to <strong>Disabled</strong> (Ensures complete hardware cold-boot initialization and RAM training).</li>`);

            p2BiosSettingsList.innerHTML = items.join('');
        }
    }

    // -------------------------------------------------------------------------
    // 5. RENDER PHASE 4 (HARDWARE DRIVER FOUNDATION)
    // -------------------------------------------------------------------------
    function renderDynamicHardware(): void {
        if (!hwDynamicContent) return;

        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) || GPU_DATABASE[0]!;
        let cpuGuidance = '';
        let gpuGuidance = '';

        if (profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-x3d-single') {
            cpuGuidance = `
                <div class="hw-block">
                    <div class="hw-block-header" style="color:var(--accent-amber)">
                        <span>⚡ AMD Ryzen 3D V-Cache Engine</span>
                        <a href="https://www.amd.com/en/support/download/drivers.html" target="_blank" rel="noopener" class="link-chip">AMD Chipset Drivers ↗</a>
                    </div>
                    <ul class="clean-bullet-list">
                        <li>Install bare AMD Chipset Driver from AMD.com. Confirm <em>AMD 3D V-Cache Performance Optimizer Service</em> is running in <code>services.msc</code>.</li>
                        ${profile.cpu === 'amd-x3d-dual' ? '<li><strong>Dual-CCD Rule:</strong> Keep Xbox Game Bar installed so Windows parks standard cores during games.</li>' : '<li><strong>Single-CCD Note:</strong> All cores share the 3D cache directly; no core-parking service dependencies needed.</li>'}
                    </ul>
                </div>
            `;
        } else if (profile.cpu === 'intel-raptor') {
            cpuGuidance = `
                <div class="hw-block">
                    <div class="hw-block-header" style="color:var(--accent-rose)">
                        <span>⚡ Intel 13th / 14th Gen Raptor Lake</span>
                        <a href="https://www.intel.com/content/www/us/en/download-center/home.html" target="_blank" rel="noopener" class="link-chip">Intel Drivers ↗</a>
                    </div>
                    <ul class="clean-bullet-list">
                        <li>Enforce <strong>Intel Default Settings</strong> in ${MOBO_DATA[profile.mobo].name} BIOS. Ensure microcode 0x12B is active to avoid overvoltage degradation.</li>
                    </ul>
                </div>
            `;
        } else if (profile.cpu === 'intel-legacy') {
            cpuGuidance = `
                <div class="hw-block">
                    <div class="hw-block-header" style="color:var(--accent-sky)">
                        <span>⚡ Intel Core 9th Gen / Monolithic (e.g. i7-9700K)</span>
                    </div>
                    <ul class="clean-bullet-list">
                        <li>All physical cores are equal. Keep Windows Power Plan on <strong>Balanced</strong> to allow active cores to boost to max single-core turbo.</li>
                    </ul>
                </div>
            `;
        } else {
            cpuGuidance = `
                <div class="hw-block">
                    <div class="hw-block-header" style="color:var(--accent-sky)">
                        <span>⚡ CPU Chipset Drivers</span>
                    </div>
                    <ul class="clean-bullet-list">
                        <li>Install clean chipset drivers directly from your processor manufacturer.</li>
                    </ul>
                </div>
            `;
        }

        // GPU Specific
        if (currentGpu.family === 'nvidia-pascal') {
            gpuGuidance = `
                <div class="hw-block" style="margin-top: 10px;">
                    <div class="hw-block-header" style="color:var(--accent-mint)">
                        <span>🎮 ${currentGpu.name} (Pascal Clean Setup)</span>
                        <a href="https://www.techpowerup.com/download/techpowerup-nvcleanstall/" target="_blank" rel="noopener" class="link-chip">NVCleanstall ↗</a>
                    </div>
                    <ul class="clean-bullet-list">
                        <li><strong>NVCleanstall:</strong> Select <em>"Display Driver + PhysX"</em> only. Check <em>"Disable Installer Telemetry"</em> and <em>"Perform Clean Install"</em>.</li>
                        <li><strong>Windows Settings:</strong> Keep <strong>HAGS (Hardware Accelerated GPU Scheduling) OFF</strong>.</li>
                        <li><strong>NVIDIA Control Panel:</strong>
                            <div class="settings-mini-table">
                                <div><span class="k">Power Management Mode:</span> <span class="v">Normal</span> (Avoid high idle clocks and excess heat)</div>
                                <div><span class="k">Low Latency Mode:</span> <span class="v">On</span></div>
                                <div><span class="k">Texture filtering - Quality:</span> <span class="v">High Performance</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
            `;
        } else {
            gpuGuidance = `
                <div class="hw-block" style="margin-top: 10px;">
                    <div class="hw-block-header" style="color:var(--accent-mint)">
                        <span>🎮 ${currentGpu.name} Setup</span>
                        <a href="https://www.techpowerup.com/download/techpowerup-nvcleanstall/" target="_blank" rel="noopener" class="link-chip">NVCleanstall ↗</a>
                    </div>
                    <ul class="clean-bullet-list">
                        <li>Install bare drivers with telemetry stripped. Keep HAGS <strong>ON</strong>.</li>
                    </ul>
                </div>
            `;
        }

        hwDynamicContent.innerHTML = cpuGuidance + gpuGuidance;
    }

    function setupCopyButtons(): void {
        document.querySelectorAll('.copy-btn-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const textToCopy = btn.getAttribute('data-copy') || '';
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