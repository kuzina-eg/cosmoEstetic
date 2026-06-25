
export default function cart() {
    const root = document.querySelector('.js-cart');
    if (!root) return;

    const fmt = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

    const getDelivery = () => {
        // .js-delivery is on the <label> element; the radio input is inside it
        const checkedInput = root.querySelector('.js-delivery input:checked');
        const label = checkedInput
            ? checkedInput.closest('.js-delivery')
            : root.querySelector('.js-delivery');
        const val = label ? Number(label.getAttribute('data-delivery')) : 0;
        return isNaN(val) ? 0 : val;
    };

    const recalc = () => {
        let count = 0;
        let total = 0;
        let oldTotal = 0;

        root.querySelectorAll('.js-item-cart').forEach((item) => {
            const price = Number(item.getAttribute('data-price')) || 0;
            const oldPrice = Number(item.getAttribute('data-old-price')) || price;
            const qtyInput = item.querySelector('.count-control__input');
            const qty = Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1);
            count += qty;
            total += price * qty;
            oldTotal += oldPrice * qty;
        });

        const delivery = getDelivery();

        const setText = (sel, txt) =>
            root.querySelectorAll(sel).forEach((el) => {
                el.textContent = txt;
            });

        setText('.js-cart-count', String(count));
        setText('.js-cart-old-total', fmt(oldTotal));
        setText('.js-cart-total', fmt(total));
        setText('.js-order-count', String(count));
        setText('.js-order-delivery', fmt(delivery));
        setText('.js-order-total', fmt(total + delivery));
    };

    // Quantity +/- and manual input
    root.querySelectorAll('.js-item-cart').forEach((item) => {
        const input = item.querySelector('.count-control__input');
        const minus = item.querySelector('.js-count-minus');
        const plus = item.querySelector('.js-count-plus');

        const setQty = (v) => {
            input.value = String(Math.max(1, v));
            recalc();
        };

        if (minus) minus.addEventListener('click', () => setQty((parseInt(input.value, 10) || 1) - 1));
        if (plus) plus.addEventListener('click', () => setQty((parseInt(input.value, 10) || 1) + 1));
        if (input) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
                recalc();
            });
            input.addEventListener('blur', () => {
                if (!parseInt(input.value, 10)) input.value = '1';
                recalc();
            });
        }
    });

    // Remove item
    root.querySelectorAll('.js-cart-remove').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.js-item-cart');
            if (item) item.remove();
            recalc();
        });
    });

    // Delivery change
    root.querySelectorAll('.js-delivery input').forEach((radio) => {
        radio.addEventListener('change', recalc);
    });

    // Address accordion
    const address = root.querySelector('.js-address');
    const addressToggle = root.querySelector('.js-address-toggle');
    if (address && addressToggle) {
        addressToggle.addEventListener('click', () => address.classList.toggle('is-open'));
    }

    recalc();
}
