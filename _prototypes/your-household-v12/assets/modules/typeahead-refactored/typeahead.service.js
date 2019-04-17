import formBodyFromObject from './form-body-from-object';
import AbortableFetch from './abortable-fetch';

export default class TypeaheadService {
  requestConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  constructor({ apiUrl, lang, sanitisedQueryReplaceChars }) {
    if (!apiUrl || !lang || !sanitisedQueryReplaceChars) {
      throw Error('[TypeaheadService] apiUrl, lang,' +
        ' sanitisedQueryReplaceChars parameters are required');
    }

    this.apiUrl = apiUrl;
    this.lang = lang;

    /**
     * Remove - as not needed to make service calls.
     */
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

      this.requestConfig.body = formBodyFromObject(query);
      this.fetch = new AbortableFetch(this.apiUrl, this.requestConfig);

      this.fetch.send()
        .then(resolve)
        .catch(reject);
    });
  }
}
