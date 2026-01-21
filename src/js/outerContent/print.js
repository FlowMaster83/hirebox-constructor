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

  // const date = new Date().toLocaleDateString("uk-UA");

  // const dateNode = document.createElement("div");
  // dateNode.className = "print-date";
  // dateNode.textContent = date;

  // printRoot.appendChild(dateNode);

  // печать
  window.print();

  // очистка
  document.body.removeChild(printRoot);
}
