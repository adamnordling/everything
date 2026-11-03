import { initTheme } from './core/theme';
import { initRouter } from './core/router';
import { initDashboard } from './tools/dashboard/ts/index';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouter();
    initDashboard();
});

document.getElementById('btn-back-to-top')?.addEventListener('click', () => {
    // Scroll the entire window
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fallback: If a specific view container ends up with its own scrollbar later
    document.getElementById('main-stage')?.scrollTo({ top: 0, behavior: 'smooth' });
});
