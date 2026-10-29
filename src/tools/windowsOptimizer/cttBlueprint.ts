export interface CttItemBlueprint {
    label: string;
    action: 'CHECK' | 'UNCHECK' | 'OPTIONAL';
    why: string;
}

// =============================================================================
// 1. ESSENTIAL TWEAKS (18 Items — Exact Alphabetical Order)
// =============================================================================
export const CTT_ESSENTIAL_ITEMS: CttItemBlueprint[] = [
    {
        label: 'Activity History - Disable',
        action: 'CHECK',
        why: 'Stops Windows from recording every opened application, file, and window to a local telemetry database.'
    },
    {
        label: 'BitLocker - Disable',
        action: 'CHECK',
        why: 'Prevents automatic background drive encryption, eliminating storage write latency and lockout risks.'
    },
    {
        label: 'ConsumerFeatures - Disable',
        action: 'CHECK',
        why: 'Blocks Windows from silently auto-installing sponsored bloatware (Candy Crush, Disney+, TikTok) on clean user accounts.'
    },
    {
        label: 'Delivery Optimization - Disable',
        action: 'CHECK',
        why: 'Stops Windows Update from using your upload bandwidth as a peer-to-peer seeder for other users on the internet.'
    },
    {
        label: 'Disk Cleanup - Run',
        action: 'CHECK',
        why: 'Purges outdated Windows temporary staging buffers and leftover rollback files.'
    },
    {
        label: 'End Task With Right Click - Enable',
        action: 'CHECK',
        why: 'Adds an "End Task" option directly to taskbar icon right-clicks so you can kill frozen games without opening Task Manager.'
    },
    {
        label: 'File Explorer Automatic Folder Discovery - Disable',
        action: 'CHECK',
        why: 'Eliminates File Explorer freezing when opening large directories as Windows scans for media metadata.'
    },
    {
        label: 'Hibernation - Disable',
        action: 'CHECK',
        why: 'Deletes hiberfil.sys (frees 16–32 GB of SSD space) and disables Fast Startup memory leak issues.'
    },
    {
        label: 'Location Tracking - Disable',
        action: 'CHECK',
        why: 'Disables background geolocation polling daemons that wake CPU cores from idle sleep states.'
    },
    {
        label: 'Microsoft Store Recommended Search Results - Disable',
        action: 'CHECK',
        why: 'Removes promoted store ads and sponsored app suggestions from Windows Search.'
    },
    {
        label: 'Prevent Device Companion Apps',
        action: 'CHECK',
        why: 'Stops Windows from automatically downloading manufacturer bloatware whenever a mouse, headset, or keyboard is plugged in.'
    },
    {
        label: 'Restore Point - Create',
        action: 'CHECK',
        why: 'Generates an emergency snapshot checkpoint before any service or registry changes are applied.'
    },
    {
        label: 'Services - Set to Manual',
        action: 'CHECK',
        why: 'MANDATORY FOR RIOT / EAC: Sets non-essential services to Manual instead of Disabled so dependencies can launch on-demand without triggering error VAN 1067 / 9003.'
    },
    {
        label: 'Start Menu Previous Layout - Enable',
        action: 'UNCHECK',
        why: 'Aesthetic only: Changes Start menu layout. Leave unchecked unless you specifically want the retro style.'
    },
    {
        label: 'Telemetry - Disable',
        action: 'CHECK',
        why: 'Disables Connected User Experiences (DiagTrack) and background diagnostic telemetry daemons.'
    },
    {
        label: 'Temporary Files - Remove',
        action: 'CHECK',
        why: 'Cleans out %temp% and system staging caches.'
    },
    {
        label: 'Widgets - Remove',
        action: 'CHECK',
        why: 'Removes the Edge WebView2 news and weather feed that consumes 200MB+ RAM in the background.'
    },
    {
        label: 'Windows Platform Binary Table (WPBT) - Disable',
        action: 'CHECK',
        why: 'Blocks motherboard UEFI firmware (ASUS, MSI, Gigabyte) from silently injecting manufacturer bloatware into Windows during boot.'
    }
];

// =============================================================================
// 2. ADVANCED TWEAKS - CAUTION (20 Items — Exact Alphabetical Order)
// =============================================================================
export const CTT_ADVANCED_ITEMS: CttItemBlueprint[] = [
    {
        label: 'Adobe URL Block List - Enable',
        action: 'UNCHECK',
        why: 'Contextual: Only check if you are specifically attempting to block Adobe telemetry host endpoints.'
    },
    {
        label: 'Background Apps - Disable',
        action: 'CHECK',
        why: 'Shuts off background execution cycles for modern UWP apps, freeing CPU thread headroom.'
    },
    {
        label: 'Brave Browser - Debloat',
        action: 'UNCHECK',
        why: 'Contextual: Only check if you use Brave Browser and want crypto/VPN buttons stripped.'
    },
    {
        label: 'Date & Time - Set Time to UTC',
        action: 'OPTIONAL',
        why: 'CHECK ONLY IF DUAL-BOOTING LINUX: Prevents hardware clock desync when alternating between Windows and Linux.'
    },
    {
        label: 'Disable Reserved Storage',
        action: 'CHECK',
        why: 'Reclaims 7–10 GB of SSD space artificially reserved by Windows for failed updates.'
    },
    {
        label: 'File Explorer Home and Gallery - Disable',
        action: 'CHECK',
        why: 'Speeds up File Explorer loading times by removing cloud-synced photo gallery tabs.'
    },
    {
        label: 'IPv6 - Disable',
        action: 'UNCHECK',
        why: 'DANGER: DO NOT CHECK. Breaks Xbox Party Chat, Teredo tunneling, and certain multiplayer lobbies.'
    },
    {
        label: 'IPv6 - Set IPv4 as Preferred',
        action: 'CHECK',
        why: 'Safe low-latency tweak: Keeps IPv6 active for games/Xbox while forcing Windows to prioritize IPv4 routes for faster DNS resolution.'
    },
    {
        label: 'Logitech Download Assistant Auto-Install - Disable',
        action: 'CHECK',
        why: 'Stops the Logitech updater prompt from auto-spawning upon plugging in a mouse or keyboard.'
    },
    {
        label: 'Microsoft Edge - Debloat',
        action: 'CHECK',
        why: 'Strips Edge background telemetry, sidebar widgets, and shopping bloat without breaking system WebViews.'
    },
    {
        label: 'Microsoft Edge - Remove',
        action: 'UNCHECK',
        why: 'DANGER: DO NOT CHECK. Stripping Edge breaks embedded web login views in game launchers (Epic, EA App, Riot, Xbox).'
    },
    {
        label: 'Microsoft OneDrive - Remove',
        action: 'OPTIONAL',
        why: 'CHECK IF NOT USING ONEDRIVE: Prevents sync locks on Documents and game save folders. Leave unchecked if you actively use OneDrive.'
    },
    {
        label: 'Razer Software Auto-Install - Disable',
        action: 'CHECK',
        why: 'Stops the Razer Synapse installer popup whenever a Razer mouse or dongle is connected.'
    },
    {
        label: 'RDP Unsigned File Warnings - Disable',
        action: 'UNCHECK',
        why: 'Security warning bypass for Remote Desktop connections; leave unchecked unless you frequently connect to internal local RDP machines.'
    },
    {
        label: 'Right-Click Menu Previous Layout - Enable',
        action: 'CHECK',
        why: 'Windows 11 only: Restores the instant classic right-click menu, eliminating the slow "Show more options" click.'
    },
    {
        label: 'Storage Sense - Disable',
        action: 'CHECK',
        why: 'Stops Windows from running automated background drive cleanups that cause disk I/O spikes during games.'
    },
    {
        label: 'System Tray Notifications & Calendar - Disable',
        action: 'UNCHECK',
        why: 'Disables system tray notification popups and clock flyout; leave unchecked for normal desktop usability.'
    },
    {
        label: 'Teredo - Disable',
        action: 'UNCHECK',
        why: 'DANGER: DO NOT CHECK. Completely breaks multiplayer peer-to-peer networking in Xbox Game Pass games (Forza, Halo, Sea of Thieves).'
    },
    {
        label: 'Visual Effects - Set to Best Performance',
        action: 'UNCHECK',
        why: 'DO NOT CHECK IN CTT: CTT turns off ClearType font smoothing and image thumbnails. Use our Phase 6 Step 6 3-click guide instead.'
    },
    {
        label: 'Windows AI - Disable And Remove',
        action: 'CHECK',
        why: 'Completely strips Windows Copilot, Recall snapshots, and Edge AI sidebars.'
    }
];

// =============================================================================
// 3. CUSTOMIZE PREFERENCES (24 Items — Exact Alphabetical Order)
// =============================================================================
export const CTT_PREFERENCE_ITEMS: CttItemBlueprint[] = [
    {
        label: 'BSoD Verbose Mode',
        action: 'CHECK',
        why: 'Displays the exact crashing driver and error filename on blue screens instead of a generic QR code.'
    },
    {
        label: 'Dark Theme for Windows',
        action: 'CHECK',
        why: 'Enforces consistent dark theme styling across all Windows UI elements.'
    },
    {
        label: 'Enable Long Paths',
        action: 'CHECK',
        why: 'Removes the 260-character path limit, preventing crashes in game modding and developer tools.'
    },
    {
        label: 'File Explorer File Extensions',
        action: 'CHECK',
        why: 'Displays true file extensions (.exe, .bat, etc.) to prevent launching disguised executables.'
    },
    {
        label: 'File Explorer Hidden Files',
        action: 'CHECK',
        why: 'Makes AppData and system configuration folders visible for game save editing and modding.'
    },
    {
        label: 'Game Mode',
        action: 'CHECK',
        why: 'MUST KEEP ON: Prioritizes GPU thread execution and pauses background Windows maintenance during games.'
    },
    {
        label: 'Lock Screen - Disable',
        action: 'OPTIONAL',
        why: 'Bypasses the swipe-up wallpaper screen and takes you directly to the password/PIN prompt upon boot.'
    },
    {
        label: 'Logon Screen Acrylic Blur',
        action: 'UNCHECK',
        why: 'Removes the GPU blur render pass on the login screen for faster login display responsiveness.'
    },
    {
        label: 'Logon Verbose Mode',
        action: 'UNCHECK',
        why: 'Shows detailed background service loading messages during boot; leave off unless troubleshooting startup hang issues.'
    },
    {
        label: 'Microsoft Outlook New Version',
        action: 'UNCHECK',
        why: 'Stops Windows from automatically replacing classic lightweight Mail/Calendar with the web-wrapped Outlook client.'
    },
    {
        label: 'Mouse Acceleration',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Unchecks "Enhance pointer precision" for pure 1:1 raw mouse sensor tracking.'
    },
    {
        label: 'Num Lock on Startup',
        action: 'OPTIONAL',
        why: 'Automatically toggles Num Lock ON upon boot for full numeric desktop keyboards.'
    },
    {
        label: 'S0 Sleep Network Connectivity',
        action: 'UNCHECK',
        why: 'Disables Modern Standby network activity during sleep, preventing laptops from draining battery or heating up in bags.'
    },
    {
        label: 'S3 Sleep',
        action: 'UNCHECK',
        why: 'Legacy S3 sleep toggle; leave unchecked unless your motherboard firmware explicitly supports classic S3 over S0.'
    },
    {
        label: 'Scrollbars Always Visible',
        action: 'OPTIONAL',
        why: 'Forces scrollbars to remain visible instead of hiding when the mouse cursor is moved away.'
    },
    {
        label: 'Settings Home Page',
        action: 'UNCHECK',
        why: 'Disables the cluttered Microsoft 365 and OneDrive promo home tab in Windows Settings.'
    },
    {
        label: 'Start Menu Bing Search',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Eliminates internet query delays when searching for local apps in the Start menu.'
    },
    {
        label: 'Start Menu Recommendations',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Removes recommended promotional apps, recent documents, and tips from the Start menu.'
    },
    {
        label: 'Sticky Keys',
        action: 'UNCHECK',
        why: 'MUST TURN OFF: Stops the Windows pop-up dialog when tapping Shift repeatedly in games.'
    },
    {
        label: 'System Tray Battery Percentage',
        action: 'OPTIONAL',
        why: 'Displays exact numeric battery percentage in the system tray for laptops and portable devices.'
    },
    {
        label: 'Taskbar Centered Icons',
        action: 'OPTIONAL',
        why: 'Windows 11 only: Centers taskbar icons. Set to left or center based on your personal layout preference.'
    },
    {
        label: 'Taskbar Search Icon',
        action: 'UNCHECK',
        why: 'Turns the wide search box into a compact icon or hides it to free up taskbar space.'
    },
    {
        label: 'Taskbar Task View Icon',
        action: 'UNCHECK',
        why: 'Hides the virtual desktop Task View button from the taskbar.'
    },
    {
        label: 'Window Snapping',
        action: 'CHECK',
        why: 'Preserves native multi-monitor quadrant snapping and window arrangement shortcuts.'
    }
];

// =============================================================================
// 4. CONFIG TAB -> FEATURES (9 Items — Exact Alphabetical Order)
// =============================================================================
export const CTT_FEATURE_ITEMS: CttItemBlueprint[] = [
    {
        label: '.NET Framework (Versions 2, 3, 4) - Enable',
        action: 'CHECK',
        why: 'MANDATORY FOR GAMING: Required for older game launchers, modding tools, and game engines.'
    },
    {
        label: 'Hyper-V - Enable',
        action: 'UNCHECK',
        why: 'Leave unchecked unless running virtual machines; forces hypervisor-based virtualization overhead.'
    },
    {
        label: 'Legacy F8 Boot Recovery - Disable',
        action: 'UNCHECK',
        why: 'Leave unchecked if you want the classic F8 key menu available during boot.'
    },
    {
        label: 'Legacy F8 Boot Recovery - Enable',
        action: 'CHECK',
        why: 'Restores the classic F8 key recovery menu at startup to quickly access Safe Mode if Windows fails to boot.'
    },
    {
        label: 'Legacy Media Components (WMP, DirectPlay) - Enable',
        action: 'CHECK',
        why: 'MANDATORY FOR RETRO GAMES: DirectPlay is required for older titles (GTA: San Andreas, Fallout 3, DX8/9).'
    },
    {
        label: 'Network File System (NFS) - Enable',
        action: 'UNCHECK',
        why: 'Leave unchecked unless mounting Unix/Linux network storage volumes over a local network.'
    },
    {
        label: 'Registry Backup (Daily Task 12:30am) - Enable',
        action: 'CHECK',
        why: 'Restores Windows automated daily registry backup to RegBack for emergency recovery.'
    },
    {
        label: 'Windows Sandbox - Enable',
        action: 'OPTIONAL',
        why: 'Spins up an isolated, disposable Windows desktop to safely test suspicious files or unknown programs.'
    },
    {
        label: 'Windows Subsystem for Linux (WSL) - Enable',
        action: 'OPTIONAL',
        why: 'Runs a real Linux kernel (Ubuntu, Debian, CachyOS) inside Windows for developer tools and testing.'
    }
];
