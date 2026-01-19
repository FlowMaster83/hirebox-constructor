// src/js/modal/modal.js
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

// 🔴 экспортируемый флаг автозакрытия
export let modalAutoClosed = false;

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

let scrollY = 0;

export function openModal() {
  if (!isModalAllowed()) return;

  // сохраняем текущую позицию
  scrollY = window.scrollY;

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  // дальше — твой текущий код
  modalAutoClosed = false;
  lastFocusedElement = document.activeElement;

  const result = renderModalResults();
  if (!result) return;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(result.content);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  modal.querySelector(".modal-close-btn")?.focus();
}


export function closeModal() {
  if (!isModalOpen()) return;

  const active = document.activeElement;
  if (modalRoot.contains(active)) {
    active.blur();
  }

  if (lastFocusedElement?.focus) {
    lastFocusedElement.focus();
  }

  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");

  modalRoot.querySelector(".modal__body").innerHTML = "";

  // восстановление скролла
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollY);
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
 * автозакрытие фиксируем флагом
 */
window.addEventListener("resize", () => {
  if (!isModalAllowed() && isModalOpen()) {
    modalAutoClosed = true;
    closeModal();
  }
});