import { renderModalResults } from "./modalContent.js";

/* =========================================================
   CONFIG
========================================================= */

const MODAL_MIN_WIDTH = 641;

/* =========================================================
   STATE
========================================================= */

let modalRoot = null;
let lastFocusedElement = null;

/* =========================================================
   UTILS
========================================================= */

function isModalAllowed() {
  return window.innerWidth >= MODAL_MIN_WIDTH;
}

function isModalOpen() {
  return modalRoot && modalRoot.classList.contains("is-open");
}

/* =========================================================
   MODAL CREATION
========================================================= */

function createModal() {
  if (modalRoot) return modalRoot;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="modal__overlay" data-close-modal></div>

    <div class="modal__content" role="dialog" aria-modal="true">
      <button
        class="modal-close-btn"
        type="button"
        aria-label="Close results"
        data-close-modal
      >
        ×
      </button>

      <section class="modal__body"></section>
    </div>
  `;

  document.body.appendChild(modal);
  modalRoot = modal;

  return modalRoot;
}

/* =========================================================
   OPEN / CLOSE
========================================================= */

export function openModal(contentNode) {
  if (!contentNode) return;
  if (!isModalAllowed()) return;

  // 🔑 сохраняем элемент, который имел фокус
  lastFocusedElement = document.activeElement;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(contentNode);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  // переводим фокус в модалку (на кнопку закрытия)
  const closeBtn = modal.querySelector(".modal-close-btn");
  closeBtn?.focus();
}

export function closeModal() {
  if (!isModalOpen()) return;

  // 🔑 СНАЧАЛА уводим фокус ИЗ модалки
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  } else {
    document.body.focus();
  }

  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");

  const body = modalRoot.querySelector(".modal__body");
  if (body) body.innerHTML = "";

  document.body.style.overflow = "";
}

/* =========================================================
   GLOBAL EVENTS
========================================================= */

/* Open / Close by click */
document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");
  const closeBtn = e.target.closest("[data-close-modal]");

  if (openBtn) {
    if (!isModalAllowed()) return;

    const resultsNode = renderModalResults();
    if (!resultsNode) return;

    openModal(resultsNode);
    return;
  }

  if (closeBtn) {
    closeModal();
  }
});

/* Close on ESC */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!isModalOpen()) return;

  closeModal();
});

/* =========================================================
   SAFETY: RESIZE
========================================================= */

window.addEventListener("resize", () => {
  if (!isModalAllowed() && isModalOpen()) {
    closeModal();
  }
});
