// Project cards expand in place to reveal their .project-card-details
// write-up, which is itself broken into independently-collapsible
// .accordion-item sections so a long write-up doesn't dump as one wall of
// text.
(() => {
  const projectCards = [...document.querySelectorAll('.project-card')];

  function toggleCard(card) {
    const details = card.querySelector('.project-card-details');
    const expanded = card.getAttribute('aria-expanded') === 'true';
    card.setAttribute('aria-expanded', String(!expanded));
    card.classList.toggle('is-selected', !expanded);
    if (details) details.hidden = expanded;
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      toggleCard(card);
    });

    card.addEventListener('keydown', (event) => {
      if (event.target !== card) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard(card);
      }
    });
  });

  document.querySelectorAll('.accordion-toggle').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const body = button.nextElementSibling;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      if (body) body.hidden = expanded;
    });
  });
})();
