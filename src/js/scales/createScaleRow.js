import { createMarker } from "../components/markers.js";
import { registerScale } from "../state/scaleRegistry.js";

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
      <button class="circle-btn" type="button">CIRCLE</button>
      <button class="dotted-btn" type="button">DASH</button>
      <button class="star-btn" type="button">STAR</button>
      <button class="check-btn" type="button">CHECK</button>
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

  const getValue = () => {
    const num = Number(input.value);
    return Number.isFinite(num) && num > 0 ? Math.min(num, MAX) : 0;
  };

  const setValue = (val) => {
    const next = Math.min(MAX, Math.max(0, val));
    input.value = next === 0 ? "" : next;
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
    if (input.value < 0) input.value = "";
    if (input.value > MAX) input.value = MAX;
    syncVisuals();
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
     ARROWS
  ========================= */

  const changeBy = (delta) => setValue(getValue() + delta);

  arrowLeft.addEventListener("click", () => changeBy(-STEP_INPUT));
  arrowRight.addEventListener("click", () => changeBy(STEP_INPUT));

  /* =========================
     MARKER TOGGLE
  ========================= */

  const toggleMarker = (type) => {
    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) => {
      b.classList.remove("marker-active");
    });

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
     RESET (единая логика)
  ========================= */

  const resetScale = () => {
    setValue(0);

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
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
