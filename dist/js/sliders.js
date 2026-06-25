(function () {
  'use strict';

  function initSwiper() {
    new Swiper('.js-promo', {
      keyboard: { enabled: true, onlyInViewport: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.promo__pagination', clickable: true },
      effect: 'fade',
      slidesPerView: '1',
      spaceBetween: 20,
      loop: true,
    });

    var swiperThumbs = new Swiper('.js-thumbs-photo', {
      direction: 'horizontal',
      slidesPerView: 3,
      spaceBetween: 16,
      watchSlidesProgress: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '.js-gallery-slider-prev', nextEl: '.js-gallery-slider-next' },
    });

    new Swiper('.js-reviews', {
      slidesPerView: 4,
      spaceBetween: 40,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '.js-reviews-prev', nextEl: '.js-reviews-next' },
      pagination: { el: '.js-reviews-pagination', clickable: true },
      breakpoints: {
        1200: { slidesPerView: 4, spaceBetween: 40 },
        992: { slidesPerView: 3, spaceBetween: 32 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        0: { slidesPerView: 1, spaceBetween: 16 },
      },
    });

    new Swiper('.js-main-photo', {
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '.js-photo-prev', nextEl: '.js-photo-next' },
      thumbs: { swiper: swiperThumbs },
      slidesPerView: '1',
      spaceBetween: 16,
    });
  }

  initSwiper();
})();
