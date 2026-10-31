// ===========================================================================
// RED STRINGS: what is connected to what.
// Each pair is [from, to]; the string draws itself from the first to the second.
// Use a card id ("summary", "publications", "links", "photo-album") or the
// name of a pin painted in the background (see PAINTED_PINS below).
// To move a card's pin along its top edge, set --pin-x on the card in style.css.
// ===========================================================================
const CONNECTIONS = [
  ["summary", "publications"],
  ["photo-album", "summary"],
  ["publications", "newspaper"],
  ["links", "map"],
];

// Pins painted in board.jpg, as [left %, top %] of the board.
const PAINTED_PINS = {
  note: [12.55, 9.6],
  detective: [54.75, 13.15],
  newspaper: [95, 8.9],
  map: [10.45, 80],
  folder: [57.15, 68.7],
  crime: [83.85, 75.6],
};

const cards = document.querySelectorAll('.card');
const board = document.querySelector('.board');
let zoomedCard = null;

const narrowScreen = window.matchMedia("(max-width: 760px)");

function zoomIn(card) {
    zoomOut();
    if (narrowScreen.matches) {
        return;
    }
    const centerX = card.offsetLeft + card.offsetWidth / 2;
    const centerY = card.offsetTop + card.offsetHeight / 2;
    // A tilted card takes up more room than its unrotated box, so fit its rotated size.
    const angle = (parseFloat(getComputedStyle(card).rotate) || 0) * Math.PI / 180;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    const fitWidth = card.offsetWidth * cos + card.offsetHeight * sin;
    const fitHeight = card.offsetWidth * sin + card.offsetHeight * cos;
    const scale = Math.min(
        4,
        (window.innerWidth * 0.85) / fitWidth,
        (window.innerHeight * 0.85) / fitHeight
    );
    const translateX = window.innerWidth / 2 - board.offsetLeft - centerX * scale;
    const translateY = window.innerHeight / 2 - board.offsetTop - centerY * scale;

    board.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    card.classList.add("zoomed");
    zoomedCard = card;
}

function zoomOut() {
    board.style.transform = "";
    if (zoomedCard !== null) {
        zoomedCard.classList.remove("zoomed");
        zoomedCard = null;
    }
}

cards.forEach((card) => {
  const backTag = document.createElement("button");
  backTag.className = "back-tag";
  backTag.textContent = "back";
  backTag.addEventListener("click", (e) => {
    e.stopPropagation();
    zoomOut();
    card.focus({ preventScroll: true });
  });
  card.appendChild(backTag);

  // Make cards reachable with Tab and openable with Enter or Space.
  card.tabIndex = 0;
  card.addEventListener("keydown", (e) => {
    if (e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      card.click();
    }
  });

  card.addEventListener("click", () => {
    document.querySelector(".hint").classList.add("hidden");
    zoomIn(card);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    zoomOut();
  }
});

window.addEventListener("resize", () => {
  if (zoomedCard !== null) {
    zoomIn(zoomedCard);
  }
});

const photoCount = 26;
const photos = Array.from({ length: photoCount }, (_, i) => ({
  src: `images/photos/photo${i + 1}.jpg`,
  alt: `Photo ${i + 1}`,
}));

let photoIndex = 0;
const albumPhoto = document.getElementById("album-photo");
const albumWindow = albumPhoto.parentElement;

// Each photo is downloaded and decoded once, in the background, and remembered.
const photoCache = new Map();
function loadPhoto(index) {
  if (!photoCache.has(index)) {
    const img = new Image();
    img.src = photos[index].src;
    photoCache.set(index, img.decode().catch(() => {}));
  }
  return photoCache.get(index);
}

// Get the photos on either side ready, so the arrows respond instantly.
function preloadNeighbours() {
  loadPhoto((photoIndex + 1) % photos.length);
  loadPhoto((photoIndex - 1 + photos.length) % photos.length);
}

function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const requested = photoIndex;
  albumWindow.classList.add("loading");
  // Wait for both the photo and the fade-out (0.18s in style.css) before swapping.
  const fadedOut = new Promise((resolve) => setTimeout(resolve, 180));
  Promise.all([loadPhoto(requested), fadedOut]).then(() => {
    if (requested !== photoIndex) {
      return; // the visitor already clicked on to another photo
    }
    albumPhoto.src = photos[requested].src;
    albumPhoto.alt = photos[requested].alt;
    albumWindow.classList.remove("loading");
    preloadNeighbours();
  });
}

document.getElementById("prev-photo").addEventListener("click", (e) => {
  e.stopPropagation();
  showPhoto(photoIndex - 1);
});

document.getElementById("next-photo").addEventListener("click", (e) => {
  e.stopPropagation();
  showPhoto(photoIndex + 1);
});

albumPhoto.alt = photos[0].alt;
photoCache.set(0, Promise.resolve());

// ---------------------------------------------------------------------------
// Red strings
// Drawn behind the cards, from pin to pin. Positions come from offsetLeft /
// offsetTop, which ignore the board's zoom transform, so strings only need
// redrawing when a card's size or position changes, never while zooming.
// ---------------------------------------------------------------------------
const SVG_NS = "http://www.w3.org/2000/svg";
const PIN_OFFSET = 0.125; // pin center below the card's top edge, in cqw (see .card::before)
const stringsLayer = document.querySelector(".strings");
const strings = [];

function svgPath(className, index) {
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", className);
  // pathLength="1" lets the CSS draw animation use 0..1 instead of real lengths.
  path.setAttribute("pathLength", "1");
  path.style.setProperty("--i", index);
  stringsLayer.append(path);
  return path;
}

// Where a pin is on the board: a painted one, or a card's (taking its tilt into account).
function pinPosition(card) {
  if (typeof card === "string") {
    const [left, top] = PAINTED_PINS[card];
    return { x: left / 100 * board.offsetWidth, y: top / 100 * board.offsetHeight };
  }
  const style = getComputedStyle(card);
  const angle = (parseFloat(style.rotate) || 0) * Math.PI / 180;
  const pinX = parseFloat(style.getPropertyValue("--pin-x")) || 50; // percent of card width
  // The pin's offset from the card's center, before the tilt...
  const dx = (pinX / 100 - 0.5) * card.offsetWidth;
  const dy = -card.offsetHeight / 2 + PIN_OFFSET * board.offsetWidth / 100;
  // ...rotated by the tilt, the same way CSS rotates the card around its center.
  return {
    x: card.offsetLeft + card.offsetWidth / 2 + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: card.offsetTop + card.offsetHeight / 2 + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

// A card element, a painted pin's name, or null if the name is unknown.
function findPin(name) {
  return document.getElementById(name) || (name in PAINTED_PINS ? name : null);
}

CONNECTIONS.forEach(([fromName, toName], i) => {
  const from = findPin(fromName);
  const to = findPin(toName);
  if (!from || !to) {
    console.warn(`String skipped: no card or painted pin called "${from ? toName : fromName}"`);
    return;
  }
  strings.push({ from, to, shadow: svgPath("string-shadow", i), line: svgPath("string", i) });
});

function drawStrings() {
  const cqw = board.offsetWidth / 100;
  strings.forEach(({ from, to, shadow, line }) => {
    const a = pinPosition(from);
    const b = pinPosition(to);
    line.setAttribute("d", `M ${a.x} ${a.y} L ${b.x} ${b.y}`);
    // The shadow is the same line nudged down and right (cheaper than a blur filter).
    const sx = 0.06 * cqw;
    const sy = 0.14 * cqw;
    shadow.setAttribute("d", `M ${a.x + sx} ${a.y + sy} L ${b.x + sx} ${b.y + sy}`);
    line.setAttribute("stroke-width", 0.16 * cqw);
    shadow.setAttribute("stroke-width", 0.16 * cqw);
  });
}

// Redraw when the window resizes, fonts load, or anything else changes a card's size.
const resizeObserver = new ResizeObserver(drawStrings);
resizeObserver.observe(board);
cards.forEach((card) => resizeObserver.observe(card));

// Start the animations only once the board image and fonts have arrived,
// so they don't play while the page is still loading.
window.addEventListener("load", () => {
  document.fonts.ready.then(() => {
    drawStrings();
    board.classList.add("is-ready");
    preloadNeighbours();
  });
});
