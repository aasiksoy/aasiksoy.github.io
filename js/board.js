// ===========================================================================
// RED STRINGS: which cards are connected.
// Each pair is [fromId, toId]; the string draws itself from the first card's
// pin to the second's. Card ids: "summary", "publications", "links", "photo-album".
// To move a card's pin along its top edge, set --pin-x on the card in style.css.
// ===========================================================================
const CONNECTIONS = [
  ["photo-album", "summary"],
  ["summary", "publications"],
];

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

function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  albumPhoto.src = photos[photoIndex].src;
  albumPhoto.alt = photos[photoIndex].alt;
}

document.getElementById("prev-photo").addEventListener("click", (e) => {
  e.stopPropagation();
  showPhoto(photoIndex - 1);
});

document.getElementById("next-photo").addEventListener("click", (e) => {
  e.stopPropagation();
  showPhoto(photoIndex + 1);
});

showPhoto(0);

// ---------------------------------------------------------------------------
// Red strings
// Positions come from offsetLeft/offsetTop, which ignore the board's zoom
// transform, so the strings only need redrawing when a card's size or
// position changes, not while zooming.
// ---------------------------------------------------------------------------
const SVG_NS = "http://www.w3.org/2000/svg";
const PIN_OFFSET = 0.125; // pin center below the card's top edge, in cqw (see .card::before)
const stringsLayer = document.querySelector(".strings");
const strings = [];
const pins = new Map();

function svgElement(name, className) {
  const el = document.createElementNS(SVG_NS, name);
  el.setAttribute("class", className);
  return el;
}

// Where a card's pin is on the board, taking the card's tilt and hover lift into account.
function pinPosition(card) {
  const style = getComputedStyle(card);
  const angle = (parseFloat(style.rotate) || 0) * Math.PI / 180;
  const [liftX = 0, liftY = 0] = style.translate === "none" ? [] : style.translate.split(" ").map(parseFloat);
  const pinX = parseFloat(style.getPropertyValue("--pin-x")) || 50; // percent of card width
  // The pin's offset from the card's center, before the tilt...
  const dx = (pinX / 100 - 0.5) * card.offsetWidth;
  const dy = -card.offsetHeight / 2 + PIN_OFFSET * board.offsetWidth / 100;
  // ...rotated by the tilt, the same way CSS rotates the card around its center.
  return {
    x: card.offsetLeft + card.offsetWidth / 2 + liftX + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: card.offsetTop + card.offsetHeight / 2 + liftY + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

function setupStrings() {
  stringsLayer.innerHTML = `
    <defs>
      <radialGradient id="pin-gradient" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" class="pin-stop-light" />
        <stop offset="0.32" class="pin-stop" />
        <stop offset="0.62" class="pin-stop-mid" />
        <stop offset="1" class="pin-stop-dark" />
      </radialGradient>
    </defs>`;
  const stringGroup = svgElement("g", "string-group");
  const pinGroup = svgElement("g", "pin-group");
  stringsLayer.append(stringGroup, pinGroup);

  CONNECTIONS.forEach(([fromId, toId], i) => {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (!from || !to) {
      console.warn(`String skipped: no card with id "${from ? toId : fromId}"`);
      return;
    }
    // pathLength="1" lets the CSS draw animation use 0..1 instead of real lengths.
    const shadow = svgElement("path", "string-shadow");
    const line = svgElement("path", "string");
    [shadow, line].forEach((path) => {
      path.setAttribute("pathLength", "1");
      path.style.setProperty("--i", i);
      stringGroup.append(path);
    });
    strings.push({ from, to, shadow, line });

    [from, to].forEach((card) => {
      if (!pins.has(card)) {
        const pin = svgElement("g", "pin");
        pin.append(svgElement("circle", "pin-shadow"), svgElement("circle", "pin-head"));
        pinGroup.append(pin);
        pins.set(card, pin);
      }
    });
  });
}

function drawStrings() {
  const pinRadius = 0.475 * board.offsetWidth / 100;
  strings.forEach(({ from, to, shadow, line }) => {
    const a = pinPosition(from);
    const b = pinPosition(to);
    // Let the string sag a little, like real thread.
    const sag = Math.hypot(b.x - a.x, b.y - a.y) * 0.04;
    const d = `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + sag} ${b.x} ${b.y}`;
    shadow.setAttribute("d", d);
    line.setAttribute("d", d);
  });
  pins.forEach((pin, card) => {
    const { x, y } = pinPosition(card);
    pin.setAttribute("transform", `translate(${x} ${y})`);
    pin.querySelectorAll("circle").forEach((circle) => circle.setAttribute("r", pinRadius));
  });
}

setupStrings();
drawStrings();

// Redraw when the window resizes, fonts load, or anything else changes a card's size.
const resizeObserver = new ResizeObserver(drawStrings);
resizeObserver.observe(board);
cards.forEach((card) => resizeObserver.observe(card));

// Follow the pins while a card lifts on hover.
let liftingCards = 0;
function followLift() {
  drawStrings();
  if (liftingCards > 0) {
    requestAnimationFrame(followLift);
  }
}
cards.forEach((card) => {
  card.addEventListener("transitionrun", (e) => {
    if (e.target === card && e.propertyName === "translate") {
      liftingCards++;
      if (liftingCards === 1) {
        requestAnimationFrame(followLift);
      }
    }
  });
  ["transitionend", "transitioncancel"].forEach((type) => {
    card.addEventListener(type, (e) => {
      if (e.target === card && e.propertyName === "translate") {
        liftingCards = Math.max(0, liftingCards - 1);
        drawStrings();
      }
    });
  });
});