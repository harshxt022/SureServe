// public/js/theme.js

// Function to toggle dark mode
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
}

// Function to update the icons based on the current theme
function updateThemeIcons(isDark) {
    const themeToggles = document.querySelectorAll('.theme-toggle-icon');
    themeToggles.forEach(icon => {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.addEventListener("DOMContentLoaded", () => updateThemeIcons(true));
} else {
    document.documentElement.classList.remove('dark');
    document.addEventListener("DOMContentLoaded", () => updateThemeIcons(false));
}
