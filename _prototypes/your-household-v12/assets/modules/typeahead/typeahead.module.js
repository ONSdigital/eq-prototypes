import TypeaheadCore, { NEW_VALUE_EVENT } from './typeahead-core';
import SuggestionsService from './typeahead.service';
import suggestionsServiceDataMap from './typeahead.service.data-map';

class TypeaheadComponent {
  constructor(context) {
    const typeahead = new TypeaheadCore({
      context,
      onSelect: this.onSelect.bind(this),
      onUnsetResult: this.onUnsetResult.bind(this)
    });

    /**
     * Not quite right, could be one service per service, not per component
     * instance
     */
    const service = SuggestionsService.create({
      apiUrl: context.getAttribute('data-api-url')
    });

    /**
     * Wire it all up from the client/component
     */
    typeahead.emitter.on(NEW_VALUE_EVENT, query => {
      service.get(query)
        .then(async res => {
          const data = await res.json();

          /**
           * Move more of this into the data map - too much
           */
          typeahead.handleResults({
            results: suggestionsServiceDataMap({
              sanitisedQueryReplaceChars: typeahead.sanitisedQueryReplaceChars,
              sanitisedQuery: typeahead.sanitisedQuery,
              lang: typeahead.lang
            }, data.results),
            totalResults: data.totalResults
          })
        });
    });

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

  typeaheads.forEach(typeahead => new TypeaheadComponent(typeahead));
}

document.addEventListener('TYPEAHEAD-READY', TypeaheadModule);
