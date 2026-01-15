// src/js/pdf/exportResultsToPDF.js
export function exportResultsToPDF() {
  const source = document.querySelector("[data-modal-results]");

  if (!source) return;
  /* =========================================================

     CREATE OFFSCREEN CLONE

  ========================================================= */

  // Клонируем только PDF-контент
  const clone = source.cloneNode(true);

  // Обёртка — носитель pdf.css
  const wrapper = document.createElement("div");
  wrapper.className = "is-exporting-pdf";

  // Убираем из визуального потока
  Object.assign(wrapper.style, {
    position: "fixed",
    top: "0",
    left: "-10000px",
    width: "1000px", // стабильная ширина для A4
    background: "#ffffff",
    pointerEvents: "none",
    zIndex: "-1",
  });

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  /* =========================================================

     PDF OPTIONS

  ========================================================= */
  const options = {
    margin: 10,
    filename: "results.pdf",
    image: {
      type: "jpeg",
      quality: 0.98,
    },

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

  /* =========================================================

     EXPORT

  ========================================================= */

  html2pdf()
    .set(options)
    .from(clone)
    .save()
    .finally(() => {
      wrapper.remove();
    });
}
