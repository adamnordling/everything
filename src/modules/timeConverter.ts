// =============================================================================
// ACCURATE TIMEZONE RELEASE CONVERTER & CLOCK ENGINE
// =============================================================================

export interface TimezoneOption {
    label: string;
    shortLabel: string;
    zone: string;
}

export const TIMEZONES: TimezoneOption[] = [
    { label: 'Pacific Time (PT: PST/PDT)', shortLabel: 'PT (PST / PDT)', zone: 'America/Los_Angeles' },
    { label: 'Mountain Time (MT: MST/MDT)', shortLabel: 'MT (MST / MDT)', zone: 'America/Denver' },
    { label: 'Central Time (CT: CST/CDT)', shortLabel: 'CT (CST / CDT)', zone: 'America/Chicago' },
    { label: 'Eastern Time (ET: EST/EDT)', shortLabel: 'ET (EST / EDT)', zone: 'America/New_York' },
    { label: 'Universal Time (UTC / GMT)', shortLabel: 'UTC / GMT', zone: 'UTC' },
    { label: 'London Time (GMT / BST)', shortLabel: 'London (GMT / BST)', zone: 'Europe/London' },
    { label: 'Central European (CET / CEST)', shortLabel: 'CET / CEST', zone: 'Europe/Stockholm' },
    { label: 'India Standard Time (IST)', shortLabel: 'IST (India)', zone: 'Asia/Kolkata' },
    { label: 'Japan / Korea (JST / KST)', shortLabel: 'JST / KST (Tokyo)', zone: 'Asia/Tokyo' },
    { label: 'Australian Eastern (AEST / AEDT)', shortLabel: 'AEST / AEDT (Sydney)', zone: 'Australia/Sydney' },
    { label: 'New Zealand (NZST / NZDT)', shortLabel: 'NZST / NZDT (Auckland)', zone: 'Pacific/Auckland' }
];

export function initClockAndConverter(): void {
    const clockDisplay = document.getElementById('clock-large');
    const dateSubEl = document.getElementById('clock-date-sub');
    const sessionBadge = document.getElementById('session-counter-badge');
    const yearStatsText = document.getElementById('year-stats-text');
    const yearFillBar = document.getElementById('year-fill-bar');
    const activeTzDisplay = document.getElementById('active-tz-display');

    const epochBtn = document.getElementById('clock-epoch-btn');
    const epochVal = document.getElementById('clock-epoch-val');
    const dstVal = document.getElementById('clock-dst-val');
    const sunsetVal = document.getElementById('clock-sunset-val');

    const tzBtn = document.getElementById('active-tz-btn');
    const tzModal = document.getElementById('modal-tz-picker');
    const tzCloseBtn = document.getElementById('modal-tz-close');
    const tzSelect = document.getElementById('tz-picker-select') as HTMLSelectElement | null;
    const tzSaveBtn = document.getElementById('btn-save-tz');

    // CONVERTER DOM ELEMENTS (Must be declared before calling populateSourceSelect)
    const hourInput = document.getElementById('tz-hour-input') as HTMLInputElement | null;
    const minInput = document.getElementById('tz-min-input') as HTMLInputElement | null;
    const formatBtn = document.getElementById('tz-format-toggle') as HTMLButtonElement | null;
    const sourceSelect = document.getElementById('tz-source-select') as HTMLSelectElement | null;
    const outputBadge = document.getElementById('tz-converted-output');

    const sessionStart = Date.now();
    let activeTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Stockholm';

    if (activeTzDisplay) activeTzDisplay.textContent = activeTz;

    // 1. One-click copy epoch
    epochBtn?.addEventListener('click', () => {
        const currentSec = String(Math.floor(Date.now() / 1000));
        void navigator.clipboard.writeText(currentSec);

        document.querySelectorAll('.inline-copy-badge').forEach(el => {
            el.remove();
        });
        const rect = epochBtn.getBoundingClientRect();
        const badge = document.createElement('div');
        badge.className = 'inline-copy-badge';
        badge.textContent = `✓ Copied Epoch: ${currentSec}`;
        document.body.appendChild(badge);

        const badgeRect = badge.getBoundingClientRect();
        badge.style.top = `${Math.max(8, rect.top - badgeRect.height - 6)}px`;
        badge.style.left = `${Math.max(8, rect.left + (rect.width - badgeRect.width) / 2)}px`;

        setTimeout(() => {
            badge.classList.add('fade-out');
            setTimeout(() => {
                badge.remove();
            }, 200);
        }, 1200);
    });

    // 2. DST Calculation (Compact text for mobile)
    function calculateDstHorizon(tz: string): string {
        const now = new Date();
        const year = now.getFullYear();
        const jan = new Date(year, 0, 1);
        const jul = new Date(year, 6, 1);

        const getOffset = (d: Date): number => {
            const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(
                d
            );
            const part = parts.find(p => p.type === 'timeZoneName');
            if (!part) return 0;
            const m = /GMT([+-]\d+)(?::(\d+))?/.exec(part.value);
            if (!m) return 0;
            const hours = parseInt(m[1], 10);
            const mins = m[2] ? parseInt(m[2], 10) : 0;
            return hours * 60 + (hours < 0 ? -mins : mins);
        };

        const janOff = getOffset(jan);
        const julOff = getOffset(jul);
        if (janOff === julOff) return 'Standard (No DST)';

        const nowOff = getOffset(now);
        const isDst = nowOff === Math.max(janOff, julOff);

        let probe = new Date(now.getTime() + 86400000);
        let foundDate: Date | null = null;
        for (let i = 1; i <= 210; i++) {
            if (getOffset(probe) !== nowOff) {
                foundDate = probe;
                break;
            }
            probe = new Date(probe.getTime() + 86400000);
        }

        if (!foundDate) return isDst ? 'DST Active' : 'Standard Time';
        const daysUntil = Math.ceil((foundDate.getTime() - now.getTime()) / 86400000);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateStr = `${monthNames[foundDate.getMonth()]} ${foundDate.getDate()}`;

        // Shorter format to fit narrow cards without wrapping
        const isMobile = window.innerWidth <= 480;
        if (isMobile) {
            return isDst ? `Ends in ${daysUntil}d (${dateStr})` : `Starts in ${daysUntil}d (${dateStr})`;
        }
        return isDst
            ? `DST Active · Ends in ${daysUntil}d (${dateStr})`
            : `Standard · Starts in ${daysUntil}d (${dateStr})`;
    }

    function updateSunsetDisplay(): void {
        if (!sunsetVal) return;
        const cachedSunsetStr = localStorage.getItem('cached_sunset');
        if (!cachedSunsetStr) {
            sunsetVal.textContent = 'Awaiting solar data...';
            return;
        }

        const sunsetDate = new Date(cachedSunsetStr);
        const now = new Date();
        const diffMs = sunsetDate.getTime() - now.getTime();

        const timeFormatter = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: activeTz
        });
        const sunsetTimeStr = timeFormatter.format(sunsetDate);

        if (diffMs > 0) {
            const h = Math.floor(diffMs / 3600000);
            const m = Math.floor((diffMs % 3600000) / 60000);
            sunsetVal.textContent = `Sunset in ${h}h ${m}m (${sunsetTimeStr})`;
        } else {
            sunsetVal.textContent = `Sunset was at ${sunsetTimeStr}`;
        }
    }

    window.addEventListener('sunset-updated', updateSunsetDisplay);

    function updateDstDisplay(): void {
        if (dstVal) {
            dstVal.textContent = calculateDstHorizon(activeTz);
        }
    }

    // Modal populate
    if (tzSelect) {
        tzSelect.innerHTML = TIMEZONES.map(t => `<option value="${t.zone}">${t.label}</option>`).join('');
        tzSelect.value = activeTz;
    }

    function closeTzModal(): void {
        if (tzModal) tzModal.style.display = 'none';
    }

    tzBtn?.addEventListener('click', () => {
        if (tzModal) {
            if (tzSelect) tzSelect.value = activeTz;
            tzModal.style.display = 'flex';
        }
    });

    tzCloseBtn?.addEventListener('click', closeTzModal);
    window.addEventListener('click', (e: MouseEvent) => {
        if (e.target === tzModal) closeTzModal();
    });

    tzSaveBtn?.addEventListener('click', () => {
        if (tzSelect) {
            activeTz = tzSelect.value;
            if (activeTzDisplay) activeTzDisplay.textContent = activeTz;
            closeTzModal();
            updateDstDisplay();
            tick();
            calculateConversion();
        }
    });

    updateDstDisplay();

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

        const fTime = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: activeTz
        });
        if (clockDisplay) clockDisplay.textContent = fTime.format(now);

        const fDay = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: activeTz }).format(now);
        const fDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: activeTz }).format(
            now
        );
        const weekNum = getISOWeek(now);

        if (dateSubEl) {
            dateSubEl.textContent = `${fDay}, ${fDate} · Week ${weekNum}`;
        }

        if (epochVal) {
            epochVal.textContent = String(Math.floor(Date.now() / 1000));
        }

        updateSunsetDisplay();

        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        if (sessionBadge) sessionBadge.textContent = `Session: ${h}:${m}:${s}`;

        const startOfYear = new Date(year, 0, 1);
        const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000) + 1;
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        const totalDays = isLeap ? 366 : 365;
        const qtr = Math.floor(now.getMonth() / 3) + 1;
        const pct = ((dayOfYear / totalDays) * 100).toFixed(1);

        if (yearStatsText) yearStatsText.textContent = `DAY ${dayOfYear}/${totalDays} · Q${qtr} · ${pct}%`;
        if (yearFillBar) yearFillBar.style.width = `${pct}%`;
    }

    tick();
    setInterval(tick, 1000);

    // =========================================================================
    // RESPONSIVE CONVERTER DROPDOWN POPULATOR
    // =========================================================================
    if (!hourInput || !minInput || !formatBtn || !sourceSelect || !outputBadge) return;

    type FormatMode = '24H' | 'AM' | 'PM';
    let currentMode: FormatMode = '24H';

    function populateSourceSelect(): void {
        if (!sourceSelect) return;
        const currentVal = sourceSelect.value || 'America/Los_Angeles';
        const isMobile = window.innerWidth <= 600;
        sourceSelect.innerHTML = TIMEZONES.map(
            tz => `<option value="${tz.zone}">${isMobile ? tz.shortLabel : tz.label}</option>`
        ).join('');
        sourceSelect.value = currentVal;
    }

    populateSourceSelect();
    window.addEventListener('resize', () => {
        populateSourceSelect();
        updateDstDisplay();
    });

    const nowInSource = new Date(new Date().toLocaleString('en-US', { timeZone: sourceSelect.value }));
    hourInput.value = String(nowInSource.getHours()).padStart(2, '0');
    minInput.value = String(nowInSource.getMinutes()).padStart(2, '0');

    hourInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            let val = parseInt(hourInput.value, 10);
            if (isNaN(val)) val = currentMode === '24H' ? 0 : 12;
            val = e.key === 'ArrowUp' ? val + 1 : val - 1;

            if (currentMode === '24H') {
                if (val > 23) val = 0;
                if (val < 0) val = 23;
            } else {
                if (val > 12) val = 1;
                if (val < 1) val = 12;
            }
            hourInput.value = String(val).padStart(2, '0');
            calculateConversion();
        }
    });

    minInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            let val = parseInt(minInput.value, 10);
            if (isNaN(val)) val = 0;
            val = e.key === 'ArrowUp' ? (val + 1) % 60 : (val - 1 + 60) % 60;
            minInput.value = String(val).padStart(2, '0');
            calculateConversion();
        }
    });

    hourInput.addEventListener('input', (e: Event) => {
        const val = parseInt(hourInput.value, 10);
        if (!isNaN(val)) {
            if (currentMode === '24H' && val > 23) hourInput.value = '23';
            else if (currentMode !== '24H' && val > 12) hourInput.value = '12';
        }
        const inputEvent = e as InputEvent;
        if (inputEvent.inputType === 'insertText' && hourInput.value.length >= 2) {
            minInput.focus();
            minInput.select();
        }
        calculateConversion();
    });

    minInput.addEventListener('input', () => {
        const val = parseInt(minInput.value, 10);
        if (!isNaN(val) && val > 59) minInput.value = '59';
        calculateConversion();
    });

    hourInput.addEventListener('blur', () => {
        let val = parseInt(hourInput.value, 10);
        if (isNaN(val)) val = currentMode === '24H' ? 0 : 12;
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

    formatBtn.addEventListener('click', () => {
        let h = parseInt(hourInput.value, 10);
        if (isNaN(h)) h = 12;

        if (currentMode === '24H') {
            currentMode = 'AM';
            h = h % 12 || 12;
            hourInput.min = '1';
            hourInput.max = '12';
        } else if (currentMode === 'AM') {
            currentMode = 'PM';
            hourInput.min = '1';
            hourInput.max = '12';
        } else {
            currentMode = '24H';
            if (h < 12) h += 12;
            hourInput.min = '0';
            hourInput.max = '23';
        }

        hourInput.value = String(h).padStart(2, '0');
        formatBtn.textContent = currentMode;
        calculateConversion();
    });

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
            if (currentMode === 'AM' && rawH === 12) rawH = 0;
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
            timeZone: activeTz
        });

        const localFormatter12 = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: activeTz
        });

        const time24 = localFormatter24.format(targetUtcDate);
        const time12 = localFormatter12.format(targetUtcDate);

        const sourceDay = now.getDate();
        const localDay = new Date(targetUtcDate.toLocaleString('en-US', { timeZone: activeTz })).getDate();
        let dayNote = 'Same Day';
        if (localDay > sourceDay) dayNote = '+1 Day';
        if (localDay < sourceDay) dayNote = '-1 Day';

        outputBadge.innerHTML = `
            <div class="converter-result-box">
                <span class="converter-result-label">Local:</span>
                <span class="converter-result-value">${time24}</span>
                <span class="converter-result-secondary">(${time12})</span>
                <span class="pill-badge">${dayNote}</span>
            </div>
        `;
    }

    function convertWallTimeToUTC(
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        timeZone: string
    ): Date {
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
        const p: Record<string, number | undefined> = {};
        for (const part of parts) {
            if (part.type !== 'literal') p[part.type] = parseInt(part.value, 10);
        }
        if (p.hour === 24) p.hour = 0;

        const wallClockAsUtc = Date.UTC(
            p.year ?? year,
            (p.month ?? month) - 1,
            p.day ?? day,
            p.hour ?? hour,
            p.minute ?? minute,
            p.second ?? 0
        );
        const offset = guessUtc.getTime() - wallClockAsUtc;
        return new Date(guessUtc.getTime() + offset);
    }

    calculateConversion();
}
