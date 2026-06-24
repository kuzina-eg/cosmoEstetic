import Swiper from 'swiper';
import {
    Keyboard,
    Navigation,
    Pagination,
    FreeMode,
    // Mousewheel,
    EffectFade,
    Autoplay,
    Thumbs,
} from 'swiper/modules';

export default function initSwiper() {

    // Hero-слайдер временно отключён (hero статичный). Вернуть — раскомментировать + восстановить разметку слайдера в Hero.astro.
    // new Swiper('.js-hero', {
    //     modules: [Pagination, EffectFade, Autoplay, Keyboard],
    //     effect: 'fade',
    //     loop: true,
    //     autoplay: { delay: 7000, disableOnInteraction: false },
    //     pagination: { el: '.hero__pagination', clickable: true },
    //     slidesPerView: 1,
    // });

    new Swiper('.js-promo', {
        modules: [
            Keyboard,
            Navigation,
            Pagination,
            // FreeMode,
            // Mousewheel
            EffectFade,
            Autoplay
        ],
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.promo__pagination',
            clickable: true,
        },
        effect: "fade",
        slidesPerView: '1',
        spaceBetween: 20,
        loop: true,
    });


    let swiperThumbs = new Swiper('.js-thumbs-photo', {
        modules: [
            Keyboard,
            Navigation,
        ],
        direction: 'horizontal',
        slidesPerView: 3,
        spaceBetween: 16,
        watchSlidesProgress: true,
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        navigation: {
            prevEl: '.js-gallery-slider-prev',
            nextEl: '.js-gallery-slider-next',
        },
    });
    new Swiper('.js-reviews', {
        modules: [Keyboard, Navigation, Pagination],
        slidesPerView: 4,
        spaceBetween: 40,
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: { prevEl: '.js-reviews-prev', nextEl: '.js-reviews-next' },
        pagination: { el: '.js-reviews-pagination', clickable: true },
        breakpoints: {
            1200: { slidesPerView: 4, spaceBetween: 40 },
            992:  { slidesPerView: 3, spaceBetween: 32 },
            768:  { slidesPerView: 2, spaceBetween: 24 },
            0:    { slidesPerView: 1, spaceBetween: 16 },
        },
    });

    let swiperMain = new Swiper('.js-main-photo', {
        modules: [
            Keyboard,
            Navigation,
            Thumbs
        ],
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        navigation: {
            prevEl: '.js-photo-prev',
            nextEl: '.js-photo-next',
        },
        thumbs: {
            swiper: swiperThumbs,
        },
        slidesPerView: '1',
        spaceBetween: 16,
    });
}
