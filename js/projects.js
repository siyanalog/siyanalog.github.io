// Expand/collapse project cards to reveal their .project-card-details block.
(() => {
  const projectCards = [...document.querySelectorAll('.project-card')];

  projectCards.forEach((card) => {
    const detailsId = card.getAttribute('aria-controls');
    const details = detailsId ? document.getElementById(detailsId) : null;
    if (!details) return;

    const toggle = () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', String(!expanded));
      details.hidden = expanded;
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      toggle();
    });

    card.addEventListener('keydown', (event) => {
      if (event.target !== card) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });
  });
})();
