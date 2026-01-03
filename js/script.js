const labels = [
  "1. Передбачуваність",
  "2. Енергія",
  "3. Ентузіазм",
  "4. Наполегливість",
  "5. Самоконтроль",
  "6. Цілеспрямованість",
  "7. Комунікація",
  "8. Взаєморозуміння",
  "9. Впевненість в собі",
  "10. Об'єктивність",
  "11. Толерантність",
  "12. Організованість",
  "13. Інтерес",
  "14. Обмін",
  "15. Результати",
  "16. Кваліфікації",
  "17. Командний дух",
  "18. Основні принципи",
  "19. Тиск на роботі",
  "20. Готовність до роботи",
];

const container = document.getElementById("scales-container");

function createScale(label) {
  const row = document.createElement("div");
  row.className = "scale-row";
  row.dataset.label = label;

  row.innerHTML = `
    <div class="label">${label}: <span class="percent-value">0</span></div>
    <div class="chart-wrapper">
      <div class="chart">
        <div class="chart-track"><div class="chart-fill"></div></div>
        <div class="ticks">
          <span class="tick strong" style="left:0%">0</span>
          <span class="tick" style="left:10%">10</span>
          <span class="tick" style="left:20%">20</span>
          <span class="tick" style="left:30%">30</span>
          <span class="tick" style="left:40%">40</span>
          <span class="tick strong" style="left:50%">50</span>
          <span class="tick" style="left:60%">60</span>
          <span class="tick" style="left:70%">70</span>
          <span class="tick" style="left:80%">80</span>
          <span class="tick" style="left:90%">90</span>
          <span class="tick strong" style="left:100%">100</span>
        </div>
      </div>
    </div>
    <input class="user-input" type="number" name="user-value" placeholder="0" min="0" max="100" inputmode="numeric"/>
    <button class="clear-btn" type="button">CLEAR</button>
    <button>STAR</button>
    <button>CIRCLE</button>
    <button>POINTER</button>
  `;

  container.appendChild(row);

  const input = row.querySelector(".user-input");

  // Выделяем текст при фокусе
  input.addEventListener("focus", () => {
    input.select();
    input.placeholder = ""; // убираем placeholder
  });

  // Восстанавливаем placeholder при blur, если пусто или 0
  input.addEventListener("blur", () => {
    if (!input.value || Number(input.value) === 0) {
      input.value = "";
      input.placeholder = "0";
      row.querySelector(".percent-value").textContent = 0;
      row.querySelector(".chart-fill").style.width = "0%";
    }
  });
}

// Генерация всех шкал
labels.forEach((label) => createScale(label));

// Обновление прогрессбара и ограничение max 100
container.addEventListener("input", function (e) {
  if (e.target.classList.contains("user-input")) {
    let value = Math.min(100, Math.max(0, e.target.value)); // ограничение 0-100
    e.target.value = value; // если ввели больше 100, сразу исправляем на 100

    const row = e.target.closest(".scale-row");
    row.querySelector(".percent-value").textContent = value;
    row.querySelector(".chart-fill").style.width = value + "%";
  }
});

container.addEventListener("click", function (e) {
  if (e.target.classList.contains("clear-btn")) {
    const row = e.target.closest(".scale-row");
    const input = row.querySelector(".user-input");
    const percent = row.querySelector(".percent-value");
    const fill = row.querySelector(".chart-fill");

    input.value = "";
    input.placeholder = "0";
    percent.textContent = "0";
    fill.style.width = "0%";
    input.focus();
  }
});

const clearAllBtn = document.querySelector(".clear-all-btn");

const onClickClearAllBtn = () => {
  const rows = document.querySelectorAll(".scale-row");

  rows.forEach((row) => {
    const input = row.querySelector(".user-input");
    const percent = row.querySelector(".percent-value");
    const fill = row.querySelector(".chart-fill");

    input.value = "";
    input.placeholder = "0";
    percent.textContent = "0";
    fill.style.width = "0%";
  });
};

clearAllBtn.addEventListener("click", onClickClearAllBtn);

const fillBtn = document.querySelector(".fill-btn");
const select = document.querySelector(".user-select");

fillBtn.addEventListener("click", () => {
  const value = Number(select.value);

  // защита на случай пустого или некорректного значения
  if (isNaN(value) || value < 0 || value > 100) return;

  const rows = document.querySelectorAll(".scale-row");

  rows.forEach(row => {
    const input = row.querySelector(".user-input");
    const percent = row.querySelector(".percent-value");
    const fill = row.querySelector(".chart-fill");

    input.value = value;
    percent.textContent = value;
    fill.style.width = value + "%";
  });
});

