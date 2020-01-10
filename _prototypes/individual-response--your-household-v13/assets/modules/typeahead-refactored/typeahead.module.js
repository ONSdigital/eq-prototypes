import TypeaheadContainer from './typeahead.container';

function TypeaheadModule() {
  const typeaheads = [...document.querySelectorAll('.js-typeahead')];

  typeaheads.forEach(typeahead => new TypeaheadContainer(typeahead));
}

/**
 * Temporary - just for prototype, should belong in main/boot file
 */
document.addEventListener('TYPEAHEAD-READY', () => new TypeaheadModule());
