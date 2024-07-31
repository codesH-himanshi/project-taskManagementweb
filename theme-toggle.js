document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-stylesheet');
    const themeImage = document.getElementById('theme-image');

    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || !savedTheme;

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeStylesheet.href = 'dark-theme.css';
        themeImage.src = 'github-mark-white.png';
        themeToggleButton.textContent = 'Light';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeStylesheet.href = 'light-theme.css';
        themeImage.src = 'github-mark.png';
        themeToggleButton.textContent = 'Dark';
    }

    themeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            themeStylesheet.href = 'light-theme.css';
            themeImage.src = 'github-mark.png';
            themeToggleButton.textContent = 'Dark';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-mode');
            themeStylesheet.href = 'dark-theme.css';
            themeImage.src = 'github-mark-white.png';
            themeToggleButton.textContent = 'Light';
            localStorage.setItem('theme', 'dark');
        }
    });
});
