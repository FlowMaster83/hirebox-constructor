/* =========================================================
   PNG EXPORT — A4.1
   DOM-clone approach
   SPEC: A3 → A4
========================================================= */

/* global htmlToImage */

export function exportResultsToPng() {
  const root = document.querySelector(".modal__content");

  if (!root) {
    console.error("[PNG] .modal__content not found");
    return;
  }

  // --- CLONE ROOT ---
  const clone = root.cloneNode(true);

  const rect = root.getBoundingClientRect();

  clone.style.width = `${rect.width}px`;
  clone.style.maxWidth = "none";

  /* === NEW: force full-height render === */
  clone.style.maxHeight = "none";
  clone.style.height = "auto";

  const body = clone.querySelector(".modal__body");
  if (body) {
    body.style.maxHeight = "none";
    body.style.height = "auto";
    body.style.overflow = "visible";
  }

  // --- REMOVE UI CONTROLS FROM CLONE ---
  // Close button must not appear in PNG
  const closeBtn = clone.querySelector(".modal-close-btn");
  if (closeBtn) closeBtn.remove();

  /*
    IMPORTANT:
    - .modal-actions are NOT inside .modal__content → nothing to remove
    - .scale-head-values MUST stay (percent values)
    - .results / .result-row / typography are NOT modified
    - NO CSS changes here by contract
  */

  // --- PREPARE TEMP CONTAINER ---
  const sandbox = document.createElement("div");
  sandbox.style.position = "fixed";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.pointerEvents = "none";
  sandbox.style.opacity = "0";

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  // --- EXPORT PNG ---
  htmlToImage
    .toPng(clone, {
      pixelRatio: 2, // STRICT 1:1 scale
      cacheBust: false,
    })
    .then((dataUrl) => {
      downloadPng(dataUrl, "results.png");
    })
    .catch((err) => {
      console.error("[PNG] export failed", err);
    })
    .finally(() => {
      // --- CLEANUP ---
      sandbox.remove();
    });
}

/* =========================================================
   DOWNLOAD HELPER
========================================================= */

function downloadPng(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
