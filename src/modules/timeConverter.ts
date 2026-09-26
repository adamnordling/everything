// =============================================================================
// ACCURATE TIMEZONE RELEASE CONVERTER & CLOCK ENGINE
// =============================================================================

export interface TimezoneOption {
    label: string;
    zone: string;
}

export const TIMEZONES: TimezoneOption[] = [
    { label: 'Pacific Time (PT: PST/PDT)', zone: 'America/Los_Angeles' },
    { label: 'Mountain Time (MT: MST/MDT)', zone: 'America/Denver' },
    { label: 'Central Time (CT: CST/CDT)', zone: 'America/Chicago' },
    { label: 'Eastern Time (ET: EST/EDT)', zone: 'America/New_York' },
    { label: 'Universal Time (UTC / GMT)', zone: 'UTC' },
    { label: 'London Time (GMT / BST)', zone: 'Europe/London' },
    { label: 'Central European (CET / CEST)', zone: 'Europe/Stockholm' },
    { label: 'India Standard Time (IST)', zone: 'Asia/Kolkata' },
    { label: 'Japan / Korea (JST / KST)', zone: 'Asia/Tokyo' },
    { label: 'Australian Eastern (AEST / AEDT)', zone: 'Australia/Sydney' },
    { label: 'New Zealand (NZST / NZDT)', zone: 'Pacific/Auckland' }
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

        // Session Timer
        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        if (sessionBadge) sessionBadge.textContent = `Session: ${h}:${m}:${s}`;

        // Year Progress
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
    const sourceSelect = document.getElementById('tz-source-select') as HTMLSelectElement | null;
    const outputBadge = document.getElementById('tz-converted-output');

    if (!hourInput || !minInput || !formatBtn || !sourceSelect || !outputBadge) return;

    type FormatMode = '24H' | 'AM' | 'PM';
    let currentMode: FormatMode = '24H';

    sourceSelect.innerHTML = TIMEZONES.map(
        tz => `<option value="${tz.zone}">${tz.label}</option>`
    ).join('');
    sourceSelect.value = 'America/Los_Angeles'; // Default to PT

    // Initialize with current time in source zone
    const nowInSource = new Date(new Date().toLocaleString('en-US', { timeZone: sourceSelect.value }));
    hourInput.value = String(nowInSource.getHours()).padStart(2, '0');
    minInput.value = String(nowInSource.getMinutes()).padStart(2, '0');

    // -------------------------------------------------------------------------
    // 1. HOUR INPUT: KEYBOARD ARROWS (Never steals focus, wraps smoothly)
    // -------------------------------------------------------------------------
    hourInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            let val = parseInt(hourInput.value, 10);
            if (isNaN(val)) val = currentMode === '24H' ? 0 : 12;
            val++;

            if (currentMode === '24H') {
                if (val > 23) val = 0;
            } else {
                if (val > 12) val = 1;
            }
            hourInput.value = String(val).padStart(2, '0');
            calculateConversion();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            let val = parseInt(hourInput.value, 10);
            if (isNaN(val)) val = currentMode === '24H' ? 0 : 12;
            val--;

            if (currentMode === '24H') {
                if (val < 0) val = 23;
            } else {
                if (val < 1) val = 12;
            }
            hourInput.value = String(val).padStart(2, '0');
            calculateConversion();
        }
    });

    // -------------------------------------------------------------------------
    // 2. MINUTE INPUT: KEYBOARD ARROWS
    // -------------------------------------------------------------------------
    minInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            let val = parseInt(minInput.value, 10);
            if (isNaN(val)) val = 0;
            val = (val + 1) % 60;
            minInput.value = String(val).padStart(2, '0');
            calculateConversion();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            let val = parseInt(minInput.value, 10);
            if (isNaN(val)) val = 0;
            val = (val - 1 + 60) % 60;
            minInput.value = String(val).padStart(2, '0');
            calculateConversion();
        }
    });

    // -------------------------------------------------------------------------
    // 3. TYPING & CLAMPING (Only jumps to minutes when TYPING 2 digits)
    // -------------------------------------------------------------------------
    hourInput.addEventListener('input', (e: Event) => {
        let val = parseInt(hourInput.value, 10);
        if (!isNaN(val)) {
            if (currentMode === '24H' && val > 23) {
                hourInput.value = '23';
            } else if (currentMode !== '24H' && val > 12) {
                hourInput.value = '12';
            }
        }

        // Only move focus if actual text/number was typed (NOT arrows or backspace)
        const inputEvent = e as InputEvent;
        if (inputEvent.inputType === 'insertText' && hourInput.value.length >= 2) {
            minInput.focus();
            minInput.select();
        }

        calculateConversion();
    });

    minInput.addEventListener('input', () => {
        let val = parseInt(minInput.value, 10);
        if (!isNaN(val) && val > 59) {
            minInput.value = '59';
        }
        calculateConversion();
    });

    // Formatting on blur (pads single digits: '5' -> '05')
    hourInput.addEventListener('blur', () => {
        let val = parseInt(hourInput.value, 10);
        if (isNaN(val)) val = currentMode === '24H' ? 0 : 12;
        if (currentMode !== '24H') {
            if (val < 1) val = 1;
            if (val > 12) val = 12;
        } else {
            if (val < 0) val = 0;
            if (val > 23) val = 23;
        }
        hourInput.value = String(val).padStart(2, '0');
        calculateConversion();
    });

    minInput.addEventListener('blur', () => {
        let val = parseInt(minInput.value, 10);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 59) val = 59;
        minInput.value = String(val).padStart(2, '0');
        calculateConversion();
    });

    sourceSelect.addEventListener('change', calculateConversion);

    // -------------------------------------------------------------------------
    // 4. STRICT 3-WAY CYCLE: 24H -> AM -> PM -> 24H (AM never skipped)
    // -------------------------------------------------------------------------
    formatBtn.addEventListener('click', () => {
        let h = parseInt(hourInput.value, 10);
        if (isNaN(h)) h = 12;

        if (currentMode === '24H') {
            // 24H -> AM
            currentMode = 'AM';
            h = h % 12 || 12; // 00 -> 12, 13 -> 01, etc.
            hourInput.min = '1';
            hourInput.max = '12';
        } else if (currentMode === 'AM') {
            // AM -> PM (Keeps the same 1-12 hour)
            currentMode = 'PM';
            hourInput.min = '1';
            hourInput.max = '12';
        } else {
            // PM -> 24H
            currentMode = '24H';
            if (h < 12) h += 12; // 01 PM -> 13, 12 PM -> 12
            hourInput.min = '0';
            hourInput.max = '23';
        }

        hourInput.value = String(h).padStart(2, '0');
        formatBtn.textContent = currentMode;
        calculateConversion();
    });

    // -------------------------------------------------------------------------
    // 5. CALCULATION ENGINE
    // -------------------------------------------------------------------------
    function calculateConversion(): void {
        if (!hourInput || !minInput || !sourceSelect || !outputBadge) return;

        let rawH = parseInt(hourInput.value, 10);
        const m = parseInt(minInput.value, 10);

        if (isNaN(rawH) || isNaN(m) || m < 0 || m > 59) {
            outputBadge.innerHTML = `<span style="color:var(--text-muted);">Enter a valid time</span>`;
            return;
        }

        if (currentMode === '24H') {
            if (rawH < 0 || rawH > 23) {
                outputBadge.innerHTML = `<span style="color:var(--text-muted);">Hour must be 0–23</span>`;
                return;
            }
        } else {
            if (rawH < 1 || rawH > 12) {
                outputBadge.innerHTML = `<span style="color:var(--text-muted);">Hour must be 1–12</span>`;
                return;
            }
            if (currentMode === 'PM' && rawH < 12) rawH += 12;
            if (currentMode === 'AM' && rawH === 12) rawH = 0; // 12 AM = 00:00
        }

        const sourceZone = sourceSelect.value;
        const now = new Date();

        const targetUtcDate = convertWallTimeToUTC(
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
            rawH,
            m,
            sourceZone
        );

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

        const sourceDay = now.getDate();
        const localDay = new Date(targetUtcDate.toLocaleString('en-US', { timeZone: localTz })).getDate();
        let dayNote = 'Same Day';
        if (localDay > sourceDay) dayNote = '+1 Day (Tomorrow)';
        if (localDay < sourceDay) dayNote = '-1 Day (Yesterday)';

        outputBadge.innerHTML = `
            <div class="converter-result-box">
                <span class="converter-result-label">Your Local Time:</span>
                <span class="converter-result-value">${time24}</span>
                <span class="converter-result-secondary">(${time12})</span>
                <span class="pill-badge">${dayNote}</span>
            </div>
        `;
    }

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
            if (part.type !== 'literal') p[part.type] = parseInt(part.value, 10);
        }
        if (p.hour === 24) p.hour = 0;

        const wallClockAsUtc = Date.UTC(p.year ?? year, (p.month ?? month) - 1, p.day ?? day, p.hour ?? hour, p.minute ?? minute, p.second ?? 0);
        const offset = guessUtc.getTime() - wallClockAsUtc;
        return new Date(guessUtc.getTime() + offset);
    }

    calculateConversion();
}