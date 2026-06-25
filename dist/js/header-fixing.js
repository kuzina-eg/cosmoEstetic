(function () {
  'use strict';

  /*
       ------------------
  	|   HEADER FIXING   |
  	  -----------------
  */
  /**
    * Fixing header on scroll
  */
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
