const LIGHT_THEME_CLASS = 'light-theme';
const DARK_THEME_CLASS = 'dark-theme';
const themeToggleButton = document.getElementById('theme-toggle');

function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains(DARK_THEME_CLASS) ? DARK_THEME_CLASS : LIGHT_THEME_CLASS;

  if (currentTheme === DARK_THEME_CLASS) {
    document.documentElement.classList.replace(DARK_THEME_CLASS, LIGHT_THEME_CLASS);
    localStorage.setItem('theme', LIGHT_THEME_CLASS);
  } else {
    document.documentElement.classList.replace(LIGHT_THEME_CLASS, DARK_THEME_CLASS);
    localStorage.setItem('theme', DARK_THEME_CLASS);
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || LIGHT_THEME_CLASS;
  document.documentElement.classList.add(savedTheme);
}

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', toggleTheme);
}

loadTheme();
