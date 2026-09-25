// 1. Data Schema
interface TodoTask {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number; // Unix timestamp
    columnDateStr: string; // YYYY-MM-DD
}

// 2. State
const state = {
    currentDate: new Date(),
    calendarViewDate: new Date(),
    tasks: [] as TodoTask[]
};

// 3. Storage Persistence
const STORAGE_KEY_TASKS = 'everything_tasks_v1';
const STORAGE_KEY_THEME = 'app_theme';

function loadTasks(): void {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (raw) {
        try {
            state.tasks = JSON.parse(raw) as TodoTask[];
        } catch {
            state.tasks = [];
        }
    }
}

function saveTasks(): void {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(state.tasks));
}

// Helper: Format Date YYYY-MM-DD
function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// 4. Live Clock & ISO Week Telemetry
function initClockAndCalendar(): void {
    const timeDisplay = document.getElementById('time-display');
    const weekDisplay = document.getElementById('week-display');

    function getISOWeek(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    }

    function update(): void {
        const now = new Date();
        if (timeDisplay) {
            timeDisplay.textContent = now.toTimeString().split(' ')[0];
        }
        if (weekDisplay) {
            weekDisplay.textContent = `Week ${getISOWeek(now)} · ${now.getFullYear()}`;
        }
    }

    update();
    setInterval(update, 1000);
}

// 5. Open-Meteo Accurate Keyless Weather Fetch
async function initWeather(): Promise<void> {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;

    // Default coordinates: Stockholm, Sweden (fallback)
    let lat = 59.3293;
    let lon = 18.0686;
    let locName = 'Stockholm';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
                locName = 'Local';
                void fetchForecast(lat, lon, locName);
            },
            () => {
                void fetchForecast(lat, lon, locName);
            },
            { timeout: 4000 }
        );
    } else {
        void fetchForecast(lat, lon, locName);
    }

    async function fetchForecast(latitude: number, longitude: number, label: string): Promise<void> {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&wind_speed_unit=ms`
            );
            if (!res.ok) throw new Error();
            const data = (await res.json()) as { current: { temperature_2m: number; weather_code: number } };
            const temp = Math.round(data.current.temperature_2m);
            const condition = interpretWeatherCode(data.current.weather_code);
            weatherDisplay.textContent = `${temp}°C ${condition} (${label})`;
        } catch {
            weatherDisplay.textContent = 'Weather unavailable';
        }
    }

    function interpretWeatherCode(code: number): string {
        if (code === 0) return '☀️ Clear';
        if (code <= 3) return '⛅ Partly Cloudy';
        if (code <= 48) return '🌫️ Fog';
        if (code <= 67) return '🌧️ Rain';
        if (code <= 77) return '❄️ Snow';
        return '⛈️ Thunderstorm';
    }
}

// 6. Interactive Month Calendar
function renderCalendar(): void {
    const grid = document.getElementById('calendar-days-grid');
    const headerTitle = document.getElementById('calendar-month-year');
    if (!grid || !headerTitle) return;

    grid.innerHTML = '';
    const viewYear = state.calendarViewDate.getFullYear();
    const viewMonth = state.calendarViewDate.getMonth();

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    headerTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;

    // First day of month
    const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // Previous month filler days
    for (let i = firstDayIndex; i > 0; i--) {
        const d = document.createElement('div');
        d.className = 'cal-day other-month';
        d.textContent = String(daysInPrevMonth - i + 1);
        grid.appendChild(d);
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const d = document.createElement('div');
        d.className = 'cal-day';
        d.textContent = String(i);

        if (
            today.getDate() === i &&
            today.getMonth() === viewMonth &&
            today.getFullYear() === viewYear
        ) {
            d.classList.add('today');
        }
        grid.appendChild(d);
    }
}

// 7. 3-Day Rolling To-Do Streams (Today, Yesterday, 2 Days Ago)
function renderTodoStreams(): void {
    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate.getTime() - 86400000);
    const twoDaysAgoDate = new Date(todayDate.getTime() - 86400000 * 2);

    const dateKeys = {
        today: toDateStr(todayDate),
        yesterday: toDateStr(yesterdayDate),
        twoDaysAgo: toDateStr(twoDaysAgoDate)
    };

    const lists = {
        today: document.getElementById('list-today'),
        yesterday: document.getElementById('list-yesterday'),
        twoDaysAgo: document.getElementById('list-twoDaysAgo')
    };

    const counts = {
        today: document.getElementById('count-today'),
        yesterday: document.getElementById('count-yesterday'),
        twoDaysAgo: document.getElementById('count-twoDaysAgo')
    };

    // Clear UI
    Object.values(lists).forEach(el => {
        if (el) el.innerHTML = '';
    });

    const countsMap = { today: 0, yesterday: 0, twoDaysAgo: 0 };

    state.tasks.forEach(task => {
        let streamKey: 'today' | 'yesterday' | 'twoDaysAgo' | null = null;
        if (task.columnDateStr === dateKeys.today) streamKey = 'today';
        else if (task.columnDateStr === dateKeys.yesterday) streamKey = 'yesterday';
        else if (task.columnDateStr === dateKeys.twoDaysAgo) streamKey = 'twoDaysAgo';

        if (streamKey && lists[streamKey]) {
            countsMap[streamKey]++;
            const item = createTodoElement(task);
            lists[streamKey]?.appendChild(item);
        }
    });

    if (counts.today) counts.today.textContent = String(countsMap.today);
    if (counts.yesterday) counts.yesterday.textContent = String(countsMap.yesterday);
    if (counts.twoDaysAgo) counts.twoDaysAgo.textContent = String(countsMap.twoDaysAgo);
}

function createTodoElement(task: TodoTask): HTMLElement {
    const el = document.createElement('div');
    el.className = `todo-item ${task.completed ? 'completed' : ''}`;
    el.draggable = true;
    el.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTodoStreams();
    });

    const span = document.createElement('span');
    span.textContent = task.text;

    const time = document.createElement('span');
    time.className = 'todo-time';
    const taskDate = new Date(task.createdAt);
    time.textContent = `${String(taskDate.getHours()).padStart(2, '0')}:${String(taskDate.getMinutes()).padStart(2, '0')}`;

    const delBtn = document.createElement('button');
    delBtn.className = 'todo-del-btn';
    delBtn.innerHTML = '✕';
    delBtn.ariaLabel = 'Delete task';
    delBtn.addEventListener('click', () => {
        state.tasks = state.tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTodoStreams();
    });

    // Native Drag and Drop
    el.addEventListener('dragstart', e => {
        e.dataTransfer?.setData('text/plain', task.id);
    });

    el.appendChild(checkbox);
    el.appendChild(span);
    el.appendChild(time);
    el.appendChild(delBtn);
    return el;
}

function initTodoInteractions(): void {
    const form = document.getElementById('todo-form') as HTMLFormElement | null;
    const input = document.getElementById('todo-input') as HTMLInputElement | null;

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = input?.value.trim();
        if (!text) return;

        const newTask: TodoTask = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now(),
            columnDateStr: toDateStr(new Date())
        };

        state.tasks.unshift(newTask);
        saveTasks();
        renderTodoStreams();
        if (input) input.value = '';
    });

    // Drag-over column drop listeners
    document.querySelectorAll<HTMLElement>('.todo-column').forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault();
        });
        col.addEventListener('drop', e => {
            e.preventDefault();
            const taskId = e.dataTransfer?.getData('text/plain');
            const targetDay = col.dataset.day as 'today' | 'yesterday' | 'twoDaysAgo' | undefined;
            if (!taskId || !targetDay) return;

            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                const targetDate = new Date();
                if (targetDay === 'yesterday') targetDate.setDate(targetDate.getDate() - 1);
                if (targetDay === 'twoDaysAgo') targetDate.setDate(targetDate.getDate() - 2);
                task.columnDateStr = toDateStr(targetDate);
                saveTasks();
                renderTodoStreams();
            }
        });
    });
}

// 8. Navigation & Theme Toggle
function initNavigation(): void {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn?.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-theme');
        localStorage.setItem(STORAGE_KEY_THEME, isLight ? 'light' : 'dark');
    });

    // Calendar month switchers
    document.getElementById('cal-prev')?.addEventListener('click', () => {
        state.calendarViewDate.setMonth(state.calendarViewDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
        state.calendarViewDate.setMonth(state.calendarViewDate.getMonth() + 1);
        renderCalendar();
    });
    document.getElementById('cal-today')?.addEventListener('click', () => {
        state.calendarViewDate = new Date();
        renderCalendar();
    });

    // Tool Switcher / Router
    document.querySelectorAll<HTMLElement>('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const viewKey = btn.dataset.view;
            const dashboardPanel = document.getElementById('view-dashboard');
            const toolStagePanel = document.getElementById('view-tool-stage');
            const toolStageContent = document.getElementById('tool-stage-content');

            if (viewKey === 'dashboard') {
                dashboardPanel?.classList.add('active');
                toolStagePanel?.classList.remove('active');
            } else {
                dashboardPanel?.classList.remove('active');
                toolStagePanel?.classList.add('active');
                if (toolStageContent) {
                    toolStageContent.innerHTML = `
                        <div class="card-header">
                            <h2 class="card-title">${btn.textContent?.trim()}</h2>
                            <span class="badge">Tool Ready</span>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">
                            Module container mounted. Ready for dynamic import: <code>src/tools/${viewKey}</code>.
                        </p>
                    `;
                }
            }
        });
    });
}

// 9. Boot Lifecycle
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    initClockAndCalendar();
    void initWeather();
    renderCalendar();
    renderTodoStreams();
    initTodoInteractions();
    initNavigation();
});