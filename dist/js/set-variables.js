(function () {
  'use strict';

  function setVariables() {
      /**
       * Set variable 1/100 screen height
       */
      const setScreenHeightProperty = () => {
          document.documentElement.style.setProperty('--vh', `${(window.innerHeight * 0.01).toFixed(2)}px`);
      };

      /**
       * Set variable 1/100 dynamic screen height
       */
      const setScreenDynamicHeightProperty = () => {
          document.documentElement.style.setProperty('--dvh', `${(window.innerHeight * 0.01).toFixed(2)}px`);
      };

      /**
       * Set header section heights (для расчёта высоты выпадающего меню)
       */
      const setHeaderHeights = () => {
          const top = document.querySelector('.header__top');
          const nav = document.querySelector('.header__nav');

          if (top) {
              document.documentElement.style.setProperty('--header-top-height', `${top.offsetHeight}px`);
          }
          if (nav) {
              document.documentElement.style.setProperty('--header-nav-height', `${nav.offsetHeight}px`);
          }
      };

      /**
       * Set variable screen mode
       */
      const setScreenMode = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;

          if (height > width) {
              document.documentElement.classList.add('is-vertical-mode');
          } else {
              document.documentElement.classList.remove('is-vertical-mode');
          }
      };

      setScreenHeightProperty();
      setScreenDynamicHeightProperty();
      setHeaderHeights();
      setScreenMode();

      window.addEventListener('resize', () => {
          setScreenDynamicHeightProperty();
          setHeaderHeights();
          setScreenMode();
      });
  }

  setVariables();
})();
