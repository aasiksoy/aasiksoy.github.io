const cards = document.querySelectorAll('.card');
const board = document.querySelector('.board');
cards.forEach((card) => {
    card.addEventListener('click', () => {
        const  centerX = card.offsetLeft + card.offsetWidth/2;
        const centerY= card.offsetTop + card.offsetHeight/2;
        const scale = 2.5
        const translateX = (board.offsetWidth/2 - centerX) * scale;
        const translateY = (board.offsetHeight/2 - centerY) * scale;
        board.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        console.log(card.id, card.offsetLeft, card.offsetTop, 
        card.offsetWidth, card.offsetHeight, centerX, centerY);
    })
});