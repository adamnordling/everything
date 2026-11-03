export interface IdeDetail {
    id: string;
    name: string;
    tier: 'S+' | 'S' | 'A' | 'A-' | 'B+';
    pricing: string;
    downloadUrl: string;
    engine: string;
    ramFootprint: string;
    coldStartup: string;
    telemetryStatus: string;
    learningCurve: 'Beginner Friendly' | 'Moderate' | 'Steep (Modal / Keyboard)';
    pros: string[];
    cons: string[];
    verdict: string;
    recommendedExtensions: Array<{ name: string; purpose: string }>;
    debloatSettingsTitle?: string;
    debloatJsonSnippet?: string;
    keyTips: string[];
}

export const IDE_TIER_DATABASE: IdeDetail[] = [
    // -------------------------------------------------------------------------
    // 1. TIER S+: NEOVIM
    // -------------------------------------------------------------------------
    {
        id: 'neovim',
        name: 'Neovim / LazyVim',
        tier: 'S+',
        pricing: 'Free / Open Source',
        downloadUrl: 'https://neovim.io/',
        engine: 'Native C & Lua (Headless / Terminal / GUI)',
        ramFootprint: '30 - 75 MB',
        coldStartup: '~15 ms',
        telemetryStatus: 'Zero Telemetry (100% Offline & Private)',
        learningCurve: 'Steep (Modal / Keyboard)',
        pros: [
            'Near-instant startup (~15 ms) and negligible memory footprint (~35 MB)',
            'Zero input latency: Keystrokes register at native hardware refresh rates',
            'Runs natively over SSH, tmux, and low-spec VPS servers without GUI tunnels',
            'Zero tracking: No telemetry daemons, ad networks, or background cloud indexers'
        ],
        cons: [
            'Steep learning curve: Modal keyboard editing (Normal, Insert, Visual) requires muscle memory',
            'No graphical debugger out of the box: Step-through debugging requires configuring nvim-dap and Lua plugins',
            'High maintenance: If configuring from raw init.lua, plugin breaking changes can occur on major updates'
        ],
        verdict:
            'The pinnacle of developer speed, keyboard ergonomics, and minimal resource usage. Best suited for developers who prioritize zero input latency and terminal workflows. Beginners should start with LazyVim rather than configuring raw Lua from scratch.',
        recommendedExtensions: [
            { name: 'lazy.nvim', purpose: 'Modern declarative plugin manager' },
            { name: 'nvim-treesitter', purpose: 'AST-based syntax highlighting and incremental selection' },
            { name: 'nvim-lspconfig', purpose: 'Native Language Server Protocol manager' },
            { name: 'telescope.nvim', purpose: 'Fuzzy finder over files, buffers, and git symbols' },
            { name: 'nvim-dap', purpose: 'Debug Adapter Protocol client for step-through debugging' }
        ],
        keyTips: [
            'Start with LazyVim: Run the official LazyVim starter repo to get a complete IDE setup with LSP, treesitter, and formatting in under 3 minutes.',
            'Addressing the Debugger: If you need visual breakpoints, install nvim-dap paired with nvim-dap-ui to render variable scopes and stack traces.',
            'Relative Line Numbers: Set "vim.opt.relativenumber = true" in your config to jump across lines instantly with commands like 14j or 8k.'
        ]
    },

    // -------------------------------------------------------------------------
    // 2. TIER S: ZED
    // -------------------------------------------------------------------------
    {
        id: 'zed',
        name: 'Zed Editor',
        tier: 'S',
        pricing: 'Free / Open Source',
        downloadUrl: 'https://zed.dev/',
        engine: 'Native Rust (GPUI Hardware-Accelerated Metal / Vulkan)',
        ramFootprint: '120 - 250 MB',
        coldStartup: '~60 ms',
        telemetryStatus: 'Opt-out (1 toggle in settings.json)',
        learningCurve: 'Beginner Friendly',
        pros: [
            'Engineered in Rust: Renders entirely on the GPU at 120 FPS without Electron sluggishness',
            'Instant cold startup (~60 ms) with minimal RAM overhead (~140 MB)',
            'Native Language Server Protocol (LSP) and tree-sitter syntax highlighting out of the box',
            'Real-time peer-to-peer multiplayer pair programming built into the core engine'
        ],
        cons: [
            'Younger extension marketplace compared to the decade-old VS Code ecosystem',
            'Native GUI configuration is still maturing on Linux and Windows platforms',
            'Custom UI theming is somewhat constrained to maintain GPUI rendering guarantees'
        ],
        verdict:
            'The modern successor to Electron-based editors. Combines the click-and-play ease of VS Code with the near-instant performance of native Rust.',
        recommendedExtensions: [
            { name: 'Language Extensions', purpose: 'Pre-configured rust-analyzer, pyright, and vtsls servers' },
            { name: 'Theme Packs', purpose: 'Dracula, One Dark, and GitHub Dark syntax themes' }
        ],
        debloatSettingsTitle: 'Zed Privacy & Performance settings.json',
        debloatJsonSnippet: `{
  // Kills telemetry and analytical crash reporting
  "telemetry": {
    "diagnostics": false,
    "metrics": false
  },

  // Typography and rendering
  "buffer_font_size": 14,
  "ui_font_size": 14,
  "theme": "One Dark",

  // Automated hygiene on save
  "autosave": "on_focus_change",
  "format_on_save": "on"
}`,
        keyTips: [
            'Isolated Language Servers: Language servers run in sandboxed native processes rather than heavy Node.js plugins.',
            'Built-in Command Palette: Press Cmd+Shift+P (or Ctrl+Shift+P) to access all editor commands instantly.'
        ]
    },

    // -------------------------------------------------------------------------
    // 3. TIER A: VS CODE / VSCODIUM
    // -------------------------------------------------------------------------
    {
        id: 'vscode',
        name: 'Visual Studio Code / VSCodium',
        tier: 'A',
        pricing: 'Free / Open Source',
        downloadUrl: 'https://code.visualstudio.com/',
        engine: 'Electron (Chromium + Node.js)',
        ramFootprint: '450 - 900 MB',
        coldStartup: '~800 ms',
        telemetryStatus: 'Active by default in official build (100% stripped in VSCodium)',
        learningCurve: 'Beginner Friendly',
        pros: [
            'The largest developer extension ecosystem in the world for all languages',
            'Integrated debugging, source control diffing, and terminal emulators out of the box',
            'Works universally across Windows, macOS, Linux, and web browsers (vscode.dev)',
            'VSCodium binary alternative provides complete zero-telemetry MIT licensing'
        ],
        cons: [
            'Electron overhead: Starts multiple Node.js worker helper processes consuming 500 MB+ RAM on idle',
            'Can become sluggish if users install dozens of unverified third-party extensions',
            'Official binary contains Microsoft usage telemetries and background experimentation daemons'
        ],
        verdict:
            'The global standard for multi-language and web engineering. When configured with clean settings that turn off background polling and the minimap, it remains responsive while retaining access to the world’s largest extension library.',
        recommendedExtensions: [
            { name: 'ESLint', purpose: 'Live AST static code error detection' },
            { name: 'Prettier', purpose: 'Automated code formatting on save' },
            { name: 'Error Lens', purpose: 'Renders syntax errors and warnings inline at the end of the line' },
            { name: 'GitLens', purpose: 'Line-by-line git blame and revision navigation' }
        ],
        debloatSettingsTitle: 'VS Code Zero-Lag settings.json (Turn off polling, lag & telemetries)',
        debloatJsonSnippet: `{
  // Kills Microsoft telemetry and experimentation daemons
  "telemetry.telemetryLevel": "off",
  "workbench.enableExperiments": false,
  "workbench.settings.enableNaturalLanguageSearch": false,

  // Rendering performance (Cuts GPU render passes)
  "editor.smoothScrolling": false,               // true = smooth scroll lag | false = instant
  "editor.cursorBlinking": "solid",              // solid = zero CPU render loop | blink = constant wake
  "editor.cursorSmoothCaretAnimation": "off",    // off = instant typing response
  "editor.minimap.enabled": false,               // false = saves 15% GPU/CPU overhead per tab
  "editor.renderWhitespace": "selection",

  // Built-in bracket intelligence (No extension needed)
  "editor.bracketPairColorization.enabled": true, // Built-in colored brackets
  "editor.guides.bracketPairs": true,            // Scope line indicators

  // Automated formatting & import organization
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },

  // Watcher exclusions (Prevents CPU fan spikes on large projects)
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/*/**": true,
    "**/dist/**": true,
    "**/.venv/**": true,
    "**/target/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/target": true,
    "**/.venv": true
  }
}`,
        keyTips: [
            'Do Not Install Bracket Pair Colorizer: VS Code has native bracket coloring built in (editor.bracketPairColorization.enabled: true). Third-party extensions cause heavy typing lag.',
            'Disable the Code Minimap: The code minimap runs an extra canvas rendering loop on every single keystroke. Disabling it saves significant CPU time.',
            'Prefer VSCodium: If you care about zero telemetry, download VSCodium (vscodium.com), which compiles the exact same source without telemetry trackers.'
        ]
    },

    // -------------------------------------------------------------------------
    // 4. TIER A-: CURSOR & WINDSURF
    // -------------------------------------------------------------------------
    {
        id: 'cursor',
        name: 'Cursor & Windsurf',
        tier: 'A-',
        pricing: 'Freemium ($20/mo Pro Subscription)',
        downloadUrl: 'https://www.cursor.com/',
        engine: 'Electron (Forked VS Code Core + Cloud/Local AI Agents)',
        ramFootprint: '650 - 1400 MB',
        coldStartup: '~1100 ms',
        telemetryStatus: 'Active: Indexes repository symbols and context for AI models',
        learningCurve: 'Beginner Friendly',
        pros: [
            'Deep codebase semantic indexing: Answers architectural questions across your entire repository',
            'Inline multi-file diff suggestions that apply edits across several files simultaneously',
            'Full compatibility with existing VS Code keybindings, themes, and extensions'
        ],
        cons: [
            'Commercial dependency: Advanced features require a $20/month subscription',
            'Heaviest resource footprint: Combines Electron with continuous background indexing processes',
            'Privacy considerations: Code embeddings and tokens are sent to model provider APIs unless Privacy Mode is on'
        ],
        verdict:
            'The current leader in AI-assisted developer IDEs. Ideal for complex migrations, fast prototyping, and navigating unfamiliar codebases, provided you configure privacy guards.',
        recommendedExtensions: [
            { name: 'Built-in Agent', purpose: 'Cmd+K / Ctrl+K inline editor and multi-file composer' },
            { name: 'Prettier', purpose: 'Clean formatting for generated model code' }
        ],
        debloatSettingsTitle: 'Cursor Privacy & Efficiency settings.json',
        debloatJsonSnippet: `{
  // Performance and latency settings
  "editor.minimap.enabled": false,
  "editor.formatOnSave": true,

  // Indexing exclusions (Stops secrets and large data from indexing)
  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/.venv/**": true,
    "**/target/**": true,
    "**/*.onnx": true,
    "**/*.pt": true
  }
}`,
        keyTips: [
            'Create a .cursorignore: Always add .env, API keys, credentials, and data folders to a .cursorignore file so private variables are never sent to external model endpoints.',
            'Enable Privacy Mode: Open Cursor Settings -> General and enable "Privacy Mode" so no code snippets are retained on server training logs.'
        ]
    },

    // -------------------------------------------------------------------------
    // 5. TIER B+: JETBRAINS SUITE
    // -------------------------------------------------------------------------
    {
        id: 'jetbrains',
        name: 'JetBrains (WebStorm / PyCharm / RustRover)',
        tier: 'B+',
        pricing: 'Commercial Subscription ($10 - $30/mo)',
        downloadUrl: 'https://www.jetbrains.com/',
        engine: 'Java Virtual Machine (JVM)',
        ramFootprint: '1.2 - 2.8 GB',
        coldStartup: '~2400 ms',
        telemetryStatus: 'Opt-out telemetry prompt during initial installation',
        learningCurve: 'Moderate',
        pros: [
            'Best-in-class automated code refactoring, AST renaming, and reference tracing',
            'Comprehensive visual debugging, database SQL query tools, and profilers included out of the box',
            'Dedicated language-specialized editions (PyCharm for Python, RustRover for Rust, WebStorm for JS/TS)'
        ],
        cons: [
            'High memory consumption: JVM heap easily claims 1.5 to 2.5 GB RAM on medium projects',
            'Slow cold startup time (~2.4s+) while parsing workspace caches and symbol indices',
            'Commercial licensing: Requires an ongoing monthly or annual subscription after evaluation'
        ],
        verdict:
            'An enterprise-grade tool suite. If you frequently perform complex cross-file refactorings and need built-in visual database management, it is unmatched, but it requires significant RAM and CPU headroom.',
        recommendedExtensions: [
            { name: 'Key Promoter X', purpose: 'Teaches keyboard shortcuts whenever you click a toolbar button' },
            { name: '.ignore', purpose: 'Syntax highlighting and template generator for .gitignore' }
        ],
        debloatSettingsTitle: 'JetBrains JVM Memory Configuration (Help -> Edit Custom VM Options)',
        debloatJsonSnippet: `# Increase maximum heap memory allocation to prevent garbage collection stutter
-Xms1024m
-Xmx4096m
-XX:ReservedCodeCacheSize=512m
-XX:+UseG1GC`,
        keyTips: [
            'Exclude Generated Folders: Right-click dist/, target/, or .venv/ in the project view -> Mark Directory as -> Excluded. This prevents the IDE from indexing binary bundles.',
            'Tune JVM Heap: If you have 32 GB+ of RAM, increase -Xmx to 4096m to eliminate garbage collector pauses during long coding sessions.'
        ]
    }
];
