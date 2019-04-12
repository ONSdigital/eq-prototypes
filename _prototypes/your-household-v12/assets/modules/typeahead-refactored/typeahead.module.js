import TypeaheadComponent, {
  NEW_FIELD_VALUE_EVENT,
  NEW_ITEM_SELECTED_EVENT,
  UNSET_FIELD_VALUE_EVENT
} from './typeahead.component';
import TypeaheadService from './typeahead.service';

class TypeaheadContainer {
  constructor(context) {
    this.context = context;
    this.typeahead = new TypeaheadComponent({ context });

    /**
     * Service could be shared amongst multiple typeahead instance
     */
    const service = new TypeaheadService({
      apiUrl: this.typeahead.apiUrl,
      lang: this.typeahead.lang,
      sanitisedQueryReplaceChars: this.typeahead.sanitisedQueryReplaceChars
    });

    this.typeahead.emitter.on(NEW_FIELD_VALUE_EVENT, value => {
      service.get(value)
        .then(this.typeahead.updateData.bind(this.typeahead))
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.log('TypeaheadService error: ', error, 'query: ', value);
          }
        });
    });

    this.code = context.querySelector('.js-typeahead-code');

    this.typeahead.emitter.on(NEW_ITEM_SELECTED_EVENT, value => (this.code.value = value.code));

    this.typeahead.emitter.on(UNSET_FIELD_VALUE_EVENT, () => (this.code.value = ''));
  }
}

function TypeaheadModule() {
  const typeaheads = [...document.querySelectorAll('.js-typeahead')];

  typeaheads.forEach(typeahead => new TypeaheadContainer(typeahead));
}

/**
 * Temporary - just for prototype
 */
document.addEventListener('TYPEAHEAD-READY', () => new TypeaheadModule());
