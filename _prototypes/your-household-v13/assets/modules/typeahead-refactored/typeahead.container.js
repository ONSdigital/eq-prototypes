import TypeaheadComponent, {
  NEW_FIELD_VALUE_EVENT,
  NEW_ITEM_SELECTED_EVENT,
  UNSET_FIELD_VALUE_EVENT
} from './typeahead.component';
import TypeaheadService from './typeahead.service';
import typeaheadDataMap from './typeahead.service-data-map';

export default class TypeaheadContainer {
  constructor(context) {
    this.typeahead = new TypeaheadComponent({ context });

    this.service = new TypeaheadService({
      apiUrl: this.typeahead.apiUrl,
      lang: document.documentElement.getAttribute('lang').toLowerCase(),
      sanitisedQueryReplaceChars: this.typeahead.sanitisedQueryReplaceChars
    });

    this.typeahead.emitter.on(NEW_FIELD_VALUE_EVENT, value => {

      /**
       * Call service, partially apply config for promise callbacks
       */
      this.service.get(value)
        .then(typeaheadDataMap.bind(null, {
          query: value,
          lang: this.typeahead.lang,
          sanitisedQueryReplaceChars: this.typeahead.sanitisedQueryReplaceChars
        }))
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
