document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-stylesheet');
    const themeImage = document.getElementById('theme-image');
    const body = document.body;

    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = savedTheme ? savedTheme === 'dark' : systemPrefersDark;

    // Apply the initial theme
    applyTheme(isDarkMode);

    // Toggle theme on button click
    themeToggleButton.addEventListener('click', () => {
        const isCurrentlyDark = body.classList.contains('dark-mode');
        applyTheme(!isCurrentlyDark);
    });

    // Watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });

    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            themeStylesheet.href = 'dark-theme.css';
            if (themeImage) themeImage.src = 'github-mark-white.png';
            themeToggleButton.textContent = 'Light';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            themeStylesheet.href = 'light-theme.css';
            if (themeImage) themeImage.src = 'github-mark.png';
            themeToggleButton.textContent = 'Dark';
            localStorage.setItem('theme', 'light');
        }
        
        // Dispatch event for other components to react to theme changes
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDarkMode: isDark } }));
    }
});