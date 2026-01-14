import { createThemeToggleButton } from "../theme/themeButton.js";
import { resetAllScales } from "../state/scaleRegistry.js";

const MAX = 100;
const STEP = 1;
const isMobile = window.matchMedia("(max-width: 640px)").matches;

/* -----------------------------
   NORMALIZE VALUE
----------------------------- */

function normalizeValue(raw) {
  if (raw === "") return null;

  const value = Number(raw);
  if (Number.isNaN(value)) return null;

  if (value <= 0) return 0;
  return Math.min(value, MAX);
}

/* -----------------------------
   APPLY TO ALL SCALES
----------------------------- */

function applyValueToAllScales(value) {
  document.querySelectorAll(".scale-row").forEach((row) => {
    const input = row.querySelector(".user-input");
    if (!input) return;

    input.value = value === 0 ? "" : value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

/* =========================================================
   CREATE HEADER CONTROLS
========================================================= */

export function createHeaderControls(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return null;

  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "header-options";

  /* LABEL */

  const label = document.createElement("p");
  label.className = "header-label";
  label.textContent = "Fill all:";

  /* MASTER INPUT */

  const input = document.createElement("input");
  input.className = "user-input";
  input.type = "number";
  input.inputMode = "numeric";
  input.placeholder = "0";

  /* RESULT BUTTON (DESKTOP ONLY) */

  let resultBtn = null;

  if (!isMobile) {
    resultBtn = document.createElement("button");
    resultBtn.className = "header-result-btn";
    resultBtn.type = "button";
    resultBtn.textContent = "RESULT";
    resultBtn.dataset.openModal = "true";
  }

  /* CLEAR ALL */

  const clearBtn = document.createElement("button");
  clearBtn.className = "clear-all-btn";
  clearBtn.type = "button";
  clearBtn.textContent = "CLEAR ALL";

  /* LANGUAGE */

  const langBtn = document.createElement("button");
  langBtn.className = "lang-toggle-btn button";
  langBtn.type = "button";
  langBtn.textContent = "UA";

  /* THEME */

  const themeContainer = document.createElement("div");
  themeContainer.className = "theme-toggle";
  createThemeToggleButton(themeContainer);

  /* INPUT HANDLERS */

  input.addEventListener("input", () => {
    const value = normalizeValue(input.value);

    if (value === null || value === 0) {
      input.value = "";
      applyValueToAllScales(0);
      return;
    }

    input.value = value;
    applyValueToAllScales(value);
  });

  input.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const current = normalizeValue(input.value) ?? 0;
      const delta = e.deltaY < 0 ? STEP : -STEP;
      const next = normalizeValue(current + delta);

      if (next === 0) {
        input.value = "";
        applyValueToAllScales(0);
        return;
      }

      input.value = next;
      applyValueToAllScales(next);
    },
    { passive: false }
  );

  /* CLEAR ALL */

  clearBtn.addEventListener("click", () => {
    resetAllScales();
    input.value = "";
  });

  /* APPEND */

  wrapper.append(
    label,
    input,
    ...(resultBtn ? [resultBtn] : []),
    clearBtn,
    langBtn,
    themeContainer
  );

  root.appendChild(wrapper);

  return {
    input,
    clearBtn,
    resultBtn,
    langBtn,
  };
}
