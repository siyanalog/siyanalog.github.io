// Generic multi-select tag filtering, shared by any page that has
// .filter-button[data-filter] buttons and .filter-item[data-tags] items.
// An item is shown when it matches ANY selected tag. No tag selected = show
// every item. To add a new tag, add a filter-button and the matching tag to
// the relevant items' data-tags — no script changes needed.
(() => {
  const filterButtons = [...document.querySelectorAll('.filter-button[data-filter]')];
  const filterItems = [...document.querySelectorAll('.filter-item[data-tags]')];
  const noResultsMessage = document.querySelector('.no-results');
  const clearButton = document.querySelector('.filter-clear');
  const selectedTags = new Set();

  if (filterButtons.length === 0 || filterItems.length === 0) return;

  const getItemTags = (item) => new Set(
    (item.dataset.tags || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
  );

  function updateItems() {
    let visibleCount = 0;

    filterItems.forEach((item) => {
      const tags = getItemTags(item);
      const visible = selectedTags.size === 0 ||
        [...selectedTags].some((selectedTag) => tags.has(selectedTag));
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      const isSelected = selectedTags.has(button.dataset.filter.toLowerCase());
      button.classList.toggle('is-active', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });

    if (clearButton) clearButton.classList.toggle('is-visible', selectedTags.size > 0);
    if (noResultsMessage) noResultsMessage.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tag = button.dataset.filter.toLowerCase();
      if (selectedTags.has(tag)) selectedTags.delete(tag);
      else selectedTags.add(tag);
      updateItems();
    });
  });

  if (clearButton) clearButton.addEventListener('click', () => {
    selectedTags.clear();
    updateItems();
  });

  updateItems();
})();
