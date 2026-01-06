// ВСЯ логіка однієї шкали

import { createMarker } from "../components/markers.js";

const STEP = 10;
const MAX = 100;

export function createScaleRow(labelTitle, container) {
  const row = document.createElement("div");
  row.className = "scale-row";

  row.innerHTML = `
    <div class="label">
      ${labelTitle}: <span class="percent-value">0</span>
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
      <button class="star-btn" type="button">STAR</button>
      <button class="circle-btn" type="button">CIRCLE</button>
      <button class="dotted-btn" type="button">DASHED</button>
      <button class="check-btn" type="button">CHECK</button>
      <button class="clear-btn" type="button">CLEAR</button>
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

  /* =========================
     TICKS (цифры — %, линии — px)
  ========================= */

  const lineNodes = [];

  for (let value = 0; value <= MAX; value += STEP) {
    // цифра
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.textContent = value;

    if (value === 0 || value === 50 || value === 100) {
      tick.classList.add("tick--major");
    }

    if (value === 100) {
      tick.classList.add("tick--end");
    }

    tick.style.left = `${value}%`;
    ticks.appendChild(tick);

    // вертикальная линия (только 10–90)
    if (value > 0 && value < 100) {
      const line = document.createElement("div");
      line.className = "tick-line";
      ticks.appendChild(line);
      lineNodes.push({ value, el: line });
    }
  }

  /* =========================
     Геометрия линий (PX)
  ========================= */

  const layoutLines = () => {
    const width = track.clientWidth;
    if (!width) return;

    const stepPx = Math.round(width / (MAX / STEP));

    lineNodes.forEach(({ value, el }) => {
      const index = value / STEP;
      el.style.left = `${Math.round(stepPx * index)}px`;
    });
  };

  requestAnimationFrame(layoutLines);

  const ro = new ResizeObserver(layoutLines);
  ro.observe(track);

  /* =========================
     Markers (ЕДИНСТВЕННЫЙ источник)
  ========================= */

  const markers = {
    solid: createMarker("solid"),
    dotted: createMarker("dotted"),
    star: createMarker("star"),
    check: createMarker("check"),
  };

  Object.values(markers).forEach((marker) => {
    track.appendChild(marker);
  });

  const buttons = {
    solid: row.querySelector(".circle-btn"),
    dotted: row.querySelector(".dotted-btn"),
    star: row.querySelector(".star-btn"),
    check: row.querySelector(".check-btn"),
  };

  /* =========================
     Value helpers
  ========================= */

  const getValue = () => {
    const num = Number(input.value);
    return Number.isFinite(num) && num > 0 ? Math.min(num, 100) : null;
  };

  const getMarkerLeft = (type) => {
    const val = getValue() ?? 0;
    return type === "check" ? `calc(${val}% + 8px)` : `${val}%`;
  };

  const syncVisuals = () => {
    const val = getValue();
    fill.style.width = `${val ?? 0}%`;
    percentLabel.textContent = val ?? 0;

    Object.entries(markers).forEach(([type, marker]) => {
      if (marker.classList.contains("active")) {
        marker.style.left = getMarkerLeft(type);
      }
    });
  };

  /* =========================
     Input
  ========================= */

  input.addEventListener("focus", () => input.select());

  input.addEventListener("input", () => {
    if (input.value < 0) input.value = "";
    if (input.value > 100) input.value = 100;
    syncVisuals();
  });

  input.addEventListener("blur", () => {
    if (input.value === "0") {
      input.value = "";
      syncVisuals();
    }
  });

  input.addEventListener("wheel", handleWheelInput, { passive: false });

  // SCROLL ON INPUT
  const SCROLLMIN = 0;
  const SCROLLMAX = 100;
  const SCROLLSTEP = 1;

  function clamp(value, min = SCROLLMIN, max = SCROLLMAX) {
    return Math.min(max, Math.max(min, value));
  }

  function handleWheelInput(e) {
    e.preventDefault();

    const input = e.currentTarget;
    const current = Number(input.value) || 0;

    const delta = e.deltaY < 0 ? SCROLLSTEP : -SCROLLSTEP;
    const nextValue = clamp(current + delta);

    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // remove 0 before the next digit
  input.addEventListener("input", handleInputNormalize);

  function handleInputNormalize(e) {
    const input = e.target;

    if (input.value === "") return;

    let value = Number(input.value);

    if (Number.isNaN(value)) {
      input.value = "";
      return;
    }

    value = clamp(value);

    input.value = value;
  }

  /* =========================
     Marker toggle
  ========================= */

  const toggleMarker = (type) => {
    const marker = markers[type];
    const button = buttons[type];
    const isActive = marker.classList.contains("active");

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });

    if (!isActive) {
      marker.classList.add("active");
      marker.style.left = getMarkerLeft(type);
      button.style.backgroundColor = "#ffe6e6";
      button.style.borderColor = "#ff0000";
    }
  };

  buttons.star.addEventListener("click", () => toggleMarker("star"));
  buttons.solid.addEventListener("click", () => toggleMarker("solid"));
  buttons.dotted.addEventListener("click", () => toggleMarker("dotted"));
  buttons.check.addEventListener("click", () => toggleMarker("check"));

  /* =========================
     Clear
  ========================= */

  row.querySelector(".clear-btn").addEventListener("click", () => {
    input.value = "";
    fill.style.width = "0%";
    percentLabel.textContent = "0";

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = "";
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });
  });

  container.appendChild(row);
}
