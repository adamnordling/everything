export type CategoryId = 'hotkeys' | 'languages' | 'cs' | 'security' | 'devops';

export type VisualKind =
    | {
          type: 'cursor-line';
          promptTag: string;
          before: string;
          highlight?: string;
          after: string;
          cursorAt?: 'start' | 'end' | 'middle';
          modeLabel?: string;
      }
    | {
          type: 'ui-scene';
          scene:
              | 'mode-esc'
              | 'mode-visual-block'
              | 'file-save'
              | 'file-top'
              | 'file-bottom'
              | 'scroll-half'
              | 'center-zz'
              | 'undo-redo'
              | 'repeat-dot'
              | 'which-key'
              | 'fuzzy-files'
              | 'live-grep'
              | 'file-tree'
              | 'buffer-tabs'
              | 'split-v'
              | 'split-h'
              | 'lsp-def'
              | 'lsp-actions'
              | 'terminal-float'
              | 'tab-new-close'
              | 'tab-reopen'
              | 'tab-cycle'
              | 'tab-jump'
              | 'tab-search'
              | 'tab-bg-link'
              | 'url-bar'
              | 'history-nav'
              | 'hard-reload'
              | 'incognito'
              | 'bookmarks-bar'
              | 'devtools-console'
              | 'devtools-inspect'
              | 'devtools-cmd'
              | 'clear-data'
              | 'cmd-palette'
              | 'win-x'
              | 'task-mgr'
              | 'run-admin'
              | 'gpu-reset'
              | 'clip-history'
              | 'snip-tool'
              | 'win-snap'
              | 'win-desktops'
              | 'explorer'
              | 'term-search'
              | 'term-clear'
              | 'term-kill'
              | 'tmux-split'
              | 'tmux-detach';
      }
    | {
          type: 'diagram';
          diagram:
              | 'ts-unknown-any'
              | 'ts-pick-omit'
              | 'ts-record'
              | 'event-loop'
              | 'css-layers'
              | 'rust-own'
              | 'rust-borrow'
              | 'py-gen'
              | 'py-gil'
              | 'big-o-hash'
              | 'big-o-binary'
              | 'big-o-sort'
              | 'stack-queue'
              | 'bfs-dfs'
              | 'stack-heap'
              | 'process-thread'
              | 'cache-locality'
              | 'deadlock'
              | 'csp-block'
              | 'xss-csrf'
              | 'crypto-triad'
              | 'nosniff'
              | 'tcp-handshake'
              | 'tcp-udp'
              | 'ports'
              | 'http-401-403'
              | 'git-soft-reset'
              | 'git-reflog'
              | 'git-revert'
              | 'git-cherry'
              | 'git-rebase'
              | 'wslc-run'
              | 'wslc-mount'
              | 'multistage'
              | 'cmd-entry';
      };

export interface FlashcardItem {
    id: string;
    topic: string;
    prompt: string;
    answer: string;
    hint?: string;
    isHotkey?: boolean;
    visual: VisualKind;
}

export interface FlashcardDeck {
    id: string;
    category: CategoryId;
    categoryLabel: string;
    title: string;
    subtitle: string;
    cards: FlashcardItem[];
}

export type StudyLayoutMode = 'drill' | 'grid';

export interface FlashcardProgressState {
    activeDeckId: string;
    layoutMode: StudyLayoutMode;
    doneIds: string[];
}
