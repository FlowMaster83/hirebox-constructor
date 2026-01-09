// header/controls.js
import { createHeaderControls } from "./createHeaderControls.js";
import { LABELS } from "../constants/labels.js";

/**
 * Список поддерживаемых языков
 * Порядок = порядок переключения
 */
const LANGS = Object.keys(LABELS); // ["ua", "en", "ru"]

let currentLangIndex = 0; // стартовый язык: ua

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

  const { select, fillBtn, clearBtn, langBtn } = controls;

  /* -----------------------------
     FILL BUTTON LOGIC
  ----------------------------- */

  const updateFillButtonState = () => {
    fillBtn.disabled = !select.value || Number(select.value) < 1;
  };

  select.addEventListener("change", updateFillButtonState);
  updateFillButtonState();

  fillBtn.addEventListener("click", () => {
    const value = Number(select.value);
    if (!value) return;

    document.querySelectorAll(".scale-row").forEach((row) => {
      const input = row.querySelector(".user-input");
      if (!input) return;

      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));
    });
  });

  /* -----------------------------
     CLEAR BUTTON LOGIC
  ----------------------------- */

  clearBtn.addEventListener("click", () => {
    document
      .querySelectorAll(".scale-row .clear-btn")
      .forEach((btn) => btn.click());

    select.value = "";
    updateFillButtonState();
  });

  /* -----------------------------
     LANGUAGE TOGGLE (ua → en → ru)
  ----------------------------- */

  if (langBtn) {
    langBtn.textContent = LANGS[currentLangIndex].toUpperCase();

    langBtn.addEventListener("click", () => {
      currentLangIndex = (currentLangIndex + 1) % LANGS.length;
      langBtn.textContent = LANGS[currentLangIndex].toUpperCase();

      updateScaleLabels();
    });
  }
}
