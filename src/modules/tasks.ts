// =============================================================================
// DEADLINES, DAILY TASKS & HABIT ROUTINE ENGINE
// =============================================================================

export interface Deadline {
    id: string;
    title: string;
    dueDate: string; // YYYY-MM-DD
}

export interface DailyTask {
    id: string;
    title: string;
    isDone: boolean;
}

export interface RoutineHabit {
    id: string;
    title: string;
    history: Record<string, boolean>; // 'YYYY-MM-DD': true/false
}

const SVG = {
    grip: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="7 9 12 4 17 9"></polyline><polyline points="7 15 12 20 17 15"></polyline></svg>`,
    edit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
    delete: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

export function initTasks(onDataChanged?: () => void): { setDeadlineDate: (dateStr: string) => void } {
    // 1. DEADLINES
    const dForm = document.getElementById('deadline-form') as HTMLFormElement | null;
    const dTitle = document.getElementById('deadline-input-title') as HTMLInputElement | null;
    const dDate = document.getElementById('deadline-input-date') as HTMLInputElement | null;
    const dStream = document.getElementById('deadlines-stream');
    const dEmpty = document.getElementById('deadlines-empty');

    let deadlines: Deadline[] = [];
    const savedDeadlines = localStorage.getItem('everything_deadlines_v2');
    if (savedDeadlines) {
        try { deadlines = JSON.parse(savedDeadlines) as Deadline[]; } catch { deadlines = []; }
    }

    function renderDeadlines(): void {
        if (!dStream || !dEmpty) return;
        dStream.querySelectorAll('.deadline-row').forEach(el => { el.remove(); });

        if (deadlines.length === 0) {
            dEmpty.style.display = 'block';
            return;
        }

        dEmpty.style.display = 'none';
        deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        deadlines.forEach(item => {
            const row = document.createElement('div');
            row.className = 'deadline-row';

            const daysLeft = Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / 86400000);
            const badgeText = daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due Today' : `${daysLeft}d left`;

            row.innerHTML = `
                <div>
                    <span style="font-weight:600;">${item.title}</span>
                    <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-left:8px;">(${item.dueDate} · ${badgeText})</span>
                </div>
                <button type="button" class="icon-action-btn btn-delete" aria-label="Delete deadline">${SVG.delete}</button>
            `;

            row.querySelector('.btn-delete')?.addEventListener('click', () => {
                deadlines = deadlines.filter(d => d.id !== item.id);
                localStorage.setItem('everything_deadlines_v2', JSON.stringify(deadlines));
                renderDeadlines();
                if (onDataChanged) onDataChanged();
            });

            dStream.appendChild(row);
        });
    }

    dForm?.addEventListener('submit', e => {
        e.preventDefault();
        if (!dTitle?.value || !dDate?.value) return;
        deadlines.push({
            id: crypto.randomUUID(),
            title: dTitle.value.trim(),
            dueDate: dDate.value
        });
        localStorage.setItem('everything_deadlines_v2', JSON.stringify(deadlines));
        renderDeadlines();
        if (onDataChanged) onDataChanged();
        dTitle.value = '';
    });

    renderDeadlines();

    // 2. DAILY TASKS
    const tForm = document.getElementById('daily-task-form') as HTMLFormElement | null;
    const tInput = document.getElementById('daily-task-input') as HTMLInputElement | null;
    const tStream = document.getElementById('daily-task-stream');

    let dailyTasks: DailyTask[] = [];
    const savedTasks = localStorage.getItem('everything_tasks_v2');
    if (savedTasks) {
        try { dailyTasks = JSON.parse(savedTasks) as DailyTask[]; } catch { dailyTasks = []; }
    } else {
        dailyTasks = [
            { id: '1', title: 'Clean workstation & archive semester repos', isDone: false },
            { id: '2', title: 'Compile CV LaTeX build pipeline', isDone: false },
            { id: '3', title: 'Sync arXiv & DiVA portal publications', isDone: true }
        ];
    }

    function renderTasks(): void {
        if (!tStream) return;
        tStream.innerHTML = '';

        dailyTasks.forEach(task => {
            const row = document.createElement('div');
            row.className = `task-card-row ${task.isDone ? 'is-done' : ''}`;

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'task-check-custom';
            check.checked = task.isDone;

            check.addEventListener('change', () => {
                task.isDone = check.checked;
                localStorage.setItem('everything_tasks_v2', JSON.stringify(dailyTasks));
                renderTasks();
            });

            const span = document.createElement('span');
            span.className = 'task-label';
            span.style.flex = '1';
            span.style.fontSize = '0.88rem';
            span.textContent = task.title;

            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'icon-action-btn btn-delete';
            del.innerHTML = SVG.delete;

            del.addEventListener('click', () => {
                dailyTasks = dailyTasks.filter(t => t.id !== task.id);
                localStorage.setItem('everything_tasks_v2', JSON.stringify(dailyTasks));
                renderTasks();
            });

            row.appendChild(check);
            row.appendChild(span);
            row.appendChild(del);
            tStream.appendChild(row);
        });
    }

    tForm?.addEventListener('submit', e => {
        e.preventDefault();
        if (!tInput?.value) return;
        dailyTasks.push({
            id: crypto.randomUUID(),
            title: tInput.value.trim(),
            isDone: false
        });
        localStorage.setItem('everything_tasks_v2', JSON.stringify(dailyTasks));
        renderTasks();
        tInput.value = '';
    });

    renderTasks();

    // 3. MORNING ROUTINES (WITH ADD CAPABILITY)
    const habitForm = document.getElementById('habit-add-form') as HTMLFormElement | null;
    const habitInput = document.getElementById('habit-add-input') as HTMLInputElement | null;
    const hStream = document.getElementById('habits-stream');

    let habits: RoutineHabit[] = [];
    const savedHabits = localStorage.getItem('everything_habits_v2');
    if (savedHabits) {
        try { habits = JSON.parse(savedHabits) as RoutineHabit[]; } catch { habits = []; }
    } else {
        habits = [
            { id: 'h1', title: 'Wim Hof respiration + core vacuum + fascia routine', history: {} },
            { id: 'h2', title: '10 diaphragmatic vacuums', history: {} },
            { id: 'h3', title: 'Awaken at solar dawn + workstation boot', history: {} }
        ];
    }

    function renderHabits(): void {
        if (!hStream) return;
        hStream.innerHTML = '';

        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Compute keys for past 3 days (e.g. Thu 24, Wed 23, Tue 22)
        const pastDays = [1, 2, 3].map(offset => {
            const d = new Date(now.getTime() - offset * 86400000);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return { key, label: `${days[d.getDay()]} ${d.getDate()}` };
        });

        const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        habits.forEach(habit => {
            const card = document.createElement('div');
            card.className = 'habit-item-card';

            const topRow = document.createElement('div');
            topRow.className = 'habit-top-row';

            const grip = document.createElement('span');
            grip.className = 'habit-drag-grip';
            grip.innerHTML = SVG.grip;

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'task-check-custom';
            check.checked = habit.history[todayKey] ?? false;

            check.addEventListener('change', () => {
                habit.history[todayKey] = check.checked;
                localStorage.setItem('everything_habits_v2', JSON.stringify(habits));
            });

            const title = document.createElement('span');
            title.style.flex = '1';
            title.style.fontSize = '0.88rem';
            title.textContent = habit.title;

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'icon-action-btn';
            editBtn.innerHTML = SVG.edit;
            editBtn.addEventListener('click', () => {
                const next = prompt('Edit routine title:', habit.title);
                if (next && next.trim()) {
                    habit.title = next.trim();
                    localStorage.setItem('everything_habits_v2', JSON.stringify(habits));
                    renderHabits();
                }
            });

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'icon-action-btn btn-delete';
            delBtn.innerHTML = SVG.delete;
            delBtn.addEventListener('click', () => {
                habits = habits.filter(h => h.id !== habit.id);
                localStorage.setItem('everything_habits_v2', JSON.stringify(habits));
                renderHabits();
            });

            topRow.appendChild(grip);
            topRow.appendChild(check);
            topRow.appendChild(title);
            topRow.appendChild(editBtn);
            topRow.appendChild(delBtn);

            const badgesRow = document.createElement('div');
            badgesRow.className = 'habit-past-tags';

            pastDays.forEach(day => {
                const isDone = habit.history[day.key] ?? false;
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = `history-badge ${isDone ? 'done' : 'missed'}`;
                pill.textContent = `${isDone ? '✓' : '✕'} ${day.label}`;

                pill.addEventListener('click', () => {
                    habit.history[day.key] = !isDone;
                    localStorage.setItem('everything_habits_v2', JSON.stringify(habits));
                    renderHabits();
                });

                badgesRow.appendChild(pill);
            });

            card.appendChild(topRow);
            card.appendChild(badgesRow);
            hStream.appendChild(card);
        });
    }

    habitForm?.addEventListener('submit', e => {
        e.preventDefault();
        if (!habitInput?.value) return;
        habits.push({
            id: crypto.randomUUID(),
            title: habitInput.value.trim(),
            history: {}
        });
        localStorage.setItem('everything_habits_v2', JSON.stringify(habits));
        renderHabits();
        habitInput.value = '';
    });

    renderHabits();

    return {
        setDeadlineDate(dateStr: string): void {
            if (dDate) dDate.value = dateStr;
            dTitle?.focus();
        }
    };
}