import formBodyFromObject from '../form-body-from-object';
import AbortableFetch from '../abortable-fetch';
import EventEmitter from 'events';

export default class SuggestionsService {
  emitter = new EventEmitter();

  constructor(apiUrl) {
    this.fetch = new AbortableFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  get(sanitisedQuery, lang) {
    const query = {
      query: sanitisedQuery,
      lang
    };

    return new Promise((resolve, reject) => {

      console.log('status', this.fetch.status);

      if (this.fetch && this.fetch.status === 'LOADING') {
        this.fetch.abort();
      }

      return this.fetch.send(formBodyFromObject(query))
        .then(resolve)
        .catch((e) => {
          this.fetch.abort();
          reject(e);
        });
    });

    /*try {
      return await this.fetch.send(formBodyFromObject(query));
    } catch (e) {
      return Promise.reject('Service call rejected', e);
    }*/
  }

  /*async get(sanitisedQuery, lang) {
    const query = {
      query: sanitisedQuery,
      lang
    };

    if (this.fetch &&
      this.fetch.status !== 'UNSENT' &&
      this.fetch.status !== 'DONE') {

      this.fetch.abort();
    }

    try {
      return await this.fetch.send(formBodyFromObject(query));
    } catch (e) {
      return Promise.reject('Service call rejected', e);
    }
  }*/

  static create(opts) {
    if (!opts.apiUrl) {
      throw Error('apiUrl property missing from opts');
    }

    return new SuggestionsService(opts.apiUrl);
  }
}
