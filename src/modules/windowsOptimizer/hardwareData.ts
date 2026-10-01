export interface HardwareProfile {
    os: 'win10' | 'win11';
    mobo: 'asus' | 'msi' | 'gigabyte' | 'asrock' | 'oem';
    cpu: 'amd-x3d-dual' | 'amd-x3d-single' | 'amd-standard' | 'intel-raptor' | 'intel-alder' | 'intel-legacy';
    gpuId: string;
    ramId: string;
}

export interface GpuModelSpec {
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

export interface RamModelSpec {
    id: string;
    name: string;
    generation: 'DDR3' | 'DDR4' | 'DDR5';
    speedMHz: number;
    channels: 'single' | 'dual' | 'quad';
    isJedecStock: boolean;
}

export const GPU_DATABASE: GpuModelSpec[] = [
    {
        id: 'gtx-1080-ti',
        name: 'NVIDIA GeForce GTX 1080 Ti',
        keywords: ['1080 ti', '1080ti'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 / 560.94 WHQL (Low Overhead)',
        driverNotes:
            'Benchmarked as one of the lowest-overhead DWM drivers for Pascal. Avoid newer branches with heavy telemetry.',
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
        directDownloadUrl:
            'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html'
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
        directDownloadUrl:
            'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html'
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
        directDownloadUrl:
            'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html'
    }
];

export const RAM_DATABASE: RamModelSpec[] = [
    {
        id: 'ddr5-6000-dual',
        name: 'DDR5 32GB+ (2 Sticks) @ 6000 MHz (AM5 / Intel Sweet Spot)',
        generation: 'DDR5',
        speedMHz: 6000,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr5-6400-dual',
        name: 'DDR5 32GB+ (2 Sticks) @ 6400–7200 MHz (Intel High-Speed XMP)',
        generation: 'DDR5',
        speedMHz: 6400,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr5-5600-dual',
        name: 'DDR5 16GB/32GB (2 Sticks) @ 5200–5600 MHz (Standard XMP)',
        generation: 'DDR5',
        speedMHz: 5600,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr5-4800-dual',
        name: 'DDR5 16GB/32GB (2 Sticks) @ 4800 MHz (JEDEC Stock — XMP/EXPO OFF!)',
        generation: 'DDR5',
        speedMHz: 4800,
        channels: 'dual',
        isJedecStock: true
    },
    {
        id: 'ddr5-quad',
        name: 'DDR5 4 Sticks (4x16GB/32GB — Heavy Memory Controller Strain)',
        generation: 'DDR5',
        speedMHz: 4800,
        channels: 'quad',
        isJedecStock: false
    },
    {
        id: 'ddr5-single',
        name: 'DDR5 Single Stick (1x16GB/32GB — Single-Channel Bottleneck)',
        generation: 'DDR5',
        speedMHz: 4800,
        channels: 'single',
        isJedecStock: false
    },
    {
        id: 'ddr4-3600-dual',
        name: 'DDR4 16GB/32GB (2 Sticks) @ 3600 MHz (Peak AM4 / Intel Gear 1)',
        generation: 'DDR4',
        speedMHz: 3600,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr4-3200-dual',
        name: 'DDR4 16GB/32GB (2 Sticks) @ 3200 MHz (Standard High-Speed XMP)',
        generation: 'DDR4',
        speedMHz: 3200,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr4-2666-dual',
        name: 'DDR4 16GB/32GB (2 Sticks) @ 2666–2933 MHz',
        generation: 'DDR4',
        speedMHz: 2666,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr4-2133-dual',
        name: 'DDR4 16GB/32GB (2 Sticks) @ 2133–2400 MHz (JEDEC Stock — XMP OFF!)',
        generation: 'DDR4',
        speedMHz: 2133,
        channels: 'dual',
        isJedecStock: true
    },
    {
        id: 'ddr4-quad',
        name: 'DDR4 4 Sticks (4x8GB/16GB — Dual-Channel Dual-Rank)',
        generation: 'DDR4',
        speedMHz: 3200,
        channels: 'quad',
        isJedecStock: false
    },
    {
        id: 'ddr4-single',
        name: 'DDR4 Single Stick (1x8GB/16GB — Severe 50% Bandwidth Penalty)',
        generation: 'DDR4',
        speedMHz: 2666,
        channels: 'single',
        isJedecStock: false
    },
    {
        id: 'ddr3-1600-dual',
        name: 'DDR3 8GB/16GB (2 Sticks) @ 1600–1866 MHz (Legacy Platform)',
        generation: 'DDR3',
        speedMHz: 1600,
        channels: 'dual',
        isJedecStock: false
    },
    {
        id: 'ddr3-single',
        name: 'DDR3 Single Stick (Legacy Single-Channel)',
        generation: 'DDR3',
        speedMHz: 1600,
        channels: 'single',
        isJedecStock: false
    }
];

export const MOBO_DATA: Record<
    HardwareProfile['mobo'],
    { name: string; toolName: string; supportUrl: string; memoryProfileName: string }
> = {
    asus: {
        name: 'ASUS / ROG',
        toolName: 'EZ Flash 3',
        supportUrl: 'https://www.asus.com/support/download-center/',
        memoryProfileName: 'XMP (Intel) or D.O.C.P. / EXPO (AMD)'
    },
    msi: {
        name: 'MSI (Micro-Star)',
        toolName: 'M-Flash',
        supportUrl: 'https://www.msi.com/support/download/',
        memoryProfileName: 'XMP / A-XMP / EXPO'
    },
    gigabyte: {
        name: 'Gigabyte / AORUS',
        toolName: 'Q-Flash',
        supportUrl: 'https://www.gigabyte.com/Support/Motherboard',
        memoryProfileName: 'XMP / EXPO'
    },
    asrock: {
        name: 'ASRock',
        toolName: 'Instant Flash',
        supportUrl: 'https://www.asrock.com/support/index.asp',
        memoryProfileName: 'XMP / EXPO'
    },
    oem: {
        name: 'OEM / Dell / HP / Lenovo / Other',
        toolName: 'BIOS Flash / Firmware Update',
        supportUrl: 'https://www.google.com/search?q=motherboard+bios+update+download',
        memoryProfileName: 'XMP / Custom Profile'
    }
};
