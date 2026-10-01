export interface CttItemBlueprint {
    label: string;
    action: 'CHECK' | 'UNCHECK' | 'OPTIONAL';
    why: string;
}

export const CTT_ESSENTIAL_ITEMS: CttItemBlueprint[] = [
    {
        label: 'Activity History - Disable',
        action: 'CHECK',
        why: 'Stops Windows from tracking and recording every opened app and window to a local database.'
    },
    {
        label: 'BitLocker - Disable',
        action: 'CHECK',
        why: 'Prevents automatic background drive encryption, eliminating storage write latency and lockout risks.'
    },
    {
        label: 'ConsumerFeatures - Disable',
        action: 'CHECK',
        why: 'Stops Windows from auto-installing sponsored bloatware (Candy Crush, Disney+, TikTok) on clean accounts.'
    },
    {
        label: 'Delivery Optimization - Disable',
        action: 'CHECK',
        why: 'Prevents Windows Update from using your upload bandwidth as a P2P seeder for strangers on the internet.'
    },
    {
        label: 'Disk Cleanup - Run',
        action: 'CHECK',
        why: 'Purges outdated Windows temporary installation staging buffers and update rollback files.'
    },
    {
        label: 'End Task With Right Click - Enable',
        action: 'CHECK',
        why: 'Allows killing hung games and frozen processes directly from the taskbar without opening Task Manager.'
    },
    {
        label: 'File Explorer Automatic Folder Discovery - Disable',
        action: 'CHECK',
        why: 'Eliminates File Explorer freezing when opening large directories as it scans for media metadata.'
    },
    {
        label: 'Hibernation - Disable',
        action: 'CHECK',
        why: 'Deletes hiberfil.sys (frees 16–32 GB SSD space) and disables Fast Startup driver memory leaks.'
    },
    {
        label: 'Location Tracking - Disable',
        action: 'CHECK',
        why: 'Disables background geolocation polling services that wake CPU cores from idle sleep.'
    },
    {
        label: 'Microsoft Store Recommended Search Results - Disable',
        action: 'CHECK',
        why: 'Removes promoted app advertisements and store suggestions from Windows search.'
    },
    {
        label: 'Prevent Device Companion Apps',
        action: 'CHECK',
        why: 'Stops Windows from auto-installing manufacturer bloatware when plugging in mice or keyboards.'
    },
    {
        label: 'Restore Point - Create',
        action: 'CHECK',
        why: 'Creates an automatic recovery snapshot before any service or registry changes are applied.'
    },
    {
        label: 'Services - Set to Manual',
        action: 'CHECK',
        why: 'CRITICAL: Sets non-essential services to Manual instead of Disabled so apps that need them can still run.'
    },
    {
        label: 'Start Menu Previous Layout - Enable',
        action: 'UNCHECK',
        why: 'Aesthetic only: Changes Start menu layout. Leave unchecked unless you want the retro layout.'
    },
    {
        label: 'Telemetry - Disable',
        action: 'CHECK',
        why: 'Shuts down Connected User Experiences (DiagTrack) and background diagnostic logging daemons.'
    },
    { label: 'Temporary Files - Remove', action: 'CHECK', why: 'Cleans out %temp% and system staging buffers.' },
    {
        label: 'Widgets - Remove',
        action: 'CHECK',
        why: 'Kills the Edge WebView2 news feed that consumes 200MB+ RAM in the background.'
    },
    {
        label: 'Windows Platform Binary Table (WPBT) - Disable',
        action: 'CHECK',
        why: 'Blocks motherboards (ASUS, MSI, Gigabyte) from injecting bloatware into Windows during boot.'
    }
];

export const CTT_ADVANCED_ITEMS: CttItemBlueprint[] = [
    {
        label: 'Background Apps - Disable',
        action: 'CHECK',
        why: 'Shuts off background activity for modern UWP apps, freeing CPU thread cycles.'
    },
    {
        label: 'Disable Reserved Storage',
        action: 'CHECK',
        why: 'Reclaims 7–10 GB of SSD space artificially held by Windows for failed updates.'
    },
    {
        label: 'File Explorer Home and Gallery - Disable',
        action: 'CHECK',
        why: 'Speeds up File Explorer loading times by removing cloud-synced photo gallery tabs.'
    },
    {
        label: 'Razer Software Auto-Install - Disable',
        action: 'CHECK',
        why: 'Stops the Razer Synapse installer prompt from appearing every time a mouse is plugged in.'
    },
    {
        label: 'Right-Click Menu Previous Layout - Enable',
        action: 'CHECK',
        why: 'Windows 11 only: Restores the instant classic right-click menu, eliminating the slow "Show more options" click.'
    },
    {
        label: 'Windows AI - Disable And Remove',
        action: 'CHECK',
        why: 'Completely disables Windows Copilot, Recall snapshots, and Edge AI sidebars.'
    },
    {
        label: 'Microsoft OneDrive - Remove',
        action: 'OPTIONAL',
        why: 'CHECK IF NOT USING ONEDRIVE: Prevents sync locks on Documents and game save folders. Leave unchecked if using OneDrive.'
    },
    {
        label: 'Date & Time - Set Time to UTC',
        action: 'OPTIONAL',
        why: 'CHECK ONLY IF DUAL-BOOTING LINUX: Prevents clock misalignment when switching between Windows and Linux.'
    },
    {
        label: 'Microsoft Edge - Debloat',
        action: 'CHECK',
        why: 'Removes Edge telemetry, sidebar ads, and shopping bloat without breaking system WebViews.'
    },
    {
        label: 'Microsoft Edge - Remove',
        action: 'UNCHECK',
        why: 'DANGER: Do not remove Edge completely. Stripping Edge breaks embedded web login views in game launchers (Epic, EA, Riot).'
    },
    {
        label: 'IPv6 - Disable',
        action: 'UNCHECK',
        why: 'DANGER: Breaks Xbox Party Chat, Teredo tunneling, and certain multiplayer games. Leave IPv6 enabled.'
    },
    {
        label: 'Teredo - Disable',
        action: 'UNCHECK',
        why: 'DANGER: Completely breaks multiplayer in Xbox Game Pass games (Forza Horizon, Halo, Sea of Thieves).'
    },
    {
        label: 'Visual Effects - Set to Best Performance',
        action: 'UNCHECK',
        why: 'Makes desktop text blurry and pixelated by disabling ClearType font smoothing.'
    },
    {
        label: 'Adobe URL Block List - Enable',
        action: 'UNCHECK',
        why: 'Contextual: Only check if you are deliberately blocking Adobe telemetry hosts.'
    },
    {
        label: 'Brave Browser - Debloat',
        action: 'UNCHECK',
        why: 'Contextual: Only check if you use Brave and want crypto/VPN buttons removed.'
    }
];

export const CTT_PREFERENCE_ITEMS: CttItemBlueprint[] = [
    {
        label: 'Game Mode (Toggle)',
        action: 'CHECK',
        why: 'MUST KEEP ON: Prioritizes GPU thread execution and pauses background Windows maintenance.'
    },
    {
        label: 'Mouse Acceleration (Toggle)',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Unchecks "Enhance pointer precision" for pure 1:1 raw mouse sensor tracking.'
    },
    {
        label: 'Start Menu Bing Search (Toggle)',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Eliminates internet query delay when searching for local apps in the Start menu.'
    },
    {
        label: 'Enable Long Paths (Toggle)',
        action: 'CHECK',
        why: 'Removes the 260-character path limit, preventing crashes in game modding and dev tools.'
    },
    {
        label: 'File Explorer File Extensions (Toggle)',
        action: 'CHECK',
        why: 'Displays true file extensions (.exe, .bat, etc.) to prevent launching disguised executables.'
    },
    {
        label: 'File Explorer Hidden Files (Toggle)',
        action: 'CHECK',
        why: 'Makes AppData and system configurations visible for game saves and modding.'
    },
    {
        label: 'Sticky Keys (Toggle)',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Stops the annoying Windows pop-up dialog when tapping Shift repeatedly in games.'
    },
    {
        label: 'Dark Theme for Windows (Toggle)',
        action: 'CHECK',
        why: 'Sets consistent dark theme across all Windows UI elements.'
    },
    {
        label: 'Window Snapping (Toggle)',
        action: 'CHECK',
        why: 'Preserves native window management and multi-monitor quadrant snapping.'
    },
    {
        label: 'BSoD Verbose Mode (Toggle)',
        action: 'CHECK',
        why: 'Shows exact crashing driver/file name on blue screens instead of a useless generic QR code.'
    },
    {
        label: 'Logon Screen Acrylic Blur (Toggle)',
        action: 'UNCHECK',
        why: 'Removes GPU blur render pass on lockscreen for faster login responsiveness.'
    }
];

export const CTT_FEATURE_ITEMS: CttItemBlueprint[] = [
    {
        label: '.NET Framework (Versions 2, 3, 4) - Enable',
        action: 'CHECK',
        why: 'MANDATORY FOR GAMING: Required for older game launchers, modding tools, and game engines.'
    },
    {
        label: 'Legacy Media Components (DirectPlay) - Enable',
        action: 'CHECK',
        why: 'MANDATORY FOR RETRO GAMES: DirectPlay is required for older titles (GTA: San Andreas, Fallout 3, DX8/9).'
    },
    {
        label: 'Registry Backup (Daily Task) - Enable',
        action: 'CHECK',
        why: 'Restores Windows automated daily registry backup to RegBack for emergency recovery.'
    },
    {
        label: 'Windows Subsystem for Linux (WSL) - Enable',
        action: 'OPTIONAL',
        why: 'RECOMMENDED FOR LINUX TESTERS: Runs a real Linux kernel (Ubuntu, CachyOS, Debian) inside Windows.'
    },
    {
        label: 'Windows Sandbox - Enable',
        action: 'OPTIONAL',
        why: 'Spins up an isolated, disposable Windows desktop to safely test suspicious files or unknown programs.'
    },
    {
        label: 'Hyper-V - Enable',
        action: 'UNCHECK',
        why: 'Leave unchecked unless running virtual machines; forces hypervisor-based virtualization overhead.'
    }
];
