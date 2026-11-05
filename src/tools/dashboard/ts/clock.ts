// =============================================================================
// ACCURATE TIMEZONE CONVERTER & CHRONOMETRY STATION (STRICT TYPESCRIPT)
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

const US_12H_ZONES = new Set(['America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York']);

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

    const hourInput = document.getElementById('tz-hour-input') as HTMLInputElement | null;
    const minInput = document.getElementById('tz-min-input') as HTMLInputElement | null;
    const formatBtn = document.getElementById('tz-format-toggle') as HTMLButtonElement | null;
    const sourceSelect = document.getElementById('tz-source-select') as HTMLSelectElement | null;
    const outputBadge = document.getElementById('tz-converted-output');
    const dateBtn = document.getElementById('tz-target-date-btn');
    const dateDisplay = document.getElementById('tz-date-display');

    const sessionStart = Date.now();
    let activeTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Stockholm';

    if (activeTzDisplay) {
        activeTzDisplay.textContent = activeTz;
    }

    // Target Date Anchor (Defaults to Today)
    const today = new Date();
    let targetYear = today.getFullYear();
    let targetMonth = today.getMonth() + 1; // 1-12
    let targetDay = today.getDate();

    // Target Moment in UTC Time
    let targetUtcTimestamp: number = Date.now();

    function updateDateBadgeUI(): void {
        if (!dateDisplay) return;
        const now = new Date();
        const isToday =
            targetYear === now.getFullYear() && targetMonth === now.getMonth() + 1 && targetDay === now.getDate();

        if (isToday) {
            dateDisplay.textContent = 'Today';
        } else {
            const tempDate = new Date(targetYear, targetMonth - 1, targetDay);
            const mShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(tempDate);
            dateDisplay.textContent = `${mShort} ${targetDay}`;
        }
    }

    updateDateBadgeUI();

    // Calendar Click Synchronization
    window.addEventListener('calendar-date-selected', ((
        e: CustomEvent<{ year: number; month: number; day: number }>
    ): void => {
        targetYear = e.detail.year;
        targetMonth = e.detail.month;
        targetDay = e.detail.day;
        updateDateBadgeUI();
        calculateConversion();
    }) as EventListener);

    // Reset Date to Today on click
    dateBtn?.addEventListener('click', (): void => {
        const now = new Date();
        targetYear = now.getFullYear();
        targetMonth = now.getMonth() + 1;
        targetDay = now.getDate();
        updateDateBadgeUI();
        calculateConversion();
    });

    // 1. Copy epoch
    epochBtn?.addEventListener('click', (): void => {
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

        setTimeout((): void => {
            badge.classList.add('fade-out');
            setTimeout((): void => {
                badge.remove();
            }, 200);
        }, 1200);
    });

    // 2. DST Calculation
    function calculateDstHorizon(tz: string): string {
        const now = new Date();
        const year = now.getFullYear();
        const jan = new Date(year, 0, 1);
        const jul = new Date(year, 6, 1);

        const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });

        const getOffset = (d: Date): number => {
            const parts = dtf.formatToParts(d);
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
        for (let i = 1; i <= 30; i++) {
            if (getOffset(probe) !== nowOff) {
                let backProbe = new Date(probe.getTime() - 6 * 86400000);
                for (let d = 0; d < 7; d++) {
                    if (getOffset(backProbe) !== nowOff) {
                        foundDate = backProbe;
                        break;
                    }
                    backProbe = new Date(backProbe.getTime() + 86400000);
                }
                break;
            }
            probe = new Date(probe.getTime() + 7 * 86400000);
        }

        if (!foundDate) return isDst ? 'DST Active' : 'Standard Time';
        const daysUntil = Math.ceil((foundDate.getTime() - now.getTime()) / 86400000);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateStr = `${monthNames[foundDate.getMonth()]} ${foundDate.getDate()}`;

        return isDst ? `Ends in ${daysUntil}d (${dateStr})` : `Starts in ${daysUntil}d (${dateStr})`;
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
        if (dstVal) dstVal.textContent = calculateDstHorizon(activeTz);
    }

    if (tzSelect) {
        tzSelect.innerHTML = TIMEZONES.map(t => `<option value="${t.zone}">${t.label}</option>`).join('');
        tzSelect.value = activeTz;
    }

    function closeTzModal(): void {
        if (tzModal) tzModal.style.display = 'none';
    }

    tzBtn?.addEventListener('click', (): void => {
        if (tzModal) {
            if (tzSelect) tzSelect.value = activeTz;
            tzModal.style.display = 'flex';
        }
    });

    tzCloseBtn?.addEventListener('click', closeTzModal);
    window.addEventListener('click', (e: MouseEvent): void => {
        if (e.target === tzModal) closeTzModal();
    });

    tzSaveBtn?.addEventListener('click', (): void => {
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
    // DYNAMIC CONVERTER: ANCHORED TIMEZONE TRANSLATION & 24H AUTO-SWITCH
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
    window.addEventListener('resize', (): void => {
        populateSourceSelect();
        updateDstDisplay();
    });

    hourInput.addEventListener('focus', (): void => {
        hourInput.select();
    });
    minInput.addEventListener('focus', (): void => {
        minInput.select();
    });

    function updateFormatModeUI(): void {
        if (!formatBtn || !hourInput) return;
        formatBtn.textContent = currentMode;
        if (currentMode === '24H') {
            hourInput.min = '0';
            hourInput.max = '23';
        } else {
            hourInput.min = '1';
            hourInput.max = '12';
        }
    }

    // Set initial hours based on the chosen source timezone
    const initialDateInSource = new Date(new Date().toLocaleString('en-US', { timeZone: sourceSelect.value }));
    let initialH = initialDateInSource.getHours();
    minInput.value = String(initialDateInSource.getMinutes()).padStart(2, '0');

    if (US_12H_ZONES.has(sourceSelect.value)) {
        currentMode = initialH >= 12 ? 'PM' : 'AM';
        initialH = initialH % 12 || 12;
    } else {
        currentMode = '24H';
    }
    hourInput.value = String(initialH).padStart(2, '0');
    updateFormatModeUI();

    // Re-synchronize input fields when the source timezone changes without shifting the target moment
    function syncInputsFromTargetTimestamp(zone: string): void {
        if (!hourInput || !minInput) return;
        const targetDate = new Date(targetUtcTimestamp);

        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: zone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });

        const parts = formatter.formatToParts(targetDate);
        let hVal = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
        const mVal = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
        if (hVal === 24) hVal = 0;

        const isUsZone = US_12H_ZONES.has(zone);
        if (isUsZone) {
            currentMode = hVal >= 12 ? 'PM' : 'AM';
            hVal = hVal % 12 || 12;
        } else {
            currentMode = '24H';
        }

        hourInput.value = String(hVal).padStart(2, '0');
        minInput.value = String(mVal).padStart(2, '0');
        updateFormatModeUI();
    }

    hourInput.addEventListener('input', (): void => {
        const raw = hourInput.value.replace(/\D/g, '');

        // 4-Digit Typing (e.g. "2200" or "0930")
        if (raw.length >= 3) {
            const hStr = raw.length === 4 ? raw.slice(0, 2) : raw.slice(0, 1);
            const mStr = raw.length === 4 ? raw.slice(2, 4) : raw.slice(1, 3);
            let hVal = parseInt(hStr, 10);
            let mVal = parseInt(mStr, 10);

            // Auto-switch to 24H if typing 13-23
            if (hVal > 12) {
                currentMode = '24H';
                updateFormatModeUI();
            }

            if (currentMode === '24H') {
                if (hVal > 23) hVal = 23;
            } else {
                if (hVal > 12) hVal = 12;
                if (hVal < 1) hVal = 1;
            }
            if (mVal > 59) mVal = 59;

            hourInput.value = String(hVal).padStart(2, '0');
            minInput.value = String(mVal).padStart(2, '0');
            minInput.focus();
            minInput.select();
            calculateConversion();
            return;
        }

        // 2-Digit Typing (e.g. "22")
        if (raw.length === 2) {
            let hVal = parseInt(raw, 10);

            // Auto-switch to 24H if typing 13-23
            if (hVal > 12) {
                currentMode = '24H';
                updateFormatModeUI();
            }

            if (currentMode === '24H') {
                if (hVal > 23) hVal = 23;
            } else {
                if (hVal > 12) hVal = 12;
            }

            hourInput.value = String(hVal).padStart(2, '0');
            minInput.focus();
            minInput.select();
        }

        calculateConversion();
    });

    minInput.addEventListener('input', (): void => {
        const val = parseInt(minInput.value, 10);
        if (!isNaN(val) && val > 59) minInput.value = '59';
        calculateConversion();
    });

    // When changing timezone dropdown: translate the input hours to the new zone while anchoring the local target time
    sourceSelect.addEventListener('change', (): void => {
        syncInputsFromTargetTimestamp(sourceSelect.value);
        calculateConversion(true);
    });

    formatBtn.addEventListener('click', (): void => {
        let h = parseInt(hourInput.value, 10);
        if (isNaN(h)) h = 12;

        if (currentMode === '24H') {
            currentMode = 'AM';
            h = h % 12 || 12;
        } else if (currentMode === 'AM') {
            currentMode = 'PM';
            h = h % 12 || 12;
        } else {
            currentMode = '24H';
            if (h < 12) h += 12;
        }

        hourInput.value = String(h).padStart(2, '0');
        updateFormatModeUI();
        calculateConversion();
    });

    function getOrdinal(n: number): string {
        const v = n % 100;
        if (v >= 11 && v <= 13) {
            return `${n}th`;
        }
        switch (n % 10) {
            case 1:
                return `${n}st`;
            case 2:
                return `${n}nd`;
            case 3:
                return `${n}rd`;
            default:
                return `${n}th`;
        }
    }

    function calculateConversion(isTzDropdownChange = false): void {
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

        // Calculate and anchor the UTC timestamp if the user entered numbers directly
        if (!isTzDropdownChange) {
            const calculatedDate = convertWallTimeToUTC(targetYear, targetMonth, targetDay, rawH, m, sourceZone);
            targetUtcTimestamp = calculatedDate.getTime();
        }

        const targetDate = new Date(targetUtcTimestamp);
        const now = new Date();

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

        const time24 = localFormatter24.format(targetDate);
        const time12 = localFormatter12.format(targetDate);

        const localMonthName = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: activeTz }).format(
            targetDate
        );
        const localDayNum = parseInt(
            new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: activeTz }).format(targetDate),
            10
        );
        const ordinalDate = `${localMonthName} ${getOrdinal(localDayNum)}`;

        // Dynamic Countdown Indicator
        const diffMs = targetDate.getTime() - now.getTime();
        const absDiff = Math.abs(diffMs);
        const totalMinutes = Math.floor(absDiff / 60000);
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;
        const remMins = totalMinutes % 60;

        let relativeText: string;
        if (absDiff < 60000) {
            relativeText = 'Right now';
        } else if (diffMs > 0) {
            if (days >= 2) {
                relativeText = `in ${days} days and ${remHours}h ${remMins}m`;
            } else if (days === 1) {
                relativeText = `Tomorrow · in ${remHours}h ${remMins}m`;
            } else {
                relativeText = remHours > 0 ? `Today · in ${remHours}h ${remMins}m` : `Today · in ${remMins}m`;
            }
        } else {
            if (days >= 2) {
                relativeText = `${days} days and ${remHours}h ago`;
            } else if (days === 1) {
                relativeText = `Yesterday · ${remHours}h ${remMins}m ago`;
            } else {
                relativeText = remHours > 0 ? `Today · ${remHours}h ago` : `Today · ${remMins}m ago`;
            }
        }

        outputBadge.innerHTML = `
            <div class="converter-result-box" style="flex-wrap: wrap; gap: 6px;">
                <span class="converter-result-label">Local:</span>
                <span class="converter-result-value">${time24}</span>
                <span class="converter-result-secondary">(${time12})</span>
                <span style="font-weight: 600; color: var(--text-primary); margin-left: 2px;">${ordinalDate}</span>
                <span class="pill-badge" style="background: var(--accent-brand-subtle); color: var(--accent-brand);">
                    ${relativeText}
                </span>
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
