const cards = document.querySelectorAll('.card');

cards.forEach((card) => {
    card.addEventListener('pointerdown', () => {
        console.log(card.id, card.offsetLeft, card.offsetTop, 
        card.offsetWidth, card.offsetHeight);
    })
});