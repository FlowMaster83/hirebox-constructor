/* =========================
   CONSTANTS
========================= */

const LABELS = [
  "1. Передбачуваність",
  "2. Енергія",
  "3. Ентузіазм",
  "4. Наполегливість",
  "5. Самоконтроль",
  "6. Цілеспрямованість",
  "7. Комунікація",
  "8. Взаєморозуміння",
  "9. Впевненість в собі",
  "10. Об'єктивність",
  "11. Толерантність",
  "12. Організованість",
  "13. Інтерес",
  "14. Обмін",
  "15. Результати",
  "16. Кваліфікації",
  "17. Командний дух",
  "18. Основні принципи",
  "19. Тиск на роботі",
  "20. Готовність до роботи",
];

const container = document.getElementById("scales-container");

/* =========================
   HELPERS
========================= */

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

/* =========================
   SCALE ROW
========================= */

function createScaleRow(labelTitle) {
  const row = document.createElement("div");
  row.className = "scale-row";

  row.innerHTML = `
      <div class="label">
        ${labelTitle}: <span class="percent-value">0</span>
      </div>

      <div class="chart-wrapper">
        <div class="chart-track">
          <div class="chart-fill"></div>

          <div class="chart-marker marker-solid"></div>
          <div class="chart-marker marker-dotted"></div>

          <div class="chart-marker marker-star">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 480 519"
              class="marker-svg"
            >
              <g
                transform="translate(0,519) scale(0.1,-0.1)"
                fill="none"
                stroke="currentColor"
                stroke-width="120"
              >
                <path
                  d="M1741 4489 c-1 -3 5 -106 13 -230 8 -123 17 -278 21 -344 3 -66 13
-236 21 -378 9 -142 13 -264 10 -272 -7 -18 -82 -20 -219 -5 -51 5 -182 14
-292 20 -110 7 -234 15 -275 20 -102 12 -340 24 -340 18 0 -5 122 -125 219
-218 55 -51 379 -366 504 -488 59 -58 107 -111 107 -117 0 -14 -455 -465 -808
-803 -13 -13 -22 -26 -19 -28 3 -3 124 4 269 15 238 19 346 26 721 49 65 4
123 5 128 1 7 -4 8 -42 4 -105 -3 -54 -14 -261 -25 -459 -11 -198 -22 -389
-25 -425 -13 -185 -16 -260 -12 -260 2 0 82 98 178 217 95 120 176 220 179
223 3 3 44 52 90 110 46 58 97 121 114 141 17 19 65 79 106 132 47 62 81 96
91 95 15 -3 81 -79 247 -287 37 -46 90 -111 117 -145 28 -34 84 -104 125 -156
41 -52 77 -97 80 -100 5 -4 60 -72 163 -200 l27 -35 -5 110 c-3 61 -10 169
-15 240 -5 72 -12 177 -15 235 -3 58 -12 231 -21 384 -17 311 -19 300 51 292
22 -3 117 -10 210 -16 94 -6 318 -22 499 -36 180 -13 337 -24 348 -24 20 0 24
-4 -207 217 -122 117 -625 614 -625 618 0 1 53 54 117 116 64 63 163 159 219
214 181 179 486 470 495 473 23 9 5 22 -28 21 -79 -3 -460 -29 -493 -34 -19
-2 -93 -7 -165 -10 -71 -4 -174 -10 -229 -16 -146 -14 -193 -12 -200 7 -3 9
-4 19 -2 22 2 4 7 79 10 167 7 164 23 488 31 630 2 44 7 139 10 210 3 72 8
140 11 153 10 51 -14 26 -181 -184 -38 -49 -106 -132 -150 -184 -44 -53 -94
-114 -111 -136 -140 -174 -189 -234 -217 -268 -17 -21 -41 -51 -52 -67 -11
-16 -29 -32 -39 -35 -20 -7 -24 -4 -76 66 -14 18 -30 38 -35 44 -6 6 -63 76
-127 156 -64 80 -130 160 -145 179 -15 18 -54 66 -86 105 -32 39 -66 80 -75
91 -10 11 -33 40 -52 65 -19 25 -42 54 -52 65 -58 71 -85 104 -100 126 -9 13
-17 21 -17 18z"
                />
              </g>
            </svg>
          </div>

          <div class="chart-marker marker-check">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M4 13l5 5 11-11"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div class="ticks">
            ${Array.from(
              { length: 11 },
              (_, i) => `<span
              class="tick"
              style="left:${i * 10}%"
              >${i * 10}</span
            >`
            ).join("")}
          </div>
        </div>
      </div>

      <input
        class="user-input"
        type="number"
        placeholder="0"
        min="0"
        max="100"
      />

      <button class="clear-btn" type="button">CLEAR</button>
      <button class="star-btn" type="button">STAR</button>
      <button class="circle-btn" type="button">CIRCLE</button>
      <button class="dotted-btn" type="button">DASHED</button>
      <button class="check-btn" type="button">CHECK</button>
      `;

  const input = row.querySelector(".user-input");
  const fill = row.querySelector(".chart-fill");
  const percentLabel = row.querySelector(".percent-value");

  const markers = {
    solid: row.querySelector(".marker-solid"),
    dotted: row.querySelector(".marker-dotted"),
    star: row.querySelector(".marker-star"),
    check: row.querySelector(".marker-check"),
  };

  const buttons = {
    solid: row.querySelector(".circle-btn"),
    dotted: row.querySelector(".dotted-btn"),
    star: row.querySelector(".star-btn"),
    check: row.querySelector(".check-btn"),
  };

  /* -------- VALUE MODEL -------- */

  const getValue = () => {
    const raw = Number(input.value);
    if (!raw) return null; // 0, "", NaN → нет значения
    return clamp(raw, 1, 100);
  };

  /* -------- VISUAL SYNC -------- */

  const syncVisuals = () => {
    const val = getValue();

    fill.style.width = `${val ?? 0}%`;
    percentLabel.textContent = val ?? 0;

    Object.entries(markers).forEach(([type, marker]) => {
      if (!marker.classList.contains("active")) return;
      marker.style.left = getMarkerLeft(type);
    });
  };

  /* -------- INPUT -------- */

  input.addEventListener("focus", () => input.select());

  input.addEventListener("input", () => {
    const num = Number(input.value);
    if (num < 0) input.value = "";
    if (num > 100) input.value = 100;
    syncVisuals();
  });

  input.addEventListener("blur", () => {
    if (input.value === "0") {
      input.value = "";
      syncVisuals();
    }
  });

  /* -------- MARKERS -------- */

  const toggleMarker = (type) => {
    const marker = markers[type];
    const button = buttons[type];
    const isActive = marker.classList.contains("active");

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = ""; // ⬅ сброс памяти
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });

    if (!isActive) {
      marker.classList.add("active");
      marker.style.left = getMarkerLeft(type); // ⬅ всегда
      button.style.backgroundColor = "#ffe6e6";
      button.style.borderColor = "#ff0000";
    }
  };

  buttons.star.addEventListener("click", () => toggleMarker("star"));
  buttons.solid.addEventListener("click", () => toggleMarker("solid"));
  buttons.dotted.addEventListener("click", () => toggleMarker("dotted"));
  buttons.check.addEventListener("click", () => toggleMarker("check"));

  const getMarkerLeft = (type) => {
    const val = getValue();
    const pos = val === null ? 0 : val;

    if (type === "check") {
      return `calc(${pos}% + 8px)`;
    }

    return `${pos}%`;
  };

  /* -------- CLEAR ROW -------- */

  row.querySelector(".clear-btn").addEventListener("click", () => {
    input.value = "";

    fill.style.width = "0%";
    percentLabel.textContent = "0";

    Object.values(markers).forEach((m) => {
      m.classList.remove("active");
      m.style.left = ""; // ⬅ критично
    });

    Object.values(buttons).forEach((b) => {
      b.style.backgroundColor = "";
      b.style.borderColor = "";
    });
  });

  container.appendChild(row);
}

/* =========================
   INIT
========================= */

LABELS.forEach(createScaleRow);

/* =========================
   HEADER CONTROLS
========================= */

const mainSelect = document.getElementById("main-select");
const fillBtn = document.querySelector(".fill-btn");
const clearAllBtn = document.querySelector(".clear-all-btn");

/* --- Fill button state --- */

const updateFillButtonState = () => {
  fillBtn.disabled = !mainSelect.value || Number(mainSelect.value) < 1;
};

mainSelect.addEventListener("change", updateFillButtonState);
updateFillButtonState();

/* --- FILL ALL --- */

fillBtn.addEventListener("click", () => {
  const val = Number(mainSelect.value);
  if (!val || val < 1 || val > 100) return;

  document.querySelectorAll(".scale-row").forEach((row) => {
    const input = row.querySelector(".user-input");
    input.value = val;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  });
});

/* --- CLEAR ALL --- */

clearAllBtn.addEventListener("click", () => {
  document
    .querySelectorAll(".scale-row .clear-btn")
    .forEach((btn) => btn.click());

  mainSelect.value = "";
  updateFillButtonState();
});
