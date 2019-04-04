export default class AbortableFetch {
  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.status = 'UNSENT';
  }

  send(body) {
    this.status = 'LOADING';

    this.controller = new window.AbortController();

    return new Promise((resolve, reject) => {
      request(this.url, { signal: this.controller.signal, ...this.options, body })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            this.status = 'DONE';
            resolve(response);
          } else {
            this.status = 'DONE';
            reject(response);
          }

          this.reset();
        })
        .catch(error => {
          this.status = 'DONE';
          reject(error);

          this.reset();
        });
    });
  }

  abort() {
    if (this.controller) {
      this.controller.abort();
    }

    this.reset();
  }

  reset() {
    this.status = 'UNSENT';
  }
}

function request(url, options) {
  return window.fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
    .catch(error => {
      throw error;
    });
}
