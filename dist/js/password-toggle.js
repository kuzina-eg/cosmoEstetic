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
