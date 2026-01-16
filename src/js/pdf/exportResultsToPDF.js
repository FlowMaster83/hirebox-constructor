export async function exportResultsToPDF() {
  const source = document.querySelector("[data-modal-results]");
  if (!source) return;

  if (typeof window.html2canvas !== "function") {
    console.error("html2canvas is not loaded");
    return;
  }

  // === 1. SNAPSHOT ТОЛЬКО СТАБИЛЬНОГО КОНТЕЙНЕРА ===
  const modalRoot = source.closest(".modal"); // важно: не body

  const snapshotCanvas = await window.html2canvas(modalRoot, {
    scale: 1,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const snapshotOverlay = document.createElement("div");
  snapshotOverlay.className = "pdf-snapshot-overlay";

  const img = document.createElement("img");
  img.src = snapshotCanvas.toDataURL("image/png");

  snapshotOverlay.appendChild(img);
  document.body.appendChild(snapshotOverlay);

  // === 2. ТЕПЕРЬ МОЖНО МЕНЯТЬ DOM ===
  document.documentElement.classList.add("is-exporting-pdf");

  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);

  const options = {
    margin: 10,
    filename: "results.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compressPDF: true,
    },
  };

  try {
    await html2pdf().set(options).from(source).save();
  } finally {
    document.documentElement.classList.remove("is-exporting-pdf");
    snapshotOverlay.remove();
  }
}
