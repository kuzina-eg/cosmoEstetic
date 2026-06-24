import IMask from 'imask';
import { Fancybox } from '@fancyapps/ui';

/*
    Лёгкая валидация форм под вёрстку модалок CosmoEstetic.
    Управляет уже свёрстанными состояниями — свою разметку НЕ создаёт:
      .form-field.is-invalid → показывает .form-field__error + красная рамка
      .modal.is-invalid       → показывает .modal__error (ошибка уровня формы, для бэкенда)
    Тексты ошибок берутся из разметки.

    Правила выводятся из самих полей:
      type="email" / name="email"   → required + корректный email
      name="password_repeat"        → required + совпадение с [name="password"]
      type="tel" / name="phone"     → маска + полный номер
      остальные input/textarea      → required
    Поле с атрибутом [data-optional] не валидируется.
*/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MASK = '+{7} (000) 000-00-00';

function isValid(input, form) {
    const name = input.getAttribute('name') || '';
    const type = (input.getAttribute('type') || '').toLowerCase();

    if (type === 'checkbox') {
        return input.checked; // обязательная галка (напр. согласие с офертой)
    }

    const value = input.value.trim();

    if (!value) return false; // required — общее правило

    if (type === 'email' || name === 'email') {
        return EMAIL_RE.test(value);
    }

    if (name === 'password_repeat') {
        const pass = form.querySelector('[name="password"]');
        return !pass || input.value === pass.value;
    }

    if (type === 'tel' || name === 'phone') {
        return value.replace(/\D/g, '').length >= 11; // +7 и 10 цифр
    }

    return true;
}

function setState(input, valid) {
    const wrap = input.closest('.form-field');
    if (wrap) wrap.classList.toggle('is-invalid', !valid);
}

export default function formValidation() {
    const forms = document.querySelectorAll('[data-js-form]');

    forms.forEach((form) => {
        const inputs = Array.from(
            form.querySelectorAll('.form-field__input, .form-field input, .form-field textarea')
        ).filter((el) => el.name && !el.hasAttribute('data-optional'));

        if (!inputs.length) return; // не дизайн-форма модалки — пропускаем

        // Маска телефона
        inputs.forEach((input) => {
            if (input.type === 'tel' || input.name === 'phone') {
                IMask(input, { mask: PHONE_MASK });
            }
        });

        let submitted = false; // «живую» перепроверку включаем после первой отправки

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            submitted = true;

            const modal = form.closest('.modal');
            if (modal) modal.classList.remove('is-invalid'); // сброс ошибки уровня формы

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

            // Успех. Статичная вёрстка без бэкенда — имитируем отправку:
            // сбрасываем поля и показываем модалку-подтверждение, если она есть.
            form.reset();
            inputs.forEach((input) => setState(input, true));

            // Логин не показывает success-модалку — просто закрываем окно
            const isLogin = modal && modal.id === 'login';
            if (!isLogin && document.querySelector('#success')) {
                Fancybox.show([{ src: '#success', type: 'inline' }]);
            } else {
                Fancybox.close();
            }
        });

        // Живая перепроверка после первой отправки
        inputs.forEach((input) => {
            const recheck = () => {
                if (!submitted) return;
                setState(input, isValid(input, form));

                // При правке пароля — перепроверить поле повтора
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
