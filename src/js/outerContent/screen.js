import { renderModalResults } from "../modal/modalContent.js";

/* global htmlToImage */

/* =========================================================
   UTILS
========================================================= */

function waitForImages(root) {
  const images = root.querySelectorAll("img");

  return Promise.all(
    Array.from(images).map((img) => {
      // если изображение уже загружено и валидно
      if (img.complete && img.naturalWidth !== 0) {
        return Promise.resolve();
      }

      // ждём загрузку или ошибку
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    }),
  );
}

function downloadPng(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

/* =========================================================
   EXPORT
========================================================= */

export async function exportResultsToPng() {
  document.documentElement.classList.add("is-exporting-screen");

  try {
    const exportRoot = document.createElement("div");
    exportRoot.className = "modal__content";

    exportRoot.style.background = "var(--modal-bg-color)";
    exportRoot.style.borderRadius = "8px";
    exportRoot.style.overflow = "visible";

    const body = document.createElement("div");
    body.className = "modal__body";
    body.style.maxHeight = "none";
    body.style.overflow = "visible";

    const { content } = renderModalResults();
    body.appendChild(content);
    exportRoot.appendChild(body);

    const sandbox = document.createElement("div");
    sandbox.style.position = "absolute";
    sandbox.style.left = "-10000px";
    sandbox.style.top = "0";
    sandbox.style.pointerEvents = "none";
    sandbox.style.opacity = "0";

    sandbox.appendChild(exportRoot);
    document.body.appendChild(sandbox);

    exportRoot.style.position = "static";
    exportRoot.style.height = "auto";
    exportRoot.style.maxHeight = "none";

    const rect = exportRoot.getBoundingClientRect();
    exportRoot.style.height = `${rect.height}px`;

    exportRoot.querySelectorAll("img").forEach((img) => {
      img.src = img.src;
    });

    await waitForImages(exportRoot);

    const dataUrl = await htmlToImage.toPng(exportRoot, {
      pixelRatio: 2,
      skipFonts: true,
    });

    downloadPng(dataUrl, "results.png");
    sandbox.remove();
  } finally {
    document.documentElement.classList.remove("is-exporting-screen");
  }
}
