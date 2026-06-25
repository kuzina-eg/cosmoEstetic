(function () {
  'use strict';

  /*
  	Fancybox
  	https://fancyapps.com/docs/ui/fancybox/
  */

  // Fancybox.defaults.dragToClose = false;
  // Fancybox.defaults.Thumbs = false;
  // Fancybox.defaults.infinite = false;
  Fancybox.defaults.template = {
  	closeButton: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7.81199L16.188 7L12 11.188L7.81199 7L7 7.81199L11.188 12L7 16.188L7.81199 17L12 12.812L16.188 17L17 16.188L12.812 12L17 7.81199Z" /></svg>`,
  };

  function initFancybox() {
      // Доступ к Fancybox из любого места (программное открытие модалок, отладка)
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

      // Переходы между модалками (логин ↔ регистрация и т.п.) не должны копить
      // инстансы Fancybox. Перед открытием новой инлайн-модалки (href="#...")
      // закрываем уже открытые. Capture-фаза — раньше собственного обработчика Fancybox.
      document.addEventListener('click', (e) => {
          const trigger = e.target.closest('[data-fancybox]');
          if (!trigger) return;
          const target = trigger.getAttribute('href') || trigger.getAttribute('data-src') || '';
          if (target.startsWith('#') && Fancybox.getInstance()) {
              Fancybox.close(true); // закрыть все открытые модалки перед открытием новой
          }
      }, true);
  }

  initFancybox();
})();
