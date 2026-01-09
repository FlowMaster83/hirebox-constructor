const THEME_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";

/**
 * Устанавливает тему
 */
export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Возвращает текущую тему
 */
export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || LIGHT;
}

/**
 * Переключает тему
 */
export function toggleTheme() {
  const currentTheme = getTheme();
  const nextTheme = currentTheme === DARK ? LIGHT : DARK;
  setTheme(nextTheme);
}

/**
 * Инициализация темы при старте
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? DARK : LIGHT);
}
