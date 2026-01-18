export async function exportResultsToPDF() {
  const source = document.querySelector("[data-modal-results]");
  if (!source) return;

  if (typeof window.html2canvas !== "function") {
    console.error("html2canvas is not loaded");
    return;
  }

  const modalRoot = source.closest(".modal");
  const appRoot = document.getElementById("app-root");
  if (!modalRoot || !appRoot) return;

  const snapshotCanvas = await window.html2canvas(modalRoot, {
    scale: 1,
    useCORS: true,
    backgroundColor: null,
  });

  const snapshotOverlay = document.createElement("div");
  snapshotOverlay.className = "pdf-snapshot-overlay";

  const img = document.createElement("img");
  img.src = snapshotCanvas.toDataURL("image/png");

  const rect = modalRoot.getBoundingClientRect();
  const appRect = appRoot.getBoundingClientRect();

  Object.assign(img.style, {
    position: "absolute",
    left: `${rect.left - appRect.left}px`,
    top: `${rect.top - appRect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  });

  snapshotOverlay.appendChild(img);
  appRoot.appendChild(snapshotOverlay);

  document.documentElement.classList.add("is-exporting-pdf");

  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);

  const options = {
    margin: 10,
    filename: "results.pdf",
    image: { type: "png" },
    html2canvas: {
      scale: 2,
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
