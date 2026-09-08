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

/* ===== header-menu ===== */
(function () {
    'use strict';

    function headerMenu() {
        const header = document.querySelector('.js-header');
        if (!header) return;

        const burger = header.querySelector('.js-menu-burger');
        const menu = header.querySelector('.js-menu');
        if (!menu) return;

        const items = Array.from(header.querySelectorAll('.js-menu-item'));

        const closeBurger = () => {
            menu.classList.remove('is-open');
            if (burger) burger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('is-menu-open');
        };

        const closeDropdowns = (except) => {
            items.forEach((item) => {
                if (item !== except) item.classList.remove('is-open');
            });
        };

        if (burger) {
            burger.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = menu.classList.toggle('is-open');
                burger.setAttribute('aria-expanded', open ? 'true' : 'false');
                document.body.classList.toggle('is-menu-open', open);
                if (!open) closeDropdowns();
            });
        }

        items.forEach((item) => {
            const link = item.querySelector('.header__nav-link');
            if (!link) return;

            if (item.classList.contains('header__nav-item--has-dropdown')) {

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const willOpen = !item.classList.contains('is-open');
                    closeDropdowns(item);
                    item.classList.toggle('is-open', willOpen);
                });
            } else {

                link.addEventListener('click', () => closeBurger());
            }
        });

        header.querySelectorAll('.header__dropdown-link').forEach((link) => {
            link.addEventListener('click', () => {
                closeDropdowns();
                closeBurger();
            });
        });

        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                closeDropdowns();
                closeBurger();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdowns();
                closeBurger();
            }
        });

        const userMenu = header.querySelector('.js-user');
        if (userMenu) {
            const userBtn = userMenu.querySelector('.js-user-button');
            if (userBtn) {
                userBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const open = userMenu.classList.toggle('is-open');
                    userBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
                });
                document.addEventListener('click', (e) => {
                    if (!userMenu.contains(e.target)) userMenu.classList.remove('is-open');
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') userMenu.classList.remove('is-open');
                });
            }
        }
    }

    headerMenu();
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

/* ===== form-validation ===== */
(function () {
    'use strict';

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_MASK = '+{7} (000) 000-00-00';

    function isValid(input, form) {
        const name = input.getAttribute('name') || '';
        const type = (input.getAttribute('type') || '').toLowerCase();

        if (type === 'checkbox') {
            return input.checked;
        }

        const value = input.value.trim();

        if (!value) return false;

        if (type === 'email' || name === 'email') {
            return EMAIL_RE.test(value);
        }

        if (name === 'password_repeat') {
            const pass = form.querySelector('[name="password"]');
            return !pass || input.value === pass.value;
        }

        if (type === 'tel' || name === 'phone') {
            return value.replace(/\D/g, '').length >= 11;
        }

        return true;
    }

    function setState(input, valid) {
        const wrap = input.closest('.form-field');
        if (wrap) wrap.classList.toggle('is-invalid', !valid);
    }

    function formValidation() {
        const forms = document.querySelectorAll('[data-js-form]');

        forms.forEach((form) => {
            const inputs = Array.from(
                form.querySelectorAll('.form-field__input, .form-field input, .form-field textarea')
            ).filter((el) => el.name && !el.hasAttribute('data-optional'));

            if (!inputs.length) return;

            inputs.forEach((input) => {
                if (input.type === 'tel' || input.name === 'phone') {
                    IMask(input, { mask: PHONE_MASK });
                }
            });

            let submitted = false;

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                submitted = true;

                const modal = form.closest('.modal');
                if (modal) modal.classList.remove('is-invalid');

                let firstInvalid = null;
                inputs.forEach((input) => {
                    const ok = isValid(input, form);
                    setState(input, ok);
                    if (!ok && !firstInvalid) firstInvalid = input;
                });

                if (firstInvalid) {
                    firstInvalid.focus();
                    return;
                }

                form.reset();
                inputs.forEach((input) => setState(input, true));

                const isLogin = modal && modal.id === 'login';
                if (!isLogin && document.querySelector('#success')) {
                    Fancybox.show([{ src: '#success', type: 'inline' }]);
                } else {
                    Fancybox.close();
                }
            });

            inputs.forEach((input) => {
                const recheck = () => {
                    if (!submitted) return;
                    setState(input, isValid(input, form));

                    if (input.name === 'password') {
                        const repeat = form.querySelector('[name="password_repeat"]');
                        if (repeat && repeat.value.trim()) setState(repeat, isValid(repeat, form));
                    }
                };

                input.addEventListener('input', recheck);
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.addEventListener('change', recheck);
                }
            });
        });
    }

    formValidation();
})();

/* ===== cart ===== */
(function () {
    'use strict';

    function cart() {
        const root = document.querySelector('.js-cart');
        if (!root) return;

        const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
        let recalcTimeout = null;
        let recalcScheduled = false;

        const getDelivery = () => {
            const checkedInput = root.querySelector('.js-delivery input:checked');
            const label = checkedInput
                ? checkedInput.closest('.js-delivery')
                : root.querySelector('.js-delivery');
            const val = label ? Number(label.getAttribute('data-delivery')) : 0;
            return isNaN(val) ? 0 : val;
        };

        const recalc = () => {
            if (recalcScheduled) return;
            if (!root.isConnected) return;

            recalcScheduled = true;
            recalcTimeout = requestAnimationFrame(() => {
                let count = 0;
                let total = 0;
                let oldTotal = 0;

                root.querySelectorAll('.js-item-cart').forEach((item) => {
                    if (!item.isConnected) return;

                    const price = Number(item.getAttribute('data-price')) || 0;
                    const oldPrice = Number(item.getAttribute('data-old-price')) || price;
                    const qtyInput = item.querySelector('.count-control__input');
                    const qty = Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1);
                    count += qty;
                    total += price * qty;
                    oldTotal += oldPrice * qty;
                });

                const delivery = getDelivery();

                const setText = (sel, txt) => {
                    root.querySelectorAll(sel).forEach((el) => {
                        if (el.isConnected) el.textContent = txt;
                    });
                };

                setText('.js-cart-count', String(count));
                setText('.js-cart-old-total', fmt(oldTotal));
                setText('.js-cart-total', fmt(total));
                setText('.js-order-count', String(count));
                setText('.js-order-delivery', fmt(delivery));
                setText('.js-order-total', fmt(total + delivery));

                recalcScheduled = false;
                recalcTimeout = null;
            });
        };

        root.querySelectorAll('.js-item-cart').forEach((item) => {
            const input = item.querySelector('.count-control__input');
            const minus = item.querySelector('.js-count-minus');
            const plus = item.querySelector('.js-count-plus');

            const setQty = (v) => {
                if (input && input.isConnected) {
                    const newVal = Math.max(1, v);
                    input.value = String(newVal);
                    recalc();
                }
            };

            if (minus) {
                minus.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentVal = parseInt(input?.value, 10) || 1;
                    setQty(currentVal - 1);
                });
            }

            if (plus) {
                plus.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currentVal = parseInt(input?.value, 10) || 1;
                    setQty(currentVal + 1);
                });
            }

            if (input) {
                let inputTimeout = null;

                input.addEventListener('input', function() {
                    if (!this.isConnected) return;

                    if (inputTimeout) {
                        clearTimeout(inputTimeout);
                        inputTimeout = null;
                    }

                    const cleanValue = this.value.replace(/[^0-9]/g, '');
                    if (this.value !== cleanValue) {
                        this.value = cleanValue;
                    }

                    inputTimeout = setTimeout(() => {
                        if (this.isConnected) {
                            recalc();
                        }
                        inputTimeout = null;
                    }, 300);
                });

                input.addEventListener('blur', function() {
                    if (!this.isConnected) return;

                    const val = parseInt(this.value, 10);
                    if (!val || val < 1) {
                        this.value = '1';
                    }
                    recalc();
                });

                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.blur();
                    }
                });
            }
        });

        root.querySelectorAll('.js-cart-remove').forEach((btn) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const item = this.closest('.js-item-cart');
                if (item && item.isConnected) {
                    item.style.transition = 'opacity 0.3s';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        if (item.isConnected) {
                            item.remove();
                            recalc();
                        }
                    }, 300);
                }
            });
        });

        root.querySelectorAll('.js-delivery input').forEach((radio) => {
            radio.addEventListener('change', recalc);
        });

        const address = root.querySelector('.js-address');
        const addressToggle = root.querySelector('.js-address-toggle');
        if (address && addressToggle) {
            addressToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (address.isConnected) {
                    address.classList.toggle('is-open');
                }
            });
        }

        recalc();
    }

    cart();
})();
