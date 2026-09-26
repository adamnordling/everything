// =============================================================================
// COMPACT CALENDAR WITH DEADLINE NOTIFICATIONS & RED-DAY ENGINE
// =============================================================================

export interface HolidayInfo {
    isRedDay: boolean;
    name: string;
    namedays: string;
}

const HOLIDAYS_DB: Record<string, HolidayInfo> = {
    '01-01': { isRedDay: true, name: "New Year's Day", namedays: 'Nyårsdagen' },
    '01-06': { isRedDay: true, name: 'Epiphany', namedays: 'Kasper, Melker, Baltsar' },
    '05-01': { isRedDay: true, name: 'Labour Day', namedays: 'Valborg' },
    '06-06': { isRedDay: true, name: 'National Day', namedays: 'Gustav, Gösta' },
    '06-19': { isRedDay: true, name: 'Midsummer Eve', namedays: 'Germund, Görel' },
    '06-20': { isRedDay: true, name: 'Midsummer Day', namedays: 'Florentin' },
    '09-25': { isRedDay: false, name: 'Autumn Equinox Milestone', namedays: 'Einar, Enar' },
    '10-31': { isRedDay: true, name: "All Saints' Eve", namedays: 'Artur' },
    '12-24': { isRedDay: true, name: 'Christmas Eve', namedays: 'Eva' },
    '12-25': { isRedDay: true, name: 'Christmas Day', namedays: 'Juldagen' },
    '12-26': { isRedDay: true, name: 'Boxing Day', namedays: 'Stefan, Staffan' },
    '12-31': { isRedDay: true, name: "New Year's Eve", namedays: 'Sylvester' }
};

export function getDayInfo(d: Date): HolidayInfo {
    const key = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const entry = HOLIDAYS_DB[key];
    const isSunday = d.getDay() === 0;

    if (entry) {
        return {
            isRedDay: entry.isRedDay || isSunday,
            name: entry.name,
            namedays: entry.namedays
        };
    }

    return {
        isRedDay: isSunday,
        name: isSunday ? 'Sunday Rest Day' : 'Working Day',
        namedays: 'Daily Focus'
    };
}

export function initCalendar(onSelectDate: (dateStr: string, activeDeadlines: string[]) => void): () => void {
    const grid = document.getElementById('cal-days-grid');
    const headerTitle = document.getElementById('cal-header-title');
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    const selectedLabel = document.getElementById('cal-selected-label');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const viewDate = new Date();
    let selectedDate = new Date();

    function render(): void {
        if (!grid || !headerTitle) return;
        grid.innerHTML = '';

        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        headerTitle.textContent = `${months[m]} ${y}`;

        // Get saved deadlines from localStorage to show deadline dot badges
        let deadlineMap: Record<string, string[]> = {};
        const saved = localStorage.getItem('everything_deadlines_v2');
        if (saved) {
            try {
                const list = JSON.parse(saved) as Array<{ title: string; dueDate: string }>;
                list.forEach(item => {
                    deadlineMap[item.dueDate] = deadlineMap[item.dueDate] || [];
                    deadlineMap[item.dueDate]?.push(item.title);
                });
            } catch {
                deadlineMap = {};
            }
        }

        const firstDayIdx = (new Date(y, m, 1).getDay() + 6) % 7;
        const daysInCurrent = new Date(y, m + 1, 0).getDate();
        const daysInPrev = new Date(y, m, 0).getDate();

        // Prev month filler days
        for (let i = firstDayIdx; i > 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell outside-month';
            cell.textContent = String(daysInPrev - i + 1);
            grid.appendChild(cell);
        }

        // Current month days
        for (let i = 1; i <= daysInCurrent; i++) {
            const cell = document.createElement('div');
            cell.className = 'cal-cell';
            cell.textContent = String(i);

            const thisDate = new Date(y, m, i);
            const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const intel = getDayInfo(thisDate);

            if (intel.isRedDay) {
                cell.classList.add('red-day');
            }

            // Amber indicator dot on calendar cell for dates with deadlines
            const dayDeadlines = deadlineMap[dateStr] || [];
            if (dayDeadlines.length > 0) {
                cell.classList.add('has-deadline');
                cell.title = `Deadlines: ${dayDeadlines.join(', ')}`;
            }

            // Image 2 Compact Mint Pill Active Selection
            if (
                selectedDate.getDate() === i &&
                selectedDate.getMonth() === m &&
                selectedDate.getFullYear() === y
            ) {
                cell.classList.add('active-day');
            }

            cell.addEventListener('click', () => {
                selectedDate = new Date(y, m, i);
                render();
                if (selectedLabel) {
                    selectedLabel.textContent = `${monthsShort[m]} ${i}, ${y}`;
                }
                // Automatically updates deadline date input & intelligence card
                onSelectDate(dateStr, dayDeadlines);
            });

            grid.appendChild(cell);
        }

        if (selectedLabel) {
            selectedLabel.textContent = `${monthsShort[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        }
    }

    prevBtn?.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        render();
    });

    nextBtn?.addEventListener('click', () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        render();
    });

    render();
    return render;
}