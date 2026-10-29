/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
export function $<T extends HTMLElement = HTMLElement>(selector: string, parent: ParentNode = document): T | null {
    return parent.querySelector<T>(selector);
}

export function req<T extends HTMLElement = HTMLElement>(selector: string, parent: ParentNode = document): T {
    const el = parent.querySelector<T>(selector);
    if (!el) {
        throw new Error(`Required DOM element not found: "${selector}"`);
    }
    return el;
}

export function copyText(text: string, buttonEl?: HTMLElement, feedbackText = '✓ Copied!'): void {
    if (!text.trim()) return;
    void navigator.clipboard.writeText(text);

    if (buttonEl) {
        const original = buttonEl.textContent;
        buttonEl.textContent = feedbackText;
        setTimeout(() => {
            buttonEl.textContent = original;
        }, 1400);
    }
}
