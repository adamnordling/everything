import type { FlashcardDeck } from './types';

export const FLASHCARD_DECKS: FlashcardDeck[] = [
    // =========================================================================
    // CATEGORY: HOTKEYS & KEYBINDS
    // =========================================================================
    {
        id: 'neovim-lazyvim',
        category: 'hotkeys',
        categoryLabel: 'Hotkeys & Keybinds',
        title: 'Neovim / LazyVim',
        subtitle: 'Modal editing, Vim motions, operators & <Space> leader binds',
        cards: [
            {
                id: 'nv-1',
                topic: 'Modes',
                prompt: 'Return to Normal mode from any mode',
                answer: 'Esc  (or jk)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'mode-esc' }
            },
            {
                id: 'nv-2',
                topic: 'Modes',
                prompt: 'Insert before cursor / at start of line',
                answer: 'i  /  I',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Insert i / I',
                    before: '  const ',
                    highlight: 'x',
                    after: ' = 10;',
                    modeLabel: 'INSERT'
                }
            },
            {
                id: 'nv-3',
                topic: 'Modes',
                prompt: 'Append after cursor / at end of line',
                answer: 'a  /  A',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Append a / A',
                    before: '  const x = 10',
                    after: ';',
                    cursorAt: 'end',
                    modeLabel: 'INSERT'
                }
            },
            {
                id: 'nv-4',
                topic: 'Modes',
                prompt: 'Open new line below / above & enter Insert',
                answer: 'o  /  O',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Open Line o / O',
                    before: '',
                    highlight: '  // new line',
                    after: '',
                    modeLabel: 'INSERT'
                }
            },
            {
                id: 'nv-5',
                topic: 'Modes',
                prompt: 'Visual char / line / block (column) mode',
                answer: 'v  /  V  /  Ctrl+v',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'mode-visual-block' }
            },
            {
                id: 'nv-6',
                topic: 'Modes',
                prompt: 'Save file / Save & quit / Force quit',
                answer: ':w  /  :wq (ZZ)  /  :q!',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'file-save' }
            },
            {
                id: 'nv-7',
                topic: 'Motions',
                prompt: 'Home-row navigation (Left, Down, Up, Right)',
                answer: 'h  /  j  /  k  /  l',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Home Row Move',
                    before: '  fn ',
                    highlight: 'm',
                    after: 'ove(x)',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-8',
                topic: 'Motions',
                prompt: 'Jump to start of next word / previous word',
                answer: 'w  /  b',
                hint: 'Uppercase W / B skips punctuation',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Word Jump',
                    before: 'const ',
                    highlight: 'speed',
                    after: ' = 120;',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-9',
                topic: 'Motions',
                prompt: 'Jump to end of current/next word',
                answer: 'e',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Word End',
                    before: 'const spee',
                    highlight: 'd',
                    after: ' = 120;',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-10',
                topic: 'Motions',
                prompt: 'Start of line (col 0) / first non-space char',
                answer: '0  /  ^',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Line Start',
                    before: '   ',
                    highlight: 'return',
                    after: ' ok;',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-11',
                topic: 'Motions',
                prompt: 'Jump to end of current line',
                answer: '$',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Line End',
                    before: '  return ok',
                    highlight: ';',
                    after: '',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-12',
                topic: 'Motions',
                prompt: 'Jump to matching bracket ( ), { }, [ ]',
                answer: '%',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Match Bracket',
                    before: 'fn run',
                    highlight: '()',
                    after: ' {}',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-13',
                topic: 'Motions',
                prompt: 'Jump to top / bottom of file',
                answer: 'gg  /  G',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'file-top' }
            },
            {
                id: 'nv-14',
                topic: 'Motions',
                prompt: 'Scroll half-page down / up',
                answer: 'Ctrl+d  /  Ctrl+u',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'scroll-half' }
            },
            {
                id: 'nv-15',
                topic: 'Motions',
                prompt: 'Center current cursor line vertically',
                answer: 'zz',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'center-zz' }
            },
            {
                id: 'nv-16',
                topic: 'Motions',
                prompt: 'Find char "x" forward / stop 1 char before "x"',
                answer: 'fx  /  tx',
                hint: 'Press ; to repeat forward, , backward',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Char Search f/t',
                    before: 'url = "https:',
                    highlight: '/',
                    after: '/app"',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-17',
                topic: 'Motions',
                prompt: 'Jump back / forward in jump list',
                answer: 'Ctrl+o  /  Ctrl+i',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'undo-redo' }
            },
            {
                id: 'nv-18',
                topic: 'Operators',
                prompt: 'Delete entire line / yank (copy) entire line',
                answer: 'dd  /  yy',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Line Op dd/yy',
                    before: '',
                    highlight: '  const tmp = null;',
                    after: '',
                    modeLabel: 'VISUAL'
                }
            },
            {
                id: 'nv-19',
                topic: 'Operators',
                prompt: 'Delete word under cursor (keeps spaces)',
                answer: 'diw',
                hint: 'daw deletes surrounding space too',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Delete Word',
                    before: 'let ',
                    highlight: 'unused',
                    after: ' = 1;',
                    modeLabel: 'VISUAL'
                }
            },
            {
                id: 'nv-20',
                topic: 'Operators',
                prompt: 'Change inside quotes "..." / parens (...)',
                answer: 'ci"  /  ci(',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Change Inside',
                    before: 'title = "',
                    highlight: 'old text',
                    after: '"',
                    modeLabel: 'INSERT'
                }
            },
            {
                id: 'nv-21',
                topic: 'Operators',
                prompt: 'Change inside curly braces {...}',
                answer: 'ci{',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Change Block',
                    before: 'if (ok) {',
                    highlight: ' run(); ',
                    after: '}',
                    modeLabel: 'INSERT'
                }
            },
            {
                id: 'nv-22',
                topic: 'Operators',
                prompt: 'Paste after / before cursor',
                answer: 'p  /  P',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Paste Register',
                    before: 'let a = ',
                    highlight: 'yanked',
                    after: ';',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-23',
                topic: 'Operators',
                prompt: 'Undo / Redo',
                answer: 'u  /  Ctrl+r',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'undo-redo' }
            },
            {
                id: 'nv-24',
                topic: 'Operators',
                prompt: 'Repeat the last editing command',
                answer: '.',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'repeat-dot' }
            },
            {
                id: 'nv-25',
                topic: 'Operators',
                prompt: 'Toggle comment on current line / selection',
                answer: 'gcc  /  gc',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Comment Toggle',
                    before: '',
                    highlight: '// ',
                    after: 'runTask();',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-26',
                topic: 'Operators',
                prompt: 'Search word under cursor / clear highlights',
                answer: '*  /  Esc',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Word Search',
                    before: 'if (',
                    highlight: 'token',
                    after: ') send(token)',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'nv-27',
                topic: 'LazyVim',
                prompt: 'Show Which-Key shortcut menu',
                answer: '<Space>',
                hint: 'Wait ~300ms after pressing Space',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'which-key' }
            },
            {
                id: 'nv-28',
                topic: 'LazyVim',
                prompt: 'Fuzzy find files / Live grep across repo',
                answer: '<Space> ff  /  <Space> sg',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'fuzzy-files' }
            },
            {
                id: 'nv-29',
                topic: 'LazyVim',
                prompt: 'Toggle File Explorer sidebar',
                answer: '<Space> e',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'file-tree' }
            },
            {
                id: 'nv-30',
                topic: 'LazyVim',
                prompt: 'Next / Previous buffer tab / Close buffer',
                answer: 'Shift+l / Shift+h / <Space> bd',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'buffer-tabs' }
            },
            {
                id: 'nv-31',
                topic: 'LazyVim',
                prompt: 'Split vertically / horizontally & move splits',
                answer: '<Space> | / <Space> - / Ctrl+hjkl',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'split-v' }
            },
            {
                id: 'nv-32',
                topic: 'LazyVim',
                prompt: 'LSP: Go to Definition / References / Hover',
                answer: 'gd  /  gr  /  Shift+k',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'lsp-def' }
            },
            {
                id: 'nv-33',
                topic: 'LazyVim',
                prompt: 'LSP: Code Actions / Rename Symbol',
                answer: '<Space> ca  /  <Space> cr',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'lsp-actions' }
            },
            {
                id: 'nv-34',
                topic: 'LazyVim',
                prompt: 'Open LazyGit / Toggle floating terminal',
                answer: '<Space> gg  /  Ctrl+/',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'terminal-float' }
            }
        ]
    },
    {
        id: 'chromium-browser',
        category: 'hotkeys',
        categoryLabel: 'Hotkeys & Keybinds',
        title: 'Chromium (Chrome / Brave)',
        subtitle: 'Zero-mouse browsing, tab triage & DevTools shortcuts',
        cards: [
            {
                id: 'ch-1',
                topic: 'Tabs',
                prompt: 'Open new tab / Close current tab',
                answer: 'Ctrl+T  /  Ctrl+W',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tab-new-close' }
            },
            {
                id: 'ch-2',
                topic: 'Tabs',
                prompt: 'Reopen last closed tab',
                answer: 'Ctrl+Shift+T',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tab-reopen' }
            },
            {
                id: 'ch-3',
                topic: 'Tabs',
                prompt: 'Switch to next / previous tab',
                answer: 'Ctrl+Tab  /  Ctrl+Shift+Tab',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tab-cycle' }
            },
            {
                id: 'ch-4',
                topic: 'Tabs',
                prompt: 'Jump to tab 1–8 / Jump to rightmost tab',
                answer: 'Ctrl+1..8  /  Ctrl+9',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tab-jump' }
            },
            {
                id: 'ch-5',
                topic: 'Tabs',
                prompt: 'Search across all open & recent tabs',
                answer: 'Ctrl+Shift+A',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tab-search' }
            },
            {
                id: 'ch-6',
                topic: 'Tabs',
                prompt: 'Open link in new background tab',
                answer: 'Middle-Click  (or Ctrl+Click)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tab-bg-link' }
            },
            {
                id: 'ch-7',
                topic: 'Navigation',
                prompt: 'Focus & highlight the URL address bar',
                answer: 'Ctrl+L  (or Alt+D)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'url-bar' }
            },
            {
                id: 'ch-8',
                topic: 'Navigation',
                prompt: 'Go Back / Forward in tab history',
                answer: 'Alt+Left  /  Alt+Right',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'history-nav' }
            },
            {
                id: 'ch-9',
                topic: 'Navigation',
                prompt: 'Hard reload (bypass browser cache)',
                answer: 'Ctrl+Shift+R  (or Ctrl+F5)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'hard-reload' }
            },
            {
                id: 'ch-10',
                topic: 'Navigation',
                prompt: 'Scroll down / up one screen cleanly',
                answer: 'Space  /  Shift+Space',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'scroll-half' }
            },
            {
                id: 'ch-11',
                topic: 'Windows',
                prompt: 'Open Incognito / Private window',
                answer: 'Ctrl+Shift+N',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'incognito' }
            },
            {
                id: 'ch-12',
                topic: 'Windows',
                prompt: 'Toggle Bookmarks bar / History / Downloads',
                answer: 'Ctrl+Shift+B / Ctrl+H / Ctrl+J',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'bookmarks-bar' }
            },
            {
                id: 'ch-13',
                topic: 'DevTools',
                prompt: 'Open DevTools / Jump straight to Console',
                answer: 'F12 (Ctrl+Shift+I)  /  Ctrl+Shift+J',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'devtools-console' }
            },
            {
                id: 'ch-14',
                topic: 'DevTools',
                prompt: 'Activate Inspect Element picker directly',
                answer: 'Ctrl+Shift+C',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'devtools-inspect' }
            },
            {
                id: 'ch-15',
                topic: 'DevTools',
                prompt: 'Run DevTools Command Palette (screenshots, sensors)',
                answer: 'Ctrl+Shift+P  (inside DevTools)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'devtools-cmd' }
            },
            {
                id: 'ch-16',
                topic: 'Privacy',
                prompt: 'Open Clear Browsing Data dialog',
                answer: 'Ctrl+Shift+Delete',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'clear-data' }
            }
        ]
    },
    {
        id: 'zed-jetbrains',
        category: 'hotkeys',
        categoryLabel: 'Hotkeys & Keybinds',
        title: 'Zed (JetBrains Keymap)',
        subtitle: 'Fast navigation, refactoring & panel toggles in Zed',
        cards: [
            {
                id: 'zed-1',
                topic: 'Navigation',
                prompt: 'Open Command Palette (find any action)',
                answer: 'Ctrl+Shift+A',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'cmd-palette' }
            },
            {
                id: 'zed-2',
                topic: 'Navigation',
                prompt: 'Quick open file by name',
                answer: 'Ctrl+Shift+N',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'fuzzy-files' }
            },
            {
                id: 'zed-3',
                topic: 'Navigation',
                prompt: 'Project-wide text search',
                answer: 'Ctrl+Shift+F',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'live-grep' }
            },
            {
                id: 'zed-4',
                topic: 'Navigation',
                prompt: 'Go to Definition / Declaration',
                answer: 'Ctrl+B  (or F12)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'lsp-def' }
            },
            {
                id: 'zed-5',
                topic: 'Panels',
                prompt: 'Toggle Left Project Explorer / Bottom Terminal',
                answer: 'Alt+1  /  Alt+F12 (Ctrl+`)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'file-tree' }
            },
            {
                id: 'zed-6',
                topic: 'Editing',
                prompt: 'Rename symbol cleanly across project',
                answer: 'Shift+F6',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'lsp-actions' }
            },
            {
                id: 'zed-7',
                topic: 'Editing',
                prompt: 'Add multi-cursor on next matching word',
                answer: 'Alt+J',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'mode-visual-block' }
            },
            {
                id: 'zed-8',
                topic: 'Editing',
                prompt: 'Toggle line comment / Format document',
                answer: 'Ctrl+/  /  Ctrl+Alt+L',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Comment & Format',
                    before: '',
                    highlight: '// ',
                    after: 'formatCode();',
                    modeLabel: 'NORMAL'
                }
            },
            {
                id: 'zed-9',
                topic: 'Config',
                prompt: 'Open Zed settings.json directly',
                answer: 'Ctrl+Alt+S',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'settings.json',
                    before: '  "tab_size": ',
                    highlight: '4',
                    after: ',',
                    modeLabel: 'NORMAL'
                }
            }
        ]
    },
    {
        id: 'windows-power',
        category: 'hotkeys',
        categoryLabel: 'Hotkeys & Keybinds',
        title: 'Windows 10 / 11 Power User',
        subtitle: 'System menus, tiling, task killers & hidden admin shortcuts',
        cards: [
            {
                id: 'win-1',
                topic: 'System',
                prompt: 'Open Power User menu (Device Mgr, Terminal, Disk Mgmt)',
                answer: 'Win+X',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'win-x' }
            },
            {
                id: 'win-2',
                topic: 'System',
                prompt: 'Open Task Manager directly (skip Ctrl+Alt+Del)',
                answer: 'Ctrl+Shift+Esc',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'task-mgr' }
            },
            {
                id: 'win-3',
                topic: 'System',
                prompt: 'Run elevated Admin app from Win+R Run dialog',
                answer: 'Ctrl+Shift+Enter  (inside Win+R)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'run-admin' }
            },
            {
                id: 'win-4',
                topic: 'System',
                prompt: 'Restart Graphics Driver instantly if screen freezes',
                answer: 'Win+Ctrl+Shift+B',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'gpu-reset' }
            },
            {
                id: 'win-5',
                topic: 'Productivity',
                prompt: 'Open Clipboard History (multiple copied items)',
                answer: 'Win+V',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'clip-history' }
            },
            {
                id: 'win-6',
                topic: 'Productivity',
                prompt: 'Region Screenshot directly to clipboard',
                answer: 'Win+Shift+S',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'snip-tool' }
            },
            {
                id: 'win-7',
                topic: 'Windows',
                prompt: 'Snap window to left/right/quarter & minimize all',
                answer: 'Win+Arrows  /  Win+D',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'win-snap' }
            },
            {
                id: 'win-8',
                topic: 'Windows',
                prompt: 'Create / Switch / Close Virtual Desktops',
                answer: 'Win+Ctrl+D / Win+Ctrl+Arrows / Win+Ctrl+F4',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'win-desktops' }
            },
            {
                id: 'win-9',
                topic: 'Explorer',
                prompt: 'Open File Explorer / Rename file / Address bar',
                answer: 'Win+E  /  F2  /  Alt+D (Ctrl+L)',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'explorer' }
            }
        ]
    },
    {
        id: 'terminal-tmux',
        category: 'hotkeys',
        categoryLabel: 'Hotkeys & Keybinds',
        title: 'Terminal, Bash & Tmux',
        subtitle: 'Readline cursor movement, job control & tmux panes',
        cards: [
            {
                id: 'sh-1',
                topic: 'Readline',
                prompt: 'Jump cursor to start / end of terminal line',
                answer: 'Ctrl+A  /  Ctrl+E',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Cursor Jump',
                    before: '$ ',
                    highlight: 'git status',
                    after: '',
                    modeLabel: 'TERM'
                }
            },
            {
                id: 'sh-2',
                topic: 'Readline',
                prompt: 'Delete from cursor to start / end of line',
                answer: 'Ctrl+U  /  Ctrl+K',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Kill Line',
                    before: '$ ',
                    highlight: 'npm run build',
                    after: '',
                    modeLabel: 'TERM'
                }
            },
            {
                id: 'sh-3',
                topic: 'Readline',
                prompt: 'Delete previous word before cursor',
                answer: 'Ctrl+W',
                isHotkey: true,
                visual: {
                    type: 'cursor-line',
                    promptTag: 'Kill Word',
                    before: '$ cd ',
                    highlight: 'projects/',
                    after: '',
                    modeLabel: 'TERM'
                }
            },
            {
                id: 'sh-4',
                topic: 'Readline',
                prompt: 'Reverse fuzzy search command history',
                answer: 'Ctrl+R',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'term-search' }
            },
            {
                id: 'sh-5',
                topic: 'Readline',
                prompt: 'Clear terminal screen without losing command',
                answer: 'Ctrl+L',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'term-clear' }
            },
            {
                id: 'sh-6',
                topic: 'Process',
                prompt: 'Kill foreground process / Send EOF (exit shell)',
                answer: 'Ctrl+C  /  Ctrl+D',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'term-kill' }
            },
            {
                id: 'sh-7',
                topic: 'Tmux',
                prompt: 'Split pane vertically (side-by-side) / horizontally',
                answer: 'Prefix %  /  Prefix "',
                hint: 'Default Prefix is Ctrl+B',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tmux-split' }
            },
            {
                id: 'sh-8',
                topic: 'Tmux',
                prompt: 'Detach current tmux session (keeps running)',
                answer: 'Prefix d',
                isHotkey: true,
                visual: { type: 'ui-scene', scene: 'tmux-detach' }
            }
        ]
    },

    // =========================================================================
    // CATEGORY: LANGUAGES & WEB
    // =========================================================================
    {
        id: 'typescript-js',
        category: 'languages',
        categoryLabel: 'Languages & Web',
        title: 'TypeScript & Web Platform',
        subtitle: 'Type narrowing, utility types, event loop & browser APIs',
        cards: [
            {
                id: 'ts-1',
                topic: 'Types',
                prompt: 'Difference between `unknown` and `any` in TypeScript',
                answer: '`unknown` forces type narrowing before use (type-safe); `any` disables type checking completely.',
                visual: { type: 'diagram', diagram: 'ts-unknown-any' }
            },
            {
                id: 'ts-2',
                topic: 'Utility Types',
                prompt: 'What do `Pick<T, K>` and `Omit<T, K>` create?',
                answer: '`Pick` keeps only keys K from T; `Omit` removes keys K from T.',
                visual: { type: 'diagram', diagram: 'ts-pick-omit' }
            },
            {
                id: 'ts-3',
                topic: 'Utility Types',
                prompt: 'What does `Record<K, V>` represent?',
                answer: 'An object map whose keys are type K and values are type V.',
                visual: { type: 'diagram', diagram: 'ts-record' }
            },
            {
                id: 'ts-4',
                topic: 'Runtime',
                prompt: 'Execution order: Sync code vs Microtasks (Promises) vs Macrotasks (setTimeout)',
                answer: '1. Sync call stack ➔ 2. ALL Microtasks (`Promise.then`, `queueMicrotask`) ➔ 3. Next Macrotask (`setTimeout`, UI paint).',
                visual: { type: 'diagram', diagram: 'event-loop' }
            },
            {
                id: 'ts-5',
                topic: 'CSS',
                prompt: 'Why use CSS Cascade Layers (`@layer reset, base, layout, components, utilities;`)?',
                answer: 'Explicitly controls specificity order globally so later layers always override earlier ones cleanly without `!important`.',
                visual: { type: 'diagram', diagram: 'css-layers' }
            }
        ]
    },
    {
        id: 'python-rust',
        category: 'languages',
        categoryLabel: 'Languages & Web',
        title: 'Python & Rust Essentials',
        subtitle: 'Ownership, borrowing, GIL, generators & uv tooling',
        cards: [
            {
                id: 'pr-1',
                topic: 'Rust',
                prompt: 'What are Rust’s 3 core Ownership rules?',
                answer: '1. Every value has one owner. 2. Only one owner at a time. 3. Value is dropped when owner leaves scope.',
                visual: { type: 'diagram', diagram: 'rust-own' }
            },
            {
                id: 'pr-2',
                topic: 'Rust',
                prompt: 'Borrowing rule: How many mutable vs immutable references can exist at once?',
                answer: 'Either ANY number of immutable `&T` references OR ONE mutable `&mut T` reference — never both at once.',
                visual: { type: 'diagram', diagram: 'rust-borrow' }
            },
            {
                id: 'pr-3',
                topic: 'Python',
                prompt: 'Difference between a List `[x for x in ...]` and a Generator `(x for x in ...)`',
                answer: 'List allocates all items in RAM immediately; Generator yields one item lazily on demand (`O(1)` memory).',
                visual: { type: 'diagram', diagram: 'py-gen' }
            },
            {
                id: 'pr-4',
                topic: 'Python',
                prompt: 'Why use `multiprocessing` vs `threading` for CPU-heavy work in standard CPython?',
                answer: 'CPython’s GIL allows only one thread to execute Python bytecode at a time; `multiprocessing` uses separate OS processes/cores.',
                visual: { type: 'diagram', diagram: 'py-gil' }
            }
        ]
    },

    // =========================================================================
    // CATEGORY: CS FUNDAMENTALS
    // =========================================================================
    {
        id: 'cs-algo-ds',
        category: 'cs',
        categoryLabel: 'CS Fundamentals',
        title: 'Data Structures & Big-O',
        subtitle: 'Time/space complexity, hash tables, trees & sorting',
        cards: [
            {
                id: 'cs-1',
                topic: 'Complexity',
                prompt: 'Hash Map lookup: Average vs Worst-case time complexity',
                answer: 'Average: O(1) · Worst-case (hash collisions): O(n)',
                visual: { type: 'diagram', diagram: 'big-o-hash' }
            },
            {
                id: 'cs-2',
                topic: 'Complexity',
                prompt: 'Binary Search time complexity (and prerequisite)',
                answer: 'O(log n) — requires the array/list to be sorted.',
                visual: { type: 'diagram', diagram: 'big-o-binary' }
            },
            {
                id: 'cs-3',
                topic: 'Complexity',
                prompt: 'Merge Sort vs Quick Sort worst-case time & space',
                answer: 'Merge Sort: O(n log n) time, O(n) space · Quick Sort: O(n²) worst time (O(n log n) avg), O(log n) stack space.',
                visual: { type: 'diagram', diagram: 'big-o-sort' }
            },
            {
                id: 'cs-4',
                topic: 'Structures',
                prompt: 'Stack vs Queue ordering',
                answer: 'Stack = LIFO (Last-In, First-Out) · Queue = FIFO (First-In, First-Out).',
                visual: { type: 'diagram', diagram: 'stack-queue' }
            },
            {
                id: 'cs-5',
                topic: 'Graphs',
                prompt: 'BFS vs DFS: Which finds shortest path in an unweighted graph & what structure does each use?',
                answer: 'BFS finds shortest path using a Queue; DFS explores depth-first using a Stack / recursion.',
                visual: { type: 'diagram', diagram: 'bfs-dfs' }
            }
        ]
    },
    {
        id: 'cs-os-arch',
        category: 'cs',
        categoryLabel: 'CS Fundamentals',
        title: 'OS, Memory & Concurrency',
        subtitle: 'Process vs thread, CPU caches, paging & mutexes',
        cards: [
            {
                id: 'os-1',
                topic: 'Memory',
                prompt: 'Stack vs Heap memory allocation',
                answer: 'Stack: fast LIFO fixed/local frames per thread. Heap: dynamic long-lived allocations managed via allocator/GC.',
                visual: { type: 'diagram', diagram: 'stack-heap' }
            },
            {
                id: 'os-2',
                topic: 'Processes',
                prompt: 'Process vs Thread: What do threads share?',
                answer: 'Threads in the same process share virtual memory/heap/file descriptors, while each thread has its own stack & registers.',
                visual: { type: 'diagram', diagram: 'process-thread' }
            },
            {
                id: 'os-3',
                topic: 'Hardware',
                prompt: 'Why is sequential array iteration much faster than linked list traversal?',
                answer: 'CPU L1/L2 cache spatial locality & hardware prefetching — arrays are contiguous in RAM; linked lists pointer-chase.',
                visual: { type: 'diagram', diagram: 'cache-locality' }
            },
            {
                id: 'os-4',
                topic: 'Concurrency',
                prompt: 'What 4 conditions must hold simultaneously for a Deadlock?',
                answer: '1. Mutual exclusion, 2. Hold and wait, 3. No preemption, 4. Circular wait.',
                visual: { type: 'diagram', diagram: 'deadlock' }
            }
        ]
    },

    // =========================================================================
    // CATEGORY: SECURITY & NETWORKING
    // =========================================================================
    {
        id: 'sec-web',
        category: 'security',
        categoryLabel: 'Security & Networking',
        title: 'Web Security, CSP & Crypto',
        subtitle: 'XSS, CSRF, CSP directives, hashing vs encryption',
        cards: [
            {
                id: 'sec-1',
                topic: 'Web',
                prompt: "What does `Content-Security-Policy: object-src 'none'; base-uri 'self';` prevent?",
                answer: 'Blocks plugin execution (`<object>/<embed>`) and `<base>` tag injection hijacking relative script URLs.',
                visual: { type: 'diagram', diagram: 'csp-block' }
            },
            {
                id: 'sec-2',
                topic: 'Web',
                prompt: 'XSS vs CSRF: Core difference',
                answer: 'XSS injects malicious JS into a trusted site; CSRF tricks an authenticated browser into sending an unwanted forged request.',
                visual: { type: 'diagram', diagram: 'xss-csrf' }
            },
            {
                id: 'sec-3',
                topic: 'Crypto',
                prompt: 'Hashing vs Encryption vs Encoding',
                answer: 'Hashing: one-way integrity digest (SHA-256). Encryption: reversible with key (AES). Encoding: format translation, zero secrecy (Base64).',
                visual: { type: 'diagram', diagram: 'crypto-triad' }
            },
            {
                id: 'sec-4',
                topic: 'Headers',
                prompt: 'What does `X-Content-Type-Options: nosniff` stop?',
                answer: 'Prevents browsers from MIME-sniffing a text/image upload as executable `text/html` or `application/javascript`.',
                visual: { type: 'diagram', diagram: 'nosniff' }
            }
        ]
    },
    {
        id: 'sec-net',
        category: 'security',
        categoryLabel: 'Security & Networking',
        title: 'TCP/IP, DNS & Common Ports',
        subtitle: 'Handshake, TCP vs UDP, HTTP codes & standard ports',
        cards: [
            {
                id: 'net-1',
                topic: 'Protocols',
                prompt: 'The TCP 3-way handshake steps',
                answer: '1. SYN (Client -> Server) ➔ 2. SYN-ACK (Server -> Client) ➔ 3. ACK (Client -> Server)',
                visual: { type: 'diagram', diagram: 'tcp-handshake' }
            },
            {
                id: 'net-2',
                topic: 'Protocols',
                prompt: 'TCP vs UDP: When is UDP used?',
                answer: 'UDP skips connection state & retransmission for low jitter — ideal for DNS (53), WebRTC/VoIP, QUIC/HTTP3, and real-time games.',
                visual: { type: 'diagram', diagram: 'tcp-udp' }
            },
            {
                id: 'net-3',
                topic: 'Ports',
                prompt: 'Default ports for SSH, DNS, HTTP, HTTPS, PostgreSQL',
                answer: 'SSH: 22 · DNS: 53 · HTTP: 80 · HTTPS: 443 · PostgreSQL: 5432',
                visual: { type: 'diagram', diagram: 'ports' }
            },
            {
                id: 'net-4',
                topic: 'HTTP',
                prompt: 'Difference between HTTP 401 and HTTP 403',
                answer: '401 Unauthorized = unauthenticated (missing/invalid login). 403 Forbidden = authenticated, but lacks permission.',
                visual: { type: 'diagram', diagram: 'http-401-403' }
            }
        ]
    },

    // =========================================================================
    // CATEGORY: DEVOPS & GIT
    // =========================================================================
    {
        id: 'devops-git',
        category: 'devops',
        categoryLabel: 'DevOps & Git',
        title: 'Git Workflows & Recovery',
        subtitle: 'Rebase, cherry-pick, reflog & safe history tools',
        cards: [
            {
                id: 'git-1',
                topic: 'Git',
                prompt: 'Undo last commit while keeping changes staged',
                answer: 'git reset --soft HEAD~1',
                isHotkey: true,
                visual: { type: 'diagram', diagram: 'git-soft-reset' }
            },
            {
                id: 'git-2',
                topic: 'Git',
                prompt: 'Find lost commits after a bad reset or rebase',
                answer: 'git reflog',
                isHotkey: true,
                visual: { type: 'diagram', diagram: 'git-reflog' }
            },
            {
                id: 'git-3',
                topic: 'Git',
                prompt: 'Safely undo a pushed commit without rewriting public history',
                answer: 'git revert <commit-hash>',
                isHotkey: true,
                visual: { type: 'diagram', diagram: 'git-revert' }
            },
            {
                id: 'git-4',
                topic: 'Git',
                prompt: 'Copy a single specific commit from another branch onto yours',
                answer: 'git cherry-pick <hash>',
                isHotkey: true,
                visual: { type: 'diagram', diagram: 'git-cherry' }
            },
            {
                id: 'git-5',
                topic: 'Git',
                prompt: '`git merge` vs `git rebase`',
                answer: 'Merge preserves branch topology with a merge commit; Rebase replays your commits linearly on top of the target branch.',
                visual: { type: 'diagram', diagram: 'git-rebase' }
            }
        ]
    },
    {
        id: 'devops-containers',
        category: 'devops',
        categoryLabel: 'DevOps & Git',
        title: 'Docker & WSLC Containers',
        subtitle: 'OCI builds, multi-stage images & daemonless WSLC',
        cards: [
            {
                id: 'ctr-1',
                topic: 'WSLC',
                prompt: 'Build & run a container natively in Windows without Docker Desktop',
                answer: 'wslc build -t app:dev .  &  wslc run -d --rm -p 8080:80 app:dev',
                isHotkey: true,
                visual: { type: 'diagram', diagram: 'wslc-run' }
            },
            {
                id: 'ctr-2',
                topic: 'WSLC',
                prompt: 'WSLC bind mount path & memory flag quirks vs Docker',
                answer: 'Use forward slashes (`-v C:/src:/app`) and uppercase size units (`-m 512M`).',
                visual: { type: 'diagram', diagram: 'wslc-mount' }
            },
            {
                id: 'ctr-3',
                topic: 'Images',
                prompt: 'Why use multi-stage `Dockerfile` builds (`AS builder`)?',
                answer: 'Compiles binaries/bundles in a large SDK stage, then copies only artifacts into a tiny runtime stage (cuts image size by 80%+).',
                visual: { type: 'diagram', diagram: 'multistage' }
            },
            {
                id: 'ctr-4',
                topic: 'Runtime',
                prompt: 'Difference between `CMD` and `ENTRYPOINT` in a Dockerfile',
                answer: '`ENTRYPOINT` sets the fixed executable; `CMD` provides default arguments (easily overridden via CLI args).',
                visual: { type: 'diagram', diagram: 'cmd-entry' }
            }
        ]
    }
];
