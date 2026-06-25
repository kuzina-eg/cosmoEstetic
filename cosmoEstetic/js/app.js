/* ===== lazyload-init ===== */
(function () {
  'use strict';
  new LazyLoad({});
})();

/* ===== sliders ===== */
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

/* ===== fancybox-init ===== */
(function () {
    'use strict';

    Fancybox.defaults.template = {
        closeButton: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7.81199L16.188 7L12 11.188L7.81199 7L7 7.81199L11.188 12L7 16.188L7.81199 17L12 12.812L16.188 17L17 16.188L12.812 12L17 7.81199Z" /></svg>`,
    };

    function initFancybox() {

        if (typeof window !== 'undefined') {
            window.Fancybox = Fancybox;
        }

        Fancybox.bind('[data-fancybox]', {
            idle: false,
            Thumbs: {
                type: 'classic',
            },
            Toolbar: {
                display: {
                    left: [],
                    right: ['close'],
                },
            },
            Images: {
                zoom: false,
            },
        });

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-fancybox]');
            if (!trigger) return;
            const target = trigger.getAttribute('href') || trigger.getAttribute('data-src') || '';
            if (target.startsWith('#') && Fancybox.getInstance()) {
                Fancybox.close(true);
            }
        }, true);
    }

    initFancybox();
})();

/* ===== header-fixing ===== */
(function () {
    'use strict';

    function headerFixing() {
        const header = document.querySelector('.js-header');

        if (header) {
            const FIXED = 'is-fixed';
            const HIDDEN = 'is-hidden';
            const NO_ANIM = 'no-anim';
            let lastScrollTop = window.scrollY;

            const fixing = () => {
                const scrollTop = window.scrollY;
                const headerHeight = header.offsetHeight;
                const scrollingDown = scrollTop > lastScrollTop;

                if (scrollTop > (headerHeight * 1.2)) {
                    const justFixed = !header.classList.contains(FIXED);
                    if (justFixed) header.classList.add(NO_ANIM);

                    header.classList.add(FIXED);
                    header.classList.toggle(HIDDEN, scrollingDown);

                    if (justFixed) {
                        header.offsetHeight;
                        requestAnimationFrame(() => header.classList.remove(NO_ANIM));
                    }
                } else {
                    header.classList.remove(FIXED, HIDDEN);
                }

                lastScrollTop = scrollTop;
            };

            fixing();

            window.addEventListener('scroll', fixing, { passive: true });
        }
    }

    headerFixing();
})();

/* ===== password-toggle ===== */
(function () {
    'use strict';

    function passwordToggle() {
        document.querySelectorAll('.js-password-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                const wrap = btn.closest('.form-field__control') || btn.parentElement;
                const input = wrap && wrap.querySelector('input');
                if (!input) return;
                const show = input.type === 'password';
                input.type = show ? 'text' : 'password';
                btn.classList.toggle('is-active', show);
            });
        });
    }

    passwordToggle();
})();

/* ===== city-search ===== */
(function () {
    'use strict';

    function citySearch() {
        document.querySelectorAll('.js-city').forEach((form) => {
            const input = form.querySelector('.js-city-input');
            const list = form.querySelector('.js-city-suggestions');
            if (!input || !list) return;
            const items = Array.from(list.querySelectorAll('.js-city-suggestion'));

            const update = () => {
                const q = input.value.trim().toLowerCase();
                if (!q) { form.classList.remove('is-searching'); return; }
                let any = false;
                items.forEach((it) => {
                    const match = it.textContent.toLowerCase().includes(q);
                    it.style.display = match ? '' : 'none';
                    if (match) any = true;
                });
                form.classList.toggle('is-searching', any);
            };

            input.addEventListener('input', update);
            items.forEach((it) => it.addEventListener('click', () => {
                input.value = it.textContent.trim();
                form.classList.remove('is-searching');
            }));
        });
    }

    citySearch();
})();
