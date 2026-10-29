export type MoboPlatformId =
    | 'asus-intel-modern'
    | 'asus-intel-300-500'
    | 'asus-intel-vintage'
    | 'asus-amd-am4'
    | 'asus-amd-am5'
    | 'msi-intel-modern'
    | 'msi-intel-300-500'
    | 'msi-amd-am4'
    | 'msi-amd-am5'
    | 'gigabyte-intel-modern'
    | 'gigabyte-intel-300-500'
    | 'gigabyte-amd-am4'
    | 'gigabyte-amd-am5'
    | 'asrock-intel'
    | 'asrock-amd'
    | 'oem-generic';

export interface HardwareProfile {
    os: 'win10' | 'win11';
    mobo: MoboPlatformId;
    cpu: 'amd-x3d-dual' | 'amd-x3d-single' | 'amd-standard' | 'intel-raptor' | 'intel-alder' | 'intel-legacy';
    gpuId: string;
    ramId: string;
}

export interface MoboPlatformSpec {
    id: MoboPlatformId;
    name: string;
    vendor: 'asus' | 'msi' | 'gigabyte' | 'asrock' | 'oem';
    isAmd: boolean;
    chipsetKeywords: string[];
    cpuKeywords: string[];
    toolName: string;
    supportUrl: string;
    memoryProfileName: string;
    supportsRebarDefault: boolean;
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

export interface Driver3DSetting {
    name: string;
    category: 'Latency & Sync' | 'Performance & Cache' | 'Textures & Quality' | 'Antialiasing';
    getValue: (gpu: GpuModelSpec, isIntelLegacy: boolean) => string;
    why: (gpu: GpuModelSpec, isIntelLegacy: boolean) => string;
    isHighlighted?: boolean;
}

export const NVIDIA_3D_SETTINGS_DATABASE: Driver3DSetting[] = [
    // 1. LATENCY & SYNC
    {
        name: 'Low Latency Mode',
        category: 'Latency & Sync',
        isHighlighted: true,
        getValue: (gpu: GpuModelSpec): string => (gpu.family === 'nvidia-pascal' ? 'On' : 'On (or Ultra with G-Sync)'),
        why: (gpu: GpuModelSpec): string =>
            gpu.family === 'nvidia-pascal'
                ? 'GTX 10-Series (Pascal): Set to ON (caps pre-rendered frames to 1). In Reflex games, NVIDIA Reflex automatically overrides and manages this.'
                : 'Modern RTX: Set to ON. If pairing with G-Sync + driver V-Sync ON + frame cap, set to ULTRA for automated frame alignment.'
    },
    {
        name: 'Vertical sync',
        category: 'Latency & Sync',
        isHighlighted: true,
        getValue: (): string => 'On (with G-Sync) / Off (Fixed Hz)',
        why: (): string =>
            'If using G-Sync/FreeSync: Driver V-Sync ON + In-game V-Sync OFF + Cap -3 FPS below Hz completely eliminates tearing with ZERO input lag penalty. On fixed-refresh panels, keep OFF.'
    },
    {
        name: 'Max Frame Rate',
        category: 'Latency & Sync',
        getValue: (): string => 'Off (or Cap -3 below Hz)',
        why: (): string =>
            'Cap in-game whenever possible. If the game lacks a reliable limiter, set driver Max Frame Rate to 141 (on 144Hz) or 237 (on 240Hz) to keep G-Sync active.'
    },
    {
        name: 'Monitor Technology',
        category: 'Latency & Sync',
        getValue: (): string => 'G-SYNC / G-SYNC Compatible',
        why: (): string =>
            'Select G-Sync if your monitor supports variable refresh rate; select Fixed Refresh Rate if running standard panels.'
    },
    {
        name: 'Virtual Reality pre-rendered frames',
        category: 'Latency & Sync',
        getValue: (): string => '1',
        why: (): string => 'Guarantees the lowest buffer lag for SteamVR and OpenXR runtimes.'
    },
    {
        name: 'Vulkan/OpenGL present method',
        category: 'Latency & Sync',
        getValue: (): string => 'Prefer layered on DXGI Swapchain',
        why: (): string =>
            'Allows Vulkan/OpenGL titles (like DOOM and emulation) to use modern Windows 10/11 Flip Model presentation.'
    },

    // 2. PERFORMANCE & CACHE
    {
        name: 'Shader Cache Size',
        category: 'Performance & Cache',
        isHighlighted: true,
        getValue: (): string => '10 GB',
        why: (): string =>
            'Driver Default (~1–4GB) is too small for modern games (Apex, CoD, Fortnite). Once full, old shaders are purged and recompiled mid-game, causing firefight stutter. 10 GB provides dedicated headroom.'
    },
    {
        name: 'Power management mode',
        category: 'Performance & Cache',
        isHighlighted: true,
        getValue: (): string => 'Normal (Optimal Power)',
        why: (): string =>
            'Avoid "Prefer maximum performance" globally! It pins clock speeds at idle, pulling 60W+ at desktop and causing fan noise. Your GPU boosts to peak frequency within 1ms under 3D load anyway.'
    },
    {
        name: 'Threaded optimization',
        category: 'Performance & Cache',
        isHighlighted: true,
        getValue: (_gpu: GpuModelSpec, isLegacy: boolean): string => (isLegacy ? 'On' : 'Auto'),
        why: (_gpu: GpuModelSpec, isLegacy: boolean): string =>
            isLegacy
                ? 'Monolithic CPU (e.g. i7-9700K 8-core/8-thread): Forcing ON ensures the display driver offloads draw calls across all physical cores.'
                : 'Modern Multi-Threaded: Leave on Auto so game engines with custom task schedulers direct their own thread pools.'
    },
    {
        name: 'CUDA - Sysmem Fallback Policy',
        category: 'Performance & Cache',
        getValue: (): string => 'Prefer No Sysmem Fallback',
        why: (): string =>
            'Prevents GPU VRAM spills from thrashing into system RAM over PCIe, which drops framerates by 80%. If VRAM runs out, apps allocate locally instead of freezing.'
    },
    {
        name: 'Background Application Max Frame Rate',
        category: 'Performance & Cache',
        getValue: (): string => '20 – 30 FPS',
        why: (): string =>
            'Caps background Discord, OBS, or Chrome streams to 30 FPS while tabbed into a game, preserving GPU encoder bandwidth and preventing VRAM contention.'
    },
    {
        name: 'Preferred refresh rate',
        category: 'Performance & Cache',
        getValue: (): string => 'Highest available',
        why: (): string => 'Forces Windows to dispatch 3D runtimes at full native panel Hz (144Hz, 240Hz, etc.).'
    },
    {
        name: 'CUDA - GPUs',
        category: 'Performance & Cache',
        getValue: (): string => 'All',
        why: (): string => 'Ensures all onboard CUDA compute units are available for physics and compute workloads.'
    },
    {
        name: 'OpenGL GDI compatibility',
        category: 'Performance & Cache',
        getValue: (): string => 'Auto',
        why: (): string => 'Provides default hardware GDI acceleration for desktop windows.'
    },
    {
        name: 'OpenGL rendering GPU',
        category: 'Performance & Cache',
        getValue: (gpu: GpuModelSpec): string => gpu.name,
        why: (): string =>
            'Explicitly selects your dedicated GPU, preventing Windows from choosing motherboard video ports.'
    },

    // 3. TEXTURES & QUALITY
    {
        name: 'Texture filtering - Quality',
        category: 'Textures & Quality',
        isHighlighted: true,
        getValue: (gpu: GpuModelSpec): string =>
            gpu.family === 'nvidia-pascal' ? 'High Performance' : 'High Performance / Quality',
        why: (gpu: GpuModelSpec): string =>
            gpu.family === 'nvidia-pascal'
                ? 'GTX 10-Series (Pascal): Set to High Performance. Reduces texture shader ALU operations, directly improving 1% low frame consistency.'
                : 'Modern RTX: High Performance gives maximum competitive frametime stability with zero visible texture degradation.'
    },
    {
        name: 'Texture filtering - Negative LOD bias',
        category: 'Textures & Quality',
        getValue: (): string => 'Allow',
        why: (): string =>
            'Allows native mipmap sharpening when Anisotropic Filtering is active. (Only set to Clamp if forcing AF via driver).'
    },
    {
        name: 'Texture filtering - Anisotropic sample optimization',
        category: 'Textures & Quality',
        getValue: (): string => 'On',
        why: (): string =>
            'Limits sample count on secondary textures to save memory bandwidth with zero loss in visual clarity.'
    },
    {
        name: 'Texture filtering - Trilinear optimization',
        category: 'Textures & Quality',
        getValue: (): string => 'On',
        why: (): string => 'Improves texture filtering cache throughput by enabling trilinear interpolation.'
    },
    {
        name: 'Anisotropic filtering',
        category: 'Textures & Quality',
        getValue: (): string => 'Application-controlled',
        why: (): string => 'Leave controlled by the game engine to prevent texture atlas flickering.'
    },

    // 4. ANTIALIASING & RESOLUTION
    {
        name: 'Antialiasing - FXAA',
        category: 'Antialiasing',
        getValue: (): string => 'Off',
        why: (): string =>
            'FXAA smears a blurry post-processing filter over the screen, degrading crosshair clarity and text.'
    },
    {
        name: 'Antialiasing - Gamma correction',
        category: 'Antialiasing',
        getValue: (): string => 'On',
        why: (): string => 'Calibrates color linearity of edge smoothing at 0% performance cost.'
    },
    {
        name: 'Antialiasing - Mode',
        category: 'Antialiasing',
        getValue: (): string => 'Application-controlled',
        why: (): string => 'Prevents driver MSAA overrides from breaking modern deferred rendering pipelines.'
    },
    {
        name: 'Antialiasing - Transparency',
        category: 'Antialiasing',
        getValue: (): string => 'Off',
        why: (): string =>
            'Supersampling foliage and chain-link fences adds heavy fill-rate latency on older GPUs like GTX 1070.'
    },
    {
        name: 'Multi-Frame Sampled AA (MFAA)',
        category: 'Antialiasing',
        getValue: (): string => 'Off',
        why: (): string => 'Adds temporal frame-blending overhead in competitive multiplayer titles.'
    },
    {
        name: 'Triple buffering',
        category: 'Antialiasing',
        getValue: (): string => 'Off',
        why: (): string => 'Legacy OpenGL option only. Introduces 1 full frame of input lag if enabled.'
    },
    {
        name: 'Image Scaling (NIS)',
        category: 'Antialiasing',
        getValue: (): string => 'Off',
        why: (): string =>
            'Adds an upscaling spatial filter pass. Run your monitor at native resolution for lowest input lag.'
    },
    {
        name: 'DSR - Factors',
        category: 'Antialiasing',
        getValue: (): string => 'Off',
        why: (): string => 'Downsampling multipliers consume immense VRAM and compute. Keep off for esports gaming.'
    }
];

export const AMD_ADRENALIN_SETTINGS_DATABASE = [
    {
        name: 'Radeon Anti-Lag',
        recommended: 'Enabled',
        why: 'Paces CPU thread submission to prevent CPU queuing ahead of the GPU. Cuts input lag dramatically in GPU-bound scenarios.'
    },
    {
        name: 'AMD Smart Access Memory (SAM)',
        recommended: 'Enabled',
        why: 'Enables full PCIe Resizable BAR access so your CPU can map the entire GPU VRAM frame buffer simultaneously.'
    },
    {
        name: 'Radeon Chill / Boost / Super Resolution',
        recommended: 'Disabled',
        why: 'Dynamic resolution scaling and frame throttling introduce inconsistent mouse movement and frame pacing spikes.'
    },
    {
        name: 'Radeon Enhanced Sync',
        recommended: 'Disabled',
        why: 'Causes display flickering with FreeSync. Pair AMD FreeSync with a -3 FPS frame cap instead.'
    },
    {
        name: 'Texture Filtering Quality',
        recommended: 'Performance',
        why: 'Optimizes texture filtering passes for maximum 1% low frame time consistency.'
    },
    {
        name: 'Pixel Format (Gaming ➔ Display)',
        recommended: 'RGB 4:4:4 Pixel Format PC Standard (Full RGB)',
        why: 'Prevents washed-out 16–235 color compression over HDMI/DisplayPort.'
    }
];

export interface RamModelSpec {
    id: string;
    name: string;
    generation: 'DDR3' | 'DDR4' | 'DDR5';
    speedMHz: number;
    channels: 'single' | 'dual' | 'quad';
    isJedecStock: boolean;
}

const NVIDIA_OFFICIAL_DRIVERS = 'https://www.nvidia.com/en-us/geforce/drivers/';
const AMD_OFFICIAL_DRIVERS = 'https://www.amd.com/en/support/download/drivers.html';
const INTEL_OFFICIAL_DRIVERS =
    'https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html';

export const MOBO_PLATFORMS: MoboPlatformSpec[] = [
    // ASUS
    {
        id: 'asus-intel-modern',
        name: 'ASUS ROG / TUF / Prime (Intel 600/700/800 — Z690, Z790, B760)',
        vendor: 'asus',
        isAmd: false,
        chipsetKeywords: ['z690', 'z790', 'z890', 'b660', 'b760', 'h670', 'h770'],
        cpuKeywords: ['12th gen', '13th gen', '14th gen', 'ultra', '12', '13', '14'],
        toolName: 'EZ Flash 3',
        supportUrl: 'https://www.asus.com/support/download-center/',
        memoryProfileName: 'XMP I',
        supportsRebarDefault: true
    },
    {
        id: 'asus-intel-300-500',
        name: 'ASUS ROG / Strix / Prime (Intel 300/400/500 — Z390, Z490, Z590, B360)',
        vendor: 'asus',
        isAmd: false,
        chipsetKeywords: ['z390', 'z370', 'b360', 'b365', 'h370', 'z490', 'b460', 'h470', 'z590', 'b560'],
        cpuKeywords: ['8th gen', '9th gen', '10th gen', '11th gen', '9700', '9900', '8700', '10700', '10900'],
        toolName: 'EZ Flash 3',
        supportUrl: 'https://www.asus.com/support/download-center/',
        memoryProfileName: 'X.M.P. I',
        supportsRebarDefault: true
    },
    {
        id: 'asus-intel-vintage',
        name: 'ASUS Legacy Intel (Z77, Z87, Z97, Z170, Z270 — 3rd–7th Gen)',
        vendor: 'asus',
        isAmd: false,
        chipsetKeywords: ['z170', 'z270', 'z97', 'z87', 'z77', 'h110', 'b150', 'b250'],
        cpuKeywords: ['3770', '4770', '4790', '6700', '7700'],
        toolName: 'EZ Flash 2 / 3',
        supportUrl: 'https://www.asus.com/support/download-center/',
        memoryProfileName: 'X.M.P.',
        supportsRebarDefault: false
    },
    {
        id: 'asus-amd-am4',
        name: 'ASUS ROG / TUF / Prime (AMD AM4 — B450, B550, X470, X570)',
        vendor: 'asus',
        isAmd: true,
        chipsetKeywords: ['x570', 'b550', 'a520', 'x470', 'b450', 'x370', 'b350'],
        cpuKeywords: ['1000', '2000', '3000', '5000', '5800x3d', '5700x3d', 'am4'],
        toolName: 'EZ Flash 3',
        supportUrl: 'https://www.asus.com/support/download-center/',
        memoryProfileName: 'D.O.C.P.',
        supportsRebarDefault: true
    },
    {
        id: 'asus-amd-am5',
        name: 'ASUS ROG / Crosshair / TUF (AMD AM5 — B650, X670, X870)',
        vendor: 'asus',
        isAmd: true,
        chipsetKeywords: ['x670', 'x670e', 'b650', 'b650e', 'a620', 'x870', 'x870e', 'b850'],
        cpuKeywords: ['7000', '8000', '9000', '7800x3d', '7950x3d', '9800x3d', 'am5'],
        toolName: 'EZ Flash 3',
        supportUrl: 'https://www.asus.com/support/download-center/',
        memoryProfileName: 'EXPO I',
        supportsRebarDefault: true
    },

    // MSI
    {
        id: 'msi-intel-modern',
        name: 'MSI (Intel 600/700/800 — Z690, Z790, B760 Click BIOS 5/X)',
        vendor: 'msi',
        isAmd: false,
        chipsetKeywords: ['z690', 'z790', 'z890', 'b660', 'b760', 'h670', 'h770'],
        cpuKeywords: ['12th gen', '13th gen', '14th gen', '12', '13', '14'],
        toolName: 'M-Flash',
        supportUrl: 'https://www.msi.com/support/download/',
        memoryProfileName: 'XMP',
        supportsRebarDefault: true
    },
    {
        id: 'msi-intel-300-500',
        name: 'MSI (Intel 300/400/500 — Z390, Z490, Z590, B360, B460)',
        vendor: 'msi',
        isAmd: false,
        chipsetKeywords: ['z390', 'z370', 'b360', 'z490', 'b460', 'z590', 'b560'],
        cpuKeywords: ['8th gen', '9th gen', '10th gen', '11th gen', '9700', '9900', '10700', '10900'],
        toolName: 'M-Flash',
        supportUrl: 'https://www.msi.com/support/download/',
        memoryProfileName: 'XMP',
        supportsRebarDefault: true
    },
    {
        id: 'msi-amd-am4',
        name: 'MSI (AMD AM4 — B450, B550, X570 Tomahawk / Gaming)',
        vendor: 'msi',
        isAmd: true,
        chipsetKeywords: ['x570', 'b550', 'a520', 'x470', 'b450', 'x370', 'b350'],
        cpuKeywords: ['1000', '2000', '3000', '5000', '5800x3d', 'am4'],
        toolName: 'M-Flash',
        supportUrl: 'https://www.msi.com/support/download/',
        memoryProfileName: 'A-XMP',
        supportsRebarDefault: true
    },
    {
        id: 'msi-amd-am5',
        name: 'MSI (AMD AM5 — B650, X670, X870 Tomahawk / Carbon)',
        vendor: 'msi',
        isAmd: true,
        chipsetKeywords: ['x670', 'b650', 'a620', 'x870', 'b850'],
        cpuKeywords: ['7000', '8000', '9000', '7800x3d', 'am5'],
        toolName: 'M-Flash',
        supportUrl: 'https://www.msi.com/support/download/',
        memoryProfileName: 'EXPO / A-XMP',
        supportsRebarDefault: true
    },

    // GIGABYTE / AORUS
    {
        id: 'gigabyte-intel-modern',
        name: 'Gigabyte / AORUS (Intel 600/700/800 — Z690, Z790, B760)',
        vendor: 'gigabyte',
        isAmd: false,
        chipsetKeywords: ['z690', 'z790', 'z890', 'b660', 'b760'],
        cpuKeywords: ['12th gen', '13th gen', '14th gen'],
        toolName: 'Q-Flash',
        supportUrl: 'https://www.gigabyte.com/Support/Motherboard',
        memoryProfileName: 'X.M.P.',
        supportsRebarDefault: true
    },
    {
        id: 'gigabyte-intel-300-500',
        name: 'Gigabyte / AORUS (Intel 300/400/500 — Z390, Z490, Z590)',
        vendor: 'gigabyte',
        isAmd: false,
        chipsetKeywords: ['z390', 'z370', 'b360', 'z490', 'b460', 'z590', 'b560'],
        cpuKeywords: ['8th gen', '9th gen', '10th gen', '11th gen'],
        toolName: 'Q-Flash',
        supportUrl: 'https://www.gigabyte.com/Support/Motherboard',
        memoryProfileName: 'X.M.P.',
        supportsRebarDefault: true
    },
    {
        id: 'gigabyte-amd-am4',
        name: 'Gigabyte / AORUS (AMD AM4 — B450, B550, X570 Elite / Pro)',
        vendor: 'gigabyte',
        isAmd: true,
        chipsetKeywords: ['x570', 'b550', 'x470', 'b450'],
        cpuKeywords: ['1000', '2000', '3000', '5000', '5800x3d'],
        toolName: 'Q-Flash',
        supportUrl: 'https://www.gigabyte.com/Support/Motherboard',
        memoryProfileName: 'X.M.P.',
        supportsRebarDefault: true
    },
    {
        id: 'gigabyte-amd-am5',
        name: 'Gigabyte / AORUS (AMD AM5 — B650, X670, X870 Master / Elite)',
        vendor: 'gigabyte',
        isAmd: true,
        chipsetKeywords: ['x670', 'b650', 'x870'],
        cpuKeywords: ['7000', '8000', '9000', '7800x3d'],
        toolName: 'Q-Flash',
        supportUrl: 'https://www.gigabyte.com/Support/Motherboard',
        memoryProfileName: 'EXPO',
        supportsRebarDefault: true
    },

    // ASROCK
    {
        id: 'asrock-intel',
        name: 'ASRock (Intel — Z390, Z490, Z690, Z790, B660, B760)',
        vendor: 'asrock',
        isAmd: false,
        chipsetKeywords: ['z390', 'z490', 'z590', 'z690', 'z790', 'b660', 'b760'],
        cpuKeywords: ['intel', 'core', 'i7', 'i9', 'i5'],
        toolName: 'Instant Flash',
        supportUrl: 'https://www.asrock.com/support/index.asp',
        memoryProfileName: 'XMP',
        supportsRebarDefault: true
    },
    {
        id: 'asrock-amd',
        name: 'ASRock (AMD AM4 / AM5 — B450, B550, X570, B650, X670)',
        vendor: 'asrock',
        isAmd: true,
        chipsetKeywords: ['b450', 'b550', 'x570', 'b650', 'x670', 'x870'],
        cpuKeywords: ['ryzen', 'amd', 'x3d'],
        toolName: 'Instant Flash',
        supportUrl: 'https://www.asrock.com/support/index.asp',
        memoryProfileName: 'XMP / EXPO',
        supportsRebarDefault: true
    },

    // OEM
    {
        id: 'oem-generic',
        name: 'OEM / Prebuilt / Laptop (Dell, HP, Lenovo Locked UEFI)',
        vendor: 'oem',
        isAmd: false,
        chipsetKeywords: ['alienware', 'optiplex', 'legion', 'omen', 'pavilion', 'latitude', 'thinkpad'],
        cpuKeywords: [],
        toolName: 'Firmware Update',
        supportUrl: 'https://www.google.com/search?q=motherboard+bios+update+download',
        memoryProfileName: 'XMP / Stock Profile',
        supportsRebarDefault: false
    }
];

export const GPU_DATABASE: GpuModelSpec[] = [
    {
        id: 'gtx-1080-ti',
        name: 'NVIDIA GeForce GTX 1080 Ti',
        keywords: ['1080 ti', '1080ti'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 WHQL / Game Ready',
        driverNotes:
            'Benchmarked as one of the lowest-overhead DWM drivers for Pascal. Keep HAGS turned OFF in Windows Display settings.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
    },
    {
        id: 'gtx-1080',
        name: 'NVIDIA GeForce GTX 1080',
        keywords: ['gtx 1080', '1080'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 WHQL / Game Ready',
        driverNotes: 'Optimized Pascal branch without experimental RTX AI overhead. Keep HAGS turned OFF.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
    },
    {
        id: 'gtx-1070-ti',
        name: 'NVIDIA GeForce GTX 1070 Ti',
        keywords: ['1070 ti', '1070ti'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 WHQL / Game Ready',
        driverNotes: 'Solid 1% low frame-time stability for GP104 silicon. Keep HAGS turned OFF.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
    },
    {
        id: 'gtx-1070',
        name: 'NVIDIA GeForce GTX 1070',
        keywords: ['gtx 1070', '1070'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 WHQL / Game Ready',
        driverNotes:
            'Proven stable release for GTX 1070. Use Custom Install > "Perform a clean installation". Keep HAGS turned OFF.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
    },
    {
        id: 'gtx-1060',
        name: 'NVIDIA GeForce GTX 1060',
        keywords: ['gtx 1060', '1060'],
        family: 'nvidia-pascal',
        supportsRebar: false,
        recommendHags: false,
        preferredOs: 'win10',
        recommendedDriverVersion: '566.36 WHQL / Game Ready',
        driverNotes: 'Lowest VRAM footprint and stable DPC latency on Pascal 6GB/3GB. Keep HAGS turned OFF.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Supports DLSS 2. Keep HAGS turned ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Optimal for 1080p/1440p competitive gaming with Reflex. Keep HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Supports hardware scheduling and DLSS 2. Keep HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Turing NVENC engine. Keep HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Requires Resizable BAR enabled in BIOS and HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Enable ReBAR in BIOS and HAGS ON for frame consistency.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Full Ampere feature set with ReBAR + HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: '24GB VRAM workstation and gaming. ReBAR + HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Ada Lovelace architecture. DLSS 3 Frame Gen requires HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'High-bandwidth Ada Lovelace. Full Reflex, ReBAR and HAGS ON.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Top-tier Ada silicon. ReBAR + HAGS ON mandatory.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Blackwell architecture. Windows 11 with HAGS ON recommended.',
        directDownloadUrl: NVIDIA_OFFICIAL_DRIVERS
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
        driverNotes: 'Choose "Minimal Install" to strip background recording daemons. Enable SAM.',
        directDownloadUrl: AMD_OFFICIAL_DRIVERS
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
        driverNotes: 'RDNA 2 sweet spot. Smart Access Memory (SAM) enabled.',
        directDownloadUrl: AMD_OFFICIAL_DRIVERS
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
        driverNotes: '16GB VRAM. Enable SAM in Radeon Software. Minimal Install.',
        directDownloadUrl: AMD_OFFICIAL_DRIVERS
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
        driverNotes: 'RDNA 3 Chiplet GPU. Anti-Lag enabled. Minimal Install.',
        directDownloadUrl: AMD_OFFICIAL_DRIVERS
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
        driverNotes: 'Flagship RDNA 3. Avoid full install bloat with Minimal setup.',
        directDownloadUrl: AMD_OFFICIAL_DRIVERS
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
        driverNotes: 'Mandatory ReBAR in BIOS. Disable telemetry in Arc Control.',
        directDownloadUrl: INTEL_OFFICIAL_DRIVERS
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
        driverNotes: 'ReBAR required for proper memory access. Windows 11 recommended.',
        directDownloadUrl: INTEL_OFFICIAL_DRIVERS
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
        directDownloadUrl: INTEL_OFFICIAL_DRIVERS
    }
];

export interface PagefileSpec {
    initMB: number;
    maxMB: number;
    badgeText: string;
    explanation: string;
}

export function getPagefileRecommendation(currentRam: RamModelSpec): PagefileSpec {
    const ramName = currentRam.name.toLowerCase();

    if (ramName.includes('single') || ramName.includes('8gb') || currentRam.id.includes('single')) {
        return {
            initMB: 8192,
            maxMB: 16384,
            badgeText: '8GB/16GB RAM · 8GB-16GB Buffer',
            explanation:
                '8GB/16GB RAM Setup: Uses an 8GB initial buffer with a 16GB expansion ceiling. Because physical RAM is limited, modern games easily exceed 16GB total commit charge; this prevents out-of-memory game crashes.'
        };
    }

    if (ramName.includes('32gb+')) {
        return {
            initMB: 4096,
            maxMB: 4096,
            badgeText: '64GB+ RAM · 4GB Lean',
            explanation:
                '64GB+ RAM Setup: Lean 4096 MB static allocation. With 64GB+ of physical memory, your system will never run out of RAM; 4GB satisfies Windows kernel triage dump and API requirements without wasting SSD storage.'
        };
    }

    return {
        initMB: 8192,
        maxMB: 8192,
        badgeText: 'Standard Dual-Channel · 8GB Static',
        explanation:
            'Standard Gaming Setup: Pure static 8192 MB. Prevents NVMe drive allocation spikes and locks memory paging to a single contiguous block on C:.'
    };
}

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
