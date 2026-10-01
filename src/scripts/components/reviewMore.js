/*
    REVIEW MORE — длинные отзывы сворачиваются до четырёх строк,
    кнопка показывается только если текст действительно не влез.

    Селекторы:
      .js-review-text — текст отзыва (обрезается стилями)
      .js-review-more — кнопка «показать весь текст»
*/

const COLLAPSED = 'показать весь текст';
const EXPANDED = 'свернуть';

const initReview = (card) => {
    const text = card.querySelector('.js-review-text');
    const button = card.querySelector('.js-review-more');

    if (!text || !button) return null;

    // обрезка зависит от ширины карточки, поэтому меряем заново на ресайзе
    const update = () => {
        if (card.classList.contains('is-expanded')) return;
        const isOverflowing = text.scrollHeight - text.clientHeight > 1;
        button.hidden = !isOverflowing;
    };

    button.addEventListener('click', () => {
        const expanded = card.classList.toggle('is-expanded');
        button.textContent = expanded ? EXPANDED : COLLAPSED;
        if (!expanded) update();
    });

    update();
    return update;
};

export default function reviewMore() {
    const cards = [...document.querySelectorAll('.review-card')]
        .filter((card) => !card.hasAttribute('data-review-init'));

    if (!cards.length) return;

    const updaters = [];
    cards.forEach((card) => {
        card.setAttribute('data-review-init', '');
        const update = initReview(card);
        if (update) updaters.push(update);
    });

    // картинки и шрифты могут приехать позже и изменить раскладку
    window.addEventListener('load', () => updaters.forEach((u) => u()));

    let timer = null;
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => updaters.forEach((u) => u()), 150);
    });
}
