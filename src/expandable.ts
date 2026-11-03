// Click-to-unfold blocks. A block is any [data-expandable] element containing
// a .exp-toggle button (the accessible control) and a .exp-details region.
//   data-expandable           clicking anywhere on the block toggles it
//   data-expandable="header"  only the header button toggles it (used for
//                             write-up sections, which hold text and links)
// Blocks can be nested; a click only affects the innermost block it landed in.
// The height animation itself is pure CSS (see .exp-details in styles.css).
(() => {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-expandable]'));

  function setOpen(block: HTMLElement, open: boolean): void {
    block.classList.toggle('is-open', open);
    block.querySelector(':scope > :is(h2, h3, .exp-toggle) .exp-toggle, :scope > .exp-toggle')
      ?.setAttribute('aria-expanded', String(open));
  }

  blocks.forEach((block) => {
    block.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (target.closest('a')) return;
      if (target.closest('[data-expandable]') !== block) return; // belongs to a nested block
      if (block.dataset.expandable === 'header') {
        if (!target.closest('.exp-toggle')) return;
      } else if (window.getSelection()?.toString()) {
        return; // don't collapse while the reader is selecting text to copy
      }
      setOpen(block, !block.classList.contains('is-open'));
    });
  });
})();
