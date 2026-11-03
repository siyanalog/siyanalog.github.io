// Single-select tabs: exactly one category panel shown at a time. Switching
// cross-fades: the current panel fades out, then the next one fades in.
// The active tab is mirrored in the URL hash (e.g. #design-team) so a tab can
// be linked to directly.
(() => {
  const tabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.tab-button[data-tab]'));
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-panel]'));
  if (tabButtons.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FADE_MS = 160;

  let current = tabButtons.find((b) => b.classList.contains('is-active'))?.dataset.tab ?? tabButtons[0].dataset.tab!;
  let switchToken = 0;

  const panelFor = (tab: string) => panels.find((p) => p.dataset.panel === tab);

  function syncButtons(tab: string): void {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });
  }

  function showOnly(next: HTMLElement): void {
    panels.forEach((panel) => {
      panel.hidden = panel !== next;
      panel.classList.remove('is-leaving');
    });
  }

  function activateTab(tab: string): void {
    const next = panelFor(tab);
    if (!next) return;
    const previous = panelFor(current);
    const token = ++switchToken;
    current = tab;
    syncButtons(tab);

    if (reducedMotion.matches || !previous || previous === next || previous.hidden) {
      showOnly(next);
      return;
    }

    // Fade the old panel out, then swap and fade the new one in.
    previous.classList.add('is-leaving');
    window.setTimeout(() => {
      if (token !== switchToken) return; // a newer switch took over
      showOnly(next);
      next.classList.add('is-entering');
      void next.offsetWidth; // reflow so the fade-in starts from opacity 0
      next.classList.remove('is-entering');
    }, FADE_MS);
  }

  function tabFromHash(): string | null {
    const hash = decodeURIComponent(location.hash.slice(1));
    return tabButtons.some((b) => b.dataset.tab === hash) ? hash : null;
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab!;
      activateTab(tab);
      history.replaceState(null, '', `#${tab}`);
    });

    // Arrow keys / Home / End move between tabs, per the ARIA tabs pattern.
    button.addEventListener('keydown', (event) => {
      let target = -1;
      if (event.key === 'ArrowRight') target = (index + 1) % tabButtons.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabButtons.length - 1;
      if (target < 0) return;
      event.preventDefault();
      tabButtons[target].focus();
      tabButtons[target].click();
    });
  });

  window.addEventListener('hashchange', () => {
    const tab = tabFromHash();
    if (tab && tab !== current) activateTab(tab);
  });

  current = tabFromHash() ?? current;
  syncButtons(current);
  showOnly(panelFor(current)!);
})();
