import { $, req } from './dom';

const sidebar = $('#app-sidebar');
const backdrop = $('#sidebar-backdrop');

const NAV_STORAGE_KEY = 'everything_nav_state_v1';
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const VALID_VIEWS = new Set(['dashboard', 'tool-youtube', 'tool-winopt', 'tool-handbook', 'tool-flashcards']);

interface NavState {
    view: string;
    scrollY: Record<string, number>;
    lastActiveAt: number;
}

let activeView = 'dashboard';
let navState: NavState = {
    view: 'dashboard',
    scrollY: {},
    lastActiveAt: Date.now()
};

function loadNavState(): NavState {
    try {
        const raw = localStorage.getItem(NAV_STORAGE_KEY);
        if (!raw) return { view: 'dashboard', scrollY: {}, lastActiveAt: Date.now() };
        const parsed = JSON.parse(raw) as Partial<NavState>;
        return {
            view: typeof parsed.view === 'string' && VALID_VIEWS.has(parsed.view) ? parsed.view : 'dashboard',
            scrollY:
                typeof parsed.scrollY === 'object' && parsed.scrollY !== null && !Array.isArray(parsed.scrollY)
                    ? parsed.scrollY
                    : {},
            lastActiveAt: typeof parsed.lastActiveAt === 'number' ? parsed.lastActiveAt : 0
        };
    } catch {
        return { view: 'dashboard', scrollY: {}, lastActiveAt: Date.now() };
    }
}

function saveNavState(touchActivity: boolean): void {
    navState.view = activeView;
    navState.scrollY[activeView] = window.scrollY;
    if (touchActivity) {
        navState.lastActiveAt = Date.now();
    }
    try {
        localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(navState));
    } catch {
        // Ignore quota limits
    }
}

export function closeMobileDrawer(): void {
    sidebar?.classList.remove('drawer-open');
    backdrop?.classList.remove('active');
}

export function openMobileDrawer(): void {
    sidebar?.classList.add('drawer-open');
    backdrop?.classList.add('active');
}

export async function switchView(targetView: string, restoreScroll = false): Promise<void> {
    closeMobileDrawer();

    const safeView = VALID_VIEWS.has(targetView) ? targetView : 'dashboard';
    if (activeView !== safeView) {
        navState.scrollY[activeView] = window.scrollY;
    }
    activeView = safeView;

    const navButtons = document.querySelectorAll<HTMLButtonElement>('.sidebar-nav .nav-item');
    const viewDashboard = req('#view-dashboard');
    const viewYoutube = req('#view-tool-youtube');
    const viewWinOpt = req('#view-tool-winopt');
    const viewHandbook = req('#view-tool-handbook');
    const viewFlashcards = req('#view-tool-flashcards');

    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === safeView);
    });

    viewDashboard.style.display = 'none';
    viewYoutube.style.display = 'none';
    viewWinOpt.style.display = 'none';
    viewHandbook.style.display = 'none';
    viewFlashcards.style.display = 'none';

    if (safeView === 'tool-youtube') {
        viewYoutube.style.display = 'flex';
        const { initYoutube } = await import('../tools/youtube/index');
        initYoutube();
    } else if (safeView === 'tool-winopt') {
        viewWinOpt.style.display = 'flex';
        const { initWindowsOptimizer } = await import('../tools/windowsOptimizer/index');
        initWindowsOptimizer();
    } else if (safeView === 'tool-handbook') {
        viewHandbook.style.display = 'flex';
        const { initDeveloperHandbook } = await import('../tools/developerHandbook/index');
        initDeveloperHandbook();
    } else if (safeView === 'tool-flashcards') {
        viewFlashcards.style.display = 'flex';
        const { initFlashcards } = await import('../tools/flashcards/index');
        initFlashcards();
    } else {
        viewDashboard.style.display = 'block';
    }

    const targetTop = restoreScroll ? (navState.scrollY[safeView] ?? 0) : 0;
    requestAnimationFrame(() => {
        window.scrollTo(0, targetTop);
    });

    saveNavState(true);
}

export function initRouter(): void {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    const navButtons = document.querySelectorAll<HTMLButtonElement>('.sidebar-nav .nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-view') || 'dashboard';
            void switchView(target, false);
        });
    });

    $('#btn-mobile-menu')?.addEventListener('click', e => {
        e.stopPropagation();
        openMobileDrawer();
    });
    $('#btn-drawer-close')?.addEventListener('click', closeMobileDrawer);
    backdrop?.addEventListener('click', closeMobileDrawer);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('drawer-open')) {
            closeMobileDrawer();
        }
    });

    let scrollTimer: number | undefined;
    window.addEventListener(
        'scroll',
        () => {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(() => {
                saveNavState(true);
            }, 150);
        },
        { passive: true }
    );

    let lastTouchSave = 0;
    const markUserActive = (): void => {
        const now = Date.now();
        if (now - lastTouchSave > 15000) {
            lastTouchSave = now;
            saveNavState(true);
        }
    };
    window.addEventListener('pointerdown', markUserActive, { passive: true });
    window.addEventListener('keydown', markUserActive, { passive: true });

    window.addEventListener('pagehide', () => {
        saveNavState(false);
    });

    navState = loadNavState();
    const elapsedMs = Date.now() - navState.lastActiveAt;

    if (elapsedMs > INACTIVITY_LIMIT_MS || !navState.lastActiveAt) {
        navState = { view: 'dashboard', scrollY: {}, lastActiveAt: Date.now() };
        void switchView('dashboard', false);
    } else {
        void switchView(navState.view, true);
    }
}
