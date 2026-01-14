// createScaleRow.js
import { createMarker } from "../components/markers.js";
import { registerScale } from "../state/scaleRegistry.js";
import { useArrowHold } from "../arrows/useArrowHold.js";

const STEP_INPUT = 1;
const STEP_TICK = 10;
const MAX = 100;

export function createScaleRow(labelTitle, container) {
  const row = document.createElement("div");
  row.className = "scale-row";

  row.innerHTML = `
  <div class="label">
    <span class="scale-label">${labelTitle}</span>:
    <span class="percent-value">0</span>
  </div>

  <div class="value">
    <div class="chart-wrapper">
      <div class="chart-track">
        <div class="chart-fill"></div>
        <div class="ticks"></div>
      </div>
    </div>

    <input
      class="user-input"
      type="number"
      placeholder="0"
      min="0"
      max="100"
    />
  </div>

  <div class="actions">
    <button
      class="circle-btn"
      type="button"
      data-marker="circle"
      data-label="CIRCLE"
      data-short="C"
    >CIRCLE</button>

    <button
      class="dotted-btn"
      type="button"
      data-marker="dash"
      data-label="DASH"
      data-short="D"
    >DASH</button>

    <button
      class="star-btn"
      type="button"
      data-marker="star"
      data-label="STAR"
      data-short="S"
    >STAR</button>

    <button
      class="check-btn"
      type="button"
      data-marker="check"
      data-label="CHECK"
      data-short="✓"
    >CHECK</button>

    <button class="clear-btn" type="button">CLEAR</button>

    <button class="arrow-btn arrow-left" type="button">←</button>
    <button class="arrow-btn arrow-right" type="button">→</button>
  </div>
`;

  /* =========================
     DOM
  ========================= */

  const input = row.querySelector(".user-input");
  const fill = row.querySelector(".chart-fill");
  const percentLabel = row.querySelector(".percent-value");
  const track = row.querySelector(".chart-track");
  const ticks = row.querySelector(".ticks");

  const arrowLeft = row.querySelector(".arrow-left");
  const arrowRight = row.querySelector(".arrow-right");

  /* =========================
     TICKS (visual only)
  ========================= */

  const lineNodes = [];

  for (let value = 0; value <= MAX; value += STEP_TICK) {
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.textContent = value;
    tick.style.left = `${value}%`;

    if (value === 0 || value === 50 || value === 100) {
      tick.classList.add("tick--major");
    }
    if (value === 100) {
      tick.classList.add("tick--end");
    }

    ticks.appendChild(tick);

    if (value > 0 && value < 100) {
      const line = document.createElement("div");
      line.className = "tick-line";
      ticks.appendChild(line);
      lineNodes.push({ value, el: line });
    }
  }

  const layoutLines = () => {
    const width = track.clientWidth;
    if (!width) return;

    const stepPx = width / (MAX / STEP_TICK);
    lineNodes.forEach(({ value, el }) => {
      el.style.left = `${Math.round((value / STEP_TICK) * stepPx)}px`;
    });
  };

  requestAnimationFrame(layoutLines);
  new ResizeObserver(layoutLines).observe(track);

  /* =========================
     MARKERS
  ========================= */

  const markers = {
    solid: createMarker("solid"),
    dotted: createMarker("dotted"),
    star: createMarker("star"),
    check: createMarker("check"),
  };

  Object.values(markers).forEach((m) => track.appendChild(m));

  const buttons = {
    solid: row.querySelector(".circle-btn"),
    dotted: row.querySelector(".dotted-btn"),
    star: row.querySelector(".star-btn"),
    check: row.querySelector(".check-btn"),
  };

  /* =========================
     VALUE HELPERS
  ========================= */

  const normalizeInputValue = (value) => {
  if (value === "" || value === null) return 0;

  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 0;

  return Math.min(num, MAX);
};


const getValue = () => normalizeInputValue(input.value);


const setValue = (val) => {
  const next = normalizeInputValue(val);

  // ВАЖНО: сюда всегда попадает уже нормализованное число
  input.value = next === 0 ? "" : String(next);

  syncVisuals();
};


  const syncVisuals = () => {
    const val = getValue();
    fill.style.width = `${val}%`;
    percentLabel.textContent = val;

    Object.entries(markers).forEach(([type, marker]) => {
      if (marker.classList.contains("active")) {
        marker.style.left =
          type === "check" ? `calc(${val}% + 8px)` : `${val}%`;
      }
    });
  };

  /* =========================
     INPUT (keyboard + wheel)
  ========================= */

  input.addEventListener("focus", () => input.select());

input.addEventListener("input", () => {
  setValue(input.value);
});


  input.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? STEP_INPUT : -STEP_INPUT;
      setValue(getValue() + delta);
    },
    { passive: false }
  );

/* =========================
   ARROWS (delegated, stable)
========================= */

const changeBy = (delta) => {
  setValue(getValue() + delta);
};

useArrowHold({
  button: arrowLeft,
  onStep: () => changeBy(-STEP_INPUT),
});

useArrowHold({
  button: arrowRight,
  onStep: () => changeBy(STEP_INPUT),
});

  /* =========================
     MARKER TOGGLE
  ========================= */

  const toggleMarker = (type) => {
    // сброс предыдущего состояния
    Object.values(markers).forEach((marker) => {
      marker.classList.remove("active");
      marker.style.left = "";
    });

    Object.values(buttons).forEach((button) => {
      button.classList.remove("marker-active");
    });

    // активация текущего
    const marker = markers[type];
    const button = buttons[type];

    marker.classList.add("active");
    button.classList.add("marker-active");

    marker.style.left =
      type === "check" ? `calc(${getValue()}% + 8px)` : `${getValue()}%`;
  };

  Object.entries(buttons).forEach(([type, btn]) => {
    btn.addEventListener("click", () => toggleMarker(type));
  });

  /* =========================
     RESET (единая точка правды)
  ========================= */

  const resetScale = () => {
    // значение
    setValue(0);

    // маркеры
    Object.values(markers).forEach((marker) => {
      marker.classList.remove("active");
      marker.style.left = "";
    });

    // кнопки маркеров
    Object.values(buttons).forEach((button) => {
      button.classList.remove("marker-active");
    });
  };

  row.querySelector(".clear-btn").addEventListener("click", resetScale);

  container.appendChild(row);

  /* =========================
     PUBLIC API + REGISTRY
  ========================= */

  const api = {
    reset: resetScale,
  };

  registerScale(api);

  return api;
}
