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
  <button data-marker="circle" data-label="CIRCLE" data-short="C">
    <span class="btn__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <use href="#icon-circle"></use>
      </svg>
    </span>
    <span class="btn__label">CIRCLE</span>
  </button>

  <button data-marker="dash" data-label="DASH" data-short="D">
    <span class="btn__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <use href="#icon-dash"></use>
      </svg>
    </span>
    <span class="btn__label">DASH</span>
  </button>

  <button data-marker="star" data-label="STAR" data-short="S">
    <span class="btn__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <use href="#icon-star"></use>
      </svg>
    </span>
    <span class="btn__label">STAR</span>
  </button>

  <button data-marker="check" data-label="CHECK" data-short="✓">
    CHECK
  </button>

  <button class="clear-btn" type="button">CLEAR</button>

  <button class="arrow-btn arrow-left" type="button">←</button>
  <button class="arrow-btn arrow-right" type="button">→</button>
</div>

  `;

  const input = row.querySelector(".user-input");
  const fill = row.querySelector(".chart-fill");
  const percentLabel = row.querySelector(".percent-value");
  const track = row.querySelector(".chart-track");
  const ticks = row.querySelector(".ticks");

  /* ---------- TICKS ---------- */

  const lineNodes = [];

  for (let v = 0; v <= MAX; v += STEP_TICK) {
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.textContent = v;
    tick.style.left = `${v}%`;

    if (v === 0 || v === 50 || v === 100) tick.classList.add("tick--major");
    if (v === 100) tick.classList.add("tick--end");

    ticks.appendChild(tick);

    if (v > 0 && v < 100) {
      const line = document.createElement("div");
      line.className = "tick-line";
      ticks.appendChild(line);
      lineNodes.push({ value: v, el: line });
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

  /* ---------- MARKERS ---------- */

  const markers = {
    circle: createMarker("solid"),
    dash: createMarker("dotted"),
    star: createMarker("star"),
    check: createMarker("check"),
  };

  Object.values(markers).forEach((m) => track.appendChild(m));

  const buttons = {};
  row.querySelectorAll("[data-marker]").forEach((btn) => {
    buttons[btn.dataset.marker] = btn;
  });

  /* ---------- VALUE ---------- */

  const normalize = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.min(n, MAX);
  };

  const getValue = () => normalize(input.value);

  const setValue = (v) => {
    const val = normalize(v);

    input.value = val === 0 ? "" : val;
    fill.style.width = `${val}%`;
    percentLabel.textContent = val;

    Object.entries(markers).forEach(([type, m]) => {
      if (m.classList.contains("active")) {
        m.style.left =
          type === "check" ? `calc(${val}% + 8px)` : `${val}%`;
      }
    });
  };

  /* ---------- INPUT (ALWAYS WORKS) ---------- */

  input.addEventListener("input", () => {
    setValue(input.value);
  });

  input.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      if (!delta) return;
      setValue(getValue() - delta * STEP_INPUT);
    },
    { passive: false }
  );

  /* ---------- ARROWS (WITH HOLD ACCELERATION) ---------- */

  useArrowHold({
    button: row.querySelector(".arrow-left"),
    onStep: () => setValue(getValue() - STEP_INPUT),
  });

  useArrowHold({
    button: row.querySelector(".arrow-right"),
    onStep: () => setValue(getValue() + STEP_INPUT),
  });

  /* ---------- MARKER TOGGLE ---------- */

  const toggleMarker = (type) => {
    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) =>
      b.classList.remove("marker-active")
    );

    markers[type].classList.add("active");
    buttons[type].classList.add("marker-active");

    markers[type].style.left =
      type === "check" ? `calc(${getValue()}% + 8px)` : `${getValue()}%`;
  };

  Object.entries(buttons).forEach(([type, btn]) => {
    btn.addEventListener("click", () => toggleMarker(type));
  });

  /* ---------- RESET ---------- */

  const resetScale = () => {
    setValue(0);

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) =>
      b.classList.remove("marker-active")
    );
  };

  row.querySelector(".clear-btn").addEventListener("click", resetScale);

  container.appendChild(row);
  registerScale({ reset: resetScale });
}
