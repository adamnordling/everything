import { initClockAndConverter } from './clock';
import { initSystemIntel } from './telemetry';
import { initCalendar, getDayInfo } from './calendar';
import { initWeather } from './weather';
import { initTasks } from './tasks';
import { initScratchpad } from './scratchpad';
import { initBackup } from './backup';

export function initDashboard(): void {
    initClockAndConverter();

    try {
        initSystemIntel();
    } catch (err) {
        console.error('Telemetry HUD error:', err);
    }

    let reRenderCalendar: (() => void) | null = null;
    const taskHandlers = initTasks(() => {
        if (reRenderCalendar) reRenderCalendar();
    });

    const intelHoliday = document.getElementById('intel-holiday-name');
    const intelNameday = document.getElementById('intel-nameday-text');
    const intelCountdown = document.getElementById('intel-countdown-badge');

    reRenderCalendar = initCalendar((selectedDateStr, activeDeadlines) => {
        taskHandlers.setDeadlineDate(selectedDateStr);

        const dateParts = selectedDateStr.split('-');
        const dayDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
        const info = getDayInfo(dayDate);

        if (intelHoliday) {
            intelHoliday.textContent =
                activeDeadlines.length > 0
                    ? info.holidayName
                        ? `${info.holidayName} · Deadlines: ${activeDeadlines.join(', ')}`
                        : `Deadlines: ${activeDeadlines.join(', ')}`
                    : info.holidayName || '';
        }

        if (intelNameday) {
            intelNameday.textContent =
                info.holidayName || activeDeadlines.length > 0
                    ? `· Name Day: ${info.namedays}`
                    : `Name Day: ${info.namedays}`;
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

    initWeather();
    initScratchpad();
    initBackup();
}
