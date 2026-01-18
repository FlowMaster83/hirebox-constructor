// modal.js
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
  return modalRoot?.classList.contains("is-open");
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

    <div class="modal__wrap">
      <div class="modal__content" role="dialog" aria-modal="true">
        <button
          class="modal-close-btn"
          type="button"
          aria-label="Close results"
          data-close-modal
        >×</button>

        <section class="modal__body"></section>
      </div>

      <div class="modal-actions">
        <button class="modal-action-btn" data-action="pdf">PDF</button>
        <button class="modal-action-btn" data-action="png">PNG</button>
        <button class="modal-action-btn" data-action="print">PRINT</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modalRoot = modal;

  return modalRoot;
}

/* =========================================================
   OPEN / CLOSE
========================================================= */

export function openModal() {
  if (!isModalAllowed()) return;

  lastFocusedElement = document.activeElement;

  const result = renderModalResults();
  if (!result) return;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(result.content);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  modal.querySelector(".modal-close-btn")?.focus();

  // actions — заглушки (pre-A4)
  modal.querySelector('[data-action="pdf"]').onclick = () =>
    console.log("PDF");
  modal.querySelector('[data-action="png"]').onclick = () =>
    console.log("PNG");
  modal.querySelector('[data-action="print"]').onclick = () =>
    console.log("PRINT");
}

export function closeModal() {
  if (!isModalOpen()) return;

  // 1. Если фокус сейчас внутри модалки — убираем его
  const active = document.activeElement;
  if (modalRoot.contains(active)) {
    active.blur();
  }

  // 2. Возвращаем фокус туда, откуда пришли
  if (lastFocusedElement?.focus) {
    lastFocusedElement.focus();
  }

  // 3. Теперь безопасно скрываем модалку для a11y
  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");

  modalRoot.querySelector(".modal__body").innerHTML = "";
  document.body.style.overflow = "";
}


/* =========================================================
   GLOBAL EVENTS
========================================================= */

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-open-modal]")) {
    openModal();
    return;
  }

  if (e.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isModalOpen()) {
    closeModal();
  }
});

/**
 * ≤640px — модалки не существует
 * Закрываем её ЛОГИЧЕСКИ, а не только визуально
 */
window.addEventListener("resize", () => {
  if (!isModalAllowed() && isModalOpen()) {
    closeModal();
  }
});
 