export function applyInitialTheme(): void {
    const savedTheme = localStorage.getItem('app_theme');
    const isDarkInitial = savedTheme !== 'light';
    document.documentElement.classList.toggle('dark-theme', isDarkInitial);
}

export function initTheme(): void {
    applyInitialTheme();

    const toggleTheme = (): void => {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
    };

    document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('sidebar-theme-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('mobile-theme-btn')?.addEventListener('click', toggleTheme);
}
