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

  async get(sanitisedQuery, lang) {
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
      return Promise.reject(Error('Error calling service: ', e));
    }
  }

  static create(opts) {
    if (!opts.apiUrl) {
      throw Error('apiUrl property missing from opts');
    }

    return new SuggestionsService(opts.apiUrl);
  }
}
