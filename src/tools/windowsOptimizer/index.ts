import {
    type HardwareProfile,
    type GpuModelSpec,
    type MoboPlatformId,
    type MoboPlatformSpec,
    type FormFactor,
    type StorageType,
    type NetworkType,
    GPU_DATABASE,
    RAM_DATABASE,
    MOBO_PLATFORMS,
    getPagefileRecommendation,
    NVIDIA_3D_SETTINGS_DATABASE,
    AMD_ADRENALIN_SETTINGS_DATABASE,
    INTEL_GRAPHICS_SETTINGS_DATABASE
} from './hardwareData';
import {
    type CttItemBlueprint,
    getCttEssentialItems,
    getCttPreferenceItems,
    CTT_ADVANCED_ITEMS,
    CTT_FEATURE_ITEMS
} from './cttBlueprint';
import template from './windowsView.html?raw';
import { copyText } from '../../core/dom';

const STORAGE_KEY = 'everything_winopt_profile_v11';

function getCpuGuidance(profile: HardwareProfile): string {
    const moboPlatform = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[0];

    if (profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-x3d-single' || profile.cpu === 'amd-standard') {
        const isX3d = profile.cpu !== 'amd-standard';
        return `
            <div class="hw-block">
                <div class="hw-block-header">
                    <span>AMD Ryzen Chipset Drivers</span>
                    <a href="https://www.amd.com/en/support/download/drivers.html" target="_blank" rel="noopener" class="link-chip">AMD Official Chipset Setup ↗</a>
                </div>
                <ul class="clean-bullet-list">
                    <li>Install the latest <strong>AMD Chipset Software</strong> directly from AMD.com (not Windows Update or OEM suites).</li>
                    ${isX3d ? '<li>Verify <em>AMD 3D V-Cache Performance Optimizer Service</em> is running in <code>services.msc</code>.</li>' : ''}
                    ${profile.cpu === 'amd-x3d-dual' ? '<li><strong>Dual-CCD Rule:</strong> Keep Xbox Game Bar installed so Windows parks standard cores during games.</li>' : ''}
                </ul>
            </div>
        `;
    }

    if (profile.cpu === 'intel-raptor' || profile.cpu === 'intel-alder' || profile.cpu === 'intel-core-ultra') {
        return `
            <div class="hw-block">
                <div class="hw-block-header">
                    <span>Modern Intel Hybrid Chipset &amp; ME (${profile.formFactor === 'laptop' ? 'Mobile' : 'Desktop'})</span>
                    <a href="${moboPlatform.supportUrl}" target="_blank" rel="noopener" class="link-chip">Official Support Portal ↗</a>
                </div>
                <ul class="clean-bullet-list">
                    <li>Install <strong>Intel Chipset Device Software (INF)</strong> and <strong>Intel Management Engine (ME)</strong> from your ${profile.formFactor === 'laptop' ? 'laptop OEM' : 'motherboard'} support page.</li>
                    ${profile.cpu === 'intel-core-ultra' ? '<li><strong>Core Ultra Note:</strong> Install the <strong>Intel NPU Driver</strong> if using AI offload features, and stay on Windows 11 for Thread Director support.</li>' : ''}
                    ${profile.cpu === 'intel-raptor' && profile.formFactor === 'desktop' ? '<li>Confirm Intel Default Power Limits (PL1/PL2 = 253W max) and BIOS microcode <strong>0x12B+</strong> are active.</li>' : ''}
                </ul>
            </div>
        `;
    }

    return `
        <div class="hw-block">
            <div class="hw-block-header">
                <span>Intel Monolithic Chipset &amp; Device Manager Audit (${moboPlatform.name})</span>
                <a href="${moboPlatform.supportUrl}" target="_blank" rel="noopener" class="link-chip">Official Support Portal ↗</a>
            </div>
            <ul class="clean-bullet-list">
                <li><strong>Device Manager Audit First:</strong> Press <kbd>Win</kbd> + <kbd>X</kbd> ➔ <strong>Device Manager</strong>. Expand <em>&ldquo;Other devices&rdquo;</em> and <em>&ldquo;System devices&rdquo;</em>.</li>
                <li><strong>No yellow exclamation marks (!):</strong> Windows already mapped your INF descriptors — no manual INF install required.</li>
                <li><strong>Yellow warnings present:</strong> Install <strong>Intel Chipset Device Software (INF)</strong> and <strong>Intel Management Engine (ME)</strong> from your support portal.</li>
            </ul>
        </div>
    `;
}

function getGpuGuidance(currentGpu: GpuModelSpec, profile: HardwareProfile): string {
    const isOptimus =
        profile.formFactor === 'laptop' && (profile.hasHybridIgpu || currentGpu.family.startsWith('nvidia'));
    const isPascal = currentGpu.family === 'nvidia-pascal';
    const isNvidia = currentGpu.family.startsWith('nvidia');
    const isAmd = currentGpu.family.startsWith('amd');
    const isIntelIgpu = currentGpu.family === 'intel-igpu';

    let specificSettings = '';
    if (isOptimus) {
        specificSettings = `
            <li><strong>MANDATORY OPTIMUS INSTALL ORDER:</strong> Install your <strong>Intel/AMD iGPU driver FIRST</strong> ➔ Reboot (still offline) ➔ Then install <strong>${currentGpu.name}</strong> choosing <em>Custom ➔ Clean installation</em>.</li>
            <li><strong>OEM Fallback Note:</strong> If NVIDIA&apos;s generic notebook installer says <em>&ldquo;No compatible graphics hardware found&rdquo;</em>, use your laptop OEM&apos;s certified VGA driver first.</li>
        `;
    } else if (isPascal) {
        specificSettings = `
            <li><strong>Official Installer Setup (Pascal):</strong> Choose <em>Custom (Advanced)</em> ➔ Check <strong>&ldquo;Perform a clean installation&rdquo;</strong>. Install Display Driver + PhysX only. Keep HAGS <strong>OFF</strong>.</li>
        `;
    } else if (isNvidia) {
        specificSettings = `
            <li><strong>Official Installer Setup (RTX / Turing):</strong> Choose <em>Custom (Advanced)</em> ➔ Check <strong>&ldquo;Perform a clean installation&rdquo;</strong>. Keep HAGS <strong>ON</strong>.</li>
            ${profile.os === 'win10' && currentGpu.family === 'nvidia-modern' ? '<li><strong>Windows 10 Driver Note:</strong> Regular RTX Game Ready updates for Windows 10 ended Oct 2026; use the final supported Win10 branch or upgrade to Windows 11.</li>' : ''}
        `;
    } else if (isAmd) {
        specificSettings = `
            <li><strong>AMD Adrenalin:</strong> Select <strong>&ldquo;Minimal Install&rdquo;</strong> to skip streaming/telemetry bloat.${currentGpu.supportsRebar ? ' Enable Smart Access Memory (SAM).' : ''}</li>
        `;
    } else if (isIntelIgpu) {
        specificSettings = `
            <li><strong>Intel Integrated Graphics:</strong> Install the official Intel WHQL package (or OEM certified driver if your laptop blocks generic Intel packages).</li>
        `;
    } else {
        specificSettings = `
            <li><strong>Intel Arc Discrete:</strong> Install latest Intel Arc WHQL package. ReBAR must be enabled in BIOS.</li>
        `;
    }

    return `
        <div class="hw-block" style="margin-top: 10px;">
            <div class="hw-block-header">
                <span>Tailored GPU Driver Package (${currentGpu.name})</span>
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

let isInitialized = false;

export function initWindowsOptimizer(): void {
    const viewPanel = document.getElementById('view-tool-winopt');
    if (!viewPanel) return;

    if (isInitialized) return;
    isInitialized = true;

    // 1. Only inject HTML if it hasn't been injected yet
    if (!viewPanel.querySelector('.winopt-container')) {
        viewPanel.innerHTML = template;

        // 2. Event delegation for CTT Accordions (100% reliable)
        viewPanel.addEventListener('click', (e: MouseEvent) => {
            const copyBtn = (e.target as HTMLElement | null)?.closest<HTMLButtonElement>('.copy-btn-trigger');
            if (copyBtn) {
                const textToCopy = copyBtn.getAttribute('data-copy') ?? '';
                if (textToCopy) {
                    copyText(textToCopy, copyBtn);
                }
                return;
            }

            const header = (e.target as HTMLElement | null)?.closest<HTMLButtonElement>('.ctt-accordion-header');
            if (!header) return;

            const targetId = header.getAttribute('data-target');
            if (!targetId) return;

            const body = document.getElementById(targetId);
            const chevron = header.querySelector('.acc-chevron');
            if (!body) return;

            // Toggle open state
            const isCurrentlyOpen = header.classList.contains('open') || body.style.display === 'flex';

            if (isCurrentlyOpen) {
                body.style.display = 'none';
                header.classList.remove('open');
                if (chevron) chevron.textContent = '▸';
            } else {
                body.style.display = 'flex';
                header.classList.add('open');
                if (chevron) chevron.textContent = '▾';
            }
        });
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
    const biosPasteInput = document.getElementById('p2-bios-paste-input') as HTMLInputElement | null;
    const biosGoogleLink = document.getElementById('p2-bios-google-link') as HTMLAnchorElement | null;
    const biosDetectedBadge = document.getElementById('p2-bios-detected-badge');

    const advisoryBanner = document.getElementById('hw-advisory-banner');
    const hwDynamicContent = document.getElementById('hw-dynamic-content');

    const formSelect = document.getElementById('winopt-form-select') as HTMLSelectElement | null;
    const storageSelect = document.getElementById('winopt-storage-select') as HTMLSelectElement | null;
    const networkSelect = document.getElementById('winopt-network-select') as HTMLSelectElement | null;

    let profile: HardwareProfile = {
        os: 'win10',
        formFactor: 'desktop',
        mobo: 'asus-intel-300-500',
        cpu: 'intel-legacy',
        gpuId: 'gtx-1070',
        hasHybridIgpu: false,
        ramId: 'ddr4-3200-dual',
        storage: 'nvme',
        network: 'ethernet'
    };

    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('everything_winopt_profile_v10');
    if (saved) {
        try {
            profile = { ...profile, ...(JSON.parse(saved) as Partial<HardwareProfile>) };
        } catch {
            // Keep default
        }
    }



    function updateBiosLookupLink(): void {
        if (!biosPasteInput || !biosGoogleLink) return;
        const raw = biosPasteInput.value.trim();

        if (!raw) {
            biosGoogleLink.href = 'https://www.google.com/search?q=motherboard+bios+update+download';
            if (biosDetectedBadge) biosDetectedBadge.style.display = 'none';
            return;
        }

        const [modelPart, biosPart] = raw.split('|');
        const cleanModel = (modelPart ?? raw)
            .replace(/to be filled by o\.e\.m\./gi, '')
            .replace(/system product name/gi, '')
            .replace(/default string/gi, '')
            .replace(/lnvnb161216/gi, '')
            .replace(/\s+/g, ' ')
            .trim();

        const query = `${cleanModel || raw} BIOS update download`;
        biosGoogleLink.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        if (biosDetectedBadge) {
            const biosVersion = biosPart?.replace(/bios:/i, '').trim() ?? '';
            if (biosVersion) {
                biosDetectedBadge.textContent = `Your BIOS: ${biosVersion}`;
                biosDetectedBadge.style.display = 'inline-flex';
            } else {
                biosDetectedBadge.style.display = 'none';
            }
        }
    }

    biosPasteInput?.addEventListener('input', updateBiosLookupLink);
    function renderPhase4Ddu(): void {
        const dduMount = document.getElementById('p4-ddu-protocol-mount');
        if (!dduMount) return;

        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        const isOptimus =
            profile.formFactor === 'laptop' && (profile.hasHybridIgpu || currentGpu.family.startsWith('nvidia'));
        const isIgpuOnly = currentGpu.family === 'intel-igpu' || currentGpu.family === 'amd-igpu';

        dduMount.innerHTML = `
            <strong style="color: var(--text-primary)">Step 2: DDU Safe Mode Deep Clean Protocol:</strong>
            <ol class="ordered-step-list">
                <li><strong>DISCONNECT FROM THE INTERNET:</strong> Unplug Ethernet or turn off Wi-Fi until Step 4 is finished.</li>
                <li><strong>Boot Safe Mode:</strong> Hold <kbd>Shift</kbd> + Restart ➔ Troubleshoot ➔ Advanced Options ➔ Startup Settings ➔ Restart ➔ Press <kbd>4</kbd>. ${profile.formFactor === 'laptop' ? '<em>(Have your Windows Password ready — PIN sometimes fails in Safe Mode, and check BitLocker is off first!)</em>' : ''}</li>
                <li>
                    <strong>Run DDU in Safe Mode:</strong>
                    <ul class="clean-bullet-list" style="margin-top:4px;">
                        ${
                            isOptimus
                                ? `
                            <li><strong>1. Clean Dedicated GPU (${currentGpu.name}):</strong> Select <strong>GPU ➔ NVIDIA/AMD</strong> ➔ Click <em>&ldquo;Clean and do NOT restart&rdquo;</em>.</li>
                            <li><strong>2. Clean Integrated GPU:</strong> Select <strong>GPU ➔ Intel (or AMD)</strong> ➔ Click <strong>&ldquo;Clean and Restart&rdquo;</strong>.</li>
                        `
                                : isIgpuOnly
                                  ? `
                            <li><strong>Clean Integrated GPU:</strong> Select <strong>GPU ➔ ${currentGpu.family === 'intel-igpu' ? 'Intel' : 'AMD'}</strong> ➔ Click <strong>&ldquo;Clean and Restart&rdquo;</strong>.</li>
                        `
                                  : `
                            <li><strong>Clean Dedicated GPU:</strong> Select <strong>GPU ➔ ${currentGpu.family.startsWith('amd') ? 'AMD' : currentGpu.family.startsWith('intel') ? 'Intel' : 'NVIDIA'}</strong> ➔ Click <strong>&ldquo;Clean and Restart&rdquo;</strong>.</li>
                        `
                        }
                    </ul>
                </li>
                <li>
                    ${
                        isOptimus
                            ? '<strong>Install Drivers Offline in Strict Order:</strong> Install your <strong>Intel/AMD iGPU driver FIRST</strong> ➔ Reboot ➔ Then install your <strong>NVIDIA/AMD dedicated driver</strong>.'
                            : '<strong>Stay offline</strong> after reboot and run your pre-downloaded GPU installer executable.'
                    }
                </li>
            </ol>
        `;
    }

    function renderPhase4Settings(): void {
        const prereqsMount = document.getElementById('p4-display-prereqs-mount');
        const settingsMount = document.getElementById('p4-driver-settings-table-mount');
        const titleEl = document.getElementById('p4-driver-control-title');
        const badgeEl = document.getElementById('p4-driver-control-badge');
        const descEl = document.getElementById('p4-driver-control-desc');

        if (!prereqsMount || !settingsMount) return;

        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        const isIntelLegacy = profile.cpu === 'intel-legacy';
        const isAmdGpu =
            currentGpu.family === 'amd-rdna' ||
            currentGpu.family === 'amd-gcn-legacy' ||
            currentGpu.family === 'amd-igpu';
        const isIntelGpu = currentGpu.family === 'intel-arc' || currentGpu.family === 'intel-igpu';
        const isOptimus =
            profile.formFactor === 'laptop' && (profile.hasHybridIgpu || currentGpu.family.startsWith('nvidia'));

        // 1. INTEL ARC / INTEL iGPU
        if (isIntelGpu) {
            if (titleEl) titleEl.textContent = `Step 3: Intel Graphics Calibration (${currentGpu.name}):`;
            if (badgeEl) badgeEl.textContent = 'Intel Graphics';
            if (descEl) {
                descEl.textContent =
                    'Configure Windows Display refresh rate + Intel Graphics Command Center / Intel Arc Control:';
            }
            prereqsMount.innerHTML = `
                <div class="latency-grid">
                    <div class="latency-item" style="border-color: var(--accent-brand);">
                        <strong style="color:var(--text-primary);">1. Windows Native Refresh Rate:</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            Open <strong>Win+I ➔ System ➔ Display ➔ Advanced display</strong> and ensure the refresh rate is at your monitor&apos;s maximum Hz.
                        </p>
                    </div>
                    <div class="latency-item" style="border-color: var(--accent-brand);">
                        <strong style="color:var(--text-primary);">2. Graphics Preference (Laptop / iGPU):</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            Keep power mode on Balanced when unplugged and High Performance when plugged into AC mains.
                        </p>
                    </div>
                </div>
            `;
            settingsMount.innerHTML = `
                <div class="latency-grid">
                    ${INTEL_GRAPHICS_SETTINGS_DATABASE.map(
                        item => `
                        <div class="latency-item" style="border-color: var(--accent-brand);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; gap:6px;">
                                <strong style="color:var(--text-primary); font-size:0.78rem;">${item.name}</strong>
                                <span class="pill-badge">${item.recommended}</span>
                            </div>
                            <p style="font-size:0.72rem; color:var(--text-secondary); margin:0; line-height:1.4;">${item.why}</p>
                        </div>
                    `
                    ).join('')}
                </div>
            `;
            return;
        }

        // 2. AMD RADEON
        if (isAmdGpu) {
            if (titleEl) titleEl.textContent = 'Step 3: AMD Software: Adrenalin Edition Calibration:';
            if (badgeEl) badgeEl.textContent = 'Radeon Adrenalin';
            if (descEl) {
                descEl.textContent =
                    'Open AMD Software (Alt+R) ➔ Gaming. Configure Display prerequisites, then apply 3D settings:';
            }

            prereqsMount.innerHTML = `
                <div class="latency-grid">
                    <div class="latency-item" style="border-color: rgba(214, 93, 100, 0.3);">
                        <strong style="color:var(--text-primary);">1. Display Refresh Rate &amp; FreeSync:</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            Go to <strong>Gaming ➔ Display</strong>. Confirm <em>AMD FreeSync</em> is <strong>Enabled</strong> and verify your panel refresh rate is at its native maximum.
                        </p>
                    </div>
                    <div class="latency-item" style="border-color: rgba(214, 93, 100, 0.3);">
                        <strong style="color:var(--text-primary);">2. Pixel Format (Full 0–255 RGB):</strong>
                        <p style="font-size:0.72rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.4;">
                            Under <strong>Gaming ➔ Display ➔ Pixel Format</strong>: Select <strong>RGB 4:4:4 Pixel Format PC Standard (Full RGB)</strong>.
                        </p>
                    </div>
                </div>
            `;

            settingsMount.innerHTML = `
                <div class="latency-grid">
                    ${AMD_ADRENALIN_SETTINGS_DATABASE.map(
                        item => `
                        <div class="latency-item" style="border-color: rgba(214, 93, 100, 0.3);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <strong style="color:var(--text-primary); font-size:0.78rem;">${item.name}</strong>
                                <span class="pill-badge" style="color:var(--accent-rose);">${item.recommended}</span>
                            </div>
                            <p style="font-size:0.72rem; color:var(--text-secondary); margin:0; line-height:1.4;">${item.why}</p>
                        </div>
                    `
                    ).join('')}
                </div>
            `;
            return;
        }

        // 3. NVIDIA (OPTIMUS LAPTOP vs DESKTOP)
        if (titleEl) titleEl.textContent = `Step 3: NVIDIA Control Panel Calibration (${currentGpu.name}):`;
        if (badgeEl) {
            badgeEl.textContent = isOptimus
                ? 'Optimus Laptop Calibrated'
                : currentGpu.family === 'nvidia-pascal'
                  ? 'Pascal Calibrated'
                  : 'Modern RTX Calibrated';
        }
        if (descEl) {
            descEl.innerHTML = isOptimus
                ? 'On Optimus laptops, the <strong>Display</strong> tab is intentionally hidden because your iGPU drives the screen. Assign games to your dedicated GPU below, then apply 3D settings:'
                : 'Complete the <strong>Display</strong> prerequisites first, then apply the <strong>Manage 3D settings</strong> matrix below:';
        }

        prereqsMount.innerHTML = isOptimus
            ? `
                <div class="latency-grid">
                    <div class="latency-item" style="border-color: var(--accent-brand);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:var(--text-primary);">A. Force Games onto ${currentGpu.name}:</strong>
                            <span class="pill-badge">Win+I ➔ Display ➔ Graphics</span>
                        </div>
                        <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                            Optimus laptops sometimes launch games on the weak Intel/AMD iGPU by mistake. Open <strong>Windows Settings ➔ System ➔ Display ➔ Graphics</strong>, browse for your game <code>.exe</code>, click <strong>Options</strong>, and select <strong>High performance (${currentGpu.name})</strong>.
                        </p>
                    </div>
                    <div class="latency-item" style="border-color: var(--accent-brand);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:var(--text-primary);">B. Internal Panel Hz &amp; Full Range RGB:</strong>
                            <span class="pill-badge">iGPU Control Panel</span>
                        </div>
                        <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                            Set panel refresh rate in <strong>Win+I ➔ Display ➔ Advanced display</strong>. For external HDMI/DP monitors connected via the iGPU, set <strong>Full Range (0–255)</strong> inside Intel Graphics Command Center.
                        </p>
                    </div>
                </div>
            `
            : `
                <div class="latency-grid">
                    <div class="latency-item" style="border-color: var(--accent-brand);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:var(--text-primary);">A. Escape the 60Hz &ldquo;Ultra HD&rdquo; Trap:</strong>
                            <span class="pill-badge" style="color:var(--accent-brand);">Display ➔ Change resolution</span>
                        </div>
                        <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                            Scroll down past &ldquo;Ultra HD, HD, SD&rdquo; to the <strong>&ldquo;PC&rdquo;</strong> section to unlock your monitor&apos;s true <strong>144Hz–360Hz+</strong> refresh rate.
                        </p>
                    </div>
                    <div class="latency-item" style="border-color: var(--accent-brand);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:var(--text-primary);">B. Full Output Dynamic Range (0–255 RGB):</strong>
                            <span class="pill-badge" style="color:var(--accent-brand);">Change resolution ➔ Step 3</span>
                        </div>
                        <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                            Select <strong>&ldquo;Use NVIDIA color settings&rdquo;</strong> and change Output dynamic range from Limited (16–235) to <strong>Full (0–255)</strong>.
                        </p>
                    </div>
                    <div class="latency-item">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:var(--text-primary);">C. G-Sync Setup Protocol:</strong>
                            <span class="pill-badge">Display ➔ Set up G-SYNC</span>
                        </div>
                        <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                            Check <strong>Enable G-SYNC, G-SYNC Compatible</strong> for full screen mode and confirm your display is checked in Step 3.
                        </p>
                    </div>
                    <div class="latency-item">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:var(--text-primary);">D. Desktop Color Depth:</strong>
                            <span class="pill-badge">8 bpc vs 10 bpc</span>
                        </div>
                        <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                            Set <strong>8 bpc</strong> for standard sRGB monitors, or <strong>10 bpc</strong> on native 10-bit panels.
                        </p>
                    </div>
                </div>
            `;

        const categories = ['Latency & Sync', 'Performance & Cache', 'Textures & Quality', 'Antialiasing'] as const;
        settingsMount.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                    <span style="font-family:var(--font-mono); font-size:0.76rem; font-weight:800; color:var(--text-primary); text-transform:uppercase;">
                        Manage 3D Settings (Global Settings Tab)
                    </span>
                    <span class="pill-badge" style="font-size:0.65rem;">28 Settings Codified</span>
                </div>
                ${categories
                    .map(category => {
                        const items = NVIDIA_3D_SETTINGS_DATABASE.filter(s => s.category === category);
                        return `
                        <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:6px; padding:10px 12px;">
                            <div style="font-family:var(--font-mono); font-size:0.72rem; font-weight:800; color:var(--accent-brand); text-transform:uppercase; margin-bottom:8px; border-bottom:1px solid var(--border-subtle); padding-bottom:4px;">
                                ${category}
                            </div>
                            <div class="latency-grid">
                                ${items
                                    .map(item => {
                                        const val = item.getValue(currentGpu, isIntelLegacy);
                                        const why = item.why(currentGpu, isIntelLegacy);
                                        const borderStyle = item.isHighlighted
                                            ? 'border-color: var(--accent-brand);'
                                            : '';
                                        return `
                                       <div class="latency-item" style="${borderStyle}">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:6px; gap:6px;">
        <strong style="color:var(--text-primary); font-size:0.76rem; flex: 1 1 auto;">${item.name}</strong>
        <span class="pill-badge">${val}</span>
    </div>
    <p style="font-size:0.71rem; color:var(--text-secondary); margin:0; line-height:1.4;">${why}</p>
</div>
                                    `;
                                    })
                                    .join('')}
                            </div>
                        </div>
                    `;
                    })
                    .join('')}
            </div>
        `;
    }
    function renderPhase6(): void {
        const isLaptop = profile.formFactor === 'laptop';
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0];
        const { initMB, maxMB, badgeText, explanation } = getPagefileRecommendation(currentRam, profile.storage);

        // 1. Dynamic Power Script (Laptop preserves Hibernate + DC battery life; Desktop disables Hibernate)
        const powerMount = document.getElementById('p6-power-mount');
        if (powerMount) {
            const powerCmd = isLaptop
                ? 'powercfg -restoredefaultschemes; powercfg /change monitor-timeout-ac 10; powercfg /change standby-timeout-ac 30; powercfg /setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f; powercfg /setactive SCHEME_CURRENT'
                : 'powercfg -restoredefaultschemes; powercfg /change monitor-timeout-ac 15; powercfg /change standby-timeout-ac 0; powercfg /change disk-timeout-ac 0; powercfg /setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0; powercfg /hibernate off; powercfg /setactive SCHEME_CURRENT';

            const powerRevert = isLaptop
                ? 'powercfg -restoredefaultschemes; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f'
                : 'powercfg -restoredefaultschemes; powercfg /hibernate on';

            powerMount.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary);">Step 1: Calibrated Balanced Power (${isLaptop ? 'Laptop AC-Safe' : 'Desktop'}):</strong>
                    <span class="pill-badge" style="font-size:0.65rem;">${isLaptop ? 'Preserves Battery & Hibernate' : 'Silent Idle, Peak Boost'}</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    ${
                        isLaptop
                            ? 'Tunes <strong>AC plugged-in</strong> PCIe &amp; USB suspend to zero latency while leaving unplugged battery (DC) savings untouched. Disables Fast Startup (<code>HiberbootEnabled=0</code>) while keeping low-battery Hibernation active.'
                            : 'Sets Balanced mode so CPU clocks stay cool at idle while disabling PCIe ASPM, USB selective suspend, and Hibernation (reclaiming 16–32 GB SSD space). Uses a 15-min display sleep timeout (OLED-safe).'
                    }
                </p>
                <div class="terminal-code-window" style="margin-top:6px;">
                    <div class="terminal-bar">
                        <div class="terminal-badge"><span class="terminal-dot"></span><span>PowerShell (Admin)</span></div>
                        <button type="button" class="btn-action-pill copy-btn-trigger" data-copy='${powerCmd}'>Copy</button>
                    </div>
                    <pre class="terminal-code-body"><code>${powerCmd}</code></pre>
                </div>
                <div class="revert-box" style="margin-top:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                        <span class="revert-title">How to Revert / Undo:</span>
                        <button type="button" class="btn-text-link copy-btn-trigger" data-copy='${powerRevert}'>Copy Revert</button>
                    </div>
                    <span class="revert-text"><code>${powerRevert}</code></span>
                </div>
            `;
        }

        // 2. Dynamic Network Adapter (Ethernet vs Wi-Fi)
        const netMount = document.getElementById('p6-network-mount');
        if (netMount) {
            const showEth = profile.network === 'ethernet' || profile.network === 'both';
            const showWifi = profile.network === 'wifi' || profile.network === 'both';

            netMount.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <strong style="color:var(--text-primary);">Step 3: Network Adapter Optimization (${profile.network.toUpperCase()}):</strong>
                    <span class="pill-badge" style="font-size:0.65rem;">Device Manager</span>
                </div>
                <p style="font-size:0.75rem; color:var(--text-secondary); line-height:1.45; margin:4px 0 0 0;">
                    Press <kbd>Win</kbd> + <kbd>X</kbd> ➔ <strong>Device Manager</strong> ➔ <em>Network adapters</em> ➔ Right-click your active adapter ➔ <strong>Properties ➔ Advanced</strong>:
                </p>
                <ul class="clean-bullet-list" style="margin-top:6px;">
                    ${
                        showEth
                            ? `
                        <li><strong>Ethernet — Energy Efficient Ethernet (EEE) / Green Ethernet:</strong> Set to <strong>Disabled</strong> (prevents transceiver sleep jitter).</li>
                        <li><strong>Ethernet — Interrupt Moderation:</strong> Set to <strong>Enabled</strong> (or <em>Low</em> for competitive FPS).</li>
                        <li><strong>Ethernet — Receive Side Scaling (RSS):</strong> Set to <strong>Enabled</strong>.</li>
                    `
                            : ''
                    }
                    ${
                        showWifi
                            ? `
                        <li><strong>Wi-Fi — Preferred Band:</strong> Set to <strong>Prefer 5 GHz</strong> (or 6 GHz) to avoid congested 2.4 GHz ping spikes.</li>
                        <li><strong>Wi-Fi — Roaming Aggressiveness:</strong> Set to <strong>Lowest</strong> or <strong>Medium-Low</strong> so your laptop doesn&apos;t drop packets scanning APs mid-game.</li>
                        <li><strong>Wi-Fi — MIMO Power Save Mode:</strong> Set to <strong>No SMPS</strong> (when plugged in).</li>
                        <li><strong>Wi-Fi — Power Management Tab:</strong> Uncheck <em>&ldquo;Allow the computer to turn off this device to save power&rdquo;</em> if experiencing random disconnects.</li>
                    `
                            : ''
                    }
                </ul>
            `;
        }

        // 3. Dynamic Pagefile
        const badgeEl = document.getElementById('p6-pagefile-badge');
        const descEl = document.getElementById('p6-pagefile-desc');
        const codeEl = document.getElementById('p6-pagefile-code');
        const copyBtn = document.getElementById('p6-pagefile-copy-btn');

        const pagefileCmd = `Get-CimInstance Win32_ComputerSystem | Set-CimInstance -Property @{AutomaticManagedPagefile=$False}; Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" -Name "PagingFiles" -Value @("C:\\pagefile.sys ${initMB} ${maxMB}") -Type MultiString; Write-Host "Pagefile set to ${initMB}-${maxMB}MB on C:. Restart PC to apply." -ForegroundColor Green`;

        if (badgeEl) badgeEl.textContent = badgeText;
        if (descEl) descEl.textContent = explanation;
        if (codeEl) codeEl.textContent = pagefileCmd;
        if (copyBtn) copyBtn.setAttribute('data-copy', pagefileCmd);

        // 4. Dynamic Step 9 Tiles (Browser HWA, Polling, OEM Bloatware Replacement)
        const hwaMount = document.getElementById('p6-hwa-mount');
        if (hwaMount) {
            hwaMount.innerHTML = isLaptop
                ? `
                    <strong style="color:var(--text-primary);">App Hardware Acceleration (Laptop Safe):</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        • <strong>Chrome / Edge / Brave:</strong> Keep Hardware Acceleration <strong>ON</strong>! Turning it off on a laptop forces 1080p/4K video onto your CPU, draining battery and causing thermal throttling.<br/>
                        • <strong>Discord / Spotify:</strong> Toggle Hardware Acceleration <strong>OFF</strong> only inside Discord/Spotify if experiencing frame drops while gaming.
                    </p>
                `
                : `
                    <strong style="color:var(--text-primary);">App Hardware Acceleration (Desktop Gaming):</strong>
                    <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                        When gaming at 98% GPU load on mismatched-Hz multi-monitor setups, background GPU video streams can hitch DWM:<br/>
                        • <strong>Discord &amp; Spotify:</strong> Set Hardware Acceleration <strong>OFF</strong>.<br/>
                        • <strong>Browsers:</strong> Test <strong>OFF</strong> if dual-monitor streams stutter during games.
                    </p>
                `;
        }

        const pollingMount = document.getElementById('p6-polling-mount');
        if (pollingMount) {
            pollingMount.innerHTML = `
                <strong style="color:var(--text-primary);">Mouse Polling Rate (${isLaptop ? '1,000 Hz Max' : '1,000 Hz vs 4K/8K Hz'}):</strong>
                <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                    ${
                        isLaptop
                            ? 'Use <strong>500–1,000 Hz</strong> on laptops. 4K/8KHz mice trigger constant CPU Core 0 interrupts, reducing battery life and hurting FPS on mobile CPUs.'
                            : '<strong>1,000 Hz</strong> is the stability sweet spot. 4K/8KHz polling can drop FPS by 15–30% on 6–8 core CPUs in DX11 games.'
                    }
                </p>
            `;
        }

        const oemMount = document.getElementById('p6-oem-bloat-mount');
        if (oemMount) {
            oemMount.innerHTML = `
                <strong style="color:var(--text-primary);">Replace Heavy OEM Control Software:</strong>
                <p style="font-size:0.73rem; margin:4px 0 0 0; color:var(--text-secondary); line-height:1.45;">
                    OEM suites install 5–10 background services. Uninstall them and use lightweight open-source tools instead:<br/>
                    • <strong>Lenovo:</strong> <strong>Lenovo Legion Toolkit</strong> (also works on many IdeaPad/LOQ models for thermal &amp; 80% battery cap).<br/>
                    • <strong>ASUS Laptops:</strong> <strong>G-Helper</strong> (replaces Armoury Crate completely).<br/>
                    • <strong>Desktop Fans/RGB:</strong> <strong>FanControl</strong> + <strong>OpenRGB</strong>.
                </p>
            `;
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

        // 1. FORM FACTOR, STORAGE & NETWORK
        if (text.includes('form: laptop')) {
            profile.formFactor = 'laptop';
        } else if (text.includes('form: desktop')) {
            profile.formFactor = 'desktop';
        } else if (
            /lnvnb|ideapad|thinkpad|legion|inspiron|xps|latitude|vivobook|zenbook|\d{4}[uh]\b|\bhx\b|\bhs\b/.test(text)
        ) {
            profile.formFactor = 'laptop';
        } else {
            profile.formFactor = 'desktop';
        }

        if (text.includes('disk: hdd') && !text.includes('nvme') && !text.includes('ssd')) {
            profile.storage = 'hdd';
        } else if (text.includes('sata-ssd') && !text.includes('nvme')) {
            profile.storage = 'sata-ssd';
        } else {
            profile.storage = 'nvme';
        }

        if (text.includes('net: wi-fi') && text.includes('ethernet')) {
            profile.network = 'both';
        } else if (text.includes('net: wi-fi')) {
            profile.network = 'wifi';
        } else if (text.includes('net: ethernet')) {
            profile.network = 'ethernet';
        } else {
            profile.network = profile.formFactor === 'laptop' ? 'wifi' : 'ethernet';
        }

        // 2. CPU ARCHITECTURE
        if (/7900x3d|7950x3d|9900x3d|9950x3d/.test(text)) {
            profile.cpu = 'amd-x3d-dual';
            detectedCpu = true;
        } else if (/5700x3d|5800x3d|7800x3d|9800x3d|x3d/.test(text)) {
            profile.cpu = 'amd-x3d-single';
            detectedCpu = true;
        } else if (
            text.includes('ryzen') ||
            text.includes('threadripper') ||
            (text.includes('amd') && !text.includes('radeon'))
        ) {
            profile.cpu = 'amd-standard';
            detectedCpu = true;
        } else if (text.includes('core(tm) ultra') || text.includes('core ultra')) {
            profile.cpu = 'intel-core-ultra';
            detectedCpu = true;
        } else if (text.includes('13th gen') || text.includes('14th gen') || /i[3579]-1[34]\d{2,3}/.test(text)) {
            profile.cpu = 'intel-raptor';
            detectedCpu = true;
        } else if (text.includes('12th gen') || /i[3579]-12\d{2,3}/.test(text)) {
            profile.cpu = 'intel-alder';
            detectedCpu = true;
        } else if (text.includes('intel') || /i[3579]-/.test(text) || text.includes('xeon')) {
            profile.cpu = 'intel-legacy';
            detectedCpu = true;
        }

        // 3. MOTHERBOARD / OEM PLATFORM
        const isCpuAmd = profile.cpu.startsWith('amd');
        const detectedVendor =
            text.includes('asus') || text.includes('rog') || text.includes('strix') || text.includes('tuf')
                ? 'asus'
                : text.includes('msi') || text.includes('micro-star')
                  ? 'msi'
                  : text.includes('gigabyte') || text.includes('aorus')
                    ? 'gigabyte'
                    : text.includes('asrock')
                      ? 'asrock'
                      : /lenovo|lnvnb|dell|alienware|hp|acer|omen|victus|ideapad|thinkpad/.test(text)
                        ? 'oem'
                        : null;

        if (
            profile.formFactor === 'laptop' &&
            (detectedVendor === 'oem' || detectedVendor === 'asus' || detectedVendor === 'msi')
        ) {
            profile.mobo = isCpuAmd ? 'oem-laptop-amd' : 'oem-laptop-intel';
            detectedMobo = true;
        } else {
            let bestMoboCandidate: MoboPlatformSpec | null = null;
            let highestMatchScore = -1;

            for (const platform of MOBO_PLATFORMS) {
                let score = 0;
                if (detectedVendor && platform.vendor === detectedVendor) score += 5;
                if (platform.isAmd === isCpuAmd) score += 3;
                else score -= 10;

                for (const kw of platform.chipsetKeywords) {
                    if (text.includes(kw)) {
                        score += 10;
                        break;
                    }
                }
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
        }

        // 4. GPU & HYBRID OPTIMUS DETECTION
        const gpuSectionMatch = /gpu:\s*([^|]+)/i.exec(text);
        const gpuText = gpuSectionMatch?.[1] ?? text;
        const hasDedicated = /nvidia|geforce|rtx|gtx|mx\d{3}|radeon rx|intel\(r\) arc a\d|intel\(r\) arc b\d/.test(
            gpuText
        );
        const hasIntegrated = /uhd graphics|hd graphics|iris|vega|680m|780m|890m|radeon\(tm\) graphics/.test(gpuText);
        profile.hasHybridIgpu = hasDedicated && hasIntegrated;

        let bestMatch: GpuModelSpec | null = null;
        let longestLen = 0;
        for (const gpu of GPU_DATABASE) {
            if (hasDedicated && (gpu.family === 'intel-igpu' || gpu.family === 'amd-igpu')) continue;
            for (const kw of gpu.keywords) {
                if (gpuText.includes(kw) && kw.length > longestLen) {
                    bestMatch = gpu;
                    longestLen = kw.length;
                }
            }
        }
        if (bestMatch) {
            profile.gpuId = bestMatch.id;
            detectedGpu = true;
        }

        // 5. RAM DETECTION
        const ramMatch = /(\d+)\s*gb\s*(?:lp)?(ddr[345])\s*@\s*(\d+)\s*mhz/i.exec(text);
        const isSingleStick = text.includes('single-channel') || text.includes('1 stick');
        const isQuadSticks = text.includes('4 sticks');

        if (ramMatch?.[1] && ramMatch[2] && ramMatch[3]) {
            const totalGb = parseInt(ramMatch[1], 10);
            const gen = ramMatch[2].toUpperCase();
            const spd = parseInt(ramMatch[3], 10);
            detectedRam = true;

            if (gen === 'DDR5') {
                if (isSingleStick) profile.ramId = 'ddr5-single';
                else if (totalGb >= 64 || isQuadSticks) profile.ramId = 'ddr5-64gb-dual';
                else if (spd >= 6400) profile.ramId = 'ddr5-6400-dual';
                else if (spd >= 5800) profile.ramId = 'ddr5-6000-dual';
                else if (spd >= 5200) profile.ramId = 'ddr5-5600-dual';
                else profile.ramId = 'ddr5-4800-dual';
            } else if (gen === 'DDR4') {
                if (isSingleStick) profile.ramId = spd <= 2400 ? 'ddr4-2400-single' : 'ddr4-single';
                else if (totalGb >= 64 || isQuadSticks) profile.ramId = 'ddr4-64gb-quad';
                else if (spd >= 3600) profile.ramId = 'ddr4-3600-dual';
                else if (spd >= 3200) profile.ramId = 'ddr4-3200-dual';
                else if (spd >= 2400) profile.ramId = 'ddr4-2666-dual';
                else profile.ramId = 'ddr4-2133-dual';
            } else {
                profile.ramId = isSingleStick ? 'ddr3-single' : 'ddr3-1600-dual';
            }
        }

        // 6. RECOMMENDED OS ALIGNMENT
        if (profile.cpu === 'intel-alder' || profile.cpu === 'intel-raptor' || profile.cpu === 'intel-core-ultra') {
            profile.os = 'win11';
        } else if (profile.gpuId.includes('1070') || profile.gpuId.includes('1080') || profile.gpuId.includes('1060')) {
            profile.os = 'win10';
        }

        if (osSelect) osSelect.value = profile.os;
        if (formSelect) formSelect.value = profile.formFactor;
        if (moboSelect) moboSelect.value = profile.mobo;
        if (cpuSelect) cpuSelect.value = profile.cpu;
        if (gpuSelect) gpuSelect.value = profile.gpuId;
        if (ramSelect) ramSelect.value = profile.ramId;
        if (storageSelect) storageSelect.value = profile.storage;
        if (networkSelect) networkSelect.value = profile.network;

        save();
        renderAll();

        if (parseStatus) {
            const hits = [
                profile.formFactor === 'laptop' ? 'Laptop' : 'Desktop',
                detectedMobo && 'Board/OEM',
                detectedCpu && 'CPU',
                detectedGpu && (profile.hasHybridIgpu ? 'Hybrid GPU (Optimus)' : 'GPU'),
                detectedRam && 'RAM',
                profile.storage.toUpperCase(),
                profile.network.toUpperCase()
            ]
                .filter(Boolean)
                .join(' · ');
            parseStatus.textContent =
                detectedCpu || detectedGpu || detectedRam
                    ? `✓ Auto-Matched: ${hits}`
                    : 'Could not match hardware string. Select manually.';
            parseStatus.style.color =
                detectedCpu || detectedGpu || detectedRam ? 'var(--accent-brand)' : 'var(--accent-rose)';
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
        const moboPlatform = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[0];
        const alerts: string[] = [];

        const isOptimusLaptop =
            profile.formFactor === 'laptop' && (profile.hasHybridIgpu || currentGpu.family.startsWith('nvidia'));

        if (isOptimusLaptop) {
            alerts.push(`
                <div class="advisory-pill info">
                    <div style="font-weight:800; margin-bottom:2px;">💻 HYBRID GRAPHICS / OPTIMUS LAPTOP DETECTED:</div>
                    Your internal laptop display is wired to your <strong>integrated GPU (iGPU)</strong>, while 3D workloads offload to <strong>${currentGpu.name}</strong>.
                    <br/>• <strong>Never disable the iGPU</strong> in BIOS or Device Manager.
                    <br/>• In Phase 4, always install the <strong>iGPU driver FIRST</strong>, reboot, then install your dedicated GPU driver.
                </div>
            `);
        } else if (profile.formFactor === 'desktop' && profile.hasHybridIgpu) {
            alerts.push(`
                <div class="advisory-pill info">
                    <div style="font-weight:800; margin-bottom:2px;">🖥️ DESKTOP iGPU + DEDICATED GPU DETECTED:</div>
                    Plug your monitor cable directly into your <strong>${currentGpu.name}</strong> ports (not the motherboard video port). You can disable the unused iGPU in Phase 2 BIOS to free up to 2 GB RAM (unless using Intel QuickSync or motherboard secondary displays).
                </div>
            `);
        }

        if (currentRam.channels === 'single') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 MEMORY BOTTLENECK: SINGLE-CHANNEL RAM DETECTED!</div>
                    Your system is running on a single memory channel, cutting memory bandwidth by up to <strong>50%</strong>.
                    <br/><strong>Fix:</strong> ${
                        profile.formFactor === 'laptop'
                            ? 'Open <strong>Task Manager ➔ Performance ➔ Memory</strong> and check <em>"Slots used"</em>. If it shows <code>1 of 2</code>, installing a matching SO-DIMM stick unlocks full Dual-Channel (+15–35% FPS). If it shows <code>1 of 1</code> or soldered, it cannot be upgraded.'
                            : 'Install a matching 2-stick kit in <strong>Slots 2 &amp; 4 (A2 &amp; B2)</strong> to unlock full Dual-Channel bandwidth.'
                    }
                </div>
            `);
        }

        if (currentRam.isJedecStock && profile.formFactor !== 'laptop') {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ RAM AT JEDEC STOCK (${currentRam.speedMHz} MHz):</div>
                    Enable <strong>${moboPlatform.memoryProfileName}</strong> in Phase 2 BIOS to run your RAM at rated speed.
                </div>
            `);
        }

        if (profile.os === 'win10') {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">📅 WINDOWS 10 LIFECYCLE NOTE:</div>
                    Standard Windows 10 22H2 reached End of Support in Oct 2025. Use <strong>Windows 10 IoT Enterprise LTSC 2021</strong> (supported until Jan 2032) or move to <strong>Windows 11</strong>${
                        profile.cpu === 'intel-alder' ||
                        profile.cpu === 'intel-raptor' ||
                        profile.cpu === 'intel-core-ultra'
                            ? ' — strongly recommended here because Intel P/E-core Thread Director requires Windows 11.'
                            : '.'
                    }
                </div>
            `);
        }

        if (currentGpu.family === 'nvidia-pascal') {
            alerts.push(`
                <div class="advisory-pill warn">
                    <div style="font-weight:800; margin-bottom:2px;">⚠️ PASCAL CALIBRATION (${currentGpu.name}):</div>
                    <div>1. <strong>Turn HAGS OFF</strong> in Windows Display settings (Pascal lacks hardware scheduling ASICs).</div>
                    <div>2. <strong>Resizable BAR is not supported</strong> on Pascal.</div>
                    <div>3. Regular Pascal Game Ready drivers ended Oct 2025 (use the <strong>580.xx Final Branch</strong> + quarterly security updates).</div>
                </div>
            `);
        }

        if (profile.cpu === 'intel-raptor' && profile.formFactor === 'desktop') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 INTEL 13th/14th GEN VOLTAGE WARNING:</div>
                    Update ${moboPlatform.name} BIOS to <strong>microcode 0x12B</strong> or newer and enforce Intel Default Power Limits (PL1/PL2 = 253W max).
                </div>
            `);
        }

        if (profile.cpu === 'amd-x3d-dual') {
            alerts.push(`
                <div class="advisory-pill info">
                    <div style="font-weight:800; margin-bottom:2px;">⚡ DUAL-CCD RYZEN X3D:</div>
                    Keep <strong>Xbox Game Bar</strong> installed so Windows &amp; AMD 3D V-Cache Optimizer park non-V-Cache cores during games.
                </div>
            `);
        }

        advisoryBanner.innerHTML = alerts.join('');
    }

    function renderPhase1(): void {
        const isWin10 = profile.os === 'win10';
        const isLaptop = profile.formFactor === 'laptop';
        const needsTpmBypass = !isWin10 && profile.cpu === 'intel-legacy';

        if (p1IsoTitle) {
            p1IsoTitle.textContent = isWin10
                ? 'Windows 10 Clean ISO (IoT LTSC 2021 / 22H2)'
                : 'Windows 11 Clean ISO (25H2 / 26H2 / LTSC 2024)';
        }

        if (p1IsoLink) {
            p1IsoLink.href = isWin10
                ? 'https://www.microsoft.com/software-download/windows10ISO'
                : 'https://www.microsoft.com/software-download/windows11';
            p1IsoLink.textContent = isWin10 ? 'Download Win10 ISO ↗' : 'Download Win11 ISO ↗';
        }

        if (p1IsoDesc) {
            p1IsoDesc.innerHTML = isWin10
                ? `Standard Windows 10 22H2 Home/Pro reached End of Support in Oct 2025. For long-term security updates until <strong>Jan 2032</strong>, clean-install a <strong>Windows 10 IoT Enterprise LTSC 2021</strong> ISO (note: MAS Edition Switcher cannot jump from Home/Pro to LTSC without an LTSC ISO, though MAS TSforge can activate ESU on existing 22H2 installs).`
                : `Windows 11 includes Intel Thread Director (required for 12th–14th Gen / Core Ultra P/E cores) and modern DirectStorage support. Download the official ISO directly from Microsoft.`;
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
                        When you click &ldquo;START&rdquo;, Rufus shows the User Experience dialog. Use these exact settings:
                    </div>
                    <ul class="clean-bullet-list">
                        <li>${
                            needsTpmBypass
                                ? '<strong>[x] Remove requirement for 4GB+ RAM, Secure Boot and TPM 2.0</strong> (Only needed for older CPUs without TPM 2.0)'
                                : isWin10
                                  ? '<strong>[x] Remove requirement for an online Microsoft account</strong>'
                                  : '<strong>Leave TPM 2.0 / Secure Boot bypass UNCHECKED</strong> (Your CPU supports Win11 natively — keeping them ON avoids Riot Vanguard / FACEIT anti-cheat errors)'
                        }</li>
                        <li><strong>[x] Create a local account with username</strong> (e.g. <code>User</code>)</li>
                        <li><strong>[x] Disable data collection</strong> (Skips telemetry setup questions)</li>
                        <li>${
                            isLaptop
                                ? '<strong>BitLocker:</strong> Check <strong>[x] Disable BitLocker automatic device encryption</strong> for max SSD speed at home, OR leave unchecked if you travel with sensitive files.'
                                : '<strong>[x] Disable BitLocker automatic device encryption</strong> (Prevents SSD lockouts and background write overhead)'
                        }</li>
                        ${
                            isLaptop
                                ? '<li><strong>LAPTOP PRE-STEP:</strong> Copy your laptop&apos;s <strong>Wi-Fi &amp; Precision Trackpad</strong> drivers onto this USB stick before wiping, as clean ISOs often lack laptop Wi-Fi drivers!</li>'
                                : ''
                        }
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
                            ? `When asked for a network, click <em>&ldquo;I don't have internet&rdquo;</em> ➔ <em>&ldquo;Continue with limited setup&rdquo;</em>. Set all privacy sliders to <strong>OFF / No</strong>.`
                            : `If Windows 11 demands Wi-Fi, press <kbd>Shift</kbd> + <kbd>F10</kbd>, type <code>OOBE\\BYPASSNRO</code>, and hit Enter. The PC reboots with an <em>&ldquo;I don't have internet&rdquo;</em> option unlocked.`
                    }
                </div>

                <!-- MAS ACTIVATION & EDITION SWITCHER -->
                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                        <strong style="color:var(--text-primary); font-size:0.78rem;">Optional: Windows Activation &amp; Edition Switcher (MAS):</strong>
                        <a href="https://massgrave.dev/" target="_blank" rel="noopener" class="link-chip">massgrave.dev Official ↗</a>
                    </div>
                    <p style="font-size:0.73rem; color:var(--text-secondary); margin:4px 0 6px 0; line-height:1.45;">
                        Complete offline setup first. Once back online in Phase 5, run this in PowerShell for permanent HWID activation, upgrading Home ➔ Pro, or activating Win10 22H2 ESU (TSforge):
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
                        Press <kbd>1</kbd> for <strong>HWID</strong> (or TSforge if activating Win10 LTSC / ESU).
                    </div>
                </div>
            `;
        }
    }

    function renderPhase2(): void {
        const moboPlatform = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[0];
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0];
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0];
        const isLaptopOrOem = profile.formFactor === 'laptop' || moboPlatform.vendor === 'oem';

        if (p2MoboToolName) p2MoboToolName.textContent = `${moboPlatform.name} (${moboPlatform.toolName})`;
        if (p2MoboLink) {
            p2MoboLink.href = moboPlatform.supportUrl;
            p2MoboLink.textContent = isLaptopOrOem
                ? 'Open OEM Support Portal ↗'
                : `Open Official ${moboPlatform.vendor.toUpperCase()} BIOS Portal ↗`;
        }

        const biosFlashSteps = document.querySelector('#view-tool-winopt .bios-guide-col .ordered-step-list');
        if (biosFlashSteps) {
            biosFlashSteps.innerHTML = isLaptopOrOem
                ? `
                    <li>Connect your laptop to <strong>AC wall power</strong> (ensure battery is &gt; 30%).</li>
                    <li>Download the official BIOS update executable (<code>.exe</code>) from your laptop brand&apos;s support page (Lenovo Support / Dell / HP) — do <strong>not</strong> use FAT32 USB flashing unless instructed by the OEM.</li>
                    <li>Close all apps and run the BIOS installer inside Windows. The machine will reboot into a flashing screen. <em>Never force power off.</em></li>
                    <li>To inspect firmware settings manually, reboot and tap <kbd>F2</kbd>, <kbd>Fn+F2</kbd>, <kbd>F10</kbd> (HP), or Lenovo&apos;s Novo pinhole key.</li>
                `
                : `
                    <li>Format an empty USB drive to <strong>FAT32</strong>.</li>
                    <li>Download the latest non-beta BIOS update from your motherboard support page and extract it to the USB root.</li>
                    <li>Restart PC and tap <kbd>Delete</kbd> or <kbd>F2</kbd> to enter UEFI/BIOS.</li>
                    <li>Open <strong>${moboPlatform.toolName}</strong>, select the USB file, and let it flash. <em>Do not power off.</em></li>
                `;
        }

        const ramGuideMount = document.getElementById('p2-ram-guide-mount');
        if (ramGuideMount) {
            ramGuideMount.innerHTML = isLaptopOrOem
                ? `
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <strong style="color:var(--text-primary);">Laptop Memory Architecture (SO-DIMM vs Soldered):</strong>
                        <span class="pill-badge" style="font-size:0.65rem;">Check Task Manager</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                        Laptops do not have desktop A1/A2/B1/B2 slots. Open <strong>Task Manager ➔ Performance ➔ Memory</strong>:
                        <br/>• <strong>Slots used: 1 of 2:</strong> One empty SO-DIMM slot exists. Adding a matching ${currentRam.generation} stick unlocks Dual-Channel.
                        <br/>• <strong>Slots used: 2 of 2:</strong> Already Dual-Channel.
                        <br/>• <strong>Memory locked at ${currentRam.speedMHz} MHz:</strong> Normal on OEM laptops (XMP menus are usually hidden by the OEM).
                    </p>
                `
                : `
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <strong style="color:var(--text-primary);">Motherboard RAM Slot Placement (Daisy-Chain Signal Integrity):</strong>
                        <span class="pill-badge" style="font-size:0.65rem;">Slots A2 &amp; B2 (2 &amp; 4)</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0 0 0; line-height:1.45;">
                        Always install 2 sticks in <strong>Slots 2 and 4 (A2 &amp; B2)</strong> counting away from the CPU: <em>[CPU] ➔ Empty (A1) ➔ Stick (A2) ➔ Empty (B1) ➔ Stick (B2)</em> to avoid open-stub signal reflections.
                    </p>
                `;
        }

        if (!p2BiosSettingsList) return;

        if (isLaptopOrOem) {
            p2BiosSettingsList.innerHTML = `
                <li class="bios-setting-tree-item">
                    <div class="bios-breadcrumb-tag">Configuration / Video / Switchable Graphics</div>
                    <div><strong>Integrated Graphics (iGPU):</strong> Keep <strong style="color:var(--accent-mint);">Enabled / Switchable</strong>.</div>
                    <div class="bios-subtext">Do NOT disable the iGPU on Optimus laptops (${currentGpu.name}). Disabling it breaks internal screen brightness and battery life.</div>
                </li>
                <li class="bios-setting-tree-item">
                    <div class="bios-breadcrumb-tag">Power / PCIe Power Management</div>
                    <div><strong>PCIe ASPM &amp; Power Saving:</strong> Keep <strong>Enabled / Auto</strong> on laptops.</div>
                    <div class="bios-subtext">Disabling ASPM on a laptop keeps PCIe lanes awake continuously, draining battery and raising chassis temperatures.</div>
                </li>
                <li class="bios-setting-tree-item">
                    <div class="bios-breadcrumb-tag">Battery / Charge Threshold (BIOS or OEM Tool)</div>
                    <div><strong>Battery Conservation Mode (80% Cap):</strong> <strong>Enable</strong> if mostly plugged in at a desk.</div>
                    <div class="bios-subtext">Prevents lithium-ion battery swelling when a laptop stays at 100% charge continuously.</div>
                </li>
                <li class="bios-setting-tree-item">
                    <div class="bios-breadcrumb-tag">Security / Boot</div>
                    <div><strong>Secure Boot &amp; TPM 2.0:</strong> <strong>Enabled</strong> · <strong>USB Boot / Fast Boot:</strong> Standard.</div>
                    <div class="bios-subtext">Required for Windows 11 updates, Riot Vanguard, and EasyAntiCheat.</div>
                </li>
            `;
            return;
        }

        // Desktop BIOS Settings (ASUS / MSI / Gigabyte / ASRock)
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
        hwDynamicContent.innerHTML = getCpuGuidance(profile) + getGpuGuidance(currentGpu, profile);

        const hagsMount = document.getElementById('p4-hags-mount');
        if (!hagsMount) return;

        const isIgpuOnly = currentGpu.family === 'intel-igpu' || currentGpu.family === 'amd-igpu';
        if (isIgpuOnly) {
            hagsMount.innerHTML = '';
            return;
        }

        hagsMount.innerHTML = `
            <div class="latency-item" style="border-color: ${currentGpu.recommendHags ? 'var(--accent-mint)' : 'var(--accent-rose)'};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; gap:8px;">
                    <strong style="color:var(--text-primary);">Hardware-Accelerated GPU Scheduling (HAGS)</strong>
                    <span class="pill-badge" style="color:${currentGpu.recommendHags ? 'var(--accent-mint)' : 'var(--accent-rose)'};">
                        ${currentGpu.recommendHags ? 'SET TO ON' : 'SET TO OFF'}
                    </span>
                </div>
                <p style="font-size:0.73rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                    Navigate to: <strong>Windows Settings (Win+I) ➔ System ➔ Display ➔ Graphics ➔ Change default graphics settings</strong>.<br/>
                    ${
                        currentGpu.recommendHags
                            ? `• <strong>Set to ON:</strong> Recommended for ${currentGpu.name} (lowers CPU scheduling overhead and required for DLSS 3/4 Frame Generation).`
                            : `• <strong>Set to OFF for ${currentGpu.name}:</strong> Older architectures lack hardware scheduling ASICs; enabling HAGS causes micro-stuttering and uneven 1% lows.`
                    }
                </p>
            </div>
        `;
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

        essentialBox.innerHTML = getCttEssentialItems(profile).map(renderRow).join('');
        advancedBox.innerHTML = CTT_ADVANCED_ITEMS.map(renderRow).join('');
        preferencesBox.innerHTML = getCttPreferenceItems(profile).map(renderRow).join('');
        featuresBox.innerHTML = CTT_FEATURE_ITEMS.map(renderRow).join('');
    }

    function renderAll(): void {
        renderAdvisoryBanner();
        renderPhase1();
        renderPhase2();
        renderPhase4Ddu();
        renderDynamicHardware();
        renderPhase4Settings(); // <--- Add this call
        renderCttBlueprint();
        renderPhase6();
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

        if (profile.formFactor === 'laptop') {
            profile.mobo = profile.cpu.startsWith('amd') ? 'oem-laptop-amd' : 'oem-laptop-intel';
        } else {
            const currentMobo = MOBO_PLATFORMS.find(m => m.id === profile.mobo) ?? MOBO_PLATFORMS[0];
            const vendor = currentMobo.vendor === 'oem' ? 'asus' : currentMobo.vendor;

            if (profile.cpu === 'amd-x3d-dual') {
                profile.mobo = `${vendor}-amd-am5` as MoboPlatformId;
            } else if (profile.cpu === 'amd-x3d-single' || profile.cpu === 'amd-standard') {
                if (!currentMobo.isAmd) {
                    profile.mobo = `${vendor}-amd-am5` as MoboPlatformId;
                }
            } else if (
                profile.cpu === 'intel-raptor' ||
                profile.cpu === 'intel-alder' ||
                profile.cpu === 'intel-core-ultra'
            ) {
                profile.mobo = vendor === 'asrock' ? 'asrock-intel' : (`${vendor}-intel-modern` as MoboPlatformId);
            } else {
                profile.mobo = vendor === 'asrock' ? 'asrock-intel' : (`${vendor}-intel-300-500` as MoboPlatformId);
            }

            if (!MOBO_PLATFORMS.some(m => m.id === profile.mobo)) {
                profile.mobo = 'asus-intel-modern';
            }
        }

        if (moboSelect) moboSelect.value = profile.mobo;
        save();
        renderAll();
    });

    formSelect?.addEventListener('change', () => {
        profile.formFactor = formSelect.value as FormFactor;
        if (profile.formFactor === 'laptop' && !profile.mobo.startsWith('oem-')) {
            profile.mobo = profile.cpu.startsWith('amd') ? 'oem-laptop-amd' : 'oem-laptop-intel';
            if (moboSelect) moboSelect.value = profile.mobo;
        } else if (profile.formFactor === 'desktop' && profile.mobo.startsWith('oem-laptop')) {
            profile.mobo = profile.cpu.startsWith('amd')
                ? 'asus-amd-am5'
                : profile.cpu === 'intel-legacy'
                  ? 'asus-intel-300-500'
                  : 'asus-intel-modern';
            if (moboSelect) moboSelect.value = profile.mobo;
        }
        save();
        renderAll();
    });

    storageSelect?.addEventListener('change', () => {
        profile.storage = storageSelect.value as StorageType;
        save();
        renderAll();
    });

    networkSelect?.addEventListener('change', () => {
        profile.network = networkSelect.value as NetworkType;
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
}
