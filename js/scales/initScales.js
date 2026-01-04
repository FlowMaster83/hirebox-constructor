// ініціалізація всіх шкал

import { LABELS } from "../constants/labels.js";
import { createScaleRow } from "./createScaleRow.js";

export function initScales() {
  const container = document.getElementById("scales-container");
  LABELS.forEach((label) => createScaleRow(label, container));
}
