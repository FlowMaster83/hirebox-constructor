import { toggleTheme, getTheme } from "./dark.js";

export function createThemeToggleButton(container = document.body) {
  const button = document.createElement("button");

  button.type = "button";
  button.setAttribute("aria-label", "Toggle theme");
  button.dataset.toggleTheme = "";

  updateButtonLabel(button);

  button.addEventListener("click", () => {
    toggleTheme();
    updateButtonLabel(button);
  });

  container.appendChild(button);
}

function updateButtonLabel(button) {
  const isDark = getTheme() === "dark";
  button.textContent = isDark ? "☀️" : "🌙";
}
