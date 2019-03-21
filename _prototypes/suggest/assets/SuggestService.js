import formBodyFromObject from './form-body-from-object';

function SuggestService(rootUrl, type) {
  let _this = this;

  this.requestInFlight = false;

  this.query = function(query) {
    _this.requestInFlight = true;

    _this.$request = $.ajax({
      url: rootUrl,
      type: 'post',
      /*dataType: 'application/x-www-form-urlencoded',*/
      data: formBodyFromObject({
        query: query,
        lang: 'en-gb'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(data) {
        console.log('Success: ', data);
        _this.requestInFlight = false;
        return data;
      },
      fail: function(e) {
        console.log('fail: ', e);
        _this.requestInFlight = false;
      }
    });

    return this.$request;
  }
}

SuggestService.create = function(opts) {
  if (!opts.url) {
    throw Error('Service URL required');
  }

  return new SuggestService(opts.url);
};

export default SuggestService;
