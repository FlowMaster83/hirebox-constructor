import { renderModalResults } from "./modalContent.js";

const MODAL_BREAKPOINT = 768;

function isModalAllowed() {
  return window.innerWidth > MODAL_BREAKPOINT;
}

let modalRoot = null;
let lastActiveElement = null;

function createModal() {
  if (modalRoot) return modalRoot;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="modal__overlay" data-close-modal></div>

    <div class="modal__content" role="dialog" aria-modal="true">
      <header class="modal__header">
        <div class="modal__logo">HireBox™</div>

        <button
          class="modal__close"
          type="button"
          data-close-modal
          aria-label="Close results"
        >
          ×
        </button>
      </header>

      <section class="modal__body"></section>
    </div>
  `;

  document.body.appendChild(modal);
  modalRoot = modal;

  return modalRoot;
}

export function openModal(contentNode, triggerEl = null) {
  lastActiveElement = triggerEl;

  const modal = createModal();
  const body = modal.querySelector(".modal__body");

  body.innerHTML = "";
  body.appendChild(contentNode);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modal.querySelector(".modal__close").focus();
}

export function closeModal() {
  if (!modalRoot) return;

  // 1️⃣ УБИРАЕМ ФОКУС С МОДАЛКИ
  const activeEl = document.activeElement;
  if (modalRoot.contains(activeEl)) {
    activeEl.blur();
  }

  // 2️⃣ ПРЯЧЕМ МОДАЛКУ
  modalRoot.classList.remove("is-open");
  modalRoot.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // 3️⃣ ВОЗВРАЩАЕМ ФОКУС НА ТРИГГЕР
  if (lastActiveElement instanceof HTMLElement) {
    lastActiveElement.focus();
  }

  lastActiveElement = null;
}

/* =========================================
   GLOBAL EVENTS
========================================= */

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");

  if (openBtn) {
    // ❌ на мобильных модалка полностью отключена
    if (!isModalAllowed()) return;

    const resultsNode = renderModalResults();
    openModal(resultsNode, openBtn);
    return;
  }

  if (e.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
