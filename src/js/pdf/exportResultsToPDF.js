export function exportResultsToPDF() {
  const source = document.querySelector("[data-modal-results]");
  if (!source) return;

  const root = document.documentElement;

  // 1. UI shield
  const overlay = document.createElement("div");
  overlay.className = "pdf-export-overlay";
  document.body.appendChild(overlay);

  // 2. Включаем PDF-режим
  root.classList.add("is-exporting-pdf");

  // 3. Даём браузеру стабилизироваться
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

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

      html2pdf()
        .set(options)
        .from(source)
        .save()
        .finally(() => {
          root.classList.remove("is-exporting-pdf");
          overlay.remove();
        });

    });
  });
}
