import { initScales } from "./scales/initScales.js";
import { initHeaderControls } from "./header/controls.js";

document.addEventListener("DOMContentLoaded", () => {
  initScales();
  initHeaderControls();
});
