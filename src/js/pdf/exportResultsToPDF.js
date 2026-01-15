// src/js/pdf/exportResultsToPDF.js

export function exportResultsToPDF() {
  const content = document.querySelector("[data-modal-results]");
  if (!content) return;

  /* =========================================================
     PREPARE DOM FOR PDF
  ========================================================= */

  document.body.classList.add("is-exporting-pdf");

  const options = {
    margin: 10,
    filename: "results.pdf",

    image: {
      type: "jpeg",
      quality: 0.98
    },

    html2canvas: {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff"
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compressPDF: true
    }
  };

  /* =========================================================
     EXPORT
  ========================================================= */

  html2pdf()
    .set(options)
    .from(content)
    .save()
    .finally(() => {
      document.body.classList.remove("is-exporting-pdf");
    });
}
