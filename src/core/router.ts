import { $, req } from './dom';

const sidebar = $('#app-sidebar');
const backdrop = $('#sidebar-backdrop');

export function closeMobileDrawer(): void {
    sidebar?.classList.remove('drawer-open');
    backdrop?.classList.remove('active');
}

export function openMobileDrawer(): void {
    sidebar?.classList.add('drawer-open');
    backdrop?.classList.add('active');
}

export async function switchView(targetView: string): Promise<void> {
    closeMobileDrawer();

    const navButtons = document.querySelectorAll<HTMLButtonElement>('.sidebar-nav .nav-item');
    const viewDashboard = req('#view-dashboard');
    const viewYoutube = req('#view-tool-youtube');
    const viewWinOpt = req('#view-tool-winopt');

    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === targetView);
    });

    viewDashboard.style.display = 'none';
    viewYoutube.style.display = 'none';
    viewWinOpt.style.display = 'none';

    if (targetView === 'tool-youtube') {
        viewYoutube.style.display = 'flex';
        // Lazy-loads YouTube code & CSS only when clicked!
        const { initYoutube } = await import('../tools/youtube/index');
        initYoutube();
    } else if (targetView === 'tool-winopt') {
        viewWinOpt.style.display = 'flex';
        // Lazy-loads Windows Optimizer code & CSS only when clicked!
        const { initWindowsOptimizer } = await import('../tools/windowsOptimizer/index');
        initWindowsOptimizer();
    } else {
        viewDashboard.style.display = 'block';
    }
}

export function initRouter(): void {
    const navButtons = document.querySelectorAll<HTMLButtonElement>('.sidebar-nav .nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-view') || 'dashboard';
            void switchView(target);
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

    // Always start on the dashboard
    void switchView('dashboard');
}
