// src/js/components/modalContent.js
import { exportResultsToPDF } from "../pdf/exportResultsToPDF.js";

/**
 * Формирует содержимое модалки с результатами
 * Используется как для UI, так и как источник для PDF
 */
export function renderModalResults() {
  const root = document.createElement("div");
  root.className = "modal-results";

  /* =========================================================
     CONTENT (то, что идёт в PDF)
  ========================================================= */

  const content = document.createElement("div");
  content.className = "results";
  content.dataset.modalResults = "";

  content.appendChild(renderModalScaleHeader());

  const scaleRows = document.querySelectorAll(".scale-row");
  scaleRows.forEach((row) => {
    content.appendChild(renderResultRow(row));
  });

  /* =========================================================
     CONTROLS (не попадают в PDF)
  ========================================================= */

  const controls = document.createElement("div");
  controls.className = "modal-controls";

  const pdfButton = document.createElement("button");
  pdfButton.type = "button";
  pdfButton.dataset.exportPdf = "";
  pdfButton.textContent = "PDF";

  pdfButton.addEventListener("click", exportResultsToPDF);

  controls.appendChild(pdfButton);

  /* ========================================================= */

  root.appendChild(content);
  root.appendChild(controls);

  return root;
}

function renderModalScaleHeader() {
  const header = document.createElement("div");
  header.className = "modal-scale-head";

  header.innerHTML = `
    <div class="scale-head-grid">
      <!-- ROW 1 -->
      <div></div>
      <div class="scale-head-levels">
        <span class="level low">LOW</span>
        <span class="level average">AVERAGE</span>
        <span class="level high">HIGH</span>
      </div>

      <!-- ROW 2 -->
      <a class="main-logo">
        <img src="./svg/logo.svg" alt="Logo" />
        <span class="main-logo-text">HIREBOX</span>
      </a>
      <div></div>

      <!-- ROW 3 -->
      <div></div>
      <div class="scale-head-values">
        <span class="value v0">0%</span>
        <span class="value v33">33%</span>
        <span class="value v66">66%</span>
        <span class="value v100">100%</span>
      </div>
    </div>
  `;

  return header;
}

function renderResultRow(rowSource) {
  const row = document.createElement("div");
  row.className = "result-row";

  const labelEl = rowSource.querySelector(".scale-label");
  const valueEl = rowSource.querySelector(".percent-value");
  const fillEl = rowSource.querySelector(".chart-fill");
  const trackEl = rowSource.querySelector(".chart-track");

  const title = labelEl?.textContent ?? "";
  const value = valueEl?.textContent ?? "0";
  const fillWidth = fillEl?.style.width ?? "0%";

  row.innerHTML = `
    <div class="result-label">
      <span class="result-title">${title}</span>:
      <span class="result-value">${value}</span>
    </div>

    <div class="result-scale">
      <div class="chart-wrapper">
        <div class="chart-track">
          <div class="chart-fill" style="width: ${fillWidth}"></div>
        </div>
      </div>
    </div>
  `;

  const targetTrack = row.querySelector(".chart-track");

  trackEl
    ?.querySelectorAll(".chart-marker.active")
    .forEach((marker) => {
      targetTrack.appendChild(marker.cloneNode(true));
    });

  return row;
}
