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
