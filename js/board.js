const cards = document.querySelectorAll('.card');
const board = document.querySelector('.board');
let zoomedCard = null;

function zoomIn(card) {
    zoomOut();
    const centerX = card.offsetLeft + card.offsetWidth / 2;
    const centerY = card.offsetTop + card.offsetHeight / 2;
    const scale = 2.5;
    const translateX = board.offsetWidth / 2 - centerX * scale;
    const translateY = board.offsetHeight / 2 - centerY * scale;

    board.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    card.classList.add("zoomed");
    zoomedCard = card;

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

const photos = [
  { src: "images/photos/photo1.jpg", caption: "Caption one", alt: "Describe photo one" },
  { src: "images/photos/photo2.jpg", caption: "Caption two", alt: "Describe photo two" },
  { src: "images/photos/photo3.jpg", caption: "Caption three", alt: "Describe photo three" },
];

let photoIndex = 0;
const albumPhoto = document.getElementById("album-photo");
const albumCaption = document.getElementById("album-caption");

function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  albumPhoto.src = photos[photoIndex].src;
  albumPhoto.alt = photos[photoIndex].alt;
  albumCaption.textContent = photos[photoIndex].caption;
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