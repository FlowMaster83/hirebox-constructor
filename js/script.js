const labels = [
  "1. Передбачуваність", "2. Енергія", "3. Ентузіазм", "4. Наполегливість",
  "5. Самоконтроль", "6. Цілеспрямованість", "7. Комунікація", "8. Взаєморозуміння",
  "9. Впевненість в собі", "10. Об'єктивність", "11. Толерантність", "12. Організованість",
  "13. Інтерес", "14. Обмін", "15. Результати", "16. Кваліфікації",
  "17. Командний дух", "18. Основні принципи", "19. Тиск на роботі", "20. Готовність до роботи",
];

const container = document.getElementById("scales-container");

function createScale(label) {
  const row = document.createElement("div");
  row.className = "scale-row";
  
  row.innerHTML = `
    <div class="label">${label}: <span class="percent-value">0</span></div>
    <div class="chart-wrapper">
      <div class="chart-track"><div class="chart-fill"></div></div>
      <div class="ticks">
        <span class="tick" style="left:0%">0</span>
        <span class="tick" style="left:50%">50</span>
        <span class="tick" style="left:100%">100</span>
      </div>
    </div>
    <input class="user-input" type="number" placeholder="0" min="0" max="100">
    <button class="clear-btn" type="button">CLEAR</button>
    <button type="button">STAR</button>
    <button type="button">CIRCLE</button>
    <button type="button">POINTER</button>
  `;

  container.appendChild(row);

  const input = row.querySelector(".user-input");
  const fill = row.querySelector(".chart-fill");
  const valDisplay = row.querySelector(".percent-value");

  // Оновлення при вводі
  input.addEventListener("input", (e) => {
    let val = Math.min(100, Math.max(0, e.target.value));
    e.target.value = val || ""; // дозволяємо порожнє поле при видаленні
    fill.style.width = `${val}%`;
    valDisplay.textContent = val || 0;
  });

  // Очищення рядка
  row.querySelector(".clear-btn").addEventListener("click", () => {
    input.value = "";
    fill.style.width = "0%";
    valDisplay.textContent = "0";
  });
}

labels.forEach(createScale);

// Загальні кнопки (Fill All / Clear All)
document.querySelector(".fill-btn").addEventListener("click", () => {
  const val = document.getElementById("main-select").value;
  document.querySelectorAll(".scale-row").forEach(row => {
    row.querySelector(".user-input").value = val;
    row.querySelector(".chart-fill").style.width = `${val}%`;
    row.querySelector(".percent-value").textContent = val;
  });
});

document.querySelector(".clear-all-btn").addEventListener("click", () => {
  document.querySelectorAll(".scale-row").forEach(row => {
    row.querySelector(".user-input").value = "";
    row.querySelector(".chart-fill").style.width = "0%";
    row.querySelector(".percent-value").textContent = "0";
  });
});