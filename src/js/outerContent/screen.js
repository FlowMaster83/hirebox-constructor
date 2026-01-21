import { renderModalResults } from "../modal/modalContent.js";

/* global htmlToImage */

const EXPORT_WIDTH = 768;

export function exportResultsToPng() {
  // --- BUILD VIRTUAL DOCUMENT ---
  const exportRoot = document.createElement("div");
  exportRoot.className = "modal__content";

  exportRoot.style.width = `${EXPORT_WIDTH}px`;
  exportRoot.style.minWidth = `${EXPORT_WIDTH}px`;
  exportRoot.style.maxWidth = `${EXPORT_WIDTH}px`;
  exportRoot.style.background = "var(--modal-bg-color)";
  exportRoot.style.borderRadius = "8px";
  exportRoot.style.overflow = "visible";

  // --- BODY ---
  const body = document.createElement("div");
  body.className = "modal__body";
  body.style.maxHeight = "none";
  body.style.overflow = "visible";

  const { content } = renderModalResults();
  body.appendChild(content);
  exportRoot.appendChild(body);

  // --- SANDBOX ---
  const sandbox = document.createElement("div");
  sandbox.style.position = "absolute";
  sandbox.style.left = "-10000px";
  sandbox.style.top = "0";
  sandbox.style.height = "auto";
  sandbox.style.width = `${EXPORT_WIDTH}px`;
  sandbox.style.pointerEvents = "none";
  sandbox.style.opacity = "0";

  sandbox.appendChild(exportRoot);
  document.body.appendChild(sandbox);

  exportRoot.style.position = "static";
  exportRoot.style.height = "auto";
  exportRoot.style.maxHeight = "none";

  // --- FORCE LAYOUT & MEASURE ---
  const rect = exportRoot.getBoundingClientRect();
  exportRoot.style.height = `${rect.height}px`;

  // --- EXPORT ---
  htmlToImage
    .toPng(exportRoot, {
      pixelRatio: 2,
    })
    .then((dataUrl) => {
      downloadPng(dataUrl, "results.png");
    })
    .finally(() => {
      sandbox.remove();
    });
}

function downloadPng(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
