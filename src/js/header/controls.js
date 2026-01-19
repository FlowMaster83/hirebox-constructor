// controls.js
import { createHeaderControls } from "./createHeaderControls.js";
import { LABELS } from "../constants/labels.js";

/**
 * Список поддерживаемых языков
 * Порядок = порядок переключения
 */
const LANGS = Object.keys(LABELS); // ["ua", "en", "ru"]
let currentLangIndex = 0;

/**
 * Обновляет подписи шкал без пересоздания DOM
 */
function updateScaleLabels() {
  const currentLang = LANGS[currentLangIndex];
  const labels = LABELS[currentLang];
  const nodes = document.querySelectorAll(".scale-label");

  nodes.forEach((el, index) => {
    el.textContent = labels[index];
  });
}

export function initHeaderControls() {
  const controls = createHeaderControls("header-controls-root");
  if (!controls) return;

  const { langBtn } = controls;

  /* -----------------------------
     LANGUAGE TOGGLE (ua → en → ru)
  ----------------------------- */

  if (!langBtn) return;

  langBtn.textContent = LANGS[currentLangIndex].toUpperCase();

  langBtn.addEventListener("click", () => {
    currentLangIndex = (currentLangIndex + 1) % LANGS.length;
    langBtn.textContent = LANGS[currentLangIndex].toUpperCase();

    updateScaleLabels();
  });
}