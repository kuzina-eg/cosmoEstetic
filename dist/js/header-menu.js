(function () {
  'use strict';

  /* CosmoEstetic header: mobile burger + dropdown (mega-menu) toggle.
     Desktop opening is handled by CSS :hover; JS adds click/touch + accordion
     behaviour via the `.is-open` class, plus outside-click / Escape closing. */
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

      // Burger toggles the whole nav (mobile)
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
              // Parent of a dropdown: click/tap toggles it (touch + mobile accordion);
              // on hover devices CSS already opens it, click pins/unpins.
              link.addEventListener('click', (e) => {
                  e.preventDefault();
                  const willOpen = !item.classList.contains('is-open');
                  closeDropdowns(item);
                  item.classList.toggle('is-open', willOpen);
              });
          } else {
              // Plain link: close the mobile menu after navigating
              link.addEventListener('click', () => closeBurger());
          }
      });

      // Leaf links inside dropdowns close everything on navigate
      header.querySelectorAll('.header__dropdown-link').forEach((link) => {
          link.addEventListener('click', () => {
              closeDropdowns();
              closeBurger();
          });
      });

      // Close on outside click / Escape
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

      // User menu toggle (logged-in state)
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
