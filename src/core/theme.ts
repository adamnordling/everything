export function initTheme(): void {
    const desktopBtn = document.getElementById('theme-btn');
    const mobileBtn = document.getElementById('mobile-theme-btn');

    const toggleTheme = (): void => {
        document.documentElement.classList.toggle('dark-theme');
    };

    desktopBtn?.addEventListener('click', toggleTheme);
    mobileBtn?.addEventListener('click', toggleTheme);
}
