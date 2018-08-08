function SuggestService(rootUrl, type) {
  let _this = this;

  this.requestInFlight = false;

  this.query = function(query) {
    _this.requestInFlight = true;

    _this.$request = $.ajax({
      url: rootUrl + '?q=' + query,
      dataType: 'json',
      success: function(data) {
        _this.requestInFlight = false;
      },
      fail: function() {
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
