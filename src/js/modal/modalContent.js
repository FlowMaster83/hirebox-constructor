// src/js/components/modalContent.js

/**
 * Формирует содержимое модалки с результатами
 * Используется ТОЛЬКО для UI
 * PDF-модель будет строиться отдельно (A4)
 */
export function renderModalResults() {
  const root = document.createElement("div");
  root.className = "modal-results";

  const content = document.createElement("div");
  content.className = "results";
  content.dataset.modalResults = "";

  content.appendChild(renderModalScaleHeader());

  document.querySelectorAll(".scale-row").forEach((row) => {
    content.appendChild(renderResultRow(row));
  });

  root.appendChild(content);

  return {
    content: root,
  };
}

function renderModalScaleHeader() {
  const header = document.createElement("div");
  header.className = "modal-scale-head";

  header.innerHTML = `
    <a class="modal-logo" aria-hidden="true">
      <img src="./svg/logo.svg" alt="HireBox logo" />
      <span class="modal-logo-text">HIREBOX</span>
    </a>

    <div class="scale-head-grid">
      <div class="scale-head-levels">
        <span class="level low">LOW</span>
        <span class="level average">AVERAGE</span>
        <span class="level high">HIGH</span>
      </div>

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

  const title =
    rowSource.querySelector(".scale-label")?.textContent ?? "";
  const value =
    rowSource.querySelector(".percent-value")?.textContent ?? "0";
  const fillWidth =
    rowSource.querySelector(".chart-fill")?.style.width ?? "0%";

  row.innerHTML = `
    <div class="result-label">
      <span class="result-title">${title}</span>:
      <span class="result-value">${value}</span>
    </div>

    <div class="result-scale">
      <div class="chart-wrapper">
        <div class="chart-track">
          <div class="chart-fill" style="width:${fillWidth}"></div>
        </div>
      </div>
    </div>
  `;

  const targetTrack = row.querySelector(".chart-track");

  rowSource
    .querySelectorAll(".chart-marker.active")
    .forEach((marker) => {
      targetTrack.appendChild(marker.cloneNode(true));
    });

  return row;
}