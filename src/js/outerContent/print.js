const PRINT_TITLES = {
  en: "HireBox - results EN",
  ua: "HireBox - результати UA",
  ru: "HireBox - результаты RU",
};

function waitForImages(root) {
  const images = root.querySelectorAll("img");

  return Promise.all(
    Array.from(images).map((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    }),
  );
}

export async function printResults() {
  const source = document.querySelector(".modal-results");
  if (!source) return;

  const originalTitle = document.title;

  const lang =
    document.documentElement.lang in PRINT_TITLES
      ? document.documentElement.lang
      : "ua";

  document.title = PRINT_TITLES[lang];

  // создаём print-root
  const printRoot = document.createElement("div");
  printRoot.id = "print-root";

  // глубокая копия результата
  printRoot.appendChild(source.cloneNode(true));
  document.body.appendChild(printRoot);

  // 🔒 страховка перезагрузки изображений (одна строка)
  printRoot.querySelectorAll("img").forEach((img) => {
    img.src = img.src;
  });

  // ⏳ ждём загрузку логотипа и других img
  await waitForImages(printRoot);

  // печать
  window.print();

  // очистка
  document.body.removeChild(printRoot);
  document.title = originalTitle;
}
