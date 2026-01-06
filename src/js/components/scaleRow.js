import { createMarker } from "./markers.js";

const track = row.querySelector(".chart-track");

const markers = {
  solid: createMarker("solid"),
  dotted: createMarker("dotted"),
  star: createMarker("star"),
  check: createMarker("check"),
};

Object.values(markers).forEach((marker) => {
  track.appendChild(marker);
});
