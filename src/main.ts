import { initClockAndConverter } from './modules/timeConverter';
import { initSystemIntel } from './modules/systemIntel';
import { initCalendar, getDayInfo } from './modules/calendar';
import { initWeather } from './modules/weather';
import { initTasks } from './modules/tasks';
import { initScratchpad } from './modules/scratchpad';
import { initBackup } from './modules/backup';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    document.getElementById('theme-btn')?.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem('app_theme', isLight ? 'light' : 'dark');
    });

    // 2. Initialize Hero Time Station & Converter
    initClockAndConverter();

    // 3. Initialize Workstation Intel (Protected Boundary)
    try {
        initSystemIntel();
    } catch (err) {
        console.error('Workstation telemetry error:', err);
    }

    // 4. Initialize Task Operations
    let reRenderCalendar: (() => void) | null = null;
    const taskHandlers = initTasks(() => {
        if (reRenderCalendar) reRenderCalendar();
    });

    // 5. Initialize Calendar & Date Intel Card
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

        // 1. Special Day / Deadline Title (Empty if none exists)
        if (intelHoliday) {
            if (activeDeadlines.length > 0) {
                intelHoliday.textContent = info.holidayName
                    ? `${info.holidayName} · Deadlines: ${activeDeadlines.join(', ')}`
                    : `Deadlines: ${activeDeadlines.join(', ')}`;
            } else if (info.holidayName) {
                intelHoliday.textContent = info.holidayName;
            } else {
                intelHoliday.textContent = ''; // NOTHING WRITTEN IF NO EVENT!
            }
        }

        // 2. Name Day (No leading dot if holiday is empty, no duplicates)
        if (intelNameday) {
            if (info.holidayName || activeDeadlines.length > 0) {
                intelNameday.textContent = `· Name Day: ${info.namedays}`;
            } else {
                intelNameday.textContent = `Name Day: ${info.namedays}`;
            }
        }

        // 3. Relative Countdown Badge in English
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

    // 6. Initialize Weather
    initWeather();
    initScratchpad();
    initBackup();
});
