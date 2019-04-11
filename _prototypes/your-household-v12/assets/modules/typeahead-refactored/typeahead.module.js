import TypeaheadComponent, { NEW_FIELD_VALUE_EVENT } from './typeahead.component';

class TypeaheadContainer {
  constructor(context) {
    this.context = context;
    this.typeahead = new TypeaheadComponent({
      context,
      onSelect: this.onSelect.bind(this),
      onUnsetResult: this.onUnsetResult.bind(this),
    });

    //this.typeahead.emitter.on(NEW_FIELD_VALUE_EVENT, value =>
    // console.log(value));

    this.code = context.querySelector('.js-typeahead-code');
  }

  onSelect(result) {
    return new Promise(resolve => {
      this.code.value = result.code;

      resolve();
    });
  }

  onUnsetResult() {
    this.code.value = '';
  }
}

function TypeaheadModule() {
  const typeaheads = [...document.querySelectorAll('.js-typeahead')];

  typeaheads.forEach(typeahead => new TypeaheadContainer(typeahead));
}

/**
 * Temporary - just for prototype
 */
document.addEventListener('TYPEAHEAD-READY', new TypeaheadModule());
