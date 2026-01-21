// src/js/outerContent/print.js

export function printResults() {
  const source = document.querySelector(".modal-results");
  if (!source) return;

  // создаём print-root
  const printRoot = document.createElement("div");
  printRoot.id = "print-root";

  // глубокая копия результата
  printRoot.appendChild(source.cloneNode(true));
  document.body.appendChild(printRoot);

  // печать
  window.print();

  // очистка
  document.body.removeChild(printRoot);
}
