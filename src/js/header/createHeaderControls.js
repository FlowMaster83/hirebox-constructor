// header/createHeaderControls.js

const MIN = 1;
const MAX = 100;
const STEP = 1;

function normalizeValue(raw) {
  if (raw === "") return null;

  let value = Number(raw);

  if (Number.isNaN(value)) return null;
  if (value < MIN) return null;

  return Math.min(value, MAX);
}

function applyValueToAllScales(value) {
  document.querySelectorAll(".scale-row").forEach((row) => {
    const input = row.querySelector(".user-input");
    if (!input) return;

    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function clearAllScales() {
  document.querySelectorAll(".scale-row").forEach((row) => {
    const input = row.querySelector(".user-input");
    if (!input) return;

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

export function createHeaderControls(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return null;

  root.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "header-options";

  /* -----------------------------
     LABEL
  ----------------------------- */

  const label = document.createElement("p");
  label.className = "header-label";
  label.textContent = "Fill all:";

  /* -----------------------------
     INPUT (MASTER)
  ----------------------------- */

  const input = document.createElement("input");
  input.className = "user-input";
  input.type = "number";
  input.inputMode = "numeric";
  input.placeholder = "0";
  input.autocomplete = "off";

  /* -----------------------------
     BUTTONS
  ----------------------------- */

  const fillBtn = document.createElement("button");
  fillBtn.className = "fill-btn";
  fillBtn.type = "button";
  fillBtn.disabled = true;
  fillBtn.textContent = "FILL ALL";

  const clearBtn = document.createElement("button");
  clearBtn.className = "clear-all-btn";
  clearBtn.type = "button";
  clearBtn.textContent = "CLEAR ALL";

  const resultBtn = document.createElement("button");
  resultBtn.className = "header-result-btn";
  resultBtn.type = "button";
  resultBtn.textContent = "RESULT";
  resultBtn.dataset.openModal = "true";

  /* -----------------------------
     LANGUAGE TOGGLE
  ----------------------------- */

  const langBtn = document.createElement("button");
  langBtn.className = "lang-toggle-btn";
  langBtn.type = "button";
  langBtn.textContent = "UA";

  /* -----------------------------
     INPUT LOGIC
  ----------------------------- */

  function updateFillState(value) {
    fillBtn.disabled = value === null;
  }

  input.addEventListener("input", () => {
    const value = normalizeValue(input.value);

    if (value === null) {
      input.value = "";
      updateFillState(null);
      return;
    }

    input.value = value;
    updateFillState(value);
  });

  input.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const current = normalizeValue(input.value) ?? 0;
      const delta = e.deltaY < 0 ? STEP : -STEP;
      const next = normalizeValue(current + delta);

      if (next === null) {
        input.value = "";
        updateFillState(null);
        return;
      }

      input.value = next;
      updateFillState(next);

      applyValueToAllScales(next);
    },
    { passive: false }
  );

  /* -----------------------------
     FILL BUTTON
  ----------------------------- */

  fillBtn.addEventListener("click", () => {
    const value = normalizeValue(input.value);
    if (value === null) return;

    applyValueToAllScales(value);
  });

  /* -----------------------------
     CLEAR ALL BUTTON
  ----------------------------- */

  clearBtn.addEventListener("click", () => {
    clearAllScales();

    input.value = "";
    updateFillState(null);
  });

  /* -----------------------------
     APPEND
  ----------------------------- */

  wrapper.append(label, input, fillBtn, clearBtn, resultBtn, langBtn);

  root.appendChild(wrapper);

  return {
    input,
    fillBtn,
    clearBtn,
    resultBtn,
    langBtn,
  };
}
