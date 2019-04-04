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

    this.core = typeahead;
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
  const serviceList = {};

  typeaheads.forEach(typeahead => {
    const apiUrl = typeahead.getAttribute('data-api-url');

    /**
     * Lazy-load services
     */
    const service = serviceList[apiUrl] = serviceList[apiUrl] || SuggestionsService.create({apiUrl});

    const component = new TypeaheadComponent(typeahead, service);

    /**
     * Wire it all up from the client - Not good, only speak to your neighbours
     */
    component.core.emitter.on(NEW_VALUE_EVENT, query => {
      service.get(query)
        .then(async res => {
          const data = await res.json();

          /**
           * Move more of this into the data map - knows too much
           */
          component.core.handleResults({
            results: suggestionsServiceDataMap({
              sanitisedQueryReplaceChars: component.core.sanitisedQueryReplaceChars,
              sanitisedQuery: component.core.sanitisedQuery,
              lang: component.core.lang
            }, data.results),
            totalResults: data.totalResults
          })
        })
        .catch(e => {
          console.log(e);
        });
    });
  });
}

document.addEventListener('TYPEAHEAD-READY', TypeaheadModule);
