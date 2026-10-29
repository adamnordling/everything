import { initTheme } from './core/theme';
import { initRouter } from './core/router';
import { initDashboard } from './tools/dashboard/ts/index';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouter();
    initDashboard();
});
