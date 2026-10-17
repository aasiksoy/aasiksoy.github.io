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
    const scale = Math.min(
        3,
        (window.innerWidth * 0.85) / card.offsetWidth,
        (window.innerHeight * 0.85) / card.offsetHeight
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
  });
  card.appendChild(backTag);

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