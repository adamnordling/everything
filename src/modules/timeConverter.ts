// =============================================================================
// ACCURATE TIMEZONE RELEASE CONVERTER & CLOCK ENGINE
// =============================================================================

export interface TimezoneOption {
    label: string;
    zone: string;
    abbr: string;
}

export const TIMEZONES: TimezoneOption[] = [
    { label: 'Pacific Time (PT: PST/PDT)', zone: 'America/Los_Angeles', abbr: 'PT' },
    { label: 'Mountain Time (MT: MST/MDT)', zone: 'America/Denver', abbr: 'MT' },
    { label: 'Central Time (CT: CST/CDT)', zone: 'America/Chicago', abbr: 'CT' },
    { label: 'Eastern Time (ET: EST/EDT)', zone: 'America/New_York', abbr: 'ET' },
    { label: 'Universal Time (UTC / GMT)', zone: 'UTC', abbr: 'UTC' },
    { label: 'London Time (GMT / BST)', zone: 'Europe/London', abbr: 'UK' },
    { label: 'Central European (CET / CEST)', zone: 'Europe/Stockholm', abbr: 'CET' },
    { label: 'India Standard Time (IST)', zone: 'Asia/Kolkata', abbr: 'IST' },
    { label: 'Japan / Korea (JST / KST)', zone: 'Asia/Tokyo', abbr: 'JST' },
    { label: 'Australian Eastern (AEST / AEDT)', zone: 'Australia/Sydney', abbr: 'AEST' },
    { label: 'New Zealand (NZST / NZDT)', zone: 'Pacific/Auckland', abbr: 'NZST' }
];

export function initClockAndConverter(): void {
    const clockDisplay = document.getElementById('clock-large');
    const dayOfWeekDisplay = document.getElementById('day-of-week-display');
    const isoWeekBadge = document.getElementById('iso-week-badge');
    const sessionBadge = document.getElementById('session-counter-badge');
    const yearStatsText = document.getElementById('year-stats-text');
    const yearFillBar = document.getElementById('year-fill-bar');
    const daysRemainingText = document.getElementById('days-remaining-text');
    const activeTzDisplay = document.getElementById('active-tz-display');

    const sessionStart = Date.now();
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (activeTzDisplay) activeTzDisplay.textContent = localTz;

    function getISOWeek(d: Date): number {
        const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNr = target.getUTCDay() || 7;
        target.setUTCDate(target.getUTCDate() + 4 - dayNr);
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
        return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    }

    function tick(): void {
        const now = new Date();
        const year = now.getFullYear();

        if (clockDisplay) clockDisplay.textContent = now.toTimeString().split(' ')[0];

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (dayOfWeekDisplay) dayOfWeekDisplay.textContent = days[now.getDay()];
        if (isoWeekBadge) isoWeekBadge.textContent = `Week ${getISOWeek(now)}`;

        // Active Session Stopwatch
        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        if (sessionBadge) sessionBadge.textContent = `Session: ${h}:${m}:${s}`;

        // Day of Year Progress
        const startOfYear = new Date(year, 0, 1);
        const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000) + 1;
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const totalDays = isLeap ? 366 : 365;
        const qtr = Math.floor(now.getMonth() / 3) + 1;
        const pct = ((dayOfYear / totalDays) * 100).toFixed(1);

        if (yearStatsText) yearStatsText.textContent = `DAY ${dayOfYear}/${totalDays} · Q${qtr} · ${pct}%`;
        if (daysRemainingText) daysRemainingText.textContent = `${totalDays - dayOfYear}d left`;
        if (yearFillBar) yearFillBar.style.width = `${pct}%`;
    }

    tick();
    setInterval(tick, 1000);

    // =========================================================================
    // ACCURATE TIMEZONE CONVERTER
    // =========================================================================
    const hourInput = document.getElementById('tz-hour-input') as HTMLInputElement | null;
    const minInput = document.getElementById('tz-min-input') as HTMLInputElement | null;
    const formatBtn = document.getElementById('tz-format-toggle') as HTMLButtonElement | null;
    const ampmSelect = document.getElementById('tz-ampm-select') as HTMLSelectElement | null;
    const sourceSelect = document.getElementById('tz-source-select') as HTMLSelectElement | null;
    const outputBadge = document.getElementById('tz-converted-output');

    if (!hourInput || !minInput || !formatBtn || !ampmSelect || !sourceSelect || !outputBadge) return;

    let is24HourMode = true;

    // Populate Timezone Dropdown
    sourceSelect.innerHTML = TIMEZONES.map(
        tz => `<option value="${tz.zone}">${tz.label}</option>`
    ).join('');
    sourceSelect.value = 'America/Los_Angeles'; // Default to PT (common release timezone)

    // Set initial values from the current time in the selected source timezone
    const nowInSource = new Date(new Date().toLocaleString('en-US', { timeZone: sourceSelect.value }));
    hourInput.value = String(nowInSource.getHours()).padStart(2, '0');
    minInput.value = String(nowInSource.getMinutes()).padStart(2, '0');

    formatBtn.addEventListener('click', () => {
        is24HourMode = !is24HourMode;
        formatBtn.textContent = is24HourMode ? '24H' : '12H';
        ampmSelect.style.display = is24HourMode ? 'none' : 'inline-block';

        let h = parseInt(hourInput.value, 10) || 0;
        if (!is24HourMode) {
            ampmSelect.value = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            hourInput.value = String(h);
        } else {
            const isPM = ampmSelect.value === 'PM';
            if (isPM && h < 12) h += 12;
            if (!isPM && h === 12) h = 0;
            hourInput.value = String(h).padStart(2, '0');
        }
        calculateConversion();
    });

    function calculateConversion(): void {
        if (!hourInput || !minInput || !sourceSelect || !outputBadge || !ampmSelect) return;

        let rawH = parseInt(hourInput.value, 10);
        const m = parseInt(minInput.value, 10);

        if (isNaN(rawH) || isNaN(m) || m < 0 || m > 59) {
            outputBadge.textContent = 'Invalid Time';
            return;
        }

        if (!is24HourMode) {
            const isPM = ampmSelect.value === 'PM';
            if (rawH < 1 || rawH > 12) {
                outputBadge.textContent = 'Use 1-12';
                return;
            }
            if (isPM && rawH < 12) rawH += 12;
            if (!isPM && rawH === 12) rawH = 0;
        } else {
            if (rawH < 0 || rawH > 23) {
                outputBadge.textContent = 'Use 0-23';
                return;
            }
        }

        const sourceZone = sourceSelect.value;
        const now = new Date();

        // Exact DST-aware conversion from source zone to local time
        const targetUtcDate = convertWallTimeToUTC(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            rawH,
            m,
            sourceZone
        );

        // Format in user's local timezone
        const localFormatter24 = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
            timeZone: localTz
        });

        const localFormatter12 = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: localTz
        });

        const time24 = localFormatter24.format(targetUtcDate);
        const time12 = localFormatter12.format(targetUtcDate);

        // Calculate day shift relative to source date
        const sourceDay = now.getDate();
        const localDay = new Date(targetUtcDate.toLocaleString('en-US', { timeZone: localTz })).getDate();
        let dayNote = 'Today';
        if (localDay > sourceDay) dayNote = 'Tomorrow';
        if (localDay < sourceDay) dayNote = 'Yesterday';

        outputBadge.innerHTML = `Your Time: <strong>${time24}</strong> (${time12}) · <small>${dayNote}</small>`;
    }

    // DST-aware inversion: determines exact UTC moment for any time in any zone
    function convertWallTimeToUTC(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): Date {
        const guessUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
        const dtf = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });

        const parts = dtf.formatToParts(guessUtc);
        const p: Record<string, number> = {};
        for (const part of parts) {
            if (part.type !== 'literal') {
                p[part.type] = parseInt(part.value, 10);
            }
        }
        if (p.hour === 24) p.hour = 0;

        const wallClockAsUtc = Date.UTC(p.year ?? year, (p.month ?? month) - 1, p.day ?? day, p.hour ?? hour, p.minute ?? minute, p.second ?? 0);
        const offset = guessUtc.getTime() - wallClockAsUtc;
        return new Date(guessUtc.getTime() + offset);
    }

    hourInput.addEventListener('input', calculateConversion);
    minInput.addEventListener('input', calculateConversion);
    sourceSelect.addEventListener('change', calculateConversion);
    ampmSelect.addEventListener('change', calculateConversion);

    calculateConversion();
}