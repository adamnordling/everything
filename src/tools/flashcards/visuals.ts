import type { VisualKind } from './types';

function esc(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapSvg(inner: string, label: string): string {
    return `
        <svg class="fc-visual-svg" viewBox="0 0 320 92" role="img" aria-label="${esc(label)}">
            <rect x="1" y="1" width="318" height="90" rx="8" fill="var(--bg-elevated)" stroke="var(--border-bold)" stroke-width="1"/>
            ${inner}
        </svg>
    `;
}

function renderCursorLine(v: Extract<VisualKind, { type: 'cursor-line' }>): string {
    const mode = v.modeLabel ?? 'NORMAL';
    const modeColor =
        mode === 'INSERT' ? 'var(--accent-mint)' : mode === 'VISUAL' ? 'var(--accent-amber)' : 'var(--accent-brand)';

    const beforeLen = v.before.length;
    const hlLen = v.highlight?.length ?? 0;

    // Monospace char width ~7.8px at font-size 13
    const startX = 16;
    const charW = 7.8;
    const hlX = startX + beforeLen * charW;
    const hlW = Math.max(8, hlLen * charW);
    const afterX = hlX + (v.highlight ? hlLen * charW : 0);

    const cursorX = v.cursorAt === 'start' ? startX : v.cursorAt === 'end' ? afterX + v.after.length * charW : hlX;

    return wrapSvg(
        `
        <rect x="10" y="9" width="64" height="18" rx="4" fill="${modeColor}" opacity="0.18"/>
        <text x="42" y="21.5" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="800" fill="${modeColor}">${esc(mode)}</text>
        <text x="84" y="21.5" font-family="ui-monospace, monospace" font-size="10" fill="var(--text-muted)">${esc(v.promptTag)}</text>
        <line x1="10" y1="33" x2="310" y2="33" stroke="var(--border-subtle)" stroke-width="1"/>
        <rect x="10" y="42" width="300" height="36" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
        ${
            v.highlight
                ? `<rect class="fc-svg-pulse-box" x="${hlX - 1}" y="49" width="${hlW + 2}" height="22" rx="3" fill="${modeColor}" opacity="0.22" stroke="${modeColor}" stroke-width="1"/>`
                : ''
        }
        <text x="${startX}" y="64" font-family="ui-monospace, monospace" font-size="13" fill="var(--text-secondary)">${esc(v.before)}</text>
        ${
            v.highlight
                ? `<text x="${hlX}" y="64" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="var(--text-primary)">${esc(v.highlight)}</text>`
                : ''
        }
        <text x="${afterX}" y="64" font-family="ui-monospace, monospace" font-size="13" fill="var(--text-secondary)">${esc(v.after)}</text>
        <rect class="fc-svg-cursor" x="${cursorX}" y="49" width="2.5" height="22" rx="1" fill="${modeColor}"/>
    `,
        v.promptTag
    );
}

function renderUiScene(scene: Extract<VisualKind, { type: 'ui-scene' }>['scene']): string {
    switch (scene) {
        case 'tab-new-close':
        case 'tab-reopen':
        case 'tab-cycle':
        case 'tab-jump':
        case 'tab-search':
        case 'tab-bg-link': {
            const activeTabX = scene === 'tab-jump' ? 216 : scene === 'tab-cycle' ? 148 : 80;
            const label =
                scene === 'tab-reopen'
                    ? 'Closed tab pops back'
                    : scene === 'tab-search'
                      ? 'Search open tabs'
                      : scene === 'tab-bg-link'
                        ? 'Link opens in background tab'
                        : scene === 'tab-jump'
                          ? 'Tab 1..8 / Last Tab (9)'
                          : scene === 'tab-cycle'
                            ? 'Step Prev <-> Next Tab'
                            : 'Create / Close Tab';
            return wrapSvg(
                `
                <rect x="12" y="12" width="296" height="68" rx="6" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <rect x="18" y="18" width="56" height="18" rx="4" fill="var(--bg-elevated)"/>
                <rect x="80" y="18" width="62" height="18" rx="4" fill="${activeTabX === 80 ? 'var(--accent-brand-subtle)' : 'var(--bg-elevated)'}" stroke="${activeTabX === 80 ? 'var(--accent-brand)' : 'none'}"/>
                <rect x="148" y="18" width="62" height="18" rx="4" fill="${activeTabX === 148 ? 'var(--accent-brand-subtle)' : 'var(--bg-elevated)'}" stroke="${activeTabX === 148 ? 'var(--accent-brand)' : 'none'}"/>
                <rect class="fc-svg-pulse-box" x="216" y="18" width="62" height="18" rx="4" fill="${activeTabX === 216 ? 'var(--accent-brand-subtle)' : 'var(--bg-elevated)'}" stroke="${scene === 'tab-reopen' || activeTabX === 216 ? 'var(--accent-mint)' : 'var(--border-subtle)'}" stroke-dasharray="${scene === 'tab-reopen' ? '3 2' : 'none'}"/>
                <text x="288" y="31" font-family="ui-monospace, monospace" font-size="12" font-weight="800" fill="var(--accent-brand)">+</text>
                <line x1="12" y1="40" x2="308" y2="40" stroke="var(--border-subtle)"/>
                <text x="160" y="63" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="700" fill="var(--text-secondary)">${esc(label)}</text>
            `,
                label
            );
        }

        case 'url-bar':
        case 'history-nav':
        case 'hard-reload':
        case 'incognito':
        case 'bookmarks-bar':
        case 'clear-data': {
            const accent =
                scene === 'incognito'
                    ? 'var(--accent-violet)'
                    : scene === 'clear-data'
                      ? 'var(--accent-rose)'
                      : 'var(--accent-brand)';
            const msg =
                scene === 'url-bar'
                    ? 'https://everything.adamnordling.se'
                    : scene === 'history-nav'
                      ? '< Back   |   Forward >'
                      : scene === 'hard-reload'
                        ? 'Bypass Cache -> Fresh Fetch'
                        : scene === 'incognito'
                          ? 'Private / Incognito Session'
                          : scene === 'bookmarks-bar'
                            ? '[*] Bookmarks Bar Toggle'
                            : 'Purge Cache, Cookies & History';
            return wrapSvg(
                `
                <rect x="14" y="14" width="292" height="28" rx="6" fill="var(--bg-surface)" stroke="${accent}"/>
                <text x="24" y="32" font-family="ui-monospace, monospace" font-size="11" font-weight="700" fill="${accent}">${esc(msg)}</text>
                <rect class="fc-svg-pulse-box" x="14" y="50" width="292" height="28" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <text x="160" y="68" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" fill="var(--text-muted)">Browser Toolbar &amp; State Action</text>
            `,
                msg
            );
        }

        case 'devtools-console':
        case 'devtools-inspect':
        case 'devtools-cmd': {
            const title =
                scene === 'devtools-inspect'
                    ? 'Pick Element on Page'
                    : scene === 'devtools-cmd'
                      ? '> Run DevTools Command...'
                      : '> console.log("ready")';
            return wrapSvg(
                `
                <rect x="14" y="12" width="166" height="68" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <rect class="fc-svg-pulse-box" x="26" y="24" width="76" height="26" rx="4" fill="var(--accent-sky)" opacity="0.22" stroke="var(--accent-sky)"/>
                <rect x="186" y="12" width="120" height="68" rx="5" fill="var(--bg-surface)" stroke="var(--accent-brand)"/>
                <text x="194" y="27" font-family="ui-monospace, monospace" font-size="9" font-weight="800" fill="var(--accent-brand)">DEVTOOLS</text>
                <line x1="186" y1="33" x2="306" y2="33" stroke="var(--border-subtle)"/>
                <text x="194" y="50" font-family="ui-monospace, monospace" font-size="8.5" fill="var(--text-primary)">${esc(title)}</text>
            `,
                'DevTools panel'
            );
        }

        case 'split-v':
        case 'split-h':
        case 'tmux-split':
        case 'win-snap': {
            const isVertical = scene === 'split-v' || scene === 'tmux-split' || scene === 'win-snap';
            return wrapSvg(
                isVertical
                    ? `
                    <rect x="18" y="12" width="136" height="68" rx="5" fill="var(--bg-surface)" stroke="var(--border-bold)"/>
                    <rect class="fc-svg-pulse-box" x="166" y="12" width="136" height="68" rx="5" fill="var(--accent-brand-subtle)" stroke="var(--accent-brand)"/>
                    <text x="86" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" fill="var(--text-muted)">Pane A</text>
                    <text x="234" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="700" fill="var(--accent-brand)">Pane B</text>
                `
                    : `
                    <rect x="18" y="10" width="284" height="32" rx="5" fill="var(--bg-surface)" stroke="var(--border-bold)"/>
                    <rect class="fc-svg-pulse-box" x="18" y="48" width="284" height="32" rx="5" fill="var(--accent-brand-subtle)" stroke="var(--accent-brand)"/>
                    <text x="160" y="30" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" fill="var(--text-muted)">Top Pane</text>
                    <text x="160" y="68" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" font-weight="700" fill="var(--accent-brand)">Bottom Split</text>
                `,
                'Split window panes'
            );
        }

        case 'win-desktops': {
            return wrapSvg(
                `
                <rect x="18" y="18" width="84" height="54" rx="5" fill="var(--bg-surface)" stroke="var(--border-bold)"/>
                <text x="60" y="49" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="var(--text-muted)">Desktop 1</text>
                <rect class="fc-svg-pulse-box" x="118" y="18" width="84" height="54" rx="5" fill="var(--accent-brand-subtle)" stroke="var(--accent-brand)"/>
                <text x="160" y="49" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="var(--accent-brand)">Desktop 2</text>
                <rect x="218" y="18" width="84" height="54" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)" stroke-dasharray="4 3"/>
                <text x="260" y="49" text-anchor="middle" font-family="ui-monospace, monospace" font-size="12" fill="var(--accent-mint)">+ New</text>
            `,
                'Virtual desktops'
            );
        }

        case 'mode-visual-block': {
            return wrapSvg(
                `
                <rect x="22" y="12" width="276" height="68" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <rect class="fc-svg-pulse-box" x="72" y="19" width="46" height="54" rx="3" fill="var(--accent-amber)" opacity="0.24" stroke="var(--accent-amber)"/>
                <text x="34" y="32" font-family="ui-monospace, monospace" font-size="11" fill="var(--text-primary)">let  alpha = 1;</text>
                <text x="34" y="49" font-family="ui-monospace, monospace" font-size="11" fill="var(--text-primary)">let  bravo = 2;</text>
                <text x="34" y="66" font-family="ui-monospace, monospace" font-size="11" fill="var(--text-primary)">let  delta = 3;</text>
            `,
                'Visual block column selection'
            );
        }

        case 'file-top':
        case 'file-bottom':
        case 'scroll-half':
        case 'center-zz': {
            const barY = scene === 'file-top' ? 16 : scene === 'file-bottom' ? 56 : 36;
            const label =
                scene === 'file-top'
                    ? 'Jump to Line 1'
                    : scene === 'file-bottom'
                      ? 'Jump to Last Line'
                      : scene === 'center-zz'
                        ? 'Center View on Cursor'
                        : 'Half-Page Scroll';
            return wrapSvg(
                `
                <rect x="20" y="12" width="248" height="68" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <rect x="282" y="12" width="16" height="68" rx="4" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <rect class="fc-svg-pulse-box" x="284" y="${barY}" width="12" height="20" rx="3" fill="var(--accent-brand)"/>
                <line x1="34" y1="26" x2="210" y2="26" stroke="var(--border-bold)" stroke-width="2"/>
                <line x1="34" y1="44" x2="245" y2="44" stroke="var(--accent-brand)" stroke-width="2.5"/>
                <line x1="34" y1="62" x2="180" y2="62" stroke="var(--border-bold)" stroke-width="2"/>
                <text x="144" y="75" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="var(--text-muted)">${esc(label)}</text>
            `,
                label
            );
        }

        default: {
            const labelMap: Record<string, string> = {
                'mode-esc': 'INSERT / VISUAL  --->  NORMAL',
                'file-save': 'Write Buffer  |  Save & Exit  |  Force Quit',
                'undo-redo': 'State v2  <---  Undo / Redo  --->  State v3',
                'repeat-dot': 'Edit once  ->  Replay exact edit again',
                'which-key': 'Leader Menu: [f] Files  [s] Search  [g] Git',
                'fuzzy-files': 'Find File:  sr/t/fc  ->  flashcards/index.ts',
                'live-grep': 'Grep Repo:  "export function"  ->  14 matches',
                'file-tree': '[+] src/  |  [-] public/  |  main.ts',
                'buffer-tabs': '[ index.ts ]  [ types.ts ]  [ visuals.ts ]',
                'lsp-def': 'callSite()  --->  function callSite() { ... }',
                'lsp-actions': 'Quick Fix: Import missing symbol / Rename',
                'terminal-float': '[ Floating Shell Overlay ]',
                'cmd-palette': '> Type any editor command...',
                'win-x': 'Power Menu: Terminal | Device Mgr | Disk Mgmt',
                'task-mgr': 'CPU / RAM / Processes (Instant Launch)',
                'run-admin': 'Win+R -> Launch Elevated Administrator',
                'gpu-reset': 'Beep -> Display Stack Re-Initialized',
                'clip-history': 'Clip #1 | Clip #2 | Clip #3 (History)',
                'snip-tool': 'Crosshair Capture -> Clipboard Image',
                explorer: 'Quick Launch File Explorer / Rename / URL',
                'term-search': '(reverse-i-search): git push origin main',
                'term-clear': 'Clean Terminal Screen (Keep Prompt)',
                'term-kill': 'SIGINT (Kill Task) / EOF (Exit)',
                'tmux-detach': 'Session [dev] detached (still alive)'
            };
            const msg = labelMap[scene] ?? scene;
            return wrapSvg(
                `
                <rect class="fc-svg-pulse-box" x="16" y="20" width="288" height="52" rx="6" fill="var(--bg-surface)" stroke="var(--accent-brand)"/>
                <text x="160" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" font-weight="700" fill="var(--text-primary)">${esc(msg)}</text>
            `,
                msg
            );
        }
    }
}

function renderDiagram(diagram: Extract<VisualKind, { type: 'diagram' }>['diagram']): string {
    switch (diagram) {
        case 'big-o-hash':
        case 'big-o-binary':
        case 'big-o-sort': {
            return wrapSvg(
                `
                <line x1="28" y1="76" x2="170" y2="76" stroke="var(--border-bold)" stroke-width="1.5"/>
                <line x1="28" y1="14" x2="28" y2="76" stroke="var(--border-bold)" stroke-width="1.5"/>
                <path d="M 30 74 Q 70 68 165 18" fill="none" stroke="var(--accent-rose)" stroke-width="1.5" stroke-dasharray="3 2"/>
                <path d="M 30 72 Q 90 54 165 46" fill="none" stroke="var(--accent-sky)" stroke-width="2"/>
                <line x1="30" y1="68" x2="165" y2="68" stroke="var(--accent-mint)" stroke-width="2"/>
                <text x="184" y="28" font-family="ui-monospace, monospace" font-size="10" fill="var(--accent-mint)">O(1) Constant</text>
                <text x="184" y="48" font-family="ui-monospace, monospace" font-size="10" fill="var(--accent-sky)">O(log n) / O(n log n)</text>
                <text x="184" y="68" font-family="ui-monospace, monospace" font-size="10" fill="var(--accent-rose)">O(n) / O(n²) Worst</text>
            `,
                'Big-O complexity curves'
            );
        }

        case 'stack-queue': {
            return wrapSvg(
                `
                <rect x="20" y="16" width="120" height="60" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <text x="80" y="30" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="800" fill="var(--accent-brand)">STACK (LIFO)</text>
                <rect x="44" y="37" width="72" height="14" rx="3" fill="var(--accent-brand-subtle)" stroke="var(--accent-brand)"/>
                <rect x="44" y="55" width="72" height="14" rx="3" fill="var(--bg-elevated)" stroke="var(--border-bold)"/>
                <rect x="180" y="16" width="120" height="60" rx="5" fill="var(--bg-surface)" stroke="var(--border-subtle)"/>
                <text x="240" y="30" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="800" fill="var(--accent-mint)">QUEUE (FIFO)</text>
                <rect x="192" y="44" width="26" height="20" rx="3" fill="var(--bg-elevated)" stroke="var(--border-bold)"/>
                <rect x="224" y="44" width="26" height="20" rx="3" fill="var(--bg-elevated)" stroke="var(--border-bold)"/>
                <rect x="256" y="44" width="26" height="20" rx="3" fill="rgba(16,185,129,0.2)" stroke="var(--accent-mint)"/>
            `,
                'Stack LIFO vs Queue FIFO'
            );
        }

        case 'tcp-handshake': {
            return wrapSvg(
                `
                <rect x="18" y="16" width="64" height="60" rx="5" fill="var(--bg-surface)" stroke="var(--border-bold)"/>
                <text x="50" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="800" fill="var(--text-primary)">Client</text>
                <rect x="238" y="16" width="64" height="60" rx="5" fill="var(--bg-surface)" stroke="var(--border-bold)"/>
                <text x="270" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="800" fill="var(--text-primary)">Server</text>
                <line x1="86" y1="26" x2="232" y2="26" stroke="var(--accent-brand)" stroke-width="2"/>
                <text x="160" y="22" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="700" fill="var(--accent-brand)">1. SYN ➔</text>
                <line x1="86" y1="48" x2="232" y2="48" stroke="var(--accent-sky)" stroke-width="2"/>
                <text x="160" y="44" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="700" fill="var(--accent-sky)">← 2. SYN-ACK</text>
                <line x1="86" y1="70" x2="232" y2="70" stroke="var(--accent-mint)" stroke-width="2"/>
                <text x="160" y="66" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="700" fill="var(--accent-mint)">3. ACK ➔</text>
            `,
                'TCP 3-way handshake'
            );
        }

        case 'multistage': {
            return wrapSvg(
                `
                <rect x="16" y="16" width="118" height="60" rx="6" fill="var(--bg-surface)" stroke="var(--accent-amber)"/>
                <text x="75" y="40" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="var(--accent-amber)">Stage 1: Builder</text>
                <text x="75" y="58" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="var(--text-muted)">SDK + Source (~900MB)</text>
                <text x="160" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="14" font-weight="800" fill="var(--accent-mint)">➔</text>
                <rect x="186" y="24" width="118" height="44" rx="6" fill="rgba(16,185,129,0.12)" stroke="var(--accent-mint)"/>
                <text x="245" y="44" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="var(--accent-mint)">Stage 2: Runtime</text>
                <text x="245" y="58" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="var(--text-primary)">Binary Only (~22MB)</text>
            `,
                'Multi-stage container build'
            );
        }

        case 'git-soft-reset':
        case 'git-reflog':
        case 'git-revert':
        case 'git-cherry':
        case 'git-rebase': {
            const label =
                diagram === 'git-soft-reset'
                    ? 'HEAD~1 (Keeps files staged)'
                    : diagram === 'git-reflog'
                      ? 'Recovery Log of all HEAD moves'
                      : diagram === 'git-revert'
                        ? 'C1 -> C2 -> [!C2 Safe Undo]'
                        : diagram === 'git-cherry'
                          ? 'Pick [C4] -> Apply onto main'
                          : "Linear History: C1 -> C2 -> C3'";
            return wrapSvg(
                `
                <line x1="36" y1="38" x2="284" y2="38" stroke="var(--border-bold)" stroke-width="2.5"/>
                <circle cx="56" cy="38" r="9" fill="var(--bg-surface)" stroke="var(--text-muted)" stroke-width="2"/>
                <circle cx="136" cy="38" r="9" fill="var(--bg-surface)" stroke="var(--accent-brand)" stroke-width="2"/>
                <circle class="fc-svg-pulse-box" cx="216" cy="38" r="9" fill="var(--accent-mint)" opacity="0.25" stroke="var(--accent-mint)" stroke-width="2"/>
                <text x="160" y="70" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="var(--text-primary)">${esc(label)}</text>
            `,
                label
            );
        }

        default: {
            const textMap: Record<string, string> = {
                'ts-unknown-any': 'unknown -> [Narrow Type] -> Safe  |  any -> Unsafe',
                'ts-pick-omit': 'Pick<T, K> = Keep K   |   Omit<T, K> = Drop K',
                'ts-record': 'Record<Key, Val>  ->  { [key]: Val }',
                'event-loop': 'Sync Stack  ->  ALL Microtasks  ->  Macrotask',
                'css-layers': 'reset < base < layout < components < utilities',
                'rust-own': '1 Owner  |  Move transfers  |  Drop at scope end',
                'rust-borrow': 'Many (&T) Readers   XOR   1 (&mut T) Writer',
                'py-gen': 'List: [ALL in RAM]   |   Gen: yield 1 by 1 (O(1))',
                'py-gil': 'Threads: 1 Python Core (GIL)  |  Processes: Multi-Core',
                'bfs-dfs': 'BFS: Queue (Shortest Path)  |  DFS: Stack (Deep)',
                'stack-heap': 'Stack: Fast LIFO Frames  |  Heap: Dynamic Alloc',
                'process-thread': 'Process: Isolated RAM  |  Threads: Shared Heap',
                'cache-locality': 'Array: [1][2][3][4] Cache Hit  |  List: Pointer Hop',
                deadlock: 'Mutual Excl + Hold&Wait + No Preempt + Cycle',
                'csp-block': 'Blocks <object>/<embed> & <base> URL hijacks',
                'xss-csrf': 'XSS: Evil Script on Site  |  CSRF: Forged Cross-Request',
                'crypto-triad': 'Hash (1-way) | Encrypt (Key) | Encode (Format)',
                nosniff: 'Stops text/img upload from running as JS/HTML',
                'tcp-udp': 'TCP: Reliable Ordered  |  UDP: Low-Jitter Fire & Forget',
                ports: '22 SSH · 53 DNS · 80 HTTP · 443 HTTPS · 5432 PG',
                'http-401-403': '401: Who are you?  |  403: Known, No Access',
                'wslc-run': 'Windows -> wslc.exe -> VirtioFS -> OCI Container',
                'wslc-mount': '-v C:/src:/app (/)   &   -m 512M (Uppercase)',
                'cmd-entry': 'ENTRYPOINT: Fixed Bin  |  CMD: Default Args'
            };
            const text = textMap[diagram] ?? diagram;
            return wrapSvg(
                `
                <rect x="14" y="20" width="292" height="52" rx="6" fill="var(--bg-surface)" stroke="var(--accent-brand)"/>
                <text x="160" y="50" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="var(--text-primary)">${esc(text)}</text>
            `,
                text
            );
        }
    }
}

export function renderVisual(visual: VisualKind): string {
    if (visual.type === 'cursor-line') return renderCursorLine(visual);
    if (visual.type === 'ui-scene') return renderUiScene(visual.scene);
    return renderDiagram(visual.diagram);
}
