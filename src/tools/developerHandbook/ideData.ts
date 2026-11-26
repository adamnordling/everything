export interface HotkeyItem {
    action: string;
    keys: string;
    note?: string;
}

export interface HotkeyGroup {
    category: string;
    items: HotkeyItem[];
}

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
    hotkeyGroups?: HotkeyGroup[];
}

export const IDE_TIER_DATABASE: IdeDetail[] = [
    // -------------------------------------------------------------------------
    // 1. TIER S+: NEOVIM / LAZYVIM
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
            'Graphical debugger requires configuring nvim-dap (included pre-wired in LazyVim extras)',
            'Raw init.lua configs require occasional plugin maintenance on major updates'
        ],
        verdict:
            'The pinnacle of developer speed, keyboard ergonomics, and minimal resource usage. Best suited for developers who prioritize zero input latency and terminal workflows. Start with LazyVim (lazyvim.org) instead of writing raw Lua from scratch.',
        recommendedExtensions: [
            { name: 'lazy.nvim', purpose: 'Modern declarative plugin manager' },
            { name: 'nvim-treesitter', purpose: 'AST-based syntax highlighting and incremental selection' },
            { name: 'nvim-lspconfig', purpose: 'Native Language Server Protocol manager' },
            { name: 'fzf-lua / telescope.nvim', purpose: 'Fuzzy finder over files, buffers, and grep matches' },
            { name: 'nvim-dap', purpose: 'Debug Adapter Protocol client for breakpoints & stack inspection' }
        ],
        keyTips: [
            'Start with LazyVim: Install the LazyVim starter template to get LSP, Treesitter, formatting, git integration, and leader menus out of the box.',
            'Built-in Tutor: Run `:Tutor` directly inside Neovim for an interactive 20-minute hands-on drill.',
            'Relative Line Numbers: LazyVim enables `relativenumber` by default — jump 12 lines down instantly with `12j` or `12k` up.'
        ],
        hotkeyGroups: [
            {
                category: '1. Modes & Saving',
                items: [
                    {
                        action: 'Return to Normal mode (from any mode)',
                        keys: 'Esc / jk',
                        note: 'Use Esc in all Vim setups'
                    },
                    { action: 'Insert before cursor', keys: 'i' },
                    { action: 'Insert at start of current line', keys: 'I' },
                    { action: 'Append after cursor', keys: 'a' },
                    { action: 'Append at end of current line', keys: 'A' },
                    { action: 'New line below & enter Insert mode', keys: 'o' },
                    { action: 'New line above & enter Insert mode', keys: 'O' },
                    { action: 'Visual character selection mode', keys: 'v' },
                    { action: 'Visual full-line selection mode', keys: 'V' },
                    { action: 'Visual Block (multi-line column edit)', keys: 'Ctrl + v' },
                    { action: 'Save file (in Normal mode)', keys: ':w / Ctrl+s', note: 'Ctrl+s works in LazyVim' },
                    { action: 'Save and quit current window', keys: ':wq / ZZ' },
                    { action: 'Quit without saving changes', keys: ':q!' }
                ]
            },
            {
                category: '2. Basic & Word Motions',
                items: [
                    {
                        action: 'Move Left / Down / Up / Right',
                        keys: 'h / j / k / l',
                        note: 'Keep fingers on home row'
                    },
                    { action: 'Jump forward to start of next word', keys: 'w', note: 'Use W to ignore punctuation' },
                    { action: 'Jump backward to start of word', keys: 'b', note: 'Use B to ignore punctuation' },
                    { action: 'Jump forward to end of word', keys: 'e' },
                    { action: 'Start of line (column 0)', keys: '0' },
                    { action: 'First non-blank character of line', keys: '^' },
                    { action: 'End of current line', keys: '$' },
                    { action: 'Jump to matching bracket ( { [ )', keys: '%' },
                    { action: 'Jump to top of file', keys: 'gg' },
                    { action: 'Jump to bottom of file', keys: 'G' },
                    { action: 'Jump to specific line number (e.g. 42)', keys: '42G / :42' },
                    { action: 'Scroll half-page down / up', keys: 'Ctrl+d / Ctrl+u' },
                    { action: 'Center cursor line on screen', keys: 'zz' },
                    {
                        action: 'Jump forward to char "x" on line',
                        keys: 'fx',
                        note: 'tx stops 1 char before x; ; repeats'
                    },
                    { action: 'Jump back / forward in jump history', keys: 'Ctrl+o / Ctrl+i' }
                ]
            },
            {
                category: '3. Search & Replace',
                items: [
                    { action: 'Search forward for text', keys: '/pattern' },
                    { action: 'Search backward for text', keys: '?pattern' },
                    { action: 'Next / Previous search match', keys: 'n / N' },
                    { action: 'Search word currently under cursor', keys: '* / #' },
                    { action: 'Clear search highlight', keys: 'Esc / :noh', note: 'Esc clears highlights in LazyVim' },
                    { action: 'Find & replace across whole file (confirm)', keys: ':%s/old/new/gc' }
                ]
            },
            {
                category: '4. Editing Operators (Verb + Motion)',
                items: [
                    { action: 'Delete character under cursor', keys: 'x' },
                    { action: 'Delete entire line', keys: 'dd' },
                    { action: 'Delete from cursor to end of line', keys: 'D / d$' },
                    { action: 'Delete inside word (keeps spaces)', keys: 'diw', note: 'daw deletes word + space' },
                    { action: 'Change inside quotes "..." (deletes & Inserts)', keys: 'ci"' },
                    { action: 'Change inside parentheses (...)', keys: 'ci(' },
                    { action: 'Change inside curly braces {...}', keys: 'ci{' },
                    { action: 'Change from cursor to end of line', keys: 'C / c$' },
                    { action: 'Yank (copy) entire line', keys: 'yy' },
                    { action: 'Yank inside word / quotes', keys: 'yiw / yi"' },
                    { action: 'Paste after / before cursor', keys: 'p / P' },
                    { action: 'Undo last change', keys: 'u' },
                    { action: 'Redo last undone change', keys: 'Ctrl + r' },
                    { action: 'Repeat last edit command', keys: '.', note: 'One of Vim’s strongest keys' },
                    { action: 'Indent / Unindent line', keys: '>> / <<' },
                    {
                        action: 'Toggle comment on line / selection',
                        keys: 'gcc / gc',
                        note: 'Built into Neovim 0.10+ & LazyVim'
                    },
                    { action: 'Move selected lines Up / Down (LazyVim)', keys: 'Alt+k / Alt+j' }
                ]
            },
            {
                category: '5. LazyVim <Space> Leader & LSP',
                items: [
                    {
                        action: 'Open Which-Key shortcut cheat menu',
                        keys: '<Space>',
                        note: 'Wait 300ms to see all menus'
                    },
                    { action: 'Fuzzy find files in project', keys: '<Space> ff' },
                    { action: 'Live grep (search text in all files)', keys: '<Space> sg' },
                    { action: 'Toggle File Explorer (Neo-tree / Snacks)', keys: '<Space> e' },
                    { action: 'Switch open buffers / recent files', keys: '<Space> fb / <Space> fr' },
                    { action: 'Next / Previous buffer tab', keys: 'Shift+l / Shift+h' },
                    { action: 'Close current buffer', keys: '<Space> bd' },
                    { action: 'Split window vertically / horizontally', keys: '<Space> | / <Space> -' },
                    { action: 'Move between window splits', keys: 'Ctrl + h/j/k/l' },
                    { action: 'Go to Definition (LSP)', keys: 'gd' },
                    { action: 'Find all References (LSP)', keys: 'gr' },
                    { action: 'Show hover documentation (LSP)', keys: 'Shift + k' },
                    { action: 'LSP Code Actions (quick fix / import)', keys: '<Space> ca' },
                    { action: 'Rename symbol across project', keys: '<Space> cr' },
                    { action: 'Next / Previous diagnostic error', keys: ']d / [d' },
                    { action: 'Open LazyGit inside Neovim', keys: '<Space> gg' },
                    { action: 'Open floating terminal', keys: '<Space> ft / Ctrl+/' }
                ]
            }
        ]
    },

    // -------------------------------------------------------------------------
    // 2. TIER S: ZED EDITOR
    // -------------------------------------------------------------------------
    {
        id: 'zed',
        name: 'Zed Editor',
        tier: 'S',
        pricing: 'Free / Open Source',
        downloadUrl: 'https://zed.dev/',
        engine: 'Native Rust (GPUI Hardware-Accelerated Metal / Vulkan / DirectX)',
        ramFootprint: '120 - 250 MB',
        coldStartup: '~60 ms',
        telemetryStatus: 'Opt-out (diagnostics, metrics & anthropic_retention = false)',
        learningCurve: 'Beginner Friendly',
        pros: [
            'Engineered in Rust: Renders on the GPU at 120+ FPS with zero Electron sluggishness',
            'Supports Windows, macOS, and Linux natively with built-in Git panel & DAP debugger',
            'Built-in keymap presets (`JetBrains`, `VSCode`, `Vim`, `SublimeText`, `Emacs`)',
            'Automatic Python `.venv` detection in integrated terminal and native Prettier/ESLint integration'
        ],
        cons: [
            'Smaller extension marketplace compared to VS Code (though core languages & themes are native)',
            'No GUI checkboxes for every setting — advanced tweaks live in JSONC `settings.json`',
            'Defaults to `tab_size: 2` which draws extra indent lines on 4-space Prettier projects unless matched'
        ],
        verdict:
            'The fastest modern GUI code editor. Combines native Rust GPUI speed with built-in Git, integrated debugging, and zero-lag JetBrains/VSCode/Vim keymaps.',
        recommendedExtensions: [
            { name: 'Catppuccin / Catppuccin Icons', purpose: 'Clean high-contrast light/dark theme & file icons' },
            { name: 'HTML / Emmet / Prettier', purpose: 'Instant tag expansion and automatic formatting on save' },
            { name: 'Language Servers', purpose: 'Built-in vtsls (TS), pyright/ruff (Python), rust-analyzer' }
        ],
        debloatSettingsTitle: 'Zed Full Workstation settings.json (Privacy + JetBrains Keymap + Panels)',
        debloatJsonSnippet: `{
  // PRIVACY
  "telemetry": {
    "diagnostics": false,
    "metrics": false,
    "anthropic_retention": false
  },

  // WORKSPACE SECURITY
  "session": {
    "trust_all_worktrees": true
  },

  // KEYBOARD (Options: "VSCode", "JetBrains", "Vim", "SublimeText")
  "base_keymap": "JetBrains",

  // APPEARANCE
  "theme": {
    "mode": "system",
    "light": "Catppuccin Latte",
    "dark": "Catppuccin Black"
  },
  "icon_theme": "Material Icon Theme",

  // FONTS
  "ui_font_size": 16,
  "buffer_font_size": 13,

  // FILE EXPLORER - LEFT
  "project_panel": {
    "dock": "left",
    "default_width": 260,
    "file_icons": true,
    "git_status": true,
    "auto_reveal_entries": true,
    "sort_mode": "directories_first",
    "show_diagnostics": "all",
    "diagnostic_badges": true,
    "git_status_indicator": true,
    "starts_open": true
  },

  // GIT - RIGHT
  "git_panel": {
    "dock": "right",
    "default_width": 360,
    "button": true,
    "group_by": "status",
    "sort_by": "path",
    "status_style": "icon",
    "tree_view": true,
    "file_icons": true,
    "show_count_badge": true,
    "diff_stats": true,
    "starts_open": true
  },

  // TERMINAL - BOTTOM
  "terminal": {
    "dock": "bottom",
    "default_height": 320,
    "button": true,
    "starts_open": false,
    "shell": "system",
    "working_directory": "current_project_directory",
    "detect_venv": {
      "on": {
        "directories": [".env", "env", ".venv", "venv"],
        "activate_script": "default"
      }
    }
  },

  // DEBUGGER
  "debugger": {
    "dock": "bottom",
    "save_breakpoints": true,
    "button": true
  },

  // EDITOR (Set tab_size: 4 to match Prettier tabWidth: 4, or keep 2 + disable indent_guides)
  "tab_size": 4,
  "hard_tabs": false,
  "soft_wrap": "editor_width",
  "indent_guides": {
    "enabled": true,
    "coloring": "indent_aware"
  },
  "autosave": "on_focus_change",
  "format_on_save": "on",
  "ensure_final_newline_on_save": true,
  "remove_trailing_whitespace_on_save": true,

  // DIAGNOSTICS & SCROLLBAR
  "diagnostics": {
    "inline": {
      "enabled": false
    }
  },
  "scrollbar": {
    "diagnostics": "all"
  }
}`,
        keyTips: [
            'Indent Guides Clutter Fix: If deeply nested HTML looks like 25+ vertical lines, match `tab_size` to your Prettier `tabWidth` (4) or set `"indent_guides": { "enabled": false }`.',
            'Prevent Cut-Off Lines: Add `"soft_wrap": "editor_width"` when keeping both Left Explorer (260px) and Right Git Panel (360px) docked open.',
            'Disable Built-in AI Completely: Add `"disable_ai": true` at the top level if you want zero AI assistants or prompts.'
        ],
        hotkeyGroups: [
            {
                category: 'Zed Core & JetBrains Keymap (Windows / Linux)',
                items: [
                    { action: 'Command Palette (all actions)', keys: 'Ctrl + Shift + A' },
                    { action: 'Quick Open File by Name', keys: 'Ctrl + Shift + N' },
                    { action: 'Project-wide Text Search', keys: 'Ctrl + Shift + F' },
                    { action: 'Toggle Left Project Explorer', keys: 'Alt + 1' },
                    { action: 'Toggle Bottom Terminal', keys: 'Alt + F12 / Ctrl + `' },
                    { action: 'Go to Definition / Declaration', keys: 'Ctrl + B / F12' },
                    { action: 'Rename Symbol across project', keys: 'Shift + F6' },
                    { action: 'Toggle Line Comment', keys: 'Ctrl + /' },
                    { action: 'Multi-cursor: Add next occurrence', keys: 'Alt + J' },
                    { action: 'Format Document manually', keys: 'Ctrl + Alt + L' },
                    { action: 'Open Settings (settings.json)', keys: 'Ctrl + Alt + S' }
                ]
            }
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
            'Do Not Install Bracket Pair Colorizer: VS Code has native bracket coloring built in (`editor.bracketPairColorization.enabled: true`).',
            'Disable the Code Minimap: The minimap runs an extra canvas rendering loop on every keystroke. Disabling it saves CPU time.',
            'Prefer VSCodium: If you care about zero telemetry, download VSCodium (vscodium.com), which compiles the same core without Microsoft tracking.'
        ],
        hotkeyGroups: [
            {
                category: 'VS Code Essential Navigation (Windows / Linux)',
                items: [
                    { action: 'Command Palette', keys: 'Ctrl + Shift + P' },
                    { action: 'Quick Open File', keys: 'Ctrl + P' },
                    { action: 'Go to Symbol in File', keys: 'Ctrl + Shift + O' },
                    { action: 'Toggle Sidebar / Terminal', keys: 'Ctrl+B / Ctrl+`' },
                    { action: 'Add Cursor to Next Match', keys: 'Ctrl + D' },
                    { action: 'Move Line Up / Down', keys: 'Alt + Up / Down' },
                    { action: 'Quick Fix / Code Action', keys: 'Ctrl + .' },
                    { action: 'Rename Symbol', keys: 'F2' }
                ]
            }
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
            { name: 'Built-in Agent', purpose: 'Ctrl+K inline editor and multi-file composer' },
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
            'Create a `.cursorignore`: Add `.env`, API keys, credentials, and large data folders so private secrets are never indexed.',
            'Enable Privacy Mode: Open Cursor Settings -> General and enable "Privacy Mode" so zero code snippets are retained for model training.'
        ]
    },

    // -------------------------------------------------------------------------
    // 5. TIER B+: JETBRAINS SUITE
    // -------------------------------------------------------------------------
    {
        id: 'jetbrains',
        name: 'JetBrains (WebStorm / PyCharm / RustRover)',
        tier: 'B+',
        pricing: 'Commercial Subscription (Free for Non-Commercial WebStorm/RustRover/Rider)',
        downloadUrl: 'https://www.jetbrains.com/',
        engine: 'Java Virtual Machine (JVM)',
        ramFootprint: '1.2 - 2.8 GB',
        coldStartup: '~2400 ms',
        telemetryStatus: 'Opt-out telemetry prompt during initial installation',
        learningCurve: 'Moderate',
        pros: [
            'Best-in-class automated code refactoring, AST renaming, and reference tracing',
            'Comprehensive visual debugging, database SQL query tools, and profilers included out of the box',
            'WebStorm, RustRover, and Rider offer free non-commercial licensing for hobby & open-source work'
        ],
        cons: [
            'High memory consumption: JVM heap easily claims 1.5 to 2.5 GB RAM on medium projects',
            'Slow cold startup time (~2.4s+) while parsing workspace caches and symbol indices',
            'Commercial licensing required for professional work'
        ],
        verdict:
            'An enterprise-grade tool suite. Unmatched for complex cross-file refactoring and built-in database/debugger tooling, though Zed with `"base_keymap": "JetBrains"` gives the same shortcuts at 1/10th the RAM.',
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
            'Exclude Generated Folders: Right-click `dist/`, `target/`, or `.venv/` -> Mark Directory as -> Excluded.',
            'Tune JVM Heap: On 32 GB+ RAM rigs, raise `-Xmx` to `4096m` to prevent garbage-collection micro-stutters.'
        ],
        hotkeyGroups: [
            {
                category: 'JetBrains Core Keymap (Windows / Linux)',
                items: [
                    { action: 'Search Everywhere (files, symbols, actions)', keys: 'Shift, Shift' },
                    { action: 'Find Action', keys: 'Ctrl + Shift + A' },
                    { action: 'Refactor / Rename Symbol', keys: 'Shift + F6' },
                    { action: 'Show Context Actions / Quick Fix', keys: 'Alt + Enter' },
                    { action: 'Go to Declaration / Usages', keys: 'Ctrl + B' },
                    { action: 'Reformat Code', keys: 'Ctrl + Alt + L' }
                ]
            }
        ]
    }
];
