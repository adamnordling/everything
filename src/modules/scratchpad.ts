// =============================================================================
// WORKSTATION SCRATCHPAD & CLIPBOARD BUFFER ENGINE
// =============================================================================

export function initScratchpad(): void {
    const textarea = document.getElementById('scratchpad-textarea') as HTMLTextAreaElement | null;
    const counter = document.getElementById('scratch-counter');
    const copyBtn = document.getElementById('scratch-copy-btn');
    const clearBtn = document.getElementById('scratch-clear-btn');
    const pasteBtn = document.getElementById('scratch-paste-btn');

    if (!textarea) return;

    // Load saved content
    const saved = localStorage.getItem('everything_scratchpad') || '';
    textarea.value = saved;
    updateCounter();

    function updateCounter(): void {
        if (!counter || !textarea) return;
        const text = textarea.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        counter.textContent = `${chars} chars · ${words} words`;
    }

    // Auto-save on every keystroke
    let saveTimeout: number | undefined;

    // Auto-save debounced and guarded against quota limits
    textarea.addEventListener('input', () => {
        updateCounter();
        window.clearTimeout(saveTimeout);
        saveTimeout = window.setTimeout(() => {
            try {
                localStorage.setItem('everything_scratchpad', textarea.value);
            } catch {
                if (counter) {
                    counter.textContent = 'Storage quota exceeded!';
                }
            }
        }, 250);
    });

    // Copy All action with instant visual feedback
    copyBtn?.addEventListener('click', () => {
        if (!textarea.value.trim()) return;
        void navigator.clipboard.writeText(textarea.value);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1400);
    });

    // Paste from Clipboard action
    pasteBtn?.addEventListener('click', () => {
        void (async (): Promise<void> => {
            try {
                const clipText = await navigator.clipboard.readText();
                if (clipText) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + clipText + textarea.value.substring(end);
                    localStorage.setItem('everything_scratchpad', textarea.value);
                    updateCounter();
                    textarea.focus();
                }
            } catch {
                textarea.focus();
            }
        })();
    });

    // Clear buffer action
    clearBtn?.addEventListener('click', () => {
        if (!textarea.value) return;
        if (confirm('Clear scratchpad buffer?')) {
            textarea.value = '';
            localStorage.removeItem('everything_scratchpad');
            updateCounter();
        }
    });
}
