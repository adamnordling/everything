import { initClockAndConverter } from './modules/timeConverter';
import { initSystemIntel } from './modules/systemIntel';
import { initCalendar, getDayInfo } from './modules/calendar';
import { initWeather } from './modules/weather';
import { initTasks } from './modules/tasks';
import { initScratchpad } from './modules/scratchpad';
import { initBackup } from './modules/backup';
import { initYoutube } from './modules/youtube';
import { initWindowsOptimizer } from './modules/windowsOptimizer/index';
const VIEW_STORAGE_KEY = 'app_active_view';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    document.getElementById('theme-btn')?.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
    });

    // 2. View Switching Router with Full Refresh Persistence
    const navButtons = document.querySelectorAll<HTMLButtonElement>('.sidebar-nav .nav-item');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewYoutube = document.getElementById('view-tool-youtube');

    const viewWinOpt = document.getElementById('view-tool-winopt');
    // In src/main.ts:
    const mobileMenuBtn = document.getElementById('btn-mobile-menu');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');
    // Finds either by ID or by .app-sidebar class:
    const sidebar = document.getElementById('app-sidebar') || document.querySelector<HTMLElement>('.app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const drawerCloseBtn = document.getElementById('btn-drawer-close');

    function closeMobileDrawer(): void {
        sidebar?.classList.remove('drawer-open');
        backdrop?.classList.remove('active');
    }

    function openMobileDrawer(): void {
        sidebar?.classList.add('drawer-open');
        backdrop?.classList.add('active');
    }

    mobileMenuBtn?.addEventListener('click', e => {
        e.stopPropagation();
        openMobileDrawer();
    });

    drawerCloseBtn?.addEventListener('click', closeMobileDrawer);
    backdrop?.addEventListener('click', closeMobileDrawer);

    // Sync theme toggle on mobile top bar
    mobileThemeBtn?.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
    });

    // Close drawer on Escape key
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('drawer-open')) {
            closeMobileDrawer();
        }
    });

    // Inside your existing switchView function, auto-close the drawer when navigating:
    function switchView(targetView: string): void {
        closeMobileDrawer(); // <--- Closes drawer automatically when a user taps a tool

        const supportedViews = ['dashboard', 'tool-youtube', 'tool-winopt'];
        const activeView = supportedViews.includes(targetView) ? targetView : 'dashboard';

        localStorage.setItem(VIEW_STORAGE_KEY, activeView);
        window.location.hash = activeView;

        navButtons.forEach(btn => {
            if (btn.getAttribute('data-view') === activeView) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (activeView === 'tool-youtube') {
            if (viewDashboard) viewDashboard.style.display = 'none';
            if (viewYoutube) viewYoutube.style.display = 'flex';
            if (viewWinOpt) viewWinOpt.style.display = 'none';
        } else if (activeView === 'tool-winopt') {
            if (viewDashboard) viewDashboard.style.display = 'none';
            if (viewYoutube) viewYoutube.style.display = 'none';
            if (viewWinOpt) viewWinOpt.style.display = 'flex';
        } else {
            if (viewDashboard) viewDashboard.style.display = 'block';
            if (viewYoutube) viewYoutube.style.display = 'none';
            if (viewWinOpt) viewWinOpt.style.display = 'none';
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.getAttribute('data-view') || 'dashboard';
            switchView(targetView);
        });
    });

    // Restore view from localStorage or URL hash immediately
    const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const initialView = hash || localStorage.getItem(VIEW_STORAGE_KEY) || 'dashboard';
    switchView(initialView);

    // 3. Initialize Hero Time Station & Converter
    initClockAndConverter();

    // 4. Initialize Workstation Intel
    try {
        initSystemIntel();
    } catch (err) {
        console.error('Workstation telemetry error:', err);
    }

    // 5. Initialize Tasks
    let reRenderCalendar: (() => void) | null = null;
    const taskHandlers = initTasks(() => {
        if (reRenderCalendar) reRenderCalendar();
    });

    // 6. Initialize Calendar & Date Intel Card
    const intelHoliday = document.getElementById('intel-holiday-name');
    const intelNameday = document.getElementById('intel-nameday-text');
    const intelCountdown = document.getElementById('intel-countdown-badge');

    reRenderCalendar = initCalendar((selectedDateStr, activeDeadlines) => {
        taskHandlers.setDeadlineDate(selectedDateStr);

        const dateParts = selectedDateStr.split('-');
        const yearNum = Number(dateParts[0]);
        const monthNum = Number(dateParts[1]);
        const dayNum = Number(dateParts[2]);
        const dayDate = new Date(yearNum, monthNum - 1, dayNum);
        const info = getDayInfo(dayDate);

        if (intelHoliday) {
            if (activeDeadlines.length > 0) {
                intelHoliday.textContent = info.holidayName
                    ? `${info.holidayName} · Deadlines: ${activeDeadlines.join(', ')}`
                    : `Deadlines: ${activeDeadlines.join(', ')}`;
            } else if (info.holidayName) {
                intelHoliday.textContent = info.holidayName;
            } else {
                intelHoliday.textContent = '';
            }
        }

        if (intelNameday) {
            if (info.holidayName || activeDeadlines.length > 0) {
                intelNameday.textContent = `· Name Day: ${info.namedays}`;
            } else {
                intelNameday.textContent = `Name Day: ${info.namedays}`;
            }
        }

        if (intelCountdown) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.round((dayDate.getTime() - today.getTime()) / 86400000);

            if (diffDays === 0) intelCountdown.textContent = 'Today';
            else if (diffDays === 1) intelCountdown.textContent = 'Tomorrow';
            else if (diffDays === -1) intelCountdown.textContent = 'Yesterday';
            else if (diffDays > 0) intelCountdown.textContent = `In ${diffDays} days`;
            else intelCountdown.textContent = `${Math.abs(diffDays)} days ago`;
        }
    });

    // 7. Initialize Tools & Utilities
    initWeather();
    initScratchpad();
    initBackup();
    initYoutube();
    initWindowsOptimizer();
});
