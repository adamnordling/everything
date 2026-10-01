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
    recommendedDriverVersion: string;
    driverNotes: string;
    directDownloadUrl: string;
}

interface RamModelSpec {
    id: string;
    name: string;
    generation: 'DDR3' | 'DDR4' | 'DDR5';
    speedMHz: number;
    channels: 'single' | 'dual' | 'quad';
    isJedecStock: boolean;
}

interface CttItemBlueprint {
    label: string;
    action: 'CHECK' | 'UNCHECK' | 'OPTIONAL';
    why: string;
}

const GPU_DATABASE: GpuModelSpec[] = [
    // NVIDIA Pascal (GTX 10-series)
    {
        id: 'gtx-1080-ti',
        name: 'NVIDIA GeForce GTX 1080 Ti',
        keywords: ['1080 ti', '1080ti'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 / 560.94 WHQL (Low Overhead)',
        driverNotes: 'Benchmarked as one of the lowest-overhead DWM drivers for Pascal. Avoid newer branches that add heavy background telemetry.',
        directDownloadUrl: 'https://www.nvidia.com/download/driverDetails.aspx/230852/'
    },
    {
        id: 'gtx-1080',
        name: 'NVIDIA GeForce GTX 1080',
        keywords: ['gtx 1080', '1080'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 / 560.94 WHQL',
        driverNotes: 'Optimized Pascal branch without experimental RTX AI features.',
        directDownloadUrl: 'https://www.nvidia.com/download/driverDetails.aspx/230852/'
    },
    {
        id: 'gtx-1070-ti',
        name: 'NVIDIA GeForce GTX 1070 Ti',
        keywords: ['1070 ti', '1070ti'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 / 560.94 WHQL',
        driverNotes: 'Solid 1% low frame-time stability for GP104 silicon.',
        directDownloadUrl: 'https://www.nvidia.com/download/driverDetails.aspx/230852/'
    },
    {
        id: 'gtx-1070',
        name: 'NVIDIA GeForce GTX 1070',
        keywords: ['gtx 1070', '1070'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 / 560.94 WHQL',
        driverNotes: 'Proven stable release for GTX 1070. Strip telemetry with NVCleanstall.',
        directDownloadUrl: 'https://www.nvidia.com/download/driverDetails.aspx/230852/'
    },
    {
        id: 'gtx-1060',
        name: 'NVIDIA GeForce GTX 1060',
        keywords: ['gtx 1060', '1060'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 / 560.94 WHQL',
        driverNotes: 'Lowest VRAM footprint and stable DPC latency on Pascal 6GB/3GB.',
        directDownloadUrl: 'https://www.nvidia.com/download/driverDetails.aspx/230852/'
    },

    // NVIDIA Turing (GTX 16 / RTX 20-series)
    {
        id: 'rtx-2080-ti',
        name: 'NVIDIA GeForce RTX 2080 Ti',
        keywords: ['2080 ti', '2080ti'],
        family: 'nvidia-turing',
        supportsRebar: false,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready Driver',
        driverNotes: 'Turing supports hardware scheduling (HAGS ON) and modern DLSS 2 Super Resolution.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-2080',
        name: 'NVIDIA GeForce RTX 2080 / Super',
        keywords: ['2080'],
        family: 'nvidia-turing',
        supportsRebar: false,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready Driver',
        driverNotes: 'Supports DLSS 2. Clean install via NVCleanstall.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-2070',
        name: 'NVIDIA GeForce RTX 2070 / Super',
        keywords: ['2070'],
        family: 'nvidia-turing',
        supportsRebar: false,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready Driver',
        driverNotes: 'Optimal for 1080p/1440p competitive gaming with Reflex.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-2060',
        name: 'NVIDIA GeForce RTX 2060 / Super',
        keywords: ['2060'],
        family: 'nvidia-turing',
        supportsRebar: false,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready Driver',
        driverNotes: 'Use NVCleanstall to conserve VRAM overhead.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'gtx-1660',
        name: 'NVIDIA GeForce GTX 1660 / Super / Ti',
        keywords: ['1660'],
        family: 'nvidia-turing',
        supportsRebar: false,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready Driver',
        driverNotes: 'Turing NVENC engine. Keep HAGS enabled.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },

    // NVIDIA Ampere / Ada / Blackwell (RTX 30 / 40 / 50-series)
    {
        id: 'rtx-3060',
        name: 'NVIDIA GeForce RTX 3060 / 3060 Ti',
        keywords: ['3060'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready / Studio',
        driverNotes: 'Requires Resizable BAR enabled in BIOS and modern driver for DLSS 2/3.5.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-3070',
        name: 'NVIDIA GeForce RTX 3070 / 3070 Ti',
        keywords: ['3070'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready / Studio',
        driverNotes: 'Enable ReBAR for boosted frame consistency.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-3080',
        name: 'NVIDIA GeForce RTX 3080 / 3080 Ti',
        keywords: ['3080'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready / Studio',
        driverNotes: 'Full Ampere feature set. Strip GFE bloat.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-3090',
        name: 'NVIDIA GeForce RTX 3090 / 3090 Ti',
        keywords: ['3090'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest WHQL Game Ready / Studio',
        driverNotes: '24GB VRAM workstation and gaming powerhouse.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-4060',
        name: 'NVIDIA GeForce RTX 4060 / 4060 Ti',
        keywords: ['4060'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest WHQL Game Ready',
        driverNotes: 'HAGS mandatory for DLSS 3 Frame Generation.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-4070',
        name: 'NVIDIA GeForce RTX 4070 / Super / Ti',
        keywords: ['4070'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest WHQL Game Ready',
        driverNotes: 'Ada Lovelace architecture. DLSS 3 Frame Gen support.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-4080',
        name: 'NVIDIA GeForce RTX 4080 / Super',
        keywords: ['4080'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest WHQL Game Ready',
        driverNotes: 'High-bandwidth Ada Lovelace. Full Reflex + ReBAR.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-4090',
        name: 'NVIDIA GeForce RTX 4090',
        keywords: ['4090'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest WHQL Game Ready',
        driverNotes: 'Top-tier Ada silicon. Clean bare install via NVCleanstall.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },
    {
        id: 'rtx-5080',
        name: 'NVIDIA GeForce RTX 5080 / 5090',
        keywords: ['5080', '5090'],
        family: 'nvidia-modern',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest WHQL Game Ready',
        driverNotes: 'Blackwell architecture. Windows 11 strictly recommended.',
        directDownloadUrl: 'https://www.nvidia.com/en-us/geforce/drivers/'
    },

    // AMD Radeon (RDNA 2 / 3 / 4)
    {
        id: 'rx-6600',
        name: 'AMD Radeon RX 6600 / XT',
        keywords: ['6600'],
        family: 'amd-rdna',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest AMD Adrenalin WHQL (Minimal)',
        driverNotes: 'Choose "Minimal Install" to strip recording/streaming services.',
        directDownloadUrl: 'https://www.amd.com/en/support/download/drivers.html'
    },
    {
        id: 'rx-6700-xt',
        name: 'AMD Radeon RX 6700 XT / 6750 XT',
        keywords: ['6700', '6750'],
        family: 'amd-rdna',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest AMD Adrenalin WHQL (Minimal)',
        driverNotes: 'RDNA 2 sweet spot. Smart Access Memory enabled.',
        directDownloadUrl: 'https://www.amd.com/en/support/download/drivers.html'
    },
    {
        id: 'rx-6800-xt',
        name: 'AMD Radeon RX 6800 / 6800 XT',
        keywords: ['6800'],
        family: 'amd-rdna',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'both',
        recommendedDriverVersion: 'Latest AMD Adrenalin WHQL (Minimal)',
        driverNotes: '16GB VRAM. Enable SAM in Radeon Software.',
        directDownloadUrl: 'https://www.amd.com/en/support/download/drivers.html'
    },
    {
        id: 'rx-7800-xt',
        name: 'AMD Radeon RX 7800 XT / 7900 GRE',
        keywords: ['7800', '7900 gre'],
        family: 'amd-rdna',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest AMD Adrenalin WHQL (Minimal)',
        driverNotes: 'RDNA 3 Chiplet GPU. Anti-Lag enabled.',
        directDownloadUrl: 'https://www.amd.com/en/support/download/drivers.html'
    },
    {
        id: 'rx-7900-xtx',
        name: 'AMD Radeon RX 7900 XT / XTX',
        keywords: ['7900 xt', '7900 xtx', '7900xt'],
        family: 'amd-rdna',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest AMD Adrenalin WHQL (Minimal)',
        driverNotes: 'Flagship RDNA 3. Avoid full install bloat.',
        directDownloadUrl: 'https://www.amd.com/en/support/download/drivers.html'
    },

    // Intel Arc
    {
        id: 'arc-a580',
        name: 'Intel Arc A580 / A750',
        keywords: ['a580', 'a750'],
        family: 'intel-arc',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest Intel Arc WHQL Graphics Driver',
        driverNotes: 'Mandatory ReBAR. Disable telemetry in Arc Control.',
        directDownloadUrl: 'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html'
    },
    {
        id: 'arc-a770',
        name: 'Intel Arc A770 (16GB)',
        keywords: ['a770'],
        family: 'intel-arc',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest Intel Arc WHQL Graphics Driver',
        driverNotes: 'ReBAR required for proper memory access.',
        directDownloadUrl: 'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html'
    },
    {
        id: 'arc-b580',
        name: 'Intel Arc B580 / Battlemage',
        keywords: ['b580', 'battlemage'],
        family: 'intel-arc',
        supportsRebar: true,
        recommendHags: true,
        preferredOs: 'win11',
        recommendedDriverVersion: 'Latest Intel Battlemage WHQL Driver',
        driverNotes: 'Battlemage architecture with Xe2 cores.',
        directDownloadUrl: 'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html'
    }
];

const RAM_DATABASE: RamModelSpec[] = [
    { id: 'ddr5-6000-dual', name: 'DDR5 32GB+ (2 Sticks) @ 6000 MHz (AM5 / Intel Sweet Spot)', generation: 'DDR5', speedMHz: 6000, channels: 'dual', isJedecStock: false },
    { id: 'ddr5-6400-dual', name: 'DDR5 32GB+ (2 Sticks) @ 6400–7200 MHz (Intel High-Speed XMP)', generation: 'DDR5', speedMHz: 6400, channels: 'dual', isJedecStock: false },
    { id: 'ddr5-5600-dual', name: 'DDR5 16GB/32GB (2 Sticks) @ 5200–5600 MHz (Standard XMP)', generation: 'DDR5', speedMHz: 5600, channels: 'dual', isJedecStock: false },
    { id: 'ddr5-4800-dual', name: 'DDR5 16GB/32GB (2 Sticks) @ 4800 MHz (JEDEC Stock — XMP/EXPO OFF!)', generation: 'DDR5', speedMHz: 4800, channels: 'dual', isJedecStock: true },
    { id: 'ddr5-quad', name: 'DDR5 4 Sticks (4x16GB/32GB — Heavy Memory Controller Strain)', generation: 'DDR5', speedMHz: 4800, channels: 'quad', isJedecStock: false },
    { id: 'ddr5-single', name: 'DDR5 Single Stick (1x16GB/32GB — Single-Channel Bottleneck)', generation: 'DDR5', speedMHz: 4800, channels: 'single', isJedecStock: false },

    { id: 'ddr4-3600-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 3600 MHz (Peak AM4 / Intel Gear 1)', generation: 'DDR4', speedMHz: 3600, channels: 'dual', isJedecStock: false },
    { id: 'ddr4-3200-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 3200 MHz (Standard High-Speed XMP)', generation: 'DDR4', speedMHz: 3200, channels: 'dual', isJedecStock: false },
    { id: 'ddr4-2666-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 2666–2933 MHz', generation: 'DDR4', speedMHz: 2666, channels: 'dual', isJedecStock: false },
    { id: 'ddr4-2133-dual', name: 'DDR4 16GB/32GB (2 Sticks) @ 2133–2400 MHz (JEDEC Stock — XMP OFF!)', generation: 'DDR4', speedMHz: 2133, channels: 'dual', isJedecStock: true },
    { id: 'ddr4-quad', name: 'DDR4 4 Sticks (4x8GB/16GB — Dual-Channel Dual-Rank)', generation: 'DDR4', speedMHz: 3200, channels: 'quad', isJedecStock: false },
    { id: 'ddr4-single', name: 'DDR4 Single Stick (1x8GB/16GB — Severe 50% Bandwidth Penalty)', generation: 'DDR4', speedMHz: 2666, channels: 'single', isJedecStock: false },

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

const CTT_ESSENTIAL_ITEMS: CttItemBlueprint[] = [
    { label: 'Activity History - Disable', action: 'CHECK', why: 'Stops Windows from tracking and recording every opened app and window to a local database.' },
    { label: 'BitLocker - Disable', action: 'CHECK', why: 'Prevents automatic background drive encryption, eliminating storage write latency and lockout risks.' },
    { label: 'ConsumerFeatures - Disable', action: 'CHECK', why: 'Stops Windows from auto-installing sponsored bloatware (Candy Crush, Disney+, TikTok) on clean accounts.' },
    { label: 'Delivery Optimization - Disable', action: 'CHECK', why: 'Prevents Windows Update from using your upload bandwidth as a P2P seeder for strangers on the internet.' },
    { label: 'Disk Cleanup - Run', action: 'CHECK', why: 'Purges outdated Windows temporary installation staging buffers and update rollback files.' },
    { label: 'End Task With Right Click - Enable', action: 'CHECK', why: 'Allows killing hung games and frozen processes directly from the taskbar without opening Task Manager.' },
    { label: 'File Explorer Automatic Folder Discovery - Disable', action: 'CHECK', why: 'Eliminates File Explorer freezing when opening large directories as it scans for media metadata.' },
    { label: 'Hibernation - Disable', action: 'CHECK', why: 'Deletes hiberfil.sys (frees 16–32 GB SSD space) and disables Fast Startup driver memory leaks.' },
    { label: 'Location Tracking - Disable', action: 'CHECK', why: 'Disables background geolocation polling services that wake CPU cores from idle sleep.' },
    { label: 'Microsoft Store Recommended Search Results - Disable', action: 'CHECK', why: 'Removes promoted app advertisements and store suggestions from Windows search.' },
    { label: 'Prevent Device Companion Apps', action: 'CHECK', why: 'Stops Windows from auto-installing manufacturer bloatware when plugging in mice or keyboards.' },
    { label: 'Restore Point - Create', action: 'CHECK', why: 'Creates an automatic recovery snapshot before any service or registry changes are applied.' },
    { label: 'Services - Set to Manual', action: 'CHECK', why: 'CRITICAL: Sets non-essential services to Manual instead of Disabled so apps that need them can still run.' },
    { label: 'Start Menu Previous Layout - Enable', action: 'UNCHECK', why: 'Aesthetic only: Changes Start menu layout. Leave unchecked unless you want the retro layout.' },
    { label: 'Telemetry - Disable', action: 'CHECK', why: 'Shuts down Connected User Experiences (DiagTrack) and background diagnostic logging daemons.' },
    { label: 'Temporary Files - Remove', action: 'CHECK', why: 'Cleans out %temp% and system staging buffers.' },
    { label: 'Widgets - Remove', action: 'CHECK', why: 'Kills the Edge WebView2 news feed that consumes 200MB+ RAM in the background.' },
    { label: 'Windows Platform Binary Table (WPBT) - Disable', action: 'CHECK', why: 'Blocks motherboards (ASUS, MSI, Gigabyte) from injecting bloatware into Windows during boot.' }
];

const CTT_ADVANCED_ITEMS: CttItemBlueprint[] = [
    { label: 'Background Apps - Disable', action: 'CHECK', why: 'Shuts off background activity for modern UWP apps, freeing CPU thread cycles.' },
    { label: 'Disable Reserved Storage', action: 'CHECK', why: 'Reclaims 7–10 GB of SSD space artificially held by Windows for failed updates.' },
    { label: 'File Explorer Home and Gallery - Disable', action: 'CHECK', why: 'Speeds up File Explorer loading times by removing cloud-synced photo gallery tabs.' },
    { label: 'Razer Software Auto-Install - Disable', action: 'CHECK', why: 'Stops the Razer Synapse installer prompt from appearing every time a mouse is plugged in.' },
    { label: 'Right-Click Menu Previous Layout - Enable', action: 'CHECK', why: 'Windows 11 only: Restores the instant classic right-click menu, eliminating the slow "Show more options" click.' },
    { label: 'Windows AI - Disable And Remove', action: 'CHECK', why: 'Completely disables Windows Copilot, Recall snapshots, and Edge AI sidebars.' },
    { label: 'Microsoft OneDrive - Remove', action: 'OPTIONAL', why: 'CHECK IF NOT USING ONEDRIVE: Prevents sync locks on Documents and game save folders. Leave unchecked if using OneDrive.' },
    { label: 'Date & Time - Set Time to UTC', action: 'OPTIONAL', why: 'CHECK ONLY IF DUAL-BOOTING LINUX: Prevents clock misalignment when switching between Windows and Linux.' },
    { label: 'Microsoft Edge - Debloat', action: 'CHECK', why: 'Removes Edge telemetry, sidebar ads, and shopping bloat without breaking system WebViews.' },
    { label: 'Microsoft Edge - Remove', action: 'UNCHECK', why: 'DANGER: Do not remove Edge completely. Stripping Edge breaks embedded web login views in game launchers (Epic, EA, Riot).' },
    { label: 'IPv6 - Disable', action: 'UNCHECK', why: 'DANGER: Breaks Xbox Party Chat, Teredo tunneling, and certain multiplayer games. Leave IPv6 enabled.' },
    { label: 'Teredo - Disable', action: 'UNCHECK', why: 'DANGER: Completely breaks multiplayer in Xbox Game Pass games (Forza Horizon, Halo, Sea of Thieves).' },
    { label: 'Visual Effects - Set to Best Performance', action: 'UNCHECK', why: 'Makes desktop text blurry and pixelated by disabling ClearType font smoothing.' },
    { label: 'Adobe URL Block List - Enable', action: 'UNCHECK', why: 'Contextual: Only check if you are deliberately blocking Adobe telemetry hosts.' },
    { label: 'Brave Browser - Debloat', action: 'UNCHECK', why: 'Contextual: Only check if you use Brave and want crypto/VPN buttons removed.' }
];

const CTT_PREFERENCE_ITEMS: CttItemBlueprint[] = [
    { label: 'Game Mode (Toggle)', action: 'CHECK', why: 'MUST KEEP ON: Prioritizes GPU thread execution and pauses background Windows maintenance.' },
    { label: 'Mouse Acceleration (Toggle)', action: 'UNCHECK', why: 'MUST TURN OFF: Unchecks "Enhance pointer precision" for pure 1:1 raw mouse sensor tracking.' },
    { label: 'Start Menu Bing Search (Toggle)', action: 'UNCHECK', why: 'MUST TURN OFF: Eliminates internet query delay when searching for local apps in the Start menu.' },
    { label: 'Enable Long Paths (Toggle)', action: 'CHECK', why: 'Removes the 260-character path limit, preventing crashes in game modding and dev tools.' },
    { label: 'File Explorer File Extensions (Toggle)', action: 'CHECK', why: 'Displays true file extensions (.exe, .bat, etc.) to prevent launching disguised executables.' },
    { label: 'File Explorer Hidden Files (Toggle)', action: 'CHECK', why: 'Makes AppData and system configurations visible for game saves and modding.' },
    { label: 'Sticky Keys (Toggle)', action: 'UNCHECK', why: 'MUST TURN OFF: Stops the annoying Windows pop-up dialog when tapping Shift repeatedly in games.' },
    { label: 'Dark Theme for Windows (Toggle)', action: 'CHECK', why: 'Sets consistent dark theme across all Windows UI elements.' },
    { label: 'Window Snapping (Toggle)', action: 'CHECK', why: 'Preserves native window management and multi-monitor quadrant snapping.' },
    { label: 'BSoD Verbose Mode (Toggle)', action: 'CHECK', why: 'Shows exact crashing driver/file name on blue screens instead of a useless generic QR code.' },
    { label: 'Logon Screen Acrylic Blur (Toggle)', action: 'UNCHECK', why: 'Removes GPU blur render pass on lockscreen for faster login responsiveness.' }
];

const CTT_FEATURE_ITEMS: CttItemBlueprint[] = [
    { label: '.NET Framework (Versions 2, 3, 4) - Enable', action: 'CHECK', why: 'MANDATORY FOR GAMING: Required for older game launchers, modding tools, and game engines.' },
    { label: 'Legacy Media Components (DirectPlay) - Enable', action: 'CHECK', why: 'MANDATORY FOR RETRO GAMES: DirectPlay is required for older titles (GTA: San Andreas, Fallout 3, DX8/9).' },
    { label: 'Registry Backup (Daily Task) - Enable', action: 'CHECK', why: 'Restores Windows automated daily registry backup to RegBack for emergency recovery.' },
    { label: 'Windows Subsystem for Linux (WSL) - Enable', action: 'OPTIONAL', why: 'RECOMMENDED FOR LINUX TESTERS: Runs a real Linux kernel (Ubuntu, CachyOS, Debian) inside Windows.' },
    { label: 'Windows Sandbox - Enable', action: 'OPTIONAL', why: 'Spins up an isolated, disposable Windows desktop to safely test suspicious files or unknown programs.' },
    { label: 'Hyper-V - Enable', action: 'UNCHECK', why: 'Leave unchecked unless running virtual machines; forces hypervisor-based virtualization overhead.' }
];

const STORAGE_KEY = 'everything_winopt_profile_v7';

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
                    <span>⚡ Intel 13th/14th Gen Chipset & ME</span>
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

    let specificSettings = '';
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
            profile.cpu = 'intel-legacy';
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

        // 4. RAM Parsing
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
            const hits = [detectedMobo && 'Mobo', detectedCpu && 'CPU', detectedGpu && 'GPU', detectedRam && 'RAM'].filter(Boolean).join(', ');
            parseStatus.textContent = hits ? `✓ Configured: ${hits}` : 'Could not match hardware string. Select manually.';
            parseStatus.style.color = hits ? 'var(--accent-mint)' : 'var(--accent-amber)';
        }
    }

    parseBtn?.addEventListener('click', () => {
        if (!parseInput || !parseInput.value.trim()) return;
        parseHardwareString(parseInput.value);
    });

    function renderAdvisoryBanner(): void {
        if (!advisoryBanner) return;

        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0]!;
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0]!;
        const alerts: string[] = [];

        if (currentRam.channels === 'single') {
            alerts.push(`
                <div class="advisory-pill danger">
                    <div style="font-weight:800; margin-bottom:2px;">🚨 SEVERE MEMORY BOTTLENECK: SINGLE-CHANNEL DETECTED!</div>
                    Your system is operating on a single memory channel. This cuts memory bandwidth by <strong>50%</strong> and causes frame drops in competitive games.
                    <br/><strong>Fix:</strong> Install a matching dual-stick kit in <strong>Slots 2 & 4 (A2 & B2)</strong> to unlock full Dual-Channel throughput.
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
                    Applies to both Windows 10 & 11: Update your ${MOBO_DATA[profile.mobo].name} motherboard to BIOS with <strong>microcode 0x12B</strong> or newer to prevent irreversible silicon degradation caused by elevated voltage requests. Enforce Intel Default Power Limits (PL1/PL2 = 253W max).
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
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0]!;
        const currentRam = RAM_DATABASE.find(r => r.id === profile.ramId) ?? RAM_DATABASE[0]!;

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
                items.push(`<li><strong>Memory Gear Mode:</strong> Ensure <strong>Gear 1</strong> is selected (1:1 memory controller clock for lowest latency on DDR4).</li>`);
            } else if (currentRam.generation === 'DDR5' && (profile.cpu === 'amd-x3d-single' || profile.cpu === 'amd-x3d-dual' || profile.cpu === 'amd-standard')) {
                items.push(`<li><strong>UCLK / FCLK Ratio (AMD AM5):</strong> Set <strong>UCLK=MEMCLK</strong> (1:1 ratio, optimal at 6000MHz with FCLK set to 2000MHz).</li>`);
            }

            items.push(`
                <li>
                    <strong>Primary Display / iGPU:</strong> Set Primary Display to <strong>PEG / PCIe</strong>. Set <em>Integrated Graphics (iGPU Multi-Monitor)</em> to <strong>Disabled</strong>.
                    <br/><span style="color:var(--text-secondary)">*Desktop only with monitor plugged directly into dedicated GPU. Frees 1–2 GB RAM. Keep enabled on laptops or if using Intel QuickSync for video encoding.</span>
                </li>
            `);

            if (currentGpu.supportsRebar) {
                items.push(`<li><strong>Above 4G Decoding & Re-Size BAR:</strong> Set to <strong>Enabled / Auto</strong> (Supported by ${currentGpu.name}).</li>`);
            } else {
                items.push(`<li><strong>Re-Size BAR Support:</strong> <strong>Disabled / Not Applicable</strong> (${currentGpu.name} does not support ReBAR).</li>`);
            }

            items.push(`<li><strong>Intel Speed Shift (HWP) / AMD CPPC:</strong> Set to <strong>Enabled</strong> (Switches CPU clock states in ~1ms via on-die hardware instead of 30ms via OS ACPI).</li>`);
            items.push(`<li><strong>PCIe ASPM (Active State Power Management):</strong> Set to <strong>Disabled</strong> (Stops PCIe slots from dropping into low-power link states, eliminating frame transition latency).</li>`);

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

            items.push(`<li><strong>Global C-States:</strong> Set to <strong>Auto / Enabled</strong> (Crucial: Do not disable C-States, as active cores need idle cores to sleep to hit maximum boost frequencies).</li>`);
            items.push(`<li><strong>Fast Boot (in BIOS):</strong> Set to <strong>Disabled</strong> (Ensures complete hardware cold-boot initialization and RAM training).</li>`);

            p2BiosSettingsList.innerHTML = items.join('');
        }
    }

    function renderDynamicHardware(): void {
        if (!hwDynamicContent) return;
        const currentGpu = GPU_DATABASE.find(g => g.id === profile.gpuId) ?? GPU_DATABASE[0]!;
        hwDynamicContent.innerHTML = getCpuGuidance(profile) + getGpuGuidance(currentGpu);
    }

    function renderCttBlueprint(): void {
        const essentialBox = document.getElementById('ctt-box-essential');
        const advancedBox = document.getElementById('ctt-box-advanced');
        const preferencesBox = document.getElementById('ctt-box-preferences');
        const featuresBox = document.getElementById('ctt-box-features');

        if (!essentialBox || !advancedBox || !preferencesBox || !featuresBox) return;

        function renderRow(item: CttItemBlueprint): string {
            const badge = item.action === 'CHECK'
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

    // Accordion handler with null-check
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