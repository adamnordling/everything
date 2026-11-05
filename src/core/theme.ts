export function initTheme(): void {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }

    const toggleTheme = (): void => {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
    };

    document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('mobile-theme-btn')?.addEventListener('click', toggleTheme);
}
