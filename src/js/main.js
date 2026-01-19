// main.js
import { initScales } from "./scales/initScales.js";
import { initHeaderControls } from "./header/controls.js";
import "./modal/modal.js";
import { initTheme } from "./theme/dark.js";
import { createThemeToggleButton } from "./theme/themeButton.js";

document.addEventListener("DOMContentLoaded", () => {
  initScales();
  initHeaderControls();
});

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  const header = document.querySelector("header");
  createThemeToggleButton(header);
});

if (window.matchMedia("(min-width: 641px)").matches) {
  import("./modal/modal.js");
}