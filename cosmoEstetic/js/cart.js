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
