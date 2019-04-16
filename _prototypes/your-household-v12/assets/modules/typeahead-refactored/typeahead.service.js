import formBodyFromObject from './form-body-from-object';
import AbortableFetch from './abortable-fetch';
import typeaheadDataMap from './typeahead.service-data-map';

export default class TypeaheadService {
  constructor({ apiUrl, lang, sanitisedQueryReplaceChars }) {
    if (!apiUrl || !lang || !sanitisedQueryReplaceChars) {
      throw Error('[TypeaheadService] apiUrl, lang,' +
        ' sanitisedQueryReplaceChars parameters are required');
    }

    this.apiUrl = apiUrl;

    /**
     * Remove - as not needed to make service calls.
     */
    this.lang = lang;
    this.sanitisedQueryReplaceChars = sanitisedQueryReplaceChars;
  }

  get(sanitisedQuery) {
    return new Promise((resolve, reject) => {
      const query = {
        query: sanitisedQuery,
        lang: this.lang
      };

      if (this.fetch && this.fetch.status !== 'DONE') {
        this.fetch.abort();
      }

      this.fetch = new AbortableFetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBodyFromObject(query)
      });

      this.fetch.send()

        /**
         * Pull out from here into client context
         */
        .then(typeaheadDataMap.bind(null, {
          query: sanitisedQuery,
          lang: this.lang,
          sanitisedQueryReplaceChars: this.sanitisedQueryReplaceChars
        }))
        .then(dataMapping => resolve(dataMapping))
        .catch(reject);
    });
  }
}
