// Single-select tabs: exactly one category panel shown at a time.
(() => {
  const tabButtons = [...document.querySelectorAll('.tab-button[data-tab]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  if (tabButtons.length === 0) return;

  function activateTab(tab) {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab;
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });
})();
