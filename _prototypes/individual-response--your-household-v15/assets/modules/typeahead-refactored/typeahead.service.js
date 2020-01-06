import formBodyFromObject from './form-body-from-object';
import AbortableFetch from './abortable-fetch';

export default class TypeaheadService {
  requestConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  constructor({ apiUrl, lang }) {
    if (!apiUrl || !lang) {
      throw Error(
        '[TypeaheadService] \'apiUrl\', \'lang\' parameters are required'
      );
    }

    this.apiUrl = apiUrl;
    this.lang = lang;
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
