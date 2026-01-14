export function exportResultsToPDF() {
  const content = document.querySelector("[data-modal-results]");

  if (!content) return;

  html2pdf()
    .set({
      margin: 10,
      filename: "results.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" }
    })
    .from(content)
    .save();
}
