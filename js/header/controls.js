// Керування

export function initHeaderControls() {
  const mainSelect = document.getElementById("main-select");
  const fillBtn = document.querySelector(".fill-btn");
  const clearAllBtn = document.querySelector(".clear-all-btn");

  const updateFillButtonState = () => {
    fillBtn.disabled = !mainSelect.value || Number(mainSelect.value) < 1;
  };

  mainSelect.addEventListener("change", updateFillButtonState);
  updateFillButtonState();

  fillBtn.addEventListener("click", () => {
    const val = Number(mainSelect.value);
    if (!val || val < 1 || val > 100) return;

    document.querySelectorAll(".scale-row").forEach((row) => {
      const input = row.querySelector(".user-input");
      input.value = val;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));
    });
  });

  clearAllBtn.addEventListener("click", () => {
    document
      .querySelectorAll(".scale-row .clear-btn")
      .forEach((btn) => btn.click());

    mainSelect.value = "";
    updateFillButtonState();
  });
}
