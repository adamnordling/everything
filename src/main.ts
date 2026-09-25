import { initClockAndConverter } from './modules/timeConverter';
import { initCalendar, getDayInfo } from './modules/calendar';
import { initWeather } from './modules/weather';
import { initTasks } from './modules/tasks';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    document.getElementById('theme-btn')?.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
    });

    // 2. Initialize Hero Time Station & Converter
    initClockAndConverter();

    // 3. Initialize Task Operations
    let reRenderCalendar: (() => void) | null = null;
    const taskHandlers = initTasks(() => {
        // When deadlines change, refresh calendar dot badges
        if (reRenderCalendar) reRenderCalendar();
    });

    // 4. Initialize Calendar & Wire Click-to-Deadline Interaction
    const intelHoliday = document.getElementById('intel-holiday-name');
    const intelNameday = document.getElementById('intel-nameday-text');
    const intelCountdown = document.getElementById('intel-countdown-badge');

    reRenderCalendar = initCalendar((selectedDateStr, activeDeadlines) => {
        // Automatically populate deadline date input on day click
        taskHandlers.setDeadlineDate(selectedDateStr);

        // Update Date Intelligence Card
        const [y, m, d] = selectedDateStr.split('-').map(Number);
        const dayDate = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
        const info = getDayInfo(dayDate);

        if (intelHoliday) {
            intelHoliday.textContent = activeDeadlines.length > 0
                ? `${info.name} · Deadlines: ${activeDeadlines.join(', ')}`
                : info.name;
        }
        if (intelNameday) intelNameday.textContent = `· ${info.namedays}`;

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

    // 5. Initialize Open-Meteo Weather
    void initWeather();
});