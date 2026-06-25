(function () {
  'use strict';

  /*
      DROPDOWN — одиночный select (кнопка + список опций + скрытый input).
      Селекторы:
        .js-dropdown          — обёртка
        .js-dropdown-button   — кнопка открытия
        .js-dropdown-button-text — текст кнопки
        .js-dropdown-popup    — выпадающая панель
        .js-dropdown-list     — список опций
        .js-dropdown-scroll   — скролл-контейнер
        .js-dropdown-option   — опция
        .js-dropdown-input    — скрытый input со значением
  */

  let dropdowns = document.querySelectorAll('.js-dropdown');
  let isOpeningDropdown = true;
  const duration = 300;

  const getActiveDropdown = () => document.querySelector('.js-dropdown.is-active');
  const getFocusedOption = (dropdownEl) => dropdownEl.querySelector('.js-dropdown-option.is-focused');

  const closeDropdownActive = (event) => {
      if (getActiveDropdown() && isOpeningDropdown) {
          isOpeningDropdown = false;

          const active = getActiveDropdown();
          const dropdownPopup = active.querySelector('.js-dropdown-popup');
          const dropdownButton = active.querySelector('.js-dropdown-button');
          const focused = getFocusedOption(active);

          if (focused) focused.classList.remove('is-focused');

          if (dropdownButton) {
              dropdownButton.focus();
              if (event) event.preventDefault();
          }

          active.classList.remove('is-active');
          if (dropdownPopup) dropdownPopup.setAttribute('aria-hidden', true);

          setTimeout(() => { isOpeningDropdown = true; }, duration);
      }
  };

  const initDropdown = (dropdownEl) => {
      const dropdownPopup = dropdownEl.querySelector('.js-dropdown-popup');
      const dropdownScroll = dropdownEl.querySelector('.js-dropdown-scroll');
      const dropdownList = dropdownEl.querySelector('.js-dropdown-list');
      const dropdownOptions = dropdownEl.querySelectorAll('.js-dropdown-option');
      const dropdownInput = dropdownEl.querySelector('.js-dropdown-input');
      const dropdownButton = dropdownEl.querySelector('.js-dropdown-button');
      const dropdownButtonText = dropdownEl.querySelector('.js-dropdown-button-text');
      const optionsCount = dropdownOptions.length;
      const dropdownId = Date.now();
      let optionFocusedIndex = -1;
      let startButtonText = null;
      let dropdownInputStartValue = null;

      const getSelectedOption = () => dropdownEl.querySelector('.js-dropdown-option.is-selected') || false;

      const getSelectedIndex = () => (getSelectedOption()
          ? [].indexOf.call(dropdownOptions, getSelectedOption())
          : -1);

      const updateFocusedOption = (newIndex) => {
          const prevOption = dropdownOptions[optionFocusedIndex];
          const option = dropdownOptions[newIndex];

          if (prevOption) {
              prevOption.classList.remove('is-focused');
              prevOption.setAttribute('aria-selected', false);
          }
          if (option) {
              option.classList.add('is-focused');
              option.setAttribute('aria-selected', true);
              if (dropdownList) dropdownList.setAttribute('aria-activedescendant', option.id);
          }

          optionFocusedIndex = newIndex;
      };

      const setScrollTop = () => {
          const focusedOption = getFocusedOption(dropdownEl);

          if (dropdownScroll && focusedOption) {
              const dropdownScrollHeight = dropdownScroll.clientHeight;
              const { height } = focusedOption.getBoundingClientRect();
              const offsetTop = focusedOption.offsetTop;

              if ((offsetTop + height - dropdownScroll.scrollTop) > dropdownScrollHeight) {
                  dropdownScroll.scrollTop = offsetTop + height - dropdownScrollHeight;
              }
              if ((offsetTop - dropdownScroll.scrollTop) < 0) {
                  dropdownScroll.scrollTop = offsetTop;
              }
          }
      };

      const openDropdown = () => {
          if (isOpeningDropdown) {
              isOpeningDropdown = false;

              const active = getActiveDropdown();
              if (active && active !== dropdownEl) {
                  active.classList.remove('is-active');
                  dropdownEl.classList.add('is-active');
              } else {
                  dropdownEl.classList.toggle('is-active');
              }

              if (dropdownEl.classList.contains('is-active')) {
                  dropdownPopup.setAttribute('aria-hidden', false);
                  if (dropdownList) setTimeout(() => dropdownList.focus(), duration);
                  setScrollTop();
                  if (dropdownButton) dropdownButton.setAttribute('aria-expanded', true);
              } else {
                  dropdownPopup.setAttribute('aria-hidden', true);
                  if (dropdownButton) dropdownButton.setAttribute('aria-expanded', false);
              }

              if (dropdownInput) updateFocusedOption(getSelectedIndex());

              setTimeout(() => { isOpeningDropdown = true; }, duration);
          }
      };

      const changeDropdown = (dropdownOption, isChangeEvent) => {
          if (isOpeningDropdown) {
              isOpeningDropdown = false;

              const selected = dropdownEl.querySelector('.js-dropdown-option.is-selected');
              const value = dropdownOption.getAttribute('data-value');
              const valueText = dropdownOption.getAttribute('data-text-value');

              if (selected) {
                  selected.classList.remove('is-selected');
                  selected.setAttribute('aria-selected', 'false');
              }

              dropdownEl.classList.remove('is-active');
              dropdownEl.classList.remove('is-placeholder');

              dropdownOption.classList.add('is-selected');
              dropdownOption.setAttribute('aria-selected', 'true');
              if (dropdownList) dropdownList.setAttribute('aria-activedescendant', dropdownOption.id);

              if (dropdownButtonText) {
                  dropdownButtonText.textContent = valueText || value || '';
              }
              if (dropdownButton) dropdownButton.setAttribute('aria-expanded', false);

              if (dropdownInput) {
                  dropdownInput.value = value;
                  dropdownInput.classList.remove('is-error');
                  if (isChangeEvent) dropdownInput.dispatchEvent(new Event('change'));
              }

              setTimeout(() => {
                  isOpeningDropdown = true;
                  if (dropdownPopup) dropdownPopup.setAttribute('aria-hidden', true);
              }, duration);
          }
      };

      const resetDropdown = () => {
          const selectedOption = dropdownEl.querySelector('.js-dropdown-option.is-selected');

          if (dropdownButtonText) dropdownButtonText.textContent = startButtonText || '';
          if (dropdownInput) dropdownInput.value = dropdownInputStartValue || null;
          if (selectedOption) selectedOption.classList.remove('is-selected');
          if (dropdownScroll) dropdownScroll.scrollTop = 0;
      };

      dropdownEl.setAttribute('data-dropdown-init', '');

      if (dropdownButtonText) {
          dropdownButtonText.id = `dropdown-button-text-${dropdownId}`;
          startButtonText = dropdownButtonText.textContent;
      }

      if (dropdownButton) {
          if (dropdownButtonText) dropdownButton.setAttribute('aria-labelledby', dropdownButtonText.id);
          dropdownButton.id = `dropdown-button-${dropdownId}`;
          dropdownButton.addEventListener('click', () => openDropdown());
      }

      dropdownOptions.forEach((option, index) => {
          option.id = `dropdown-option-${dropdownId}-${index + 1}`;
          option.addEventListener('click', () => changeDropdown(option, true));
      });

      if (dropdownInput) {
          dropdownInputStartValue = dropdownInput.value;

          dropdownInput.addEventListener('change', (event) => {
              const optionCurrent = dropdownEl.querySelector(`.js-dropdown-option[data-value="${event.target.value}"]`);
              if (optionCurrent) changeDropdown(optionCurrent);
          });

          updateFocusedOption(getSelectedIndex());
          dropdownEl.resetDropdown = () => resetDropdown();
      }

      dropdownEl.addEventListener('keyup', (e) => {
          if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'Space') {
              if (document.activeElement === dropdownButton) openDropdown();

              if (document.activeElement.closest('.js-dropdown-list')
                  && dropdownEl.classList.contains('is-active')) {
                  if (getFocusedOption(dropdownEl)) {
                      changeDropdown(getFocusedOption(dropdownEl));
                  } else {
                      closeDropdownActive();
                  }
                  if (dropdownButton) dropdownButton.focus();
              }
          }
      });

      dropdownEl.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
              updateFocusedOption(optionFocusedIndex < optionsCount - 1 ? optionFocusedIndex + 1 : 0);
              setScrollTop();
              e.preventDefault();
          }
          if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
              updateFocusedOption(optionFocusedIndex > 0 ? optionFocusedIndex - 1 : optionsCount - 1);
              setScrollTop();
              e.preventDefault();
          }
          if ((e.code === 'Tab' || e.key === 'Tab')
              && document.activeElement.closest('.js-dropdown.is-active')) {
              closeDropdownActive(e);
          }
          if (e.key === 'Escape' || e.code === 'Escape') {
              closeDropdownActive(e);
          }
      });
  };

  const setDropdowns = () => {
      dropdowns = document.querySelectorAll('.js-dropdown');
      dropdowns.forEach((dropdownEl) => {
          if (!dropdownEl.hasAttribute('data-dropdown-init')) initDropdown(dropdownEl);
      });
  };

  // Закрытие при клике вне дропдауна
  document.addEventListener('click', (event) => {
      if (!event.target.closest('.js-dropdown')) closeDropdownActive(event);
  });

  // Закрытие при уходе фокуса по Tab за пределы активного дропдауна
  document.addEventListener('keyup', (event) => {
      if ((event.code === 'Tab' || event.key === 'Tab')
          && getActiveDropdown()
          && !document.activeElement.closest('.js-dropdown.is-active')) {
          closeDropdownActive(event);
      }
  });

  setDropdowns();
})();
